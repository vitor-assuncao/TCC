import express from "express";
import pool from "../db.js";

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

    // se foi passado um representante, filtra
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

export default router;
