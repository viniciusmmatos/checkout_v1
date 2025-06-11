const tabela = document.getElementById('tabela-pedidos');
const API = 'http://localhost:3000/api/pedidos';

async function carregarPedidos() {
  const resposta = await fetch(API);
  const pedidos = await resposta.json();

  tabela.innerHTML = '';
  pedidos.forEach(p => {
    const data = new Date(p.date).toLocaleString('pt-BR');
    const linha = document.createElement('tr');

    const itensHtml = p.itens.map(item =>{
        return `${item.quantidade} X ${item.nome}`;
    }).join(', ');

    linha.innerHTML = `
      <td class="px-4 py-2 border text-center">${p.id}</td>
      <td class="px-4 py-2 border text-center">${data}</td>
      <td class="px-4 py-2 border text-center">${itensHtml}</td>
      <td class="px-4 py-2 border text-right">R$ ${p.total.toFixed(2)}</td>
      <td class="px-4 py-2 border text-center">${p.metodoPagamento}</td>
      <td class="px-4 py-2 border text-center">${p.nome || '-'}</td>
      <td class="px-4 py-2 border text-center">${p.equipe || '-'}</td>
    `;
    tabela.appendChild(linha);
  });
}

carregarPedidos();
