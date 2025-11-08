import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PedidoContext from "../pedidos/PedidoContext";
import api from '../../services/api';
import "./Catalogo.css";

const Catalogo = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [mensagem, setMensagem] = useState("");

  const { itens, adicionarItem, removerItem } = useContext(PedidoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/produtos");
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

        const data = await response.json();
        setProdutos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setErro(error.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutos();
  }, []);

  const handleAdicionar = (produto) => {
    adicionarItem({
      id: produto.id,
      nome: produto.nome,
      preco: produto.preco_unitario,
    });
    setMensagem(`✅ ${produto.nome} adicionado ao pedido`);
    setTimeout(() => setMensagem(""), 2500);
  };

  const handleFinalizar = () => {
    navigate("/pedido"); // Redireciona para o PedidoForm
  };

  if (carregando) return <p className="loading">Carregando produtos...</p>;
  if (erro) return <p className="error">❌ {erro}</p>;

  return (
    <div className="catalogo-page">
      {/* 🟢 Mensagem de sucesso */}
      {mensagem && <div className="mensagem-sucesso">{mensagem}</div>}

      <div className="catalogo-main">
        {/* 🧩 Catálogo principal */}
        <div className="catalogo-grid">
          {produtos.length === 0 ? (
            <p>Nenhum produto cadastrado no momento.</p>
          ) : (
            produtos.map((produto) => {
              let imagemUrl = "https://via.placeholder.com/150";
              if (produto.url_imagem) {
                if (produto.url_imagem.includes("drive.google.com")) {
                  const fileId = produto.url_imagem.split("/d/")[1]?.split("/")[0];
                  imagemUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
                } else {
                  imagemUrl = produto.url_imagem;
                }
              }

              return (
                <div className="catalogo-card" key={produto.id}>
                  <img
                    src={imagemUrl}
                    alt={produto.nome || "Produto"}
                    className="produto-imagem"
                  />
                  <div className="produto-info">
                    <h3>{produto.nome || "Sem nome"}</h3>
                    <p className="descricao">{produto.descricao || "Sem descrição"}</p>
                    <p><strong>SKU:</strong> {produto.sku || "N/A"}</p>
                    <p><strong>Unidade:</strong> {produto.unidade_medida || "N/A"}</p>
                    <p><strong>Estoque:</strong> {produto.quantidade ?? 0}</p>
                    <div className="preco">
                      💰 R$ {Number(produto.preco_unitario || 0).toFixed(2)}
                    </div>
                    <button
                      className="add-pedido-btn"
                      onClick={() => handleAdicionar(produto)}
                    >
                      + Adicionar ao Pedido
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* 🧺 Carrinho lateral */}
        <div className="pedido-sidebar">
          <h3>🧾 Produtos no Pedido</h3>
          {itens.length === 0 ? (
            <p className="vazio">Nenhum produto adicionado.</p>
          ) : (
            <>
              <ul className="lista-pedido">
                {itens.map((item) => (
                  <li key={item.produto_id} className="item-pedido">
                    <span>{item.nome}</span>
                    <span>R$ {item.preco_unitario.toFixed(2)}</span>
                    <button onClick={() => removerItem(item.produto_id)}>❌</button>
                  </li>
                ))}
              </ul>

              <div className="resumo-pedido">
                <p>
                  <strong>Total:</strong> R${" "}
                  {itens
                    .reduce((acc, item) => acc + item.preco_total, 0)
                    .toFixed(2)}
                </p>
                <button
                  className="finalizar-btn"
                  onClick={handleFinalizar}
                  disabled={itens.length === 0}
                >
                  🟢 Finalizar Pedido
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalogo;
