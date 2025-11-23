import React, { useState } from "react";
import api from "../../services/api";
import "./FabricaLogin.css";

const FabricaLogin = () => {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/fabrica-login", { usuario, senha });

      localStorage.setItem(
        "fabrica_usuario",
        JSON.stringify(res.data.usuario)
      );

      window.location.href = "/fabrica";
    } catch (error) {
      alert(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="fabrica-login-container">
      <h2>Login da Fábrica</h2>

      <form onSubmit={handleLogin} className="fabrica-login-form">
        <label>Usuário:</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default FabricaLogin;
