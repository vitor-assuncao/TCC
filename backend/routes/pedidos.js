import express from 'express';
import { criarPedido, listarPedidos, obterPedido } from '../controllers/pedidosController.js';

const router = express.Router();

router.post('/', criarPedido);     // POST /api/pedidos
router.get('/', listarPedidos);    // GET /api/pedidos
router.get('/:id', obterPedido);   // GET /api/pedidos/:id

export default router;
