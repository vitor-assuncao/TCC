import express from "express";
import pool from "../../db.js";

const router = express.Router();

/* ===============================
   [POST] - Criar novo cliente
   =============================== */
router.post("/", async (req, res) => {
  const { nome, documento, email, telefone, endereco, representante_id } = req.body;

  try {
    const [result] = await pool.query(
      `INSERT INTO clientes 
        (nome, documento, email, telefone, endereco, representante_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
      [nome, documento, email, telefone, endereco, representante_id]
    );

    res.status(201).json({
      id: result.insertId,
      nome,
      documento,
      email,
      telefone,
      endereco,
      representante_id,
      message: "Cliente cadastrado com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao cadastrar cliente:", error);
    res.status(500).json({ error: "Erro ao cadastrar cliente" });
  }
});

/* ===============================
   [GET] - Listar todos os clientes
   =============================== */
router.get("/", async (req, res) => {
  const representanteId = req.query.representante_id;

  if (!representanteId) {
    return res.status(400).json({ error: "representante_id é obrigatório" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM clientes WHERE representante_id = ?",
      [representanteId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

export default router;
