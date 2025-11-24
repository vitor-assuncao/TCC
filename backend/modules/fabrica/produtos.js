import express from "express";
import connection from "../../db.js"; // ajuste o caminho se necessário

const router = express.Router();


// =====================
// 🔹 LISTAR TODOS PRODUTOS
// =====================
// --- LISTAR PRODUTOS COM ESTOQUE ---
router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query(`
      SELECT 
        p.id,
        p.nome,
        p.descricao,
        p.sku,
        p.preco_unitario,
        p.url_imagem, 
        IFNULL(e.quantidade, 0) AS quantidade
      FROM produtos p
      LEFT JOIN estoque e ON e.produto_id = p.id
    `);

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    res.status(500).json({ message: "Erro ao buscar produtos." });
  }
});



// =====================
// 🔹 CRIAR NOVO PRODUTO
// =====================
router.post("/", async (req, res) => {
  const {
    nome,
    descricao,
    sku,
    unidade_medida,
    preco_unitario,
    url_imagem,
    quantidade
  } = req.body;

  if (!nome || !sku) {
    return res.status(400).json({ message: "Nome e SKU são obrigatórios." });
  }

  try {
    // 1️⃣ Cria o produto
    const [result] = await connection.query(
      `INSERT INTO produtos 
       (nome, descricao, sku, unidade_medida, preco_unitario, url_imagem)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nome,
        descricao || null,
        sku,
        unidade_medida || null,
        preco_unitario || 0,
        url_imagem || null
      ]
    );

    const produtoId = result.insertId;

    // 2️⃣ Inicializa o estoque
    await connection.query(
      `INSERT INTO estoque (produto_id, quantidade)
       VALUES (?, ?)`,
      [produtoId, quantidade || 0]
    );

    res.status(201).json({
      id: produtoId,
      message: "Produto criado com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro ao criar produto." });
  }
});





// =====================
// 🔹 ATUALIZAR QUANTIDADE
// =====================
router.put("/:id/quantidade", async (req, res) => {
  const { id } = req.params;
  const { quantidade } = req.body;

  if (quantidade == null) {
    return res.status(400).json({ error: "Quantidade é obrigatória" });
  }

  try {
    await connection.query(
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


// =====================
// 🔹 ATUALIZAR PREÇO
// =====================
router.put("/:id/preco", async (req, res) => {
  const { id } = req.params;
  const { preco_unitario } = req.body;

  if (preco_unitario == null) {
    return res.status(400).json({ message: "Preço é obrigatório." });
  }

  try {
    const [result] = await connection.query(
      "UPDATE produtos SET preco_unitario = ? WHERE id = ?",
      [preco_unitario, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    res.json({ message: "Preço atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro ao atualizar preço:", error);
    res.status(500).json({ message: "Erro ao atualizar preço." });
  }
});


// =====================
// 🔹 DELETAR PRODUTO
// =====================
// --- DELETAR PRODUTO ---
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Verifica se o produto existe
    const [rows] = await connection.query("SELECT * FROM produtos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }

    // Remove o item do estoque primeiro (respeitando a foreign key)
    await connection.query("DELETE FROM estoque WHERE produto_id = ?", [id]);

    // Agora remove o produto
    await connection.query("DELETE FROM produtos WHERE id = ?", [id]);

    res.status(200).json({ message: "Produto e estoque removidos com sucesso!" });
  } catch (error) {
    console.error("Erro ao remover produto:", error);
    res.status(500).json({ message: "Erro ao remover o produto." });
  }
});


export default router;
