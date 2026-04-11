# Sistema de Gestión de Reservas - Backend

Sistema backend construido con NestJS para la gestión integral de reservas de espacios y materiales en instituciones educativas.

## Descripción

Este sistema permite gestionar:

- **Espacios físicos**: Aulas, laboratorios, auditorios
- **Materiales**: Equipos y recursos prestables
- **Reservas**: Programación y control de reservas de espacios
- **Reservas de Material**: Gestión de préstamos con control de fechas límite y devoluciones
- **Usuarios**: Registro y autenticación
- **Calendario**: Visualización de disponibilidad

## Tecnologías

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL** - Base de datos
- **dayjs** - Manejo de fechas

## Estructura del Proyecto

```
src/
├── database/
│   ├── Entidades/         # Entidades de TypeORM
│   ├── data/              # Archivos de datos para seed
│   ├── scripts/           # Scripts de carga de datos
│   └── seed/              # Módulo de seed para producción
├── Modelos/
│   ├── calendario/        # Gestión de calendarios
│   ├── espacio/           # Gestión de espacios
│   ├── material/          # Gestión de materiales
│   ├── reserva/           # Gestión de reservas
│   ├── reservaMaterial/   # Gestión de préstamos de material
│   └── usuario/           # Gestión de usuarios
└── main.ts               # Punto de entrada
```

## Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- PostgreSQL (v12 o superior)
- npm

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd Sistema-de-gestion-de-reserva-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.dev.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USUARIO=postgres
DB_PASSWORD=tu_password
DB_DATABASE=reservas

# Servidor
PORT=3000
NODE_ENV=development
```

4. **Crear la base de datos**

Conectarse a PostgreSQL y crear la base de datos

## Ejecución

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3000`

## Poblar Base de Datos

Una vez ejecutada la aplicación, visita el endpoint:

```
GET http://localhost:3000/seed
```

Esto cargará automáticamente todos los espacios y materiales desde los archivos de configuración.

## API Endpoints

### Espacios

- `GET /espacio` - Listar todos los espacios
- `GET /espacio/:id` - Obtener un espacio
- `POST /espacio` - Crear espacio
- `PUT /espacio/:id` - Actualizar espacio
- `DELETE /espacio/:id` - Eliminar espacio

### Materiales

- `GET /material` - Listar materiales
- `GET /material/:id` - Obtener un material
- `POST /material` - Crear material
- `PUT /material/:id` - Actualizar material
- `DELETE /material/:id` - Eliminar material

### Reservas

- `GET /reserva` - Listar reservas
- `GET /reserva/:id` - Obtener una reserva
- `POST /reserva` - Crear reserva
- `PUT /reserva/:id` - Actualizar reserva
- `DELETE /reserva/:id` - Eliminar reserva

### Reservas de Material

- `GET /reserva-material` - Listar préstamos
- `GET /reserva-material/:id` - Obtener un préstamo
- `GET /reserva-material/email/:email` - Préstamos por usuario
- `POST /reserva-material` - Crear préstamo
- `PATCH /reserva-material/:id/estado` - Actualizar estado (Entregado/Devuelto)
- `PATCH /reserva-material/:id/calificacion` - Calificar préstamo

### Usuarios

- `GET /usuario` - Listar usuarios
- `GET /usuario/:email` - Obtener usuario
- `POST /usuario` - Crear usuario
- `PUT /usuario/:email` - Actualizar usuario
- `DELETE /usuario/:email` - Eliminar usuario

### Calendario

- `GET /calendario` - Listar eventos
- `POST /calendario` - Crear evento

### Seed

- `GET /seed` - Poblar base de datos

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Notas Importantes

- El sistema usa **SSL automáticamente en producción** para conexiones seguras a la base de datos
- Las reservas de material tienen control de **fechas límite** basadas en el `tiempoPrestamo` del material
- El estado de las reservas de material sigue el flujo: `Pendiente` → `Entregado` → `Devuelto`
- Los archivos de datos para seed están en `src/database/data/`
