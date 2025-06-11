import { buscarProduto, atualizarEstoque } from "./produtosModel.js";

let pedidos = [];
let idPedido = 1;

export function listarPedidos() {
    return pedidos;
}

export function adicionarPedido({ itens, metodoPagamento, nome, equipe }) {
    let total = 0;

    itens.forEach(({ id, quantidade }) => {
        const produto = buscarProduto(id);
        if (produto && produto.estoque >= quantidade) {
            total += produto.valor * quantidade;
            atualizarEstoque(id, quantidade);
        } else {
            throw new Error(`Estoque insuficiente para o produto ${produto?.nome || id}`);
        }
    });

    if (!metodoPagamento) {
        throw new Error('Método de pagamento é obrigatório.');
    }

    if (metodoPagamento === 'PENDENTE' && (!nome || !equipe)) {
        throw new Error('Nome e equipe são obrigatórios para pagamento pendente.');
    }

    const pedido = {
        id: idPedido++,
        date: new Date().toISOString(),
        itens,
        total,
        metodoPagamento,
        nome: metodoPagamento === 'PENDENTE' ? nome : '',
        equipe: metodoPagamento === 'PENDENTE' ? equipe : ''
    };

    pedidos.push(pedido);
    return pedido;
}
