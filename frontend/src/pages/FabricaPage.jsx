import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoForm from '../modules/fabrica/components/ProdutoForm';
import RepresentanteForm from '../modules/fabrica/components/RepresentanteForm';
import './FabricaPage.css';

const FabricaPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('produtos');

  // Hooks de produtos
  const { produtos, carregando, erro, adicionarProduto } = useProdutos();

  // --- ESTOQUE ---
  const [estoque, setEstoque] = useState([]);
  const [loadingEstoque, setLoadingEstoque] = useState(false);
  const [errorEstoque, setErrorEstoque] = useState(null);

  // Carrega o estoque ao abrir a aba
  useEffect(() => {
    if (activeTab === 'estoque') {
      fetchEstoque();
    }
  }, [activeTab]);

  const fetchEstoque = async () => {
    try {
      setLoadingEstoque(true);
      setErrorEstoque(null);
      const response = await fetch('http://localhost:3001/api/estoque');
      if (!response.ok) throw new Error('Erro ao buscar estoque');
      const data = await response.json();
      setEstoque(data);
    } catch (err) {
      setErrorEstoque(err.message);
    } finally {
      setLoadingEstoque(false);
    }
  };

  const atualizarQuantidade = async (produtoId, novaQuantidade) => {
    try {
      const response = await fetch(`http://localhost:3001/api/estoque/${produtoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade: novaQuantidade }),
      });
      if (!response.ok) throw new Error('Erro ao atualizar estoque');
      await fetchEstoque(); // Atualiza a tabela após salvar
    } catch (err) {
      alert('Erro ao atualizar estoque: ' + err.message);
    }
  };

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
          <button 
            className={activeTab === 'representantes' ? 'active' : ''}
            onClick={() => setActiveTab('representantes')}
          >
            🧑‍💼 Representantes
          </button>

        </nav>

        <div className="tab-content">
          {/* --- ABA PRODUTOS --- */}
          {activeTab === 'produtos' && (
            <div className="tab-panel">
              <h2>Gestão de Produtos</h2>

              {erro && <div className="error-message">❌ Erro: {erro}</div>}

              <ProdutoForm
                onSubmit={handleAdicionarProduto}
                carregando={carregando}
              />

              <div className="produtos-list">
                <h3>Produtos Cadastrados</h3>
                <p>Total: {produtos.length} produtos</p>
              </div>
            </div>
          )}

          {/* --- ABA ESTOQUE --- */}
          {activeTab === 'estoque' && (
            <div className="tab-panel">
              <h2>Controle de Estoque</h2>

              {loadingEstoque && <p>Carregando estoque...</p>}
              {errorEstoque && (
                <div className="error-message">❌ {errorEstoque}</div>
              )}

              {!loadingEstoque && !errorEstoque && estoque.length > 0 && (
                <table className="estoque-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Atualizar</th>
                      <th>Última Atualização</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoque.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.nome_produto}</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            value={item.quantidade}
                            onChange={(e) =>
                              setEstoque((prev) =>
                                prev.map((el) =>
                                  el.id === item.id
                                    ? { ...el, quantidade: e.target.value }
                                    : el
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="btn-update"
                            onClick={() =>
                              atualizarQuantidade(
                                item.produto_id,
                                parseInt(item.quantidade)
                              )
                            }
                          >
                            💾 Salvar
                          </button>
                        </td>
                        <td>{new Date(item.data_atualizacao).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {!loadingEstoque && estoque.length === 0 && (
                <p>Nenhum produto cadastrado no estoque.</p>
              )}
            </div>
          )}

          {/* --- ABA PREÇOS --- */}
          {activeTab === 'precos' && (
            <div className="tab-panel">
              <h2>Listas de Preço</h2>
              <p>Funcionalidade em desenvolvimento...</p>
            </div>
          )}
          {activeTab === 'representantes' && (
            <div className="tab-panel">
              <h2>Cadastro de Representantes</h2>
              <RepresentanteForm />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default FabricaPage;
