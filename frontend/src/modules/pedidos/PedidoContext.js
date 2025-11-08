import { createContext } from 'react';

const PedidoContext = createContext({
  itens: [],
  adicionarItem: () => {},
  removerItem: () => {},
  limparPedido: () => {},
});

export default PedidoContext;
