import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ClienteForm from "../modules/representante/ClienteForm";
import Catalogo from "../modules/representante/Catalogo";
import api from "../services/api";  
import "./RepresentantePage.css";

const RepresentantePage = () => {
  // 🔒 VALIDAÇÃO DE LOGIN (Forma 1)
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/login";
    return null; // impede renderização até redirecionar
  }

  const [mostrarFormCliente, setMostrarFormCliente] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="representante-container">
      <header className="topbar">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Voltar para Início
        </button>
        <h1>📦 Catálogo de Produtos</h1>
        <button
          className="add-client-button"
          onClick={() => setMostrarFormCliente(!mostrarFormCliente)}
        >
          {mostrarFormCliente ? "❌ Fechar Cadastro" : "➕ Cadastrar Cliente"}
        </button>

        <button
          className="btn-relatorio"
          onClick={() => navigate("/relatorio-vendas")}
        >
          📊 Ver Relatório de Vendas
        </button>
      </header>

      <main className="representante-content">
        <div className="representante-card">
          <Catalogo /> {/* ✅ Catálogo movido para módulo próprio */}
        </div>

        {mostrarFormCliente && (
          <div className="cliente-section">
            <h2>Cadastro de Clientes</h2>
            <ClienteForm />
          </div>
        )}
      </main>
    </div>
  );
};

export default RepresentantePage;
