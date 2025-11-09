import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RelatorioVendas.css";

const RelatorioVendas = () => {
  const [representantes, setRepresentantes] = useState([]);
  const [representanteSelecionado, setRepresentanteSelecionado] = useState("");
  const [relatorio, setRelatorio] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // carregar representantes no select
  useEffect(() => {
    const fetchRepresentantes = async () => {
      try {
        const res = await api.get("/representantes");
        setRepresentantes(res.data);
      } catch (error) {
        console.error("Erro ao carregar representantes:", error);
      }
    };
    fetchRepresentantes();
  }, []);

  // buscar relatório
  const buscarRelatorio = async () => {
    if (!representanteSelecionado) {
      alert("Selecione um representante!");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const res = await api.get(
        `/relatorios/vendas-representante?representante_id=${representanteSelecionado}`
      );
      setRelatorio(res.data);
    } catch (err) {
      setErro("Erro ao carregar relatório de vendas");
      console.error(err);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="relatorio-container">
      <h2>📊 Relatório de Vendas por Representante</h2>

      {/* Seleção de representante */}
      <div className="filtro-container">
        <label htmlFor="representante">Selecione o Representante:</label>
        <select
          id="representante"
          value={representanteSelecionado}
          onChange={(e) => setRepresentanteSelecionado(e.target.value)}
        >
          <option value="">-- Selecione --</option>
          {representantes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>

        <button onClick={buscarRelatorio}>🔍 Buscar</button>
      </div>

      {/* Exibição dos resultados */}
      {carregando && <p>Carregando...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!carregando && relatorio.length === 0 && (
        <p>Nenhum dado encontrado para este representante.</p>
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
            {relatorio.map((item, index) => (
              <tr key={index}>
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
