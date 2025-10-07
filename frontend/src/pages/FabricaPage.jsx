// src/pages/FabricaPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoForm from '../modules/fabrica/components/ProdutoForm';
import './FabricaPage.css';

const FabricaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('produtos');
  
  // Usando nosso hook personalizado
  const { produtos, carregando, erro, adicionarProduto } = useProdutos();

  const handleAdicionarProduto = async (produtoData) => {
    await adicionarProduto(produtoData);
  };

  return (
    <div className="fabrica-container">
      <header className="fabrica-header">
        <button onClick={() => navigate('/')} className="back-button">
          ← Voltar para Início
        </button>
        <h1>Painel da Fábrica</h1>
      </header>

      <div className="fabrica-content">
        <nav className="fabrica-nav">
          <button 
            className={activeTab === 'produtos' ? 'active' : ''}
            onClick={() => setActiveTab('produtos')}
          >
            📦 Produtos
          </button>
          <button 
            className={activeTab === 'estoque' ? 'active' : ''}
            onClick={() => setActiveTab('estoque')}
          >
            📊 Estoque
          </button>
          <button 
            className={activeTab === 'precos' ? 'active' : ''}
            onClick={() => setActiveTab('precos')}
          >
            💰 Listas de Preço
          </button>
        </nav>

        <div className="tab-content">
          {activeTab === 'produtos' && (
            <div className="tab-panel">
              <h2>Gestão de Produtos</h2>
              
              {/* Mensagem de erro */}
              {erro && (
                <div className="error-message">
                  ❌ Erro: {erro}
                </div>
              )}
              
              {/* Formulário para adicionar produto */}
              <ProdutoForm 
                onSubmit={handleAdicionarProduto}
                carregando={carregando}
              />

              {/* Lista de produtos (será implementada depois) */}
              <div className="produtos-list">
                <h3>Produtos Cadastrados</h3>
                <p>Total: {produtos.length} produtos</p>
                {/* Aqui vamos listar os produtos posteriormente */}
              </div>
            </div>
          )}

          {activeTab === 'estoque' && (
            <div className="tab-panel">
              <h2>Controle de Estoque</h2>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          )}

          {activeTab === 'precos' && (
            <div className="tab-panel">
              <h2>Listas de Preço</h2>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FabricaPage;