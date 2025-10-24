import React, { useState, useEffect } from 'react';
import { representanteService } from '../../../services/api';
import './RepresentanteForm.css';

const RepresentanteForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    data_contratacao: ''
  });

  const [representantes, setRepresentantes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // 🔄 Carregar representantes do banco ao abrir a página
  useEffect(() => {
    carregarRepresentantes();
  }, []);

  const carregarRepresentantes = async () => {
    try {
      const data = await representanteService.listarRepresentantes();
      setRepresentantes(data);
    } catch (error) {
      console.error('Erro ao carregar representantes:', error);
      setErro('Erro ao carregar representantes');
    }
  };

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

    setCarregando(true);
    setErro(null);

    try {
      await representanteService.criarRepresentante(formData);
      alert('Representante cadastrado com sucesso!');
      setFormData({ nome: '', email: '', telefone: '', data_contratacao: '' });
      await carregarRepresentantes(); // Recarregar a lista
    } catch (error) {
      console.error('Erro no formulário:', error);
      setErro('Erro ao cadastrar representante.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="representante-form-container">
      <h3>Adicionar Novo Representante</h3>

      {erro && <div className="error-message">{erro}</div>}

      <form onSubmit={handleSubmit} className="representante-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nome">Nome *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Ex: João Silva"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="joao@email.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="telefone">Telefone</label>
            <input
              type="text"
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label htmlFor="data_contratacao">Data de Contratação</label>
            <input
              type="date"
              id="data_contratacao"
              name="data_contratacao"
              value={formData.data_contratacao}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={carregando}>
          {carregando ? 'Adicionando...' : 'Adicionar Representante'}
        </button>
      </form>

      {/* 📋 Lista de representantes */}
      <div className="representantes-list">
        <h4>Representantes Cadastrados</h4>
        {representantes.length === 0 ? (
          <p>Nenhum representante cadastrado.</p>
        ) : (
          <ul>
            {representantes.map((rep) => (
              <li key={rep.id}>
                <strong>{rep.nome}</strong> — {rep.email} ({rep.telefone || 'sem telefone'})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RepresentanteForm;
