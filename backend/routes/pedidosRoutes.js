import express from 'express';
import { listarPedidos, adicionarPedido } from '../models/pedidosModel.js';
import { buscarProduto } from '../models/produtosModel.js';

const router = express.Router();

router.get('/', (req, res) => {
    const pedidos = listarPedidos();
    const pedidosComItens = pedidos.map(pedido => ({
        ...pedido,
        itens:pedido.itens.map(item =>{
            const produto = buscarProduto(item.id);
            return {
                nome:produto.nome,
                quantidade: item.quantidade
            };
        })
    }));
    res.json(pedidosComItens)
});

router.post('/', (req, res) => {
    try {
        const pedido = adicionarPedido(req.body);
        res.status(201).json(pedido);
    } catch (erro) {
        res.status(400).json({ erro: erro.message });
    }
});

export default router;
