import api from "./api";

// 🔹 Listar todos os produtos
export const listarProdutos = async () => {
  const response = await api.get("/produtos");
  return response.data;
};

// 🔹 Criar um novo produto
export const criarProduto = async (dados) => {
  const response = await api.post("/produtos", dados);
  return response.data;
};
