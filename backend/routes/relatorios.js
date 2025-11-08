// backend/routes/relatorios.js
import express from "express";
import pool from "../db.js";

const router = express.Router();

// [GET] - Relatório de vendas por representante
router.get("/vendas-representante", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        representante_id,
        representante_nome,
        periodo,
        total_pedidos,
        valor_total_vendido,
        meta_vendas,
        ROUND(percentual_atingimento_meta, 2) AS percentual_atingimento_meta
      FROM relatorio_vendas_representante
      ORDER BY periodo DESC, representante_nome ASC;
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao gerar relatório de vendas por representante:", error);
    res.status(500).json({ error: "Erro ao gerar relatório de vendas" });
  }
});

export default router;
