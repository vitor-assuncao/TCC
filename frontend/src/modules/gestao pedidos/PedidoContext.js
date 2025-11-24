import { createContext } from 'react';

const PedidoContext = createContext({
  itens: [],
  adicionarItem: () => {},
  removerItem: () => {},
  limparCarrinho: () => {},
});

export default PedidoContext;
