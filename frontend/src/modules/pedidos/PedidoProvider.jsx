import React, { useState } from 'react';
import PedidoContext from './PedidoContext';

const PedidoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  const adicionarItem = (produto) => {
    setItens((prevItens) => {
      const existente = prevItens.find(i => i.produto_id === produto.id);
      if (existente) {
        // soma quantidade se já existe
        return prevItens.map(i =>
          i.produto_id === produto.id
            ? { ...i, quantidade: i.quantidade + 1, preco_total: (i.quantidade + 1) * i.preco_unitario }
            : i
        );
      }
      // adiciona novo
      return [
        ...prevItens,
        {
          produto_id: produto.id,
          quantidade: 1,
          preco_unitario: produto.preco,
          preco_total: produto.preco
        }
      ];
    });
  };

  const removerItem = (produtoId) => {
    setItens((prevItens) => prevItens.filter(i => i.produto_id !== produtoId));
  };

  const limparPedido = () => {
    setItens([]);
  };

  return (
    <PedidoContext.Provider value={{ itens, adicionarItem, removerItem, limparPedido }}>
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoProvider;
