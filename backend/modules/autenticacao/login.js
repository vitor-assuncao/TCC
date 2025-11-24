import express from "express";
import db from "../../db.js";

const router = express.Router();

// ==============================
// POST /api/login
// ==============================
router.post("/", async (req, res) => {
  const { email, cpf } = req.body;

  if (!email || !cpf) {
    return res.status(400).json({ error: "E-mail e CPF são obrigatórios!" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT * FROM representantes WHERE email = ? AND cpf = ?",
      [email, cpf]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas!" });
    }

    const usuario = rows[0];

    res.json({
      message: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("Erro ao realizar login:", error);
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

export default router;
