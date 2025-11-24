// routes/representantes.js
import express from "express";
import db from "../../db.js";

const router = express.Router();

// ==============================
// GET /api/representantes
// ==============================
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM representantes");
    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar representantes:", error);
    res.status(500).json({ error: "Erro ao listar representantes" });
  }
});

// ==============================
// POST /api/representantes
// ==============================
router.post("/", async (req, res) => {
  const { nome, email, cpf, telefone, data_contratacao } = req.body;

  // 🔎 Validação simples antes de inserir
  if (!nome || !email || !cpf) {
    return res.status(400).json({
      error: "Nome, email e CPF são obrigatórios!",
    });
  }

  try {
    await db.execute(
      `INSERT INTO representantes (nome, email, cpf, telefone, data_contratacao) 
       VALUES (?, ?, ?, ?, ?)`,
      [nome, email, cpf, telefone, data_contratacao]
    );

    res.status(201).json({
      message: "Representante criado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao criar representante:", error);

    // erro de duplicação de email ou cpf
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        error: "E-mail ou CPF já cadastrado!",
      });
    }

    res.status(500).json({ error: "Erro ao criar representante" });
  }
});

export default router;
