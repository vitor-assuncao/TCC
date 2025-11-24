import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./FabricaPedidos.css";

const FabricaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Estado para modal com os itens
  const [itensPedido, setItensPedido] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

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

  // 👉 NOVO: buscar itens do pedido
  const verItensDoPedido = async (pedidoId) => {
    try {
      const res = await api.get(`/pedidos/${pedidoId}/itens`);
      setItensPedido(res.data);
      setPedidoSelecionado(pedidoId);
      setModalAberto(true);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
      alert("Erro ao carregar itens do pedido");
    }
  };

  if (carregando) return <p>Carregando pedidos...</p>;

  return (
    <div className="fabrica-pedidos">
      <h2>📋 Pedidos Recebidos</h2>

      {/* TABELA DE PEDIDOS */}
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
                  onChange={(e) =>
                    atualizarStatus(p.pedido_id, e.target.value)
                  }
                >
                  <option>Em aberto</option>
                  <option>Confirmado</option>
                  <option>Enviado</option>
                  <option>Cancelado</option>
                </select>

                {/* NOVO BOTÃO */}
                <button
                  className="btn-itens"
                  onClick={() => verItensDoPedido(p.pedido_id)}
                >
                  Ver Itens
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL COM OS ITENS DO PEDIDO */}
      {modalAberto && (
        <div className="modal-fundo">
          <div className="modal">
            <h3>Itens do Pedido #{pedidoSelecionado}</h3>

            {itensPedido.length === 0 ? (
              <p>Nenhum item encontrado.</p>
            ) : (
              <table className="tabela-itens">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Qtd</th>
                    <th>Preço Unitário</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itensPedido.map((item, index) => (
                    <tr key={index}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {Number(item.preco_unitario).toFixed(2)}</td>
                      <td>
                        R${" "}
                        {(
                          item.quantidade * Number(item.preco_unitario)
                        ).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="modal-fechar"
              onClick={() => setModalAberto(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FabricaPedidos;
