// src/modules/fabrica/components/ProdutoForm.jsx
import React, { useState } from 'react';
import './ProdutoForm.css';

const ProdutoForm = ({ onSubmit, carregando }) => {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    sku: '',
    unidade_medida: '',
    url_imagem: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.sku) {
      alert('Nome e SKU são obrigatórios!');
      return;
    }

    try {
      await onSubmit(formData);
      // Limpar formulário após sucesso
      setFormData({
        nome: '',
        descricao: '',
        sku: '',
        unidade_medida: '',
        url_imagem: ''
      });
      alert('Produto adicionado com sucesso!');
    } catch (error) {
      console.error('Erro no formulário:', error);
    }
  };

  return (
    <div className="produto-form">
      <h3>Adicionar Novo Produto</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome do Produto *</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
            placeholder="Ex: Mesa de Escritório"
          />
        </div>

        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            rows="3"
            placeholder="Descreva o produto..."
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sku">SKU *</label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              required
              placeholder="Ex: MESA-001"
            />
          </div>

          <div className="form-group">
            <label htmlFor="unidade_medida">Unidade de Medida</label>
            <input
              type="text"
              id="unidade_medida"
              name="unidade_medida"
              value={formData.unidade_medida}
              onChange={handleChange}
              placeholder="Ex: UN, PC, M²"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="url_imagem">URL da Imagem</label>
          <input
            type="url"
            id="url_imagem"
            name="url_imagem"
            value={formData.url_imagem}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={carregando}
        >
          {carregando ? 'Adicionando...' : 'Adicionar Produto'}
        </button>
      </form>
    </div>
  );
};

export default ProdutoForm;