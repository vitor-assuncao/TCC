import React, { useEffect, useState } from "react";
import api from "../services/api";
import "./FabricaPedidos.css";

const FabricaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const buscarPedidos = async () => {
    try {
      const res = await api.get("/pedidos");
      setPedidos(res.data);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    // console.log("BASE:", api.defaults.baseURL);
    buscarPedidos();
  }, []);

  const atualizarStatus = async (id, novoStatus) => {
    try {
      await api.put(`/pedidos/${id}/status`, { status: novoStatus });
      buscarPedidos();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  if (carregando) return <p>Carregando pedidos...</p>;

  return (
    <div className="fabrica-pedidos">
      <h2>📋 Pedidos Recebidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Representante</th>
            <th>Data</th>
            <th>Valor Total</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.map((p) => (
            <tr key={p.pedido_id}>
              <td>{p.pedido_id}</td>
              <td>{p.cliente}</td>
              <td>{p.representante}</td>
              <td>{new Date(p.data_pedido).toLocaleString()}</td>
              <td>R$ {Number(p.valor_total).toFixed(2)}</td>
              <td>{p.status}</td>
              <td>
                <select
                  value={p.status}
                  onChange={(e) => atualizarStatus(p.pedido_id, e.target.value)}
                >
                  <option>Em aberto</option>
                  <option>Confirmado</option>
                  <option>Enviado</option>
                  <option>Cancelado</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FabricaPedidos;
