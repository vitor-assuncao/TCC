import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./RelatorioVendas.css";
import { useNavigate } from "react-router-dom";

const RelatorioVendas = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  if (!usuario) {
    window.location.href = "/login";
    return null;
  }

  const representanteId = usuario.id;

  const [relatorio, setRelatorio] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [itensPedido, setItensPedido] = useState([]);
  const [modalItensAberto, setModalItensAberto] = useState(false);
  const [modalPedidosAberto, setModalPedidosAberto] = useState(false);

  const [pedidoSelecionado, setPedidoSelecionado] = useState(null);

  // 🔥 Carrega relatório
  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(
          `/relatorios/vendas-representante?representante_id=${representanteId}`
        );
        setRelatorio(r.data || []);
      } catch (err) {
        console.error("Erro ao carregar relatório:", err);
      }
    })();
  }, [representanteId]);

  // 🔥 Carregar pedidos do representante
  const carregarPedidos = async () => {
    try {
      const resp = await api.get(
        `/relatorios/pedidos-representante?representante_id=${representanteId}`
      );
      setPedidos(resp.data || []);
      setModalPedidosAberto(true);
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
      alert("Erro ao carregar pedidos.");
    }
  };

  // 🔥 Carregar itens de um pedido
  const verItensPedido = async (pedidoId) => {
    try {
      const resp = await api.get(`/pedidos/${pedidoId}/itens`);
      setItensPedido(resp.data || []);
      setPedidoSelecionado(pedidoId);
      setModalItensAberto(true);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
      alert("Erro ao carregar itens.");
    }
  };

  return (
    <div className="relatorio-container">
      <h2>📊 Meu Relatório de Vendas</h2>
      <p>Representante: <strong>{usuario.nome}</strong></p>

      <button
        onClick={() => navigate("/representante")}
        className="botao-voltar-relatorio"
      >
        ← Voltar ao Catálogo
      </button>

      <button
        onClick={carregarPedidos}
        className="btn-pedidos"
      >
        📦 Ver Meus Pedidos
      </button>

      {relatorio.length > 0 && (
        <table className="relatorio-tabela">
          <thead>
            <tr>
              <th>Período</th>
              <th>Total Pedidos</th>
              <th>Valor Vendido</th>
              <th>Meta</th>
              <th>Atingimento</th>
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

      {/* MODAL DE PEDIDOS */}
      {modalPedidosAberto && (
        <div className="modal-fundo">
          <div className="modal">
            <h3>📦 Meus Pedidos</h3>

            {pedidos.length === 0 ? (
              <p>Nenhum pedido encontrado.</p>
            ) : (
              <table className="tabela-itens">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Data</th>
                    <th>Total</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((p) => (
                    <tr key={p.id}>
                      <td>{p.id}</td>
                      <td>{p.cliente}</td>
                      <td>{new Date(p.data_pedido).toLocaleString()}</td>
                      <td>R$ {Number(p.valor_total).toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-itens"
                          onClick={() => verItensPedido(p.id)}
                        >
                          Ver Itens
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="modal-fechar"
              onClick={() => setModalPedidosAberto(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* MODAL DE ITENS */}
      {modalItensAberto && (
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
                    <th>Preço</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {itensPedido.map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.nome}</td>
                      <td>{item.quantidade}</td>
                      <td>R$ {Number(item.preco_unitario).toFixed(2)}</td>
                      <td>R$ {(item.quantidade * item.preco_unitario).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <button
              className="modal-fechar"
              onClick={() => setModalItensAberto(false)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatorioVendas;
