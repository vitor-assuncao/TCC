// backend/server.js
import express from 'express';
import cors from 'cors';
import produtosRoutes from './routes/produtos.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

console.log('Tentando registrar rotas de produtos...');

app.use('/api/produtos', produtosRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get('/teste', (req, res) => {
  res.send('Rota /teste funcionando!');
});