import express from "express";
import db from "../db.js";
const router = express.Router();

// 🔹 Listar produtos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM produtos");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar produtos:", error);
    res.status(500).json({ message: "Erro ao listar produtos" });
  }
});

// 🔹 Criar novo produto
router.post("/", async (req, res) => {
  try {
    const { nome, descricao, preco, estoque } = req.body;
    await db.execute(
      "INSERT INTO produtos (nome, descricao, preco, estoque) VALUES (?, ?, ?, ?)",
      [nome, descricao, preco, estoque]
    );
    res.status(201).json({ message: "Produto criado com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    res.status(500).json({ message: "Erro ao criar produto" });
  }
});

export default router;
