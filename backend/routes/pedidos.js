import express from "express";
import pool from "../db.js";

const router = express.Router();

// [POST] - Criar novo pedido
router.post("/", async (req, res) => {
  const {
    cliente_id,
    representante_id,
    condicao_pagamento,
    observacoes,
    valor_total,
    itens,
  } = req.body;

  // validação simples
  if (
    !cliente_id ||
    !representante_id ||
    !Array.isArray(itens) ||
    itens.length === 0
  ) {
    return res
      .status(400)
      .json({ error: "Campos obrigatórios ausentes ou itens inválidos" });
  }

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // inserção do pedido principal
    const [pedidoResult] = await connection.query(
      `INSERT INTO pedidos 
        (cliente_id, representante_id, valor_total, condicao_pagamento, observacoes)
       VALUES (?, ?, ?, ?, ?)`,
      [
        cliente_id,
        representante_id,
        valor_total ?? 0,
        condicao_pagamento || null,
        observacoes || null,
      ]
    );

    const pedidoId = pedidoResult.insertId;

    // inserir itens do pedido
    for (const item of itens) {
      // garantir que todos os campos tenham valor
      const produto_id = item.produto_id ?? null;
      const quantidade = item.quantidade ?? 0;
      const preco_unitario = item.preco_unitario ?? 0;
      const preco_total = quantidade * preco_unitario;

      if (!produto_id) continue; // pula item inválido

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

export default router;
