import db from '../db.js';

// Criação de um novo pedido
export const criarPedido = async (req, res) => {
  const connection = await db.getConnection();
  try {
    const {
      cliente_id,
      representante_id,
      condicao_pagamento,
      observacoes,
      valor_total,
      itens
    } = req.body;

    if (!cliente_id || !representante_id || !Array.isArray(itens) || itens.length === 0) {
      return res.status(400).json({ error: 'Dados insuficientes para criar o pedido.' });
    }

    await connection.beginTransaction();

    // Inserir pedido
    const [pedidoResult] = await connection.execute(
      `INSERT INTO pedidos 
        (cliente_id, representante_id, condicao_pagamento, observacoes, valor_total)
       VALUES (?, ?, ?, ?, ?)`,
      [cliente_id, representante_id, condicao_pagamento, observacoes, valor_total]
    );

    const pedidoId = pedidoResult.insertId;

    // Inserir itens do pedido
    for (const item of itens) {
      await connection.execute(
        `INSERT INTO itens_pedido 
          (pedido_id, produto_id, quantidade, preco_unitario, preco_total)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.produto_id, item.quantidade, item.preco_unitario, item.preco_total]
      );
    }

    await connection.commit();

    res.status(201).json({
      message: 'Pedido criado com sucesso!',
      pedido_id: pedidoId
    });
  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ error: 'Erro ao criar pedido.' });
  } finally {
    connection.release();
  }
};

// Listar todos os pedidos (para testes)
export const listarPedidos = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*, c.nome AS cliente_nome, r.nome AS representante_nome
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      JOIN representantes r ON p.representante_id = r.id
      ORDER BY p.data_pedido DESC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar pedidos:', error);
    res.status(500).json({ error: 'Erro ao listar pedidos.' });
  }
};

// Obter detalhes de um pedido
export const obterPedido = async (req, res) => {
  const { id } = req.params;
  try {
    const [pedidoRows] = await db.query(
      `SELECT * FROM pedidos WHERE id = ?`, [id]
    );
    if (pedidoRows.length === 0) {
      return res.status(404).json({ error: 'Pedido não encontrado.' });
    }

    const [itensRows] = await db.query(
      `SELECT ip.*, p.nome AS produto_nome 
       FROM itens_pedido ip
       JOIN produtos p ON ip.produto_id = p.id
       WHERE ip.pedido_id = ?`, [id]
    );

    res.json({
      ...pedidoRows[0],
      itens: itensRows
    });
  } catch (error) {
    console.error('Erro ao obter pedido:', error);
    res.status(500).json({ error: 'Erro ao obter pedido.' });
  }
};
