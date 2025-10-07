// src/hooks/useProdutos.js
import { useState } from 'react';
import { produtoService } from '../services/api';

export const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Adicionar novo produto
  const adicionarProduto = async (produtoData) => {
    setCarregando(true);
    setErro('');
    
    try {
      const novoProduto = await produtoService.criarProduto(produtoData);
      setProdutos(prev => [...prev, novoProduto]);
      setCarregando(false);
      return novoProduto; // Retorna o produto criado para feedback
    } catch (error) {
      setErro(error.message);
      setCarregando(false);
      throw error; // Propaga o erro para o componente
    }
  };

  // Buscar produtos (para futuro uso)
  const buscarProdutos = async () => {
    setCarregando(true);
    setErro('');
    
    try {
      const listaProdutos = await produtoService.listarProdutos();
      setProdutos(listaProdutos);
      setCarregando(false);
    } catch (error) {
      setErro(error.message);
      setCarregando(false);
    }
  };

  return {
    produtos,
    carregando,
    erro,
    adicionarProduto,
    buscarProdutos
  };
};