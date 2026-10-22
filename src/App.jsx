import { useEffect, useMemo, useState } from 'react';

export default function App() {
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchSku, setSearchSku] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [lineas, setLineas] = useState([]);
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [statusPago, setStatusPago] = useState('pendiente_pago');
  const [statusEntrega, setStatusEntrega] = useState('pendiente_entrega');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const allClients = await window.api.getClients();
    const allProducts = await window.api.getProducts();
    const allOrders = await window.api.getOrders();

    setClients(allClients);
    setProducts(allProducts);
    setOrders(allOrders);
  }

  const filteredClients = useMemo(() => {
    const text = searchClient.toLowerCase();
    if (!text) return clients;

    return clients.filter((client) => {
      return (
        client.nombre.toLowerCase().includes(text) ||
        client.codigo_cliente.toLowerCase().includes(text)
      );
    });
  }, [clients, searchClient]);

  const filteredProducts = useMemo(() => {
    const text = searchSku.toLowerCase();
    if (!text) return products;

    return products.filter((product) => {
      return (
        product.sku.toLowerCase().includes(text) ||
        product.descripcion.toLowerCase().includes(text)
      );
    });
  }, [products, searchSku]);

  function addProductToOrder() {
    if (!selectedProduct) return;

    setLineas((prev) => [
      ...prev,
      {
        producto_id: selectedProduct.id,
        sku: selectedProduct.sku,
        descripcion: selectedProduct.descripcion,
        cantidad,
        precio_unitario: selectedProduct.precio,
        subtotal: selectedProduct.precio * cantidad
      }
    ]);

    setSelectedProduct(null);
    setSearchSku('');
    setCantidad(1);
  }

  async function saveOrder() {
    if (!selectedClientId) return;

    const total = lineas.reduce((sum, item) => sum + item.subtotal, 0);

    const order = {
      cliente_id: selectedClientId,
      domicilio_id: 1,
      fecha_entrega: fechaEntrega,
      estatus_entrega: statusEntrega,
      estatus_pago: statusPago,
      total,
      observaciones: '',
      detalle: lineas.map((item) => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        subtotal: item.subtotal
      }))
    };

    await window.api.createOrder(order);
    await loadData();

    setLineas([]);
    setSelectedProduct(null);
    setFechaEntrega('');
    setStatusPago('pendiente_pago');
    setStatusEntrega('pendiente_entrega');
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>LOGISTICA</h1>
        <button className="active">Dashboard</button>
        <button>Clientes</button>
        <button>Productos</button>
        <button>Pedidos</button>
        <button>Impresión</button>
      </aside>

      <main className="content">
        <header className="topbar">
          <h2>Gestión logística</h2>
        </header>

        <section className="card">
          <h3>1. Buscar cliente</h3>
          <input
            type="text"
            placeholder="Nombre o ID"
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
          />

          <div className="client-list">
            {filteredClients.map((client) => (
              <button
                key={client.id}
                className={selectedClientId === client.id ? 'selected' : ''}
                onClick={() => setSelectedClientId(client.id)}
              >
                {client.nombre} - {client.codigo_cliente}
              </button>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>2. Fecha de entrega</h3>
          <input
            type="date"
            value={fechaEntrega}
            onChange={(e) => setFechaEntrega(e.target.value)}
          />
        </section>

        <section className="card">
          <h3>3. Agregar productos</h3>
          <input
            type="text"
            placeholder="Buscar SKU o descripción"
            value={searchSku}
            onChange={(e) => setSearchSku(e.target.value)}
          />

          <div className="product-list">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                className="product-item"
                onClick={() => setSelectedProduct(product)}
              >
                <strong>{product.sku}</strong> - {product.descripcion} - ${product.precio}
              </button>
            ))}
          </div>

          {selectedProduct && (
            <div className="product-form">
              <div>
                <strong>{selectedProduct.descripcion}</strong>
                <span>SKU: {selectedProduct.sku}</span>
              </div>
              <input
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
              />
              <button onClick={addProductToOrder}>Agregar producto</button>
            </div>
          )}
        </section>

        <section className="card">
          <h3>4. Resumen del pedido</h3>
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {lineas.map((linea, index) => (
                <tr key={index}>
                  <td>{linea.sku}</td>
                  <td>{linea.descripcion}</td>
                  <td>{linea.cantidad}</td>
                  <td>{linea.precio_unitario}</td>
                  <td>{linea.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="status-row">
            <select value={statusPago} onChange={(e) => setStatusPago(e.target.value)}>
              <option value="pendiente_pago">Pendiente de pago</option>
              <option value="pago_contra_entrega">Pago contra entrega</option>
              <option value="pagado">Pagado</option>
            </select>

            <select value={statusEntrega} onChange={(e) => setStatusEntrega(e.target.value)}>
              <option value="pendiente_entrega">Pendiente de entrega</option>
              <option value="entregada">Entregada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          <button className="save-btn" onClick={saveOrder}>Guardar pedido</button>
        </section>

        <section className="card">
          <h3>5. Pedidos</h3>
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <strong>{order.cliente_nombre}</strong>
                <span>{order.fecha_entrega}</span>
                <span>{order.estatus_pago}</span>
                <span>{order.estatus_entrega}</span>
                <span>Total: ${order.total}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
