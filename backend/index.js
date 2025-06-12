import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import produtosRoutes from './routes/produtosRoutes.js';
import pedidosRoutes from './routes/pedidosRoutes.js';
import relatorioRoutes from './routes/relatorioRoutes.js';

const app = express();
const PORT = 3000;

// Em ESModules, precisamos obter __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas de API
app.use('/api/produtos', produtosRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/relatorio', relatorioRoutes);

// Servir arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/checkout.html'));
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
