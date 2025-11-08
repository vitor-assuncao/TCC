import axios from "axios";

// 🔹 Cria uma instância global do Axios apontando para o backend
const api = axios.create({
  baseURL: "http://localhost:3001/api", // altere a porta se necessário
  timeout: 10000, // tempo limite opcional (10 segundos)
  headers: {
    "Content-Type": "application/json",
  },
});

export const produtoService = api;
export const representanteService = api;
export const pedidoService = api;
export const clienteService = api;

// 🔹 Interceptor opcional para logar erros e facilitar debug
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição API:", error);
    return Promise.reject(error);
  }
);

// 🔹 Exporta como padrão (ESSENCIAL para funcionar com "import api from ...")
export default api;

