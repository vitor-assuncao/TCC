import express from "express";
import db from "../db.js"; // ajuste o caminho conforme o seu arquivo de conexão MySQL

const router = express.Router();

// Criar um novo pedido
router.post("/", async (req, res) => {
  try {
    const { cliente_id, representante_id, condicao_pagamento, observacoes, valor_total, itens } = req.body;

    if (!cliente_id || !representante_id || !itens || itens.length === 0) {
      return res.status(400).json({ message: "Dados do pedido incompletos." });
    }

    // Cria o pedido na tabela pedidos
    const [pedidoResult] = await db.execute(
      "INSERT INTO pedidos (cliente_id, representante_id, condicao_pagamento, observacoes, valor_total) VALUES (?, ?, ?, ?, ?)",
      [cliente_id, representante_id, condicao_pagamento, observacoes, valor_total]
    );

    const pedidoId = pedidoResult.insertId;

    // Insere os itens do pedido
    for (const item of itens) {
      await db.execute(
        "INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario, preco_total) VALUES (?, ?, ?, ?, ?)",
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.preco_total]
      );
    }

    res.status(201).json({ message: "Pedido criado com sucesso!", pedido_id: pedidoId });
  } catch (error) {
    console.error("Erro ao criar pedido:", error);
    res.status(500).json({ message: "Erro ao criar pedido.", error });
  }
});

export default router;
