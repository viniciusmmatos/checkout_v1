import { buscarProduto, atualizarEstoque } from "./produtosModel.js";

let pedidos = [];
let idPedido = 1;

export function listarPedidos() {
    return pedidos;
}

export function adicionarPedido({ itens, metodoPagamento, nome, equipe }) {
    let total = 0;
    const itensCompletos = [];

    itens.forEach(({ id, quantidade }) => {
        const produto = buscarProduto(id);
        if (produto && produto.estoque >= quantidade) {
            const subtotal = produto.valor * quantidade;
            total += subtotal;
            atualizarEstoque(id, quantidade);

            itensCompletos.push({
                id,
                nome: produto.nome,
                quantidade,
                valorUnitario: produto.valor
            });
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
        itens: itensCompletos,
        total,
        metodoPagamento,
        nome: metodoPagamento === 'PENDENTE' ? nome : '',
        equipe: metodoPagamento === 'PENDENTE' ? equipe : ''
    };

    pedidos.push(pedido);
    return pedido;
}

export function atualizarProduto(id, dados) {
    const produto = buscarProduto(id);
    if (produto) {
        if (dados.nome) produto.nome = dados.nome;
        if (dados.classe) produto.classe = dados.classe;
        if (!isNaN(dados.valor)) produto.valor = parseFloat(dados.valor);
        if (!isNaN(dados.estoque)) produto.estoque = parseInt(dados.estoque);
        return produto;
    }
    return null;
}

export function removerPedido(id) {
    const index = pedidos.findIndex(p => p.id === id);
    if (index !== -1) {
        pedidos.splice(index, 1);
        return true;
    }
    return false;
}