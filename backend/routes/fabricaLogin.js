import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { usuario, senha } = req.body;

  if (usuario === "admin" && senha === "1234") {
    return res.json({
      message: "Login da fábrica realizado!",
      usuario: {
        nome: "Administrador",
        tipo: "admin"
      }
    });
  }

  return res.status(401).json({ error: "Credenciais inválidas" });
});

export default router;
