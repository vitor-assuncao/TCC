import React, { useState, useEffect } from "react";
import {
  listarRepresentantes,
  criarRepresentante,
} from "../../../services/representanteService";
import "./RepresentanteForm.css";

const RepresentanteForm = () => {
  const [representantes, setRepresentantes] = useState([]);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_contratacao: "",
  });
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // 🔹 Carrega os representantes assim que o componente monta
  useEffect(() => {
    carregarRepresentantes();
  }, []);

  const carregarRepresentantes = async () => {
    try {
      const data = await listarRepresentantes();
      setRepresentantes(data);
    } catch (error) {
      console.error("Erro ao carregar representantes:", error);
      setErro("Erro ao carregar representantes");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome || !formData.email) {
      alert("Nome e e-mail são obrigatórios!");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      await criarRepresentante(formData);
      alert("✅ Representante cadastrado com sucesso!");

      // Limpa o formulário
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        data_contratacao: "",
      });

      // Recarrega a lista
      await carregarRepresentantes();
    } catch (error) {
      console.error("Erro no formulário:", error);
      setErro("Erro ao cadastrar representante.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="representante-form-container">
      <h2>Cadastro de Representantes</h2>

      {erro && <p className="erro-msg">{erro}</p>}

      <form onSubmit={handleSubmit} className="representante-form">
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone:</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="form-group">
          <label>Data de Contratação:</label>
          <input
            type="date"
            name="data_contratacao"
            value={formData.data_contratacao}
            onChange={handleChange}
          />
        </div>

        <button type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar Representante"}
        </button>
      </form>

      <hr />

      <h3>📋 Lista de Representantes</h3>
      {representantes.length === 0 ? (
        <p>Nenhum representante cadastrado ainda.</p>
      ) : (
        <ul className="representantes-lista">
          {representantes.map((rep) => (
            <li key={rep.id}>
              <strong>{rep.nome}</strong> — {rep.email}
              {rep.telefone && <> — {rep.telefone}</>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RepresentanteForm;
