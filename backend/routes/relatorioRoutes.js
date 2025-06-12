import express from 'express';
import { gerarRelatorioPDF } from '../controllers/relatorioController.js';

const router = express.Router();

router.get('/pedidos', gerarRelatorioPDF);

export default router;