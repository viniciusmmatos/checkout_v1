import express from 'express';
import { listarProdutos, adicionarProduto } from '../models/produtosModel.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.json(listarProdutos());
});

router.post('/', (req, res) => {
    try {
        const novo = adicionarProduto(req.body);
        res.status(201).json(novo);
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

export default router;
