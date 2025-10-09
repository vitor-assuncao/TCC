// src/services/api.js
const API_BASE = 'http://localhost:3001/api';

// Serviço para produtos
export const produtoService = {
  // Criar novo produto
  criarProduto: async (produtoData) => {
    try {
      const response = await fetch(`${API_BASE}/produtos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produtoData),
      });

      if (!response.ok) throw new Error('Erro ao criar produto');
      return await response.json();
    } catch (error) {
      console.error('Erro no serviço:', error);
      throw error;
    }
  },

  // Listar produtos
  listarProdutos: async () => {
    try {
      const response = await fetch(`${API_BASE}/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      return await response.json();
    } catch (error) {
      console.error('Erro no serviço:', error);
      throw error;
    }
  },
};

// Serviço para estoque
export const estoqueService = {
  // Criar estoque inicial
  criarEstoque: async (estoqueData) => {
    try {
      const response = await fetch(`${API_BASE}/estoque`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estoqueData),
      });

      if (!response.ok) throw new Error('Erro ao cadastrar estoque');
      return await response.json();
    } catch (error) {
      console.error('Erro ao criar estoque:', error);
      throw error;
    }
  },

  // Atualizar quantidade de estoque
  atualizarEstoque: async (produtoId, quantidade) => {
    try {
      const response = await fetch(`${API_BASE}/estoque/${produtoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantidade }),
      });

      if (!response.ok) throw new Error('Erro ao atualizar estoque');
      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar estoque:', error);
      throw error;
    }
  },

  // Listar estoque
  listarEstoque: async () => {
    try {
      const response = await fetch(`${API_BASE}/estoque`);
      if (!response.ok) throw new Error('Erro ao buscar estoque');
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar estoque:', error);
      throw error;
    }
  },
};
