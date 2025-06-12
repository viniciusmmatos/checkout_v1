// backend/controllers/relatorioController.js

import PDFDocument from 'pdfkit';
import { listarPedidos } from '../models/pedidosModel.js';

export function gerarRelatorioPDF(req, res) {
  const pedidos = listarPedidos();

  // Cálculo de totais
  let totalVendido = 0;
  let totalItens = 0;
  const vendasPorProduto = {};

  pedidos.forEach(p => {
    totalVendido += p.total;
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
    .sort((a, b) => b[1].quantidade - a[1].quantity)
    .slice(0, 5); // top 5 produtos

  const doc = new PDFDocument({ size: 'A4', margin: 40 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=relatorio_pedidos.pdf');
  doc.pipe(res);

  // Título
  doc.fontSize(18).text('Relatório de Pedidos', { align: 'center' });
  doc.moveDown();

  // RESUMO GERAL
  doc.fontSize(14).text('Resumo Geral:', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  doc.text(`Total vendido: R$ ${totalVendido.toFixed(2)}`);
  doc.text(`Total de pedidos: ${pedidos.length}`);
  doc.text(`Total de itens vendidos: ${totalItens}`);
  doc.moveDown(1);

  // VENDAS POR PRODUTO
  doc.fontSize(14).text('Vendas por Produto:', { underline: true });
  doc.moveDown(0.5);
  Object.entries(vendasPorProduto).forEach(([nome, dados]) => {
    doc.text(`${nome}: ${dados.quantidade} unidades - R$ ${dados.valor.toFixed(2)}`);
  });
  doc.moveDown(1);

  // TOP 5 PRODUTOS
  doc.fontSize(14).text('Top 5 Produtos Mais Vendidos:', { underline: true });
  doc.moveDown(0.5);
  produtosOrdenados.forEach(([nome, dados], index) => {
    doc.text(`${index + 1}. ${nome} - ${dados.quantidade} unidades`);
  });
  doc.moveDown(1);

  // EXTRATO DE PEDIDOS
  doc.fontSize(14).text('Extrato de Pedidos:', { underline: true });
  doc.moveDown(0.5);

  const tableHeaders = ['ID', 'Data', 'Total', 'Pagamento', 'Cliente', 'Equipe', 'Itens'];
  const colWidths = [30, 100, 60, 90, 80, 80, 200];
  const startX = doc.x;
  let y = doc.y;

  doc.font('Helvetica-Bold').fontSize(10);
  tableHeaders.forEach((header, i) => {
    doc.rect(startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0), y, colWidths[i], 18).fillAndStroke('#eee', '#000');
    doc.fillColor('#000').text(header, startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 2, y + 4, {
      width: colWidths[i] - 4,
      align: 'left',
      lineBreak: false
    });
  });
  doc.moveDown();
  y += 18;

  doc.font('Helvetica').fontSize(9);

  pedidos.forEach(p => {
    const data = new Date(p.date).toLocaleString('pt-BR');
    const itensFormatados = p.itens.map(i => `${i.nome} (${i.quantidade})`).join(', ');
    const cliente = p.metodoPagamento === 'PENDENTE' ? p.nome : '-';
    const equipe = p.metodoPagamento === 'PENDENTE' ? p.equipe : '-';

    const row = [
      p.id.toString(),
      data,
      `R$ ${p.total.toFixed(2)}`,
      p.metodoPagamento,
      cliente,
      equipe,
      itensFormatados
    ];

    row.forEach((text, i) => {
      const x = startX + colWidths.slice(0, i).reduce((a, b) => a + b, 0);
      doc.rect(x, y, colWidths[i], 16).stroke();
      doc.text(text, x + 2, y + 4, {
        width: colWidths[i] - 4,
        align: i === 2 ? 'right' : 'left', // total column aligned right
        lineBreak: false,
        ellipsis: true
      });
    });

    y += 16;
    if (y > doc.page.height - 50) {
      doc.addPage();
      y = 40;
    }
  });

  doc.end();
}
