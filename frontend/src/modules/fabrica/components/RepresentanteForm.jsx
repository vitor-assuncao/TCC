import React, { useState, useEffect } from "react";
import "./RepresentanteForm.css";
import { representanteService } from '../../../services/api';

const RepresentanteForm = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    data_contratacao: ""
  });
  const [representantes, setRepresentantes] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.nome || !formData.email) {
    alert('Nome e email são obrigatórios!');
    return;
  }

  try {
    await representanteService.criarRepresentante(formData);
    alert('Representante cadastrado com sucesso!');
    setFormData({ nome: '', email: '', telefone: '', data_contratacao: '' });
  } catch (error) {
    console.error('Erro no formulário:', error);
    alert('Erro ao cadastrar representante.');
  }
};

  return (
    <div className="representante-form">
      <h3>Cadastrar Novo Representante</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome *</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Data de Contratação</label>
          <input
            type="date"
            name="data_contratacao"
            value={formData.data_contratacao}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Adicionar Representante</button>
      </form>

      <hr />

      <ul className="representante-lista">
        {representantes.length === 0 ? (
          <li>Nenhum representante cadastrado ainda.</li>
        ) : (
          representantes.map((r, i) => (
            <li key={i}>
              <span>{r.nome}</span>
              <span>{r.email}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default RepresentanteForm;
