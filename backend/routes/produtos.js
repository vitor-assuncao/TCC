import express from 'express';
import pool from '../db.js';

const router = express.Router();

// [POST] - Criar novo produto
router.post('/', async (req, res) => {
  const { nome, descricao, sku, unidade_medida, url_imagem } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1️⃣ Inserir produto na tabela de produtos
    const [produtoResult] = await connection.query(
      'INSERT INTO produtos (nome, descricao, sku, unidade_medida, url_imagem) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, sku, unidade_medida, url_imagem]
    );

    const produtoId = produtoResult.insertId;

    // 2️⃣ Inserir automaticamente no estoque (quantidade inicial 0)
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
      url_imagem,
      message: 'Produto criado e adicionado ao estoque com sucesso!'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar produto e inserir no estoque:', error);
    res.status(500).json({ error: 'Erro ao criar produto e inserir no estoque' });
  } finally {
    connection.release();
  }
});

// [GET] - Listar todos os produtos
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

export default router;
