// src/services/api.js
const API_BASE = 'http://localhost:3001/api';

// Serviço para produtos
export const produtoService = {
  // Criar novo produto
  criarProduto: async (produtoData) => {
    try {
      const response = await fetch(`${API_BASE}/produtos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produtoData),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro no serviço:', error);
      throw error;
    }
  },

  // Listar todos os produtos (para futuras funcionalidades)
  listarProdutos: async () => {
    try {
      const response = await fetch(`${API_BASE}/produtos`);
      
      if (!response.ok) {
        throw new Error('Erro ao buscar produtos');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erro no serviço:', error);
      throw error;
    }
  }
};