import React, { useState } from "react";
import api from "../../services/api";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !cpf) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const res = await api.post("/login", { email, cpf });

      alert("Login realizado com sucesso!");

      // 🔹 Salvar usuário para manter session simples
      localStorage.setItem("usuario", JSON.stringify(res.data.usuario));

      // 🔹 Redirecionar
      window.location.href = "/representante";

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <div className="login-container">
      <h2>Acesso do Representante</h2>

      <form onSubmit={handleLogin} className="login-form">
        <label>E-mail:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@exemplo.com"
          required
        />

        <label>CPF:</label>
        <input
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          placeholder="000.000.000-00"
          required
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;
