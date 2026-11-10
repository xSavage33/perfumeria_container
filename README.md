# elContainer Perfumeria

E-commerce de perfumeria construido con arquitectura de microservicios.

## Stack Tecnologico

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **Deployment**: Docker + Dokploy

## Arquitectura

```
                    ┌─────────────────┐
                    │    Frontend     │
                    │   (Next.js)     │
                    │   Port: 3004    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │   Port: 3000    │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
┌────────▼────────┐ ┌────────▼────────┐ ┌────────▼────────┐
│    Products     │ │      Cart       │ │     Orders      │
│    Service      │ │    Service      │ │    Service      │
│   Port: 3001    │ │   Port: 3002    │ │   Port: 3003    │
└────────┬────────┘ └────────┬────────┘ └────────┬────────┘
         │                   │                   │
         └───────────────────┼───────────────────┘
                             │
                    ┌────────▼────────┐
                    │   PostgreSQL    │
                    │   Port: 5432    │
                    └─────────────────┘
```

## Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Principal | `#CFE8E1` | Fondos, cards |
| Secundario | `#002941` | Textos, headers |
| Acento | `#FD6E6E` | CTAs, badges |

## Inicio Rapido

### Requisitos

- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)

### Con Docker (Recomendado)

```bash
# Clonar el repositorio
git clone <repo-url>
cd elContainerPerfumeria

# Copiar variables de entorno
cp .env.example .env

# Iniciar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

La aplicacion estara disponible en:
- Frontend: http://localhost:3004
- API Gateway: http://localhost:3000
- Products API: http://localhost:3001
- Cart API: http://localhost:3002
- Orders API: http://localhost:3003

### Desarrollo Local

```bash
# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Instalar dependencias de cada servicio
cd services/products && npm install
cd ../cart && npm install
cd ../orders && npm install
cd ../gateway && npm install
cd ../../frontend && npm install

# Ejecutar migraciones
cd services/products && npx prisma migrate dev
cd ../cart && npx prisma migrate dev
cd ../orders && npx prisma migrate dev

# Seed de datos (opcional)
cd services/products && npm run prisma:seed

# Iniciar cada servicio en terminales separadas
cd services/gateway && npm run dev
cd services/products && npm run dev
cd services/cart && npm run dev
cd services/orders && npm run dev
cd frontend && npm run dev
```

## API Endpoints

### Products Service (3001)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /api/products | Listar productos |
| GET | /api/products/:id | Detalle producto |
| POST | /api/products | Crear producto |
| PUT | /api/products/:id | Actualizar producto |
| DELETE | /api/products/:id | Eliminar producto |
| GET | /api/categories | Listar categorias |
| GET | /api/brands | Listar marcas |

### Cart Service (3002)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| GET | /api/cart/:sessionId | Obtener carrito |
| POST | /api/cart/:sessionId/items | Agregar item |
| PUT | /api/cart/:sessionId/items/:productId | Actualizar cantidad |
| DELETE | /api/cart/:sessionId/items/:productId | Eliminar item |
| DELETE | /api/cart/:sessionId | Vaciar carrito |

### Orders Service (3003)

| Metodo | Endpoint | Descripcion |
|--------|----------|-------------|
| POST | /api/orders | Crear orden |
| GET | /api/orders/:orderNumber | Detalle orden |
| PUT | /api/orders/:id/status | Actualizar estado |
| GET | /api/orders | Listar ordenes |

## Despliegue en Dokploy

### 1. Preparar el repositorio

Asegurate de que tu codigo este en un repositorio Git (GitHub, GitLab, etc.)

### 2. Configurar en Dokploy

1. Accede a tu panel de Dokploy
2. Crea un nuevo proyecto
3. Conecta tu repositorio
4. Configura las variables de entorno:

```env
DB_USER=elcontainer
DB_PASSWORD=tu_password_seguro
DB_NAME=elcontainer
NEXT_PUBLIC_API_URL=https://tu-dominio.com/api
```

### 3. Docker Compose para Produccion

Dokploy detectara automaticamente el `docker-compose.yml` y desplegara todos los servicios.

### 4. Configurar Dominio

En Dokploy, configura tu dominio personalizado y SSL automatico.

## Estructura del Proyecto

```
elContainerPerfumeria/
├── docker-compose.yml
├── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── Dockerfile
├── services/
│   ├── gateway/
│   ├── products/
│   ├── cart/
│   └── orders/
└── database/
    └── init.sql
```

## Scripts Utiles

```bash
# Reiniciar todos los servicios
docker-compose restart

# Ver logs de un servicio especifico
docker-compose logs -f products

# Acceder a la base de datos
docker-compose exec postgres psql -U elcontainer

# Reconstruir imagenes
docker-compose build --no-cache

# Limpiar todo
docker-compose down -v
```

## Licencia

MIT
