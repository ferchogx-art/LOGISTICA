const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

const {
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
} = require('../src/api/db.js');

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 1000,
    minWidth: 1100,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:5173');
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('db:getClients', async () => getClients());
ipcMain.handle('db:createClient', async (_event, client) => createClient(client));
ipcMain.handle('db:getClientById', async (_event, id) => getClientById(id));
ipcMain.handle('db:getProducts', async () => getProducts());
ipcMain.handle('db:createProduct', async (_event, product) => createProduct(product));
ipcMain.handle('db:getProductBySku', async (_event, sku) => getProductBySku(sku));
ipcMain.handle('db:createAddress', async (_event, address) => createAddress(address));
ipcMain.handle('db:getAddressesByClient', async (_event, clientId) => getAddressesByClient(clientId));
ipcMain.handle('db:createOrder', async (_event, order) => createOrder(order));
ipcMain.handle('db:getOrders', async () => getOrders());
ipcMain.handle('db:getOrderById', async (_event, id) => getOrderById(id));
ipcMain.handle('db:updateOrderStatus', async (_event, payload) => updateOrderStatus(payload));
ipcMain.handle('db:getOrderDetails', async (_event, id) => getOrderDetails(id));
