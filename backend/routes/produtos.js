// backend/routes/produtos.js
import express from 'express';
import pool from '../db.js';

const router = express.Router();



// [POST] - Criar novo produto
router.post('/', async (req, res) => {
  const { nome, descricao, sku, unidade_medida, url_imagem } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO produtos (nome, descricao, sku, unidade_medida, url_imagem) VALUES (?, ?, ?, ?, ?)',
      [nome, descricao, sku, unidade_medida, url_imagem]
    );

    res.status(201).json({ id: result.insertId, nome, descricao, sku, unidade_medida, url_imagem });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }


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
});

export default router;
