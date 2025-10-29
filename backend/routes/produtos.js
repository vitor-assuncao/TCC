import express from 'express';
import pool from '../db.js';

const router = express.Router();

/* =======================================
   [POST] - Criar novo produto
   ======================================= */
router.post('/', async (req, res) => {
  const { nome, descricao, sku, unidade_medida, url_imagem, preco_unitario = 0 } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // Inserir produto
    const [produtoResult] = await connection.query(
      `INSERT INTO produtos 
        (nome, descricao, sku, unidade_medida, url_imagem, preco_unitario) 
        VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, descricao, sku, unidade_medida, url_imagem, preco_unitario]
    );

    const produtoId = produtoResult.insertId;

    // Inserir no estoque com quantidade inicial 0
    await connection.query(
      'INSERT INTO estoque (produto_id, quantidade) VALUES (?, 0)',
      [produtoId]
    );

    await connection.commit();

    res.status(201).json({
      id: produtoId,
      nome,
      descricao,
      sku,
      unidade_medida,
      preco_unitario,
      url_imagem,
      message: 'Produto criado e adicionado ao estoque com sucesso!',
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar produto e inserir no estoque:', error);
    res.status(500).json({ error: 'Erro ao criar produto e inserir no estoque' });
  } finally {
    connection.release();
  }
});

/* =======================================
   [GET] - Listar todos os produtos
   ======================================= */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, e.quantidade 
      FROM produtos p
      LEFT JOIN estoque e ON e.produto_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

/* =======================================
   [PUT] - Atualizar o preço do produto
   ======================================= */
router.put('/:id/preco', async (req, res) => {
  const { id } = req.params;
  const { preco } = req.body;

  if (preco == null || isNaN(preco)) {
    return res.status(400).json({ error: 'Preço inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE produtos SET preco_unitario = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE id = ?',
      [preco, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Preço atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar preço do produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar preço do produto' });
  }
});

/* =======================================
   [PUT] - Atualizar a quantidade no estoque
   ======================================= */
router.put('/:id/estoque', async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (quantidade == null || isNaN(quantidade)) {
    return res.status(400).json({ error: 'Quantidade inválida' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE estoque SET quantidade = ?, data_atualizacao = CURRENT_TIMESTAMP WHERE produto_id = ?',
      [quantidade, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado no estoque' });
    }

    res.json({ message: 'Quantidade de estoque atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

export default router;
