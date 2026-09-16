# Sistema Web de Gestión Comercial — Comuna 10, Neiva

Producto mínimo funcional (PMF) para la gestión de inventarios, ventas y cuentas
básicas de pequeños comercios de la Comuna 10 del municipio de Neiva, desarrollado
como Proyecto Integrador II (Universidad Surcolombiana).

Arquitectura de tres capas definida en el documento del proyecto:

- **Frontend**: React (JavaScript), diseño responsive, basado en los mockups del equipo.
- **Backend / API**: Node.js + Express, autenticación con JWT + bcrypt.
- **Base de datos**: PostgreSQL, con Sequelize como ORM.

## Estructura del repositorio

```
backend/     API REST (Express + Sequelize + PostgreSQL)
frontend/    Aplicación web (React + Vite)
```

## Requisitos previos

- Node.js 18 o superior
- PostgreSQL 14 o superior (local o administrado)

## Puesta en marcha — Backend

```bash
cd backend
npm install
cp .env.example .env   # y completar credenciales de PostgreSQL y JWT_SECRET
npm run seed            # crea los roles base (Propietario, Empleado)
npm run dev              # http://localhost:4000
```

El servidor sincroniza automáticamente los modelos con la base de datos configurada
en `.env` (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`).

## Puesta en marcha — Frontend

```bash
cd frontend
npm install
cp .env.example .env    # VITE_API_URL apuntando al backend
npm run dev               # http://localhost:5173
```

## Módulos implementados (alcance definido en el capítulo 4 del documento)

| Módulo | Requisitos cubiertos |
| --- | --- |
| Autenticación y roles | RNF-04 |
| Gestión de productos | RF-01, RF-05 |
| Inventario (entradas/salidas) | RF-02, RF-03, RF-04 |
| Alertas de stock crítico | RF-07 |
| Ventas | RF-06 |
| Cuentas básicas (ingresos/egresos) | RF-08, RF-09 |
| Reportes (más/menos vendidos, financiero, stock bajo) | Alcance funcional (cap. 4.7) |

Fuera de alcance (según numeral 1.9 del documento): facturación electrónica,
integración con la DIAN, nómina, comercio electrónico, múltiples sucursales,
pasarelas de pago, módulos contables avanzados e inteligencia artificial.

## Modelo de datos

Entidades según la Tabla 12 del documento: `Rol`, `Usuario`, `Categoria`,
`Producto`, `MovimientoInventario`, `MovimientoCuenta`, `Venta`, `Alerta`.
