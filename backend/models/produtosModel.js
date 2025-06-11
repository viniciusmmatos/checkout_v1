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
