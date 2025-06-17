const nomeInput = document.getElementById('nome');
const classeInput = document.getElementById('classe');
const estoqueInput = document.getElementById('estoque');
const precoInput = document.getElementById('preco');
const btnCadastrar = document.getElementById('cadastrar');
const tabela = document.getElementById('tabela-produtos');

const API = 'http://localhost:3000/api/produtos';

let listaProdutos = [];
let editandoId = null;

async function carregarProdutos() {
  const resposta = await fetch(API);
  const produtos = await resposta.json();
  listaProdutos = produtos;

  tabela.innerHTML = '';
  produtos.forEach(p => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td class="px-4 py-2 border">${p.nome}</td>
      <td class="px-4 py-2 border">R$ ${p.valor.toFixed(2)}</td>
      <td class="px-4 py-2 border">${p.classe}</td>
      <td class="px-4 py-2 border">${p.estoque}</td>
      <td class="px-4 py-2 border text-center">
        <button class="text-blue-600 hover:underline" onclick="editarProduto('${p.id}')">[Editar]</button>
        <button class="text-blue-600 hover:underline" onclick="excluirProduto('${p.id}')">[Exclir]</button>

        </td>
    `;
    tabela.appendChild(linha);
  });
}

async function cadastrarProduto() {
  const nome = nomeInput.value.trim();
  const classe = classeInput.value;
  const estoque = parseInt(estoqueInput.value);
  const valor = parseFloat(precoInput.value);

  //RESET STYLUS ERRO
  nomeInput.classList.remove('border-red-500');
  classeInput.classList.remove('border-red-500');
  estoqueInput.classList.remove('border-red-500');
  precoInput.classList.remove('border-red-500');
  const msgErro = document.getElementById('mensagem-erro');
  msgErro.classList.remove('hidden');
  msgErro.textContent = ''

  //VALIDAÇÃO DADOS PREENCHIDOS
  let temErro = false;
  if(!nome){
    nomeInput.classList.add('border-red-500');
    temErro = true;
  }
  if(!classe){
    classeInput.classList.add('border-red-500');
    temErro = true;
  }
  if(isNaN(estoque)){
    estoqueInput.classList.add('border-red-500');
    temErro = true;
  }
  if(isNaN(valor)){
    precoInput.classList.add('border-red-500');
    temErro = true;
  }

  if(temErro){
    msgErro.textContent = '❗ Preencha todos os campos corretamente antes de cadastrar.'
    msgErro.classList.remove('hidden');
    return;
  }


  const novoProduto = { nome, classe, estoque, valor };
  let resposta;

  if (editandoId) {
    // Atualização
    resposta = await fetch(`${API}/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    });

    btnCadastrar.textContent = 'Cadastrar';
    editandoId = null;
  } else {
    // Criação
    resposta = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoProduto)
    });
  }

  if (resposta.ok) {
    // Limpar campos e recarregar lista
    alert(editandoId ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!')
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

window.editarProduto = function (id) {
  const produto = listaProdutos.find(p => p.id === id);
  if (!produto) return;

  nomeInput.value = produto.nome;
  classeInput.value = produto.classe;
  precoInput.value = produto.valor;
  estoqueInput.value = produto.estoque;

  editandoId = id;
  btnCadastrar.textContent = 'Salvar';
};

window.excluirProduto = async function (id) {
  const confirmacao = confirm('Tem certeza que deseja excluir o produto?');
  if (!confirmacao) return;

  const resposta = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  if (resposta.status === 204) {
    alert('Produto removido com sucesso.');
    await carregarProdutos();
  } else {
    const erro = await resposta.json();
    alert('Erro: ' + erro.erro)
  }
};

carregarProdutos();

