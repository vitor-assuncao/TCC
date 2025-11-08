import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import PedidoContext from './PedidoContext';
import './PedidoForm.css';

const PedidoForm = ({ representanteId }) => {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [condicaoPagamento, setCondicaoPagamento] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [itens, setItens] = useState([]);
  const [valorTotal, setValorTotal] = useState(0);
  const [mensagem, setMensagem] = useState('');
  const [pedidoCriadoId, setPedidoCriadoId] = useState(null);
  const [loading, setLoading] = useState(false);

  // contexto global do pedido (itens adicionados via catálogo)
  const { itens: itensContext, limparPedido } = useContext(PedidoContext);

  // Carregar clientes e produtos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientesRes = await api.get(`/clientes?representante_id=${representanteId}`);
        setClientes(clientesRes.data);
        const produtosRes = await api.get('/produtos');
        setProdutos(produtosRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    fetchData();
  }, [representanteId]);

  // Se houver itens no contexto (vindos do catálogo), carrega no formulário
  useEffect(() => {
    if (itensContext.length > 0) {
      setItens(itensContext);
    }
  }, [itensContext]);

  // Atualiza o total automaticamente
  useEffect(() => {
    const total = itens.reduce((acc, item) => acc + item.preco_total, 0);
    setValorTotal(total);
  }, [itens]);

  const handleAddItem = () => {
    setItens([...itens, { produto_id: '', quantidade: 1, preco_unitario: 0, preco_total: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItens = [...itens];
    if (field === 'produto_id') {
      const produto = produtos.find(p => p.id === parseInt(value));
      updatedItens[index].produto_id = produto.id;
      updatedItens[index].preco_unitario = produto.preco;
      updatedItens[index].preco_total = produto.preco * updatedItens[index].quantidade;
    } else if (field === 'quantidade') {
      updatedItens[index].quantidade = parseInt(value);
      updatedItens[index].preco_total = updatedItens[index].quantidade * updatedItens[index].preco_unitario;
    }
    setItens(updatedItens);
  };

  const handleRemoveItem = (index) => {
    setItens(itens.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem('');
    setPedidoCriadoId(null);

    try {
      const pedidoData = {
        cliente_id: clienteId,
        representante_id: representanteId,
        condicao_pagamento: condicaoPagamento,
        observacoes,
        valor_total: valorTotal,
        itens: itens.map(i => ({
          produto_id: i.produto_id,
          quantidade: i.quantidade,
          preco_unitario: i.preco_unitario,
          preco_total: i.preco_total
        }))
      };

      const response = await api.post('/pedidos', pedidoData);
      setMensagem('✅ Pedido criado com sucesso!');
      setPedidoCriadoId(response.data.pedido_id);

      // Resetar formulário e limpar contexto
      setClienteId('');
      setCondicaoPagamento('');
      setObservacoes('');
      setItens([]);
      setValorTotal(0);
      limparPedido();
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      setMensagem('❌ Erro ao criar pedido. Verifique os dados.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pedido-form-container">
      <h2>Criar Novo Pedido</h2>

      <form onSubmit={handleSubmit} className="pedido-form">
        <div className="form-group">
          <label>Cliente:</label>
          <select value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
            <option value="">Selecione um cliente</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Condição de Pagamento:</label>
          <input
            type="text"
            value={condicaoPagamento}
            onChange={(e) => setCondicaoPagamento(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Observações:</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
          />
        </div>

        <h3>Itens do Pedido</h3>
        <table className="itens-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Preço Unitário</th>
              <th>Total</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {itens.map((item, index) => (
              <tr key={index}>
                <td>
                  <select
                    value={item.produto_id}
                    onChange={(e) => handleItemChange(index, 'produto_id', e.target.value)}
                    required
                  >
                    <option value="">Selecione</option>
                    {produtos.map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                  />
                </td>
                <td>R$ {item.preco_unitario.toFixed(2)}</td>
                <td>R$ {item.preco_total.toFixed(2)}</td>
                <td><button type="button" onClick={() => handleRemoveItem(index)}>Remover</button></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className="add-item-btn" onClick={handleAddItem}>
          + Adicionar Item
        </button>

        <div className="valor-total">
          <strong>Valor Total:</strong> R$ {valorTotal.toFixed(2)}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar Pedido'}
        </button>
      </form>

      {mensagem && <p className="mensagem">{mensagem}</p>}
      {pedidoCriadoId && <p className="pedido-id">Número do Pedido: <strong>#{pedidoCriadoId}</strong></p>}
    </div>
  );
};

export default PedidoForm;
