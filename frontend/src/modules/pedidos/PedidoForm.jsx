import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./PedidoForm.css";

const PedidoForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // tenta pegar os itens vindos da página anterior ou do localStorage
  const itensDoState = location.state?.itensSelecionados || [];
  const itensDoStorage = (() => {
    try {
      const raw = localStorage.getItem("carrinho_pedido");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();

  const itensIniciais = itensDoState.length ? itensDoState : itensDoStorage;

  const [pedido, setPedido] = useState({
    cliente_id: "",
    representante_id: "",
    condicao_pagamento: "",
    observacoes: "",
    valor_total: 0,
    itens: itensIniciais,
  });

  const [clientes, setClientes] = useState([]);
  const [representantes, setRepresentantes] = useState([]);
  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  // atualiza o valor total do pedido sempre que os itens mudarem
  useEffect(() => {
    const total = (pedido.itens || []).reduce(
      (acc, it) =>
        acc +
        Number(it.preco_unitario || 0) * Number(it.quantidade || 0),
      0
    );
    setPedido((prev) => ({ ...prev, valor_total: total }));
  }, [pedido.itens]);

  // carrega clientes e representantes do backend
  useEffect(() => {
    (async () => {
      try {
        const [cRes, rRes] = await Promise.all([
          api.get("/clientes"),
          api.get("/representantes"),
        ]);
        setClientes(cRes.data || []);
        setRepresentantes(rRes.data || []);
      } catch (e) {
        console.error("Erro ao carregar dados:", e);
      }
    })();
  }, []);

  // atualizar campos do formulário
  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  // remover item do pedido
  const removerItem = (produtoId) => {
    const itensAtualizados = (pedido.itens || []).filter(
      (i) => i.produto_id !== produtoId
    );
    setPedido((prev) => ({ ...prev, itens: itensAtualizados }));
    localStorage.setItem("carrinho_pedido", JSON.stringify(itensAtualizados));
  };

  // enviar pedido para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !pedido.cliente_id ||
      !pedido.representante_id ||
      (pedido.itens || []).length === 0
    ) {
      alert("Preencha cliente, representante e adicione ao menos um produto.");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      await api.post("/pedidos", pedido);
      setMensagem("✅ Pedido criado com sucesso!");
      localStorage.removeItem("carrinho_pedido");
      setTimeout(() => navigate("/representante"), 1200);
    } catch (err) {
      console.error(err);
      setMensagem("❌ Erro ao criar pedido.");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="pedido-form-container">
      <h2>Criar Novo Pedido</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="pedido-form">
        {/* Cliente */}
        <div className="form-group">
          <label>Cliente:</label>
          <select
            name="cliente_id"
            value={pedido.cliente_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Representante */}
        <div className="form-group">
          <label>Representante:</label>
          <select
            name="representante_id"
            value={pedido.representante_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecione...</option>
            {representantes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Condição de Pagamento */}
        <div className="form-group">
          <label>Condição de Pagamento:</label>
          <input
            type="text"
            name="condicao_pagamento"
            value={pedido.condicao_pagamento}
            onChange={handleChange}
            placeholder="Ex: 30 dias, à vista..."
          />
        </div>

        {/* Observações */}
        <div className="form-group">
          <label>Observações:</label>
          <textarea
            name="observacoes"
            value={pedido.observacoes}
            onChange={handleChange}
            placeholder="Digite observações adicionais..."
          />
        </div>

        {/* Produtos no pedido */}
        <div className="pedido-itens-card">
          <h3>🧾 Produtos no Pedido</h3>
          {(pedido.itens || []).length === 0 ? (
            <p>Nenhum produto adicionado.</p>
          ) : (
            (pedido.itens || []).map((item) => (
              <div key={item.produto_id} className="pedido-item">
                <div>
                  <strong>{item.nome}</strong>
                  <p>
                    R$ {Number(item.preco_unitario || 0).toFixed(2)} ×{" "}
                    {Number(item.quantidade || 0)} ={" "}
                    <strong>
                      R${" "}
                      {(
                        Number(item.preco_unitario || 0) *
                        Number(item.quantidade || 0)
                      ).toFixed(2)}
                    </strong>
                  </p>
                </div>
                <button
                  type="button"
                  className="remover-item"
                  onClick={() => removerItem(item.produto_id)}
                >
                  ❌
                </button>
              </div>
            ))
          )}
          <hr />
          <p className="total">
            <strong>Total:</strong> R$ {Number(pedido.valor_total || 0).toFixed(2)}
          </p>
        </div>

        {/* Botões */}
        <div className="botoes-container">
          <button type="submit" disabled={carregando} className="finalizar">
            {carregando ? "Salvando..." : "✅ Finalizar Pedido"}
          </button>

          <button
            type="button"
            className="botao-voltar"
            onClick={() => navigate("/representante")}
          >
            ← Voltar ao Catálogo
          </button>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;
