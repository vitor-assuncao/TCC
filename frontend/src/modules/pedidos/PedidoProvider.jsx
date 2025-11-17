import React, { useState } from 'react';
import PedidoContext from './PedidoContext';

const PedidoProvider = ({ children }) => {
  const [itens, setItens] = useState([]);

  const adicionarItem = (produto) => {
    setItens((prevItens) => {
      const existente = prevItens.find((i) => i.produto_id === produto.id);

      if (existente) {
        return prevItens.map((i) =>
          i.produto_id === produto.id
            ? {
                ...i,
                quantidade: i.quantidade + 1,
                preco_total: (i.quantidade + 1) * i.preco_unitario,
              }
            : i
        );
      }

      const preco = Number(produto.preco_unitario || produto.preco || 0);

      return [
        ...prevItens,
        {
          produto_id: produto.id,
          nome: produto.nome,
          quantidade: 1,
          preco_unitario: preco,
          preco_total: preco,
        },
      ];
    });
  };

  const removerItem = (produtoId) => {
    setItens((prevItens) => prevItens.filter((i) => i.produto_id !== produtoId));
  };

  const limparCarrinho = () => {
    setItens([]);
  };

  return (
    <PedidoContext.Provider
      value={{
        itens,
        adicionarItem,
        removerItem,
        limparCarrinho,  // 🔥 agora funciona
      }}
    >
      {children}
    </PedidoContext.Provider>
  );
};

export default PedidoProvider;
