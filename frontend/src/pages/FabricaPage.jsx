import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProdutos } from '../hooks/useProdutos';
import ProdutoForm from '../modules/fabrica/components/ProdutoForm';
import RepresentanteForm from '../modules/fabrica/components/RepresentanteForm';
import './FabricaPage.css';

const FabricaPage = () => {

  const admin = JSON.parse(localStorage.getItem("fabrica_usuario"));

if (!admin || admin.tipo !== "admin") {
  window.location.href = "/fabrica-login";
  return null;
}

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('produtos');

  // Hooks de produtos
  const { produtos, carregando, erro, adicionarProduto } = useProdutos();

  // --- ESTOQUE ---
  const [estoque, setEstoque] = useState([]);
  const [loadingEstoque, setLoadingEstoque] = useState(false);
  const [errorEstoque, setErrorEstoque] = useState(null);

  // --- PREÇOS ---
  const [precosEditados, setPrecosEditados] = useState({});

  const handlePrecoChange = (produtoId, novoPreco) => {
    setPrecosEditados((prev) => ({ ...prev, [produtoId]: novoPreco }));
  };

  const salvarPreco = async (produtoId) => {
    const novoPreco = precosEditados[produtoId];
    if (!novoPreco) return;

    try {
      const resp = await fetch(`http://localhost:3001/api/produtos/${produtoId}/preco`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ preco_unitario: parseFloat(novoPreco) }),
      });

      if (!resp.ok) {
        const texto = await resp.text();
        console.error('Resposta do backend (preço):', resp.status, texto);
        throw new Error('Erro ao atualizar preço');
      }

      alert('Preço atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar preço:', error);
      alert('Erro ao atualizar preço.');
    }
  };

  // --- CARREGAR ESTOQUE ---
  useEffect(() => {
    if (activeTab === 'estoque') {
      fetchEstoque();
    }
  }, [activeTab]);

  const fetchEstoque = async () => {
    try {
      setLoadingEstoque(true);
      setErrorEstoque(null);
      const response = await fetch('http://localhost:3001/api/produtos');
      if (!response.ok) throw new Error('Erro ao buscar produtos/estoque');
      const data = await response.json();
      setEstoque(data);
    } catch (err) {
      setErrorEstoque(err.message);
    } finally {
      setLoadingEstoque(false);
    }
  };

  // ---------- 🔥 ATUALIZAR QUANTIDADE ----------
  const salvarQuantidade = async (produtoId, novaQuantidade) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/produtos/${produtoId}/quantidade`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantidade: parseInt(novaQuantidade) || 0 }),
        }
      );

      if (!response.ok) {
        const texto = await response.text();
        console.error(
          'Resposta do backend (quantidade):',
          response.status,
          texto
        );
        throw new Error('Erro ao atualizar quantidade');
      }

      alert('Quantidade atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      alert('Erro ao atualizar quantidade.');
    }
  };
  // ---------------------------------------------

  // --- REMOVER PRODUTO ---
  const removerProduto = async (id) => {
    if (!window.confirm('Tem certeza que deseja remover este produto do estoque?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/produtos/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao remover o produto.');
      setEstoque((prev) => prev.filter((p) => p.id !== id));
      alert('Produto removido com sucesso!');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      alert('Erro ao remover produto.');
    }
  };

  const handleAdicionarProduto = async (produtoData) => {
    await adicionarProduto(produtoData);
  };

  // --- REDIRECIONAR PARA TELA DE PEDIDOS ---
  const irParaPedidos = () => {
    navigate('/fabrica-pedidos');
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
            className={activeTab === 'representantes' ? 'active' : ''}
            onClick={() => setActiveTab('representantes')}
          >
            🧑‍💼 Representantes
          </button>
          <button
            className={activeTab === 'pedidos' ? 'active' : ''}
            onClick={() => irParaPedidos()}
          >
            📋 Pedidos
          </button>
          <button
            className={activeTab === 'metas' ? 'active' : ''}
            onClick={() => navigate('/fabrica-metas')}
          >
            🎯 Metas
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
              {errorEstoque && <p style={{ color: 'red' }}>❌ {errorEstoque}</p>}

              {estoque.length === 0 ? (
                <p>Nenhum produto cadastrado no estoque.</p>
              ) : (
                <table className="estoque-tabela">
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>SKU</th>
                      <th>Quantidade</th>
                      <th>Preço (R$)</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {estoque.map((produto) => (
                      <tr key={produto.id}>
                        <td>{produto.nome}</td>
                        <td>{produto.sku}</td>
                        <td>
                          <input
                            type="number"
                            value={produto.quantidade ?? 0}
                            onChange={(e) => {
                              const novaQtd = parseInt(e.target.value) || 0;
                              setEstoque((prev) =>
                                prev.map((p) =>
                                  p.id === produto.id
                                    ? { ...p, quantidade: novaQtd }
                                    : p
                                )
                              );
                            }}
                            min="0"
                            style={{ width: '80px', textAlign: 'center' }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={
                              precosEditados[produto.id] ??
                              produto.preco_unitario ??
                              0
                            }
                            onChange={(e) =>
                              handlePrecoChange(produto.id, e.target.value)
                            }
                            step="0.01"
                            min="0"
                            style={{ width: '90px', textAlign: 'right' }}
                          />
                        </td>
                        <td style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              salvarPreco(produto.id);
                              salvarQuantidade(
                                produto.id,
                                produto.quantidade ?? 0
                              );
                            }}
                            className="btn-salvar"
                          >
                            💾 Salvar
                          </button>
                          <button
                            onClick={() => removerProduto(produto.id)}
                            className="btn-remover"
                          >
                            🗑️ Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* --- ABA REPRESENTANTES --- */}
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
