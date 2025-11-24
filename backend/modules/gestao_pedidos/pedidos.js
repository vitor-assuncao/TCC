import express from "express";
import pool from "../../db.js";

const router = express.Router();

// --- util: atualiza meta após pedido (pode manter como está se você já tem) ---
async function atualizarMetaVendas(pool, representante_id, data_pedido) {
  try {
    const periodo = data_pedido.toISOString().slice(0, 7);
    const [somaPedidos] = await pool.query(
      `SELECT IFNULL(SUM(valor_total), 0) AS total_vendido
       FROM pedidos
       WHERE representante_id = ? 
         AND DATE_FORMAT(data_pedido, '%Y-%m') = ?`,
      [representante_id, periodo]
    );
    const valorRealizado = somaPedidos[0].total_vendido || 0;

    const [metaExistente] = await pool.query(
      `SELECT id FROM metas_vendas WHERE representante_id = ? AND periodo = ?`,
      [representante_id, periodo]
    );

    if (metaExistente.length > 0) {
      await pool.query(
        `UPDATE metas_vendas SET valor_realizado = ? WHERE representante_id = ? AND periodo = ?`,
        [valorRealizado, representante_id, periodo]
      );
    } else {
      await pool.query(
        `INSERT INTO metas_vendas (representante_id, periodo, valor_meta, valor_realizado)
         VALUES (?, ?, 0, ?)`,
        [representante_id, periodo, valorRealizado]
      );
    }
  } catch (e) {
    console.error("Erro ao atualizar metas automaticamente:", e);
  }
}

// [POST] Criar pedido com itens/produtos
router.post("/", async (req, res) => {
  console.log("📦 Body recebido em /api/pedidos:", JSON.stringify(req.body, null, 2));

  const {
    cliente_id,
    representante_id,
    condicao_pagamento,
    observacoes,
    valor_total: valor_total_do_body, // opcional
    produtos: produtosDoBody,
    itens: itensDoBody,
  } = req.body;

  // Aceita "produtos" ou "itens"
  const produtos = Array.isArray(produtosDoBody)
    ? produtosDoBody
    : Array.isArray(itensDoBody)
    ? itensDoBody
    : [];

  // Validação explícita e amigável
  if (!cliente_id || !representante_id) {
    return res.status(400).json({
      error: "cliente_id e representante_id são obrigatórios",
      debug: { tem_cliente_id: !!cliente_id, tem_representante_id: !!representante_id },
    });
  }

  if (!Array.isArray(produtos) || produtos.length === 0) {
    return res.status(400).json({
      error: "Nenhum produto adicionado ao pedido.",
      debug: { keys: Object.keys(req.body), exemplo_esperado: [{ produto_id: 1, quantidade: 2, preco_unitario: 10.5 }] },
    });
  }

  // Normaliza e valida itens
  const itensNormalizados = produtos
    .filter((p) => p && (p.produto_id || p.id)) // tolera "id"
    .map((p) => ({
      produto_id: Number(p.produto_id || p.id),
      quantidade: Number(p.quantidade || 0),
      preco_unitario: Number(p.preco_unitario || 0),
    }))
    .filter((p) => p.produto_id && p.quantidade > 0);

  if (itensNormalizados.length === 0) {
    return res.status(400).json({
      error: "Todos os itens estão inválidos (verifique produto_id e quantidade).",
      debug: { produtosRecebidos: produtos },
    });
  }

  // Calcula valor_total se não vier no body
  const valor_total =
    typeof valor_total_do_body === "number" && !Number.isNaN(valor_total_do_body)
      ? valor_total_do_body
      : itensNormalizados.reduce((acc, it) => acc + it.quantidade * it.preco_unitario, 0);

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1) cria pedido
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos 
        (cliente_id, representante_id, valor_total, condicao_pagamento, observacoes, status)
       VALUES (?, ?, ?, ?, ?, 'Em aberto')`,
      [cliente_id, representante_id, valor_total, condicao_pagamento || null, observacoes || null]
    );

    const pedido_id = pedidoResult.insertId;

    // 2) cria itens
    for (const it of itensNormalizados) {
      await connection.query(
        `INSERT INTO itens_pedido 
         (pedido_id, produto_id, quantidade, preco_unitario, preco_total)
         VALUES (?, ?, ?, ?, ?)`,
        [pedido_id, it.produto_id, it.quantidade, it.preco_unitario, it.quantidade * it.preco_unitario]
      );

      // 3) baixa estoque
      await connection.query(
        `UPDATE estoque SET quantidade = GREATEST(quantidade - ?, 0)
         WHERE produto_id = ?`,
        [it.quantidade, it.produto_id]
      );
    }

    await connection.commit();

    // 4) atualiza metas
    await atualizarMetaVendas(pool, representante_id, new Date());

    res.status(201).json({ message: "Pedido criado com sucesso!", pedido_id, valor_total });
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido", detalhe: String(error?.message || error) });
  } finally {
    connection.release();
  }
});

// [GET] lista pedidos (fábrica)
router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS pedido_id,
        p.data_pedido,
        p.status,
        p.valor_total,
        c.nome AS cliente,
        r.nome AS representante
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      JOIN representantes r ON p.representante_id = r.id
      ORDER BY p.data_pedido DESC
    `);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// [PUT] status
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Status é obrigatório" });

  try {
    const [r] = await pool.query(`UPDATE pedidos SET status = ? WHERE id = ?`, [status, id]);
    if (!r.affectedRows) return res.status(404).json({ error: "Pedido não encontrado" });
    res.json({ message: "Status atualizado" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

// Buscar itens de um pedido específico
// [GET] Buscar itens de um pedido específico
router.get("/:id/itens", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        ip.produto_id,
        p.nome,
        ip.quantidade,
        ip.preco_unitario,
        (ip.quantidade * ip.preco_unitario) AS total_item
      FROM itens_pedido ip
      JOIN produtos p ON p.id = ip.produto_id
      WHERE ip.pedido_id = ?
      `,
      [id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar itens do pedido:", error);
    res.status(500).json({ error: "Erro ao buscar itens do pedido" });
  }
});


export default router;
