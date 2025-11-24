import express from "express";
import pool from "../../db.js";

const router = express.Router();

/**
 * 🔄 Atualiza o valor_realizado de cada meta com base nos pedidos existentes.
 */
async function atualizarValoresRealizados() {
  try {
    const [metas] = await pool.query("SELECT id, representante_id, periodo FROM metas_vendas");

    for (const meta of metas) {
      const { representante_id, periodo, id } = meta;

      // Define o início e fim do mês
      const dataInicio = `${periodo}-01`;
      const dataFim = `${periodo}-31`;

      const [somaPedidos] = await pool.query(
        `
        SELECT IFNULL(SUM(valor_total), 0) AS total_vendido
        FROM pedidos
        WHERE representante_id = ?
          AND DATE(data_pedido) BETWEEN ? AND ?
        `,
        [representante_id, dataInicio, dataFim]
      );

      const valorRealizado = somaPedidos[0].total_vendido || 0;

      await pool.query(
        `UPDATE metas_vendas SET valor_realizado = ? WHERE id = ?`,
        [valorRealizado, id]
      );
    }

    console.log("✅ Metas atualizadas com valores realizados.");
  } catch (error) {
    console.error("Erro ao atualizar valores realizados:", error);
  }
}

/**
 * ✅ Criar ou atualizar uma meta
 */
router.post("/", async (req, res) => {
  const { representante_id, periodo, valor_meta } = req.body;

  if (!representante_id || !periodo || !valor_meta) {
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  }

  try {
    const [existing] = await pool.query(
      `SELECT id FROM metas_vendas WHERE representante_id = ? AND periodo = ?`,
      [representante_id, periodo]
    );

    if (existing.length > 0) {
      await pool.query(
        `UPDATE metas_vendas SET valor_meta = ? WHERE representante_id = ? AND periodo = ?`,
        [valor_meta, representante_id, periodo]
      );
    } else {
      await pool.query(
        `INSERT INTO metas_vendas (representante_id, periodo, valor_meta) VALUES (?, ?, ?)`,
        [representante_id, periodo, valor_meta]
      );
    }

    // Atualiza o realizado após inserir ou editar
    await atualizarValoresRealizados();

    res.json({ message: "Meta salva e valores realizados atualizados!" });
  } catch (error) {
    console.error("Erro ao criar/atualizar meta:", error);
    res.status(500).json({ error: "Erro ao criar/atualizar meta" });
  }
});

/**
 * ✅ Listar metas com atingimento calculado
 */
router.get("/", async (req, res) => {
  try {
    // Atualiza os valores antes de listar
    await atualizarValoresRealizados();

    const [rows] = await pool.query(`
      SELECT 
        mv.id,
        r.nome AS representante,
        mv.periodo,
        mv.valor_meta,
        mv.valor_realizado,
        ROUND((mv.valor_realizado / mv.valor_meta) * 100, 2) AS percentual_atingido
      FROM metas_vendas mv
      JOIN representantes r ON mv.representante_id = r.id
      ORDER BY mv.periodo DESC, r.nome ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar metas:", error);
    res.status(500).json({ error: "Erro ao buscar metas" });
  }
});

export default router;
