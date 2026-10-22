const fs = require('node:fs');
const path = require('node:path');

const printDirectory = path.join(process.cwd(), 'assets');
const logoPath = path.join(printDirectory, 'logo-fester.txt');

if (!fs.existsSync(printDirectory)) {
  fs.mkdirSync(printDirectory, { recursive: true });
}

if (!fs.existsSync(logoPath)) {
  fs.writeFileSync(
    logoPath,
    'FESTER PAREDES\n----------------\nLOGO PREVIEW\n'
  );
}

module.exports = {
  generateTicket: (pedido) => {
    return {
      type: 'ticket',
      content: [
        'FESTER PAREDES',
        '----------------',
        `Pedido: ${pedido.id || 'N/A'}`,
        `Cliente: ${pedido.cliente || 'Sin cliente'}`,
        `Entrega: ${pedido.fecha_entrega || 'Sin fecha'}`,
        `Pago: ${pedido.estatus_pago || 'Pendiente'}`,
        `Entrega: ${pedido.estatus_entrega || 'Pendiente'}`,
        '----------------',
        ...(pedido.detalle || []).map((item) => `${item.descripcion} x ${item.cantidad}`),
        '----------------',
        `Total: $${pedido.total || 0}`
      ].join('\n')
    };
  }
};
