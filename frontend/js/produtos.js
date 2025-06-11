const nomeInput = document.getElementById('nome');
const classeInput = document.getElementById('classe');
const estoqueInput = document.getElementById('estoque');
const precoInput = document.getElementById('preco');
const btnCadastrar = document.getElementById('cadastrar');
const tabela = document.getElementById('tabela-produtos');

const API = 'http://localhost:3000/api/produtos';

async function carregarProdutos() {
  const resposta = await fetch(API);
  const produtos = await resposta.json();

  tabela.innerHTML = '';
  produtos.forEach(p => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td class="px-4 py-2 border">${p.nome}</td>
      <td class="px-4 py-2 border">R$ ${p.valor.toFixed(2)}</td>
      <td class="px-4 py-2 border">${p.classe}</td>
      <td class="px-4 py-2 border">${p.estoque}</td>
    `;
    tabela.appendChild(linha);
  });
}

async function cadastrarProduto() {
  const novoProduto = {
    nome: nomeInput.value,
    classe: classeInput.value,
    estoque: parseInt(estoqueInput.value),
    valor: parseFloat(precoInput.value)
  };

  const resposta = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoProduto)
  });

  if (resposta.ok) {
    nomeInput.value = '';
    classeInput.value = '';
    estoqueInput.value = '';
    precoInput.value = '';
    await carregarProdutos();
  } else {
    const erro = await resposta.json();
    alert('Erro: ' + erro.erro);
  }
}

btnCadastrar.addEventListener('click', cadastrarProduto);
carregarProdutos();
