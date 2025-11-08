import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api"; // ✅ caminho corrigido
import "./PedidoForm.css";

const PedidoForm = () => {
  const navigate = useNavigate();

  const [pedido, setPedido] = useState({
    cliente_id: "",
    representante_id: "",
    condicao_pagamento: "",
    observacoes: "",
    valor_total: 0,
    itens: [],
  });

  const [mensagem, setMensagem] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pedido.cliente_id || !pedido.representante_id) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setCarregando(true);
    setMensagem("");

    try {
      await api.post("/pedidos", pedido);
      setMensagem("✅ Pedido criado com sucesso!");
      setPedido({
        cliente_id: "",
        representante_id: "",
        condicao_pagamento: "",
        observacoes: "",
        valor_total: 0,
        itens: [],
      });
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      setMensagem("❌ Erro ao criar pedido.");
    } finally {
      setCarregando(false);
    }
  };

  // 🔙 botão de voltar ao catálogo
  const handleVoltar = () => {
    navigate("/catalogo"); // ✅ rota configurada no App.jsx
  };

  return (
    <div className="pedido-form-container">
      <h2>Criar Novo Pedido</h2>

      {mensagem && <p className="mensagem">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="pedido-form">
        <div className="form-group">
          <label>ID do Cliente:</label>
          <input
            type="number"
            name="cliente_id"
            value={pedido.cliente_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>ID do Representante:</label>
          <input
            type="number"
            name="representante_id"
            value={pedido.representante_id}
            onChange={handleChange}
            required
          />
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

        <div className="botoes-container">
          <button type="submit" disabled={carregando}>
            {carregando ? "Salvando..." : "Salvar Pedido"}
          </button>

          <button
            type="button"
            className="botao-voltar"
            onClick={handleVoltar}
          >
            ← Voltar ao Catálogo
          </button>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;
