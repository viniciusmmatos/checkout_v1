import express from 'express';
import { listarProdutos, adicionarProduto, atualizarProduto, removerProduto } from '../models/produtosModel.js';

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

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const atualizado = atualizarProduto(id, req.body);
    if (atualizado) {
        res.json(atualizado)
    } else {
        res.status(404).json({ erro: 'Produto não encontrado' })
    }
});

router.delete('/:id', (req, res) =>{
    const {id} = req.params;
    const sucesso = removerProduto(id);
    if(sucesso){
        res.sendStatus(204);
    }else{
        res.status(404).json({erro: 'Produto não encontrado!'})
    }
});

export default router;
