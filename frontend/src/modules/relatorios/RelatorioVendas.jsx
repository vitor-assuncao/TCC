import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RelatorioVendas.css";
import { useNavigate } from "react-router-dom";

const RelatorioVendas = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  // 🔐 Proteção
  if (!usuario) {
    window.location.href = "/login";
    return null;
  }

  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const representanteId = usuario.id;

  // Carrega relatório apenas do representante logado
  useEffect(() => {
    const carregar = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const resposta = await api.get(
          `/relatorios/vendas-representante?representante_id=${representanteId}`
        );
        setRelatorio(resposta.data);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar relatório de vendas.");
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [representanteId]);

  return (
    <div className="relatorio-container">
      <h2>📊 Meu Relatório de Vendas</h2>
      <p>Representante: <strong>{usuario.nome}</strong></p>

      {/* 🔙 Botão de voltar */}
      <button
        onClick={() => navigate("/representante")}
        className="botao-voltar-relatorio"
      >
        ← Voltar para o Catálogo
      </button>

      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!carregando && relatorio.length === 0 && (
        <p>Nenhum dado encontrado.</p>
      )}

      {relatorio.length > 0 && (
        <table className="relatorio-tabela">
          <thead>
            <tr>
              <th>Período</th>
              <th>Total de Pedidos</th>
              <th>Valor Vendido (R$)</th>
              <th>Meta (R$)</th>
              <th>Atingimento (%)</th>
            </tr>
          </thead>
          <tbody>
            {relatorio.map((item, idx) => (
              <tr key={idx}>
                <td>{item.periodo}</td>
                <td>{item.total_pedidos}</td>
                <td>R$ {Number(item.valor_total_vendido).toFixed(2)}</td>
                <td>R$ {Number(item.meta_vendas).toFixed(2)}</td>
                <td>{Number(item.percentual_atingimento_meta).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RelatorioVendas;
