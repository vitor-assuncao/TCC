import api from "./api";

// 🔹 Lista todos os representantes
export const listarRepresentantes = async () => {
  const response = await api.get("/representantes");
  return response.data;
};

// 🔹 Cria um novo representante
export const criarRepresentante = async (dados) => {
  const response = await api.post("/representantes", dados);
  return response.data;
};
