INSERT INTO clientes (codigo_cliente, nombre, telefono, correo, observaciones) VALUES
('CLI-001', 'Juan Pérez', '5551234567', 'juan@mail.com', 'Cliente habitual'),
('CLI-002', 'María López', '5559876543', 'maria@mail.com', 'Se entrega en la oficina');

INSERT INTO domicilios (cliente_id, alias, calle, numero, colonia, municipio, estado, codigo_postal, referencias) VALUES
(1, 'Casa', 'Av. Reforma', '120', 'Centro', 'Monterrey', 'Nuevo León', '64000', 'Frente a la iglesia'),
(1, 'Oficina', 'Calle Juárez', '40', 'Contry', 'Monterrey', 'Nuevo León', '64010', 'Al lado del banco'),
(2, 'Casa', 'Calle Hidalgo', '220', 'San Jerónimo', 'Guadalajara', 'Jalisco', '44100', 'Entre farmacia y panadería');

INSERT INTO productos (sku, descripcion, precio, unidad, stock) VALUES
('SKU-001', 'Papel para impresión', 180.5, 'pza', 50),
('SKU-002', 'Tinta para caja', 240.0, 'pza', 30),
('SKU-003', 'Caja de tornillos', 120.0, 'caja', 20),
('SKU-004', 'Cinta adhesiva', 75.0, 'rollo', 40);
