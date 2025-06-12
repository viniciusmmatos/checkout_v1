export const produtos = [];

let contador = 1;

export function listarProdutos() {
    return produtos;
}

export function buscarProduto(id) {
    return produtos.find(p => p.id === id);
}

export function adicionarProduto({ classe, nome, estoque, valor }) {
    const novo = {
        id: `ITN${contador++}`,
        classe,
        nome,
        estoque: parseInt(estoque),
        valor: parseFloat(valor)
    };
    produtos.push(novo);
    return novo;
}

export function atualizarEstoque(id, qtd) {
    const produto = buscarProduto(id);
    if (produto) {
        produto.estoque -= qtd;
    }
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

export function removerProduto(id) {
    const index = produtos.findIndex(p => p.id === id);
    if (index !== -1) {
        produtos.splice(index, 1)
        return true;
    }
    return false;
}