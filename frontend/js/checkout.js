const selectProduto = document.getElementById('produto');
const inputQtd = document.getElementById('quantidade');
const btnAdicionar = document.getElementById('adicionar');
const btnFinalizar = document.getElementById('finalizar');
const tabela = document.getElementById('tabela-itens');
const totalSpan = document.getElementById('total-pedido');
const metodoPagamento = document.getElementById('metodo-pagamento');
const inputNome = document.getElementById('nome');
const inputEquipe = document.getElementById('equipe');

const API_PRODUTOS = 'http://localhost:3000/api/produtos';
const API_PEDIDOS = 'http://localhost:3000/api/pedidos';

let listaProdutos = [];
let carrinho = [];

async function carregarProdutos() {
  const resp = await fetch(API_PRODUTOS);
  listaProdutos = await resp.json();

  selectProduto.innerHTML = '<option>Selecione um produto</option>';
  listaProdutos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.textContent = `${p.nome} - R$ ${p.valor.toFixed(2)} (${p.estoque} un)`;
    selectProduto.appendChild(opt);
  });
}

function atualizarTabela() {
  tabela.innerHTML = '';
  let total = 0;

  carrinho.forEach(item => {
    const produto = listaProdutos.find(p => p.id === item.id);
    const quantidade = parseInt(item.quantidade);
    const subtotal = quantidade * produto.valor;
    total += subtotal;

    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td class="px-4 py-2 border">${produto.nome}</td>
      <td class="px-4 py-2 border">${quantidade}</td>
      <td class="px-4 py-2 border">R$ ${produto.valor.toFixed(2)}</td>
      <td class="px-4 py-2 border">R$ ${subtotal.toFixed(2)}</td>
    `;
    tabela.appendChild(linha);
  });

  totalSpan.textContent = total.toFixed(2);
}

btnAdicionar.addEventListener('click', () => {
  const id = selectProduto.value;
  const qtd = parseInt(inputQtd.value);

  if (!id || isNaN(qtd) || qtd <= 0) return alert('Preencha os campos corretamente!');

  const produto = listaProdutos.find(p => p.id === id);
  if (!produto) return alert('Produto Inválido.');
  if (qtd > produto.estoque) return alert('Estoque insuficiente');

  carrinho.push({ id, quantidade: qtd });
  atualizarTabela();
  inputQtd.value = '';
});

metodoPagamento.addEventListener('change', () => {
  const isPendente = metodoPagamento.value === 'PENDENTE';
  inputNome.classList.toggle('hidden', !isPendente);
  inputEquipe.classList.toggle('hidden', !isPendente);
});

btnFinalizar.addEventListener('click', async () => {
  if (carrinho.length === 0) return alert('Nenhum item adicionado ao carrinho.');

  const metodo = metodoPagamento.value;
  const nome = inputNome.value.trim();
  const equipe = inputEquipe.value.trim();

  if (!metodo) return alert('Selecione o método de pagamento');
  if (metodo === 'PENDENTE' && (!nome || !equipe)) return alert('Preencha o nome e equipe para pedidos pendentes.');

  const pedido = {
    itens: carrinho,
    metodoPagamento: metodo,
    nome: metodo === 'PENDENTE' ? nome : '',
    equipe: metodo === 'PENDENTE' ? equipe : ''
  };

  const resposta = await fetch(API_PEDIDOS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pedido)
  });

  if (resposta.ok) {
    alert('Pedido finalizado com sucesso!');
    carrinho = [];
    atualizarTabela();
    await carregarProdutos();
    metodoPagamento.value = '';
    inputNome.value = '';
    inputEquipe.value = '';
    inputNome.classList.add('hidden');
    inputEquipe.classList.add('hidden');
  } else {
    const erro = await resposta.json();
    alert('Erro: ' + erro.erro);
  }
});

carregarProdutos();
