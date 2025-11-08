import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RelatorioVendas = () => {
  const [relatorio, setRelatorio] = useState([]);

  useEffect(() => {
    const fetchRelatorio = async () => {
      const res = await api.get("/relatorios/vendas-representante");
      setRelatorio(res.data);
    };
    fetchRelatorio();
  }, []);

  return (
    <div className="relatorio-container">
      <h2>📊 Relatório de Vendas por Representante</h2>
      <table>
        <thead>
          <tr>
            <th>Representante</th>
            <th>Período</th>
            <th>Total de Pedidos</th>
            <th>Vendas (R$)</th>
            <th>Meta (R$)</th>
            <th>Atingimento (%)</th>
          </tr>
        </thead>
        <tbody>
          {relatorio.map((linha, idx) => (
            <tr key={idx}>
              <td>{linha.representante_nome}</td>
              <td>{linha.periodo}</td>
              <td>{linha.total_pedidos}</td>
              <td>R$ {linha.valor_total_vendido.toFixed(2)}</td>
              <td>R$ {linha.meta_vendas.toFixed(2)}</td>
              <td>{linha.percentual_atingimento_meta.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioVendas;
