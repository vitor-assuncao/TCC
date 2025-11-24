import express from "express";
import pool from "../../db.js";

const router = express.Router();

// ✅ Relatório de vendas por representante
router.get("/vendas-representante", async (req, res) => {
  const { representante_id } = req.query;

  try {
    let query = `
      SELECT 
        representante_id,
        representante_nome,
        periodo,
        total_pedidos,
        valor_total_vendido,
        meta_vendas,
        ROUND(percentual_atingimento_meta, 2) AS percentual_atingimento_meta
      FROM relatorio_vendas_representante
    `;

    const params = [];

    if (representante_id) {
      query += " WHERE representante_id = ?";
      params.push(representante_id);
    }

    query += " ORDER BY periodo DESC";

    const [rows] = await pool.query(query, params);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
});

// ✅ NOVO — Listar pedidos do representante logado
router.get("/pedidos-representante", async (req, res) => {
  const { representante_id } = req.query;

  if (!representante_id) {
    return res.status(400).json({ error: "representante_id é obrigatório" });
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        cli.nome AS cliente,
        p.data_pedido,
        p.valor_total
      FROM pedidos p
      JOIN clientes cli ON cli.id = p.cliente_id
      WHERE p.representante_id = ?
      ORDER BY p.data_pedido DESC
      `,
      [representante_id]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar pedidos do representante:", error);
    res.status(500).json({ error: "Erro ao buscar pedidos" });
  }
});

export default router;
