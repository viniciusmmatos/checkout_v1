const tabela = document.getElementById('tabela-pedidos');
const API = 'http://localhost:3000/api/pedidos';

async function carregarPedidos() {
  const resposta = await fetch(API);
  const pedidos = await resposta.json();

  tabela.innerHTML = '';
  pedidos.forEach(p => {
    const data = new Date(p.date).toLocaleString('pt-BR');
    const linha = document.createElement('tr');

    linha.innerHTML = `
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">${p.id}</td>
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">${data}</td>
      <td class="px-4 py-2 border">${p.itens[0].quantidade} X ${p.itens[0].nome}</td>
      <td class="px-4 py-2 border text-right" rowspan="${p.itens.length}">R$ ${p.total.toFixed(2)}</td>
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">${p.metodoPagamento}</td>
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">${p.nome || '-'}</td>
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">${p.equipe || '-'}</td>
      <td class="px-4 py-2 border text-center" rowspan="${p.itens.length}">
          <button class="text-red-600 hover:underline" onclick="excluirPedido(${p.id})">Cancelar</button>
      </td>
      `;
    tabela.appendChild(linha);

    for (let i = 1; i < p.itens.length; i++) {
      const item = p.itens[i];
      const linhaItem = document.createElement('tr');
      linhaItem.innerHTML = `
      <td class = "px-4 py-2 border">${item.quantidade} X ${item.nome}</td>
      `;
      tabela.appendChild(linhaItem)
    }
  });
}

window.excluirPedido = async function (id) {
  const confirma = confirm('Deseja realmente apagar o pedido?');
  if (!confirma) return;

  const resposta = await fetch(`${API}/${id}`, {
    method: 'DELETE'
  });

  if (resposta.status === 204) {
    alert('Pedido excluido.')
    await carregarPedidos();
  } else {
    const erro = await resposta.json();
    alert('Erro: ' + erro.erro);
  }
}

window.baixarRelatorio = function () {
  window.open('http://localhost:3000/api/relatorio/pedidos', '_blank');
};

carregarPedidos();
