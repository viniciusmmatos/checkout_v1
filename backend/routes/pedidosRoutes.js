import express from 'express';
import { listarPedidos, adicionarPedido, removerPedido } from '../models/pedidosModel.js';
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

router.delete('/:id',(req, res) =>{
    const {id} = req.params;
    const sucesso = removerPedido(parseInt(id));
    if(sucesso){
        res.sendStatus(204);
    } else{
        res.status(404).json({erro: 'Pedido não encontrado.'})
    }
});

export default router;
