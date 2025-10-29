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

  // --- PREÇOS ---
  const [precosEditados, setPrecosEditados] = useState({});

  const handlePrecoChange = (produtoId, novoPreco) => {
    setPrecosEditados((prev) => ({ ...prev, [produtoId]: novoPreco }));
  };

const salvarPreco = async (produtoId) => {
  const novoPreco = precosEditados[produtoId];
  if (!novoPreco) return;

  try {
    await fetch(`http://localhost:3001/api/produtos/${produtoId}/preco`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preco: parseFloat(novoPreco) }),
    });

    alert('Preço atualizado com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar preço:', error);
    alert('Erro ao atualizar preço.');
  }
};


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



const salvarQuantidade = async (produtoId, novaQuantidade) => {
  try {
    const response = await fetch(`http://localhost:3001/api/estoque/${produtoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantidade: parseInt(novaQuantidade) }),
    });

    if (!response.ok) throw new Error('Erro ao atualizar quantidade');
    alert('Quantidade atualizada com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar estoque:', error);
    alert('Erro ao atualizar quantidade.');
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

    {/* Mensagens de status */}
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

              {/* Campo de quantidade editável */}
              <td>
                <input
                  type="number"
                  value={produto.quantidade ?? 0}
                  onChange={(e) => {
                    const novaQtd = parseInt(e.target.value) || 0;
                    setEstoque((prev) =>
                      prev.map((p) =>
                        p.id === produto.id ? { ...p, quantidade: novaQtd } : p
                      )
                    );
                  }}
                  min="0"
                  style={{ width: '80px', textAlign: 'center' }}
                />
              </td>

              {/* Campo de preço editável */}
              <td>
                <input
                  type="number"
                  value={precosEditados[produto.id] ?? produto.preco ?? 0}
                  onChange={(e) =>
                    handlePrecoChange(produto.id, e.target.value)
                  }
                  step="0.01"
                  min="0"
                  style={{ width: '90px', textAlign: 'right' }}
                />
              </td>

              {/* Botão de salvar */}
              <td>
                <button
                  onClick={() => {
                    salvarPreco(produto.id);
                    salvarQuantidade(produto.id, produto.quantidade);
                  }}
                >
                  💾 Salvar
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
