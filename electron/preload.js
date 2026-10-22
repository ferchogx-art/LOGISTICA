const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getClients: () => ipcRenderer.invoke('db:getClients'),
  createClient: (client) => ipcRenderer.invoke('db:createClient', client),
  getClientById: (id) => ipcRenderer.invoke('db:getClientById', id),
  getProducts: () => ipcRenderer.invoke('db:getProducts'),
  createProduct: (product) => ipcRenderer.invoke('db:createProduct', product),
  getProductBySku: (sku) => ipcRenderer.invoke('db:getProductBySku', sku),
  createAddress: (address) => ipcRenderer.invoke('db:createAddress', address),
  getAddressesByClient: (clientId) => ipcRenderer.invoke('db:getAddressesByClient', clientId),
  createOrder: (order) => ipcRenderer.invoke('db:createOrder', order),
  getOrders: () => ipcRenderer.invoke('db:getOrders'),
  getOrderById: (id) => ipcRenderer.invoke('db:getOrderById', id),
  updateOrderStatus: (payload) => ipcRenderer.invoke('db:updateOrderStatus', payload),
  getOrderDetails: (id) => ipcRenderer.invoke('db:getOrderDetails', id)
});
