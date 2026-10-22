const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dbDir = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDir, 'fester_logistica.sqlite');
const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

function initDatabase() {
  const schema = fs.readFileSync(schemaPath, 'utf8');
  db.exec(schema);

  const count = db.prepare('SELECT COUNT(*) AS total FROM clientes').get();
  if (Number(count.total) === 0) {
    const seedPath = path.join(process.cwd(), 'database', 'seed.sql');
    const seed = fs.readFileSync(seedPath, 'utf8');
    db.exec(seed);
  }
}

function getClients() {
  return db.prepare('SELECT * FROM clientes WHERE activo = 1 ORDER BY nombre ASC').all();
}

function createClient(client) {
  const query = db.prepare(`
    INSERT INTO clientes (codigo_cliente, nombre, telefono, correo, observaciones, activo)
    VALUES (@codigo_cliente, @nombre, @telefono, @correo, @observaciones, 1)
  `);

  const result = query.run({
    codigo_cliente: client.codigo_cliente,
    nombre: client.nombre,
    telefono: client.telefono || '',
    correo: client.correo || '',
    observaciones: client.observaciones || ''
  });

  return result.lastInsertRowid;
}

function getClientById(id) {
  return db.prepare('SELECT * FROM clientes WHERE id = ?').get(id);
}

function getProducts() {
  return db.prepare('SELECT * FROM productos WHERE activo = 1 ORDER BY descripcion ASC').all();
}

function createProduct(product) {
  const query = db.prepare(`
    INSERT INTO productos (sku, descripcion, precio, unidad, stock, activo)
    VALUES (@sku, @descripcion, @precio, @unidad, @stock, 1)
  `);

  const result = query.run({
    sku: product.sku,
    descripcion: product.descripcion,
    precio: Number(product.precio),
    unidad: product.unidad || 'pza',
    stock: Number(product.stock || 0)
  });

  return result.lastInsertRowid;
}

function getProductBySku(sku) {
  return db.prepare('SELECT * FROM productos WHERE sku = ? AND activo = 1').get(sku);
}

function createAddress(address) {
  const query = db.prepare(`
    INSERT INTO domicilios (cliente_id, alias, calle, numero, colonia, municipio, estado, codigo_postal, referencias, activo)
    VALUES (@cliente_id, @alias, @calle, @numero, @colonia, @municipio, @estado, @codigo_postal, @referencias, 1)
  `);

  return query.run({
    cliente_id: address.cliente_id,
    alias: address.alias,
    calle: address.calle,
    numero: address.numero || '',
    colonia: address.colonia || '',
    municipio: address.municipio || '',
    estado: address.estado || '',
    codigo_postal: address.codigo_postal || '',
    referencias: address.referencias || ''
  });
}

function getAddressesByClient(clienteId) {
  return db.prepare('SELECT * FROM domicilios WHERE cliente_id = ? AND activo = 1 ORDER BY alias ASC').all(clienteId);
}

function createOrder(order) {
  const fechaActual = new Date().toISOString();

  const orderInsert = db.prepare(`
    INSERT INTO pedidos (
      cliente_id,
      domicilio_id,
      fecha_creacion,
      fecha_entrega,
      estatus_entrega,
      estatus_pago,
      total,
      observaciones,
      activo
    ) VALUES (
      @cliente_id,
      @domicilio_id,
      @fecha_creacion,
      @fecha_entrega,
      @estatus_entrega,
      @estatus_pago,
      @total,
      @observaciones,
      1
    )
  `);

  const result = orderInsert.run({
    cliente_id: order.cliente_id,
    domicilio_id: order.domicilio_id,
    fecha_creacion: fechaActual,
    fecha_entrega: order.fecha_entrega,
    estatus_entrega: order.estatus_entrega,
    estatus_pago: order.estatus_pago,
    total: Number(order.total || 0),
    observaciones: order.observaciones || ''
  });

  const pedidoId = Number(result.lastInsertRowid);

  const detailInsert = db.prepare(`
    INSERT INTO detalle_pedidos (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
    VALUES (@pedido_id, @producto_id, @cantidad, @precio_unitario, @subtotal)
  `);

  for (const item of order.detalle || []) {
    detailInsert.run({
      pedido_id: pedidoId,
      producto_id: item.producto_id,
      cantidad: Number(item.cantidad),
      precio_unitario: Number(item.precio_unitario),
      subtotal: Number(item.subtotal)
    });
  }

  return pedidoId;
}

function getOrders() {
  return db.prepare(`
    SELECT p.*, c.nombre AS cliente_nombre
    FROM pedidos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    WHERE p.activo = 1
    ORDER BY p.fecha_entrega DESC
  `).all();
}

function getOrderById(id) {
  return db.prepare(`
    SELECT p.*, c.nombre AS cliente_nombre
    FROM pedidos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    WHERE p.id = ?
  `).get(id);
}

function getOrderDetails(id) {
  return db.prepare(`
    SELECT dp.*, pr.descripcion, pr.sku, pr.precio
    FROM detalle_pedidos dp
    LEFT JOIN productos pr ON pr.id = dp.producto_id
    WHERE dp.pedido_id = ?
  `).all(id);
}

function updateOrderStatus(payload) {
  const { id, estatus_pago, estatus_entrega } = payload;
  db.prepare(`
    UPDATE pedidos
    SET estatus_pago = @estatus_pago,
        estatus_entrega = @estatus_entrega
    WHERE id = @id
  `).run({ id, estatus_pago, estatus_entrega });

  return true;
}

module.exports = {
  initDatabase,
  getClients,
  createClient,
  getClientById,
  getProducts,
  createProduct,
  getProductBySku,
  createAddress,
  getAddressesByClient,
  createOrder,
  getOrders,
  updateOrderStatus,
  getOrderById,
  getOrderDetails
};
