// backend/server.js
import express from 'express';
import cors from 'cors';
import pool from "./db.js";
import produtosRoutes from './routes/produtos.js';
import estoqueRoutes from './routes/estoque.js';
import representanteRoutes from './routes/representantes.js';
import clientesRoutes from "./routes/clientes.js";
import pedidosRoutes from './routes/pedidos.js';
import relatoriosRoutes from "./routes/relatorios.js";
import metasRoutes from "./routes/metas.js";
import loginRoutes from "./routes/login.js";
import fabricaLogin from "./routes/fabricaLogin.js";



const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

console.log('Tentando registrar rotas de produtos...');

app.get("/api/test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS hora_atual");
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
    res.status(500).json({ error: "Erro de conexão com o banco de dados" });
  }
});

app.use('/api/produtos', produtosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/representantes',representanteRoutes );
app.use("/api/clientes", clientesRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use("/api/relatorios", relatoriosRoutes);
app.use("/api/metas", metasRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/fabrica-login", fabricaLogin);



app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/teste', (req, res) => {
  res.send('Rota /teste funcionando!');
  
});

