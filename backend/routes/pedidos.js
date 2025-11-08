import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Criar novo pedido
router.post("/", async (req, res) => {
  const {
    cliente_id,
    representante_id,
    condicao_pagamento,
    observacoes,
    valor_total,
    itens,
  } = req.body;

  if (!cliente_id || !representante_id || !itens || itens.length === 0) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes." });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos 
       (cliente_id, representante_id, valor_total, condicao_pagamento, observacoes, status)
       VALUES (?, ?, ?, ?, ?, 'Em aberto')`,
      [
        cliente_id,
        representante_id,
        valor_total ?? 0,
        condicao_pagamento || null,
        observacoes || null,
      ]
    );

    const pedidoId = pedidoResult.insertId;

    for (const item of itens) {
      const produto_id = item.produto_id ?? null;
      const quantidade = item.quantidade ?? 0;
      const preco_unitario = item.preco_unitario ?? 0;
      const preco_total = quantidade * preco_unitario;

      if (!produto_id) continue;

      await connection.query(
        `INSERT INTO itens_pedido 
         (pedido_id, produto_id, quantidade, preco_unitario, preco_total)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, produto_id, quantidade, preco_unitario, preco_total]
      );
    }

    await connection.commit();
    res.status(201).json({ message: "Pedido criado com sucesso!" });
  } catch (error) {
    await connection.rollback();
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ error: "Erro ao criar pedido" });
  } finally {
    connection.release();
  }
});

// ✅ Listar todos os pedidos (visão da Fábrica)
router.get("/", async (req, res) => {
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
  } catch (error) {
    console.error("Erro ao listar pedidos:", error);
    res.status(500).json({ error: "Erro ao listar pedidos" });
  }
});

// ✅ Atualizar status do pedido
router.put("/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: "Status é obrigatório" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE pedidos SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Pedido não encontrado" });
    }

    res.json({ message: "Status do pedido atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar status:", error);
    res.status(500).json({ error: "Erro ao atualizar status" });
  }
});

export default router;
