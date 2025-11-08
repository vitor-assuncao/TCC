import { useState, useEffect } from "react";
import { listarProdutos, criarProduto } from "../services/produtoService";

export function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  // 🔹 Carrega produtos ao montar o componente
  useEffect(() => {
    carregarProdutos();
  }, []);

  // 🔹 Busca produtos do backend
  const carregarProdutos = async () => {
    try {
      setCarregando(true);
      const data = await listarProdutos();
      setProdutos(data);
      setErro(null);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      setErro("Erro ao carregar produtos.");
    } finally {
      setCarregando(false);
    }
  };

  // 🔹 Adiciona novo produto
  const adicionarProduto = async (novoProduto) => {
    try {
      setCarregando(true);
      await criarProduto(novoProduto);
      await carregarProdutos(); // atualiza lista
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setErro("Erro ao adicionar produto.");
    } finally {
      setCarregando(false);
    }
  };

  return {
    produtos,
    carregando,
    erro,
    carregarProdutos,
    adicionarProduto,
  };
}
