CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo_cliente TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT,
  correo TEXT,
  observaciones TEXT,
  activo INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS domicilios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  alias TEXT NOT NULL,
  calle TEXT NOT NULL,
  numero TEXT,
  colonia TEXT,
  municipio TEXT,
  estado TEXT,
  codigo_postal TEXT,
  referencias TEXT,
  activo INTEGER DEFAULT 1,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sku TEXT UNIQUE NOT NULL,
  descripcion TEXT NOT NULL,
  precio REAL NOT NULL DEFAULT 0,
  unidad TEXT DEFAULT 'pza',
  stock INTEGER DEFAULT 0,
  activo INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  domicilio_id INTEGER NOT NULL,
  fecha_creacion TEXT NOT NULL,
  fecha_entrega TEXT NOT NULL,
  estatus_entrega TEXT NOT NULL DEFAULT 'pendiente_entrega',
  estatus_pago TEXT NOT NULL DEFAULT 'pendiente_pago',
  total REAL NOT NULL DEFAULT 0,
  observaciones TEXT,
  activo INTEGER DEFAULT 1,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (domicilio_id) REFERENCES domicilios(id)
);

CREATE TABLE IF NOT EXISTS detalle_pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  producto_id INTEGER NOT NULL,
  cantidad INTEGER NOT NULL,
  precio_unitario REAL NOT NULL,
  subtotal REAL NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE INDEX IF NOT EXISTS idx_clientes_nombre ON clientes(nombre);
CREATE INDEX IF NOT EXISTS idx_productos_sku ON productos(sku);
CREATE INDEX IF NOT EXISTS idx_pedidos_fecha ON pedidos(fecha_entrega);
CREATE INDEX IF NOT EXISTS idx_pedidos_estatus ON pedidos(estatus_entrega, estatus_pago);
