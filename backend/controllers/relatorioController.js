// backend/controllers/relatorioHtmlController.js

import puppeteer from 'puppeteer';
import { listarPedidos } from '../models/pedidosModel.js';

function gerarHTMLRelatorio(pedidos) {
  let totalVendido = 0;
  let totalItens = 0;
  const vendasPorProduto = {};
  const vendasPorPagamento = {
    'DINHEIRO': 0,
    'PIX': 0,
    'CARTÃO DE CRÉDITO': 0,
    'CARTÃO DE DÉBITO': 0,
    'PENDENTE': 0
  };

  pedidos.forEach(p => {
    totalVendido += p.total;
    vendasPorPagamento[p.metodoPagamento] += p.total;

    p.itens.forEach(i => {
      totalItens += i.quantidade;
      if (!vendasPorProduto[i.nome]) {
        vendasPorProduto[i.nome] = { quantidade: 0, valor: 0 };
      }
      vendasPorProduto[i.nome].quantidade += i.quantidade;
      vendasPorProduto[i.nome].valor += i.quantidade * i.valorUnitario;
    });
  });

  const produtosOrdenados = Object.entries(vendasPorProduto)
    .sort((a, b) => b[1].quantidade - a[1].quantidade);

  return `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1, h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
        th { background: #eee; }
        .right { text-align: right; }
      </style>
    </head>
    <body>
      <h1>Relatório de Pedidos</h1>

      <h2>Resumo</h2>
      <table>
        <tr>
          <th>Total vendido (R$)</th>
          <th>Total de pedidos</th>
          <th>Total de itens vendidos</th>
        </tr>
        <tr>
          <td class="right">${totalVendido.toFixed(2)}</td>
          <td class="right">${pedidos.length}</td>
          <td class="right">${totalItens}</td>
        </tr>
      </table>

      <h2>Vendas por Produto</h2>
      <table>
        <thead>
          <tr>
            <th>Produto</th>
            <th>Qtd Vendida</th>
            <th>Faturamento (R$)</th>
          </tr>
        </thead>
        <tbody>
          ${produtosOrdenados.map(([nome, dados]) => `
            <tr>
              <td>${nome}</td>
              <td class="right">${dados.quantidade}</td>
              <td class="right">${dados.valor.toFixed(2)}</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <h2>Faturamento por Método de Pagamento</h2>
      <table>
        <thead>
          <tr>
            <th>Método de Pagamento</th>
            <th>Faturamento (R$)</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(vendasPorPagamento).map(([metodo, valor]) => `
            <tr>
              <td>${metodo}</td>
              <td class="right">${valor.toFixed(2)}</td>
            </tr>`).join('')}
        </tbody>
      </table>

      <h2>Extrato de Pedidos</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Total</th>
            <th>Pagamento</th>
            <th>Cliente</th>
            <th>Equipe</th>
            <th>Itens</th>
          </tr>
        </thead>
        <tbody>
          ${pedidos.map(p => `
            <tr>
              <td>${p.id}</td>
              <td>${new Date(p.date).toLocaleString('pt-BR')}</td>
              <td class="right">R$ ${p.total.toFixed(2)}</td>
              <td>${p.metodoPagamento}</td>
              <td>${p.metodoPagamento === 'PENDENTE' ? p.nome : '-'}</td>
              <td>${p.metodoPagamento === 'PENDENTE' ? p.equipe : '-'}</td>
              <td>${p.itens.map(i => `${i.nome} (${i.quantidade})`).join(', ')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
  </html>
  `;
}

export async function gerarRelatorioPDF(req, res) {
  const pedidos = listarPedidos();
  const html = gerarHTMLRelatorio(pedidos);

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const buffer = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_pedidos.pdf');
  res.send(buffer);
}
