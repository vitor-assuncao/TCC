import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RepresentantePage.css";

const RepresentantePage = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
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

  if (carregando) return <p className="loading">Carregando produtos...</p>;
  if (erro) return <p className="error">❌ {erro}</p>;

  return (
    <div className="representante-container">
      {/* Barra superior fixa */}
      <header className="topbar">
        <button className="back-button" onClick={() => navigate("/")}>
          ← Voltar para Início
        </button>
        <h1> Catálogo de Produtos</h1>
      </header>

      {/* Conteúdo abaixo da barra */}
      <main className="representante-content">
        <div className="representante-card">
          {produtos.length === 0 ? (
            <p>Nenhum produto cadastrado no momento.</p>
          ) : (
            <div className="catalogo-grid">
              {produtos.map((produto) => {
                // Corrigir automaticamente link do Google Drive
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
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RepresentantePage;
