import express from 'express';
import pool from '../db.js';

const router = express.Router();

/**
 * [POST] - Criar novo produto
 */
router.post('/', async (req, res) => {
  const { nome, descricao, sku, unidade_medida, preco_unitario, url_imagem } = req.body;

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    // 1️⃣ Inserir produto na tabela de produtos (agora inclui o preço)
    const [produtoResult] = await connection.query(
      `INSERT INTO produtos 
        (nome, descricao, sku, unidade_medida, preco_unitario, url_imagem)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, descricao, sku, unidade_medida, preco_unitario, url_imagem]
    );

    const produtoId = produtoResult.insertId;

    // 2️⃣ Criar registro no estoque com quantidade inicial 0
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

/**
 * [GET] - Listar todos os produtos
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM produtos');
    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
});

/**
 * [GET] - Buscar produto por ID
 */
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM produtos WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
});

/**
 * [PUT] - Atualizar produto
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, descricao, sku, unidade_medida, preco_unitario, url_imagem } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE produtos 
       SET nome = ?, descricao = ?, sku = ?, unidade_medida = ?, preco_unitario = ?, url_imagem = ?, data_atualizacao = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [nome, descricao, sku, unidade_medida, preco_unitario, url_imagem, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
});

/**
 * [DELETE] - Excluir produto
 */
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Exclui o estoque vinculado
    await connection.query('DELETE FROM estoque WHERE produto_id = ?', [id]);

    // Exclui o produto
    const [result] = await connection.query('DELETE FROM produtos WHERE id = ?', [id]);

    await connection.commit();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto e estoque excluídos com sucesso!' });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro ao excluir produto' });
  } finally {
    connection.release();
  }
});

export default router;
