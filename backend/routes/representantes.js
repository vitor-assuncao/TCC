import express from 'express';
import pool from '../db.js';

const router = express.Router();

// [POST] - Criar representante
router.post('/', async (req, res) => {
  const { nome, email, telefone, data_contratacao } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO representantes (nome, email, telefone, data_contratacao) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, data_contratacao]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      email,
      telefone,
      data_contratacao,
      message: 'Representante cadastrado com sucesso!'
    });
  } catch (error) {
    console.error('Erro ao cadastrar representante:', error);
    res.status(500).json({ error: 'Erro ao cadastrar representante' });
  }
});

// [GET] - Listar todos os representantes
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM representantes ORDER BY nome ASC');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar representantes:', error);
    res.status(500).json({ error: 'Erro ao buscar representantes' });
  }
});

export default router;
