import React, { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PedidoContext from "../pedidos/PedidoContext";
import api from "../../services/api";
import "./PedidoForm.css";

const PedidoForm = () => {

  // 🔒 PROTEÇÃO DE LOGIN
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario) {
    window.location.href = "/login";
    return null;
  }

  const navigate = useNavigate();
  const location = useLocation();
  const { limparCarrinho } = useContext(PedidoContext);

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
    representante_id: usuario.id,
    condicao_pagamento: "",
    observacoes: "",
    valor_total: 0,
    itens: itensIniciais,
  });

  const [clientes, setClientes] = useState([]);
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

  // carrega clientes do backend
  useEffect(() => {
    (async () => {
      try {
        const cRes = await api.get(`/clientes?representante_id=${usuario.id}`);
        setClientes(cRes.data || []);
      } catch (e) {
        console.error("Erro ao carregar clientes:", e);
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

    // validações básicas
    if (!pedido.cliente_id) {
      alert("Selecione o cliente.");
      return;
    }

    if (!pedido.itens || pedido.itens.length === 0) {
      alert("Nenhum produto adicionado ao pedido.");
      return;
    }

    const produtos = (pedido.itens || [])
      .filter((it) => it && (it.produto_id || it.id) && Number(it.quantidade) > 0)
      .map((it) => ({
        produto_id: Number(it.produto_id || it.id),
        quantidade: Number(it.quantidade),
        preco_unitario: Number(it.preco_unitario || 0),
      }));

    const body = {
      cliente_id: Number(pedido.cliente_id),
      representante_id: Number(usuario.id),
      condicao_pagamento: pedido.condicao_pagamento || null,
      observacoes: pedido.observacoes || null,
      valor_total: Number(
        produtos.reduce((acc, it) => acc + it.quantidade * it.preco_unitario, 0)
      ),
      produtos,
    };

    try {
      await api.post("/pedidos", body);

      // 🔥 AGORA SIM LIMPA O CARRINHO DO CONTEXT
      limparCarrinho();

      // 🔥 remove do localStorage
      localStorage.removeItem("carrinho_pedido");

      alert("Pedido criado com sucesso!");
      navigate("/representante");
    } catch (error) {
      console.error("Erro ao criar pedido:", error?.response?.data || error);
      alert(
        "Erro ao criar pedido. " +
        (error?.response?.data?.error || "Verifique os dados e tente novamente.")
      );
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

        <div className="form-group">
          <label>Observações:</label>
          <textarea
            name="observacoes"
            value={pedido.observacoes}
            onChange={handleChange}
            placeholder="Digite observações adicionais..."
          />
        </div>

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
