import express from 'express';
import pool from '../../db.js';

const router = express.Router();

// 📦 GET - Lista todo o estoque com o nome do produto
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT e.id, e.produto_id, e.quantidade, e.data_atualizacao, p.nome AS nome_produto
      FROM estoque e
      JOIN produtos p ON e.produto_id = p.id
      ORDER BY p.nome ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar estoque:', error);
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

// ➕ POST - Adiciona um novo item de estoque (opcional)
router.post('/', async (req, res) => {
  const { produto_id, quantidade } = req.body;

  if (!produto_id) {
    return res.status(400).json({ error: 'ID do produto é obrigatório' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO estoque (produto_id, quantidade) VALUES (?, ?)',
      [produto_id, quantidade ?? 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Item adicionado ao estoque' });
  } catch (error) {
    console.error('Erro ao adicionar ao estoque:', error);
    res.status(500).json({ error: 'Erro ao adicionar ao estoque' });
  }
});

// ✏️ PUT - Atualiza a quantidade de um produto no estoque
router.put("/:id/quantidade", async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (quantidade == null) {
    return res.status(400).json({ error: "Quantidade é obrigatória" });
  }

  try {
    // Se sua quantidade está na tabela produtos:
    // await db.execute("UPDATE produtos SET quantidade = ? WHERE id = ?", [quantidade, id]);

    // Se sua quantidade está na tabela estoque (com produto_id):
    await db.execute(
      `INSERT INTO estoque (produto_id, quantidade)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE quantidade = VALUES(quantidade)`,
      [id, quantidade]
    );

    res.json({ message: "Quantidade atualizada com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar quantidade:", error);
    res.status(500).json({ error: "Erro ao atualizar quantidade" });
  }
});

router.put('/:produtoId', async (req, res) => {
  const { produtoId } = req.params;
  const { quantidade } = req.body;

  try {
    await pool.query('UPDATE estoque SET quantidade = ? WHERE produto_id = ?', [
      quantidade,
      produtoId,
    ]);
    res.json({ message: 'Quantidade atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

export default router;
