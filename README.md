# LOGISTICA

Aplicación de escritorio local para gestión logística de clientes, productos, pedidos, entregas y pagos.

## Requisitos

- Node.js 20+
- npm 10+

## Instalación

```bash
npm install
```

## Ejecutar en modo desarrollo

```bash
npm run dev
```

Esto abrirá la aplicación Electron con React en modo local.

## Compilar para pruebas o empaquetado

```bash
npm run build
```

## Base de datos local

La base de datos se guarda en:

```txt
./data/fester_logistica.sqlite
```

## Funcionalidades base

- Registro de clientes
- Búsqueda por nombre o ID
- Registro de domicilios por cliente
- Registro de productos con SKU
- Búsqueda de producto por SKU o descripción
- Creación de pedidos con varios productos
- Cambio de estatus de pago y entrega
- Consulta por fecha y filtros
- Impresión térmica 57 mm (estructura base lista para conectar a la impresora)

## Estructura

- `electron/` = proceso principal de Electron
- `src/` = interfaz React
- `database/` = esquema SQL
- `data/` = base de datos local

## Siguiente paso

Adicionalmente, este proyecto puede prepararse para generar un ejecutable `.exe` con GitHub Actions o Electron Builder.
