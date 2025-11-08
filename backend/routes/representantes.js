// routes/representantes.js
import express from "express";
import db from "../db.js";
const router = express.Router();

// GET /api/representantes
router.get("/", async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM representantes");
  res.json(rows);
});

// POST /api/representantes
router.post("/", async (req, res) => {
  const { nome, email, telefone, data_contratacao } = req.body;
  await db.execute(
    "INSERT INTO representantes (nome, email, telefone, data_contratacao) VALUES (?, ?, ?, ?)",
    [nome, email, telefone, data_contratacao]
  );
  res.status(201).json({ message: "Representante criado com sucesso!" });
});

export default router;
