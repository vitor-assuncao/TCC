// backend/server.js
import express from 'express';
import cors from 'cors';
import produtosRoutes from './routes/produtos.js';
import estoqueRoutes from './routes/estoque.js';
import representanteRoutes from './routes/representantes.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

console.log('Tentando registrar rotas de produtos...');

app.use('/api/produtos', produtosRoutes);
app.use('/api/estoque', estoqueRoutes);
app.use('/api/representantes',representanteRoutes );

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/teste', (req, res) => {
  res.send('Rota /teste funcionando!');
  
});