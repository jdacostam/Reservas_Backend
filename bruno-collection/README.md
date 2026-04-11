# Bruno Collection - Sistema de Gestión de Reservas

Esta colección de Bruno contiene todos los endpoints del API REST del Sistema de Gestión de Reservas.

## Configuración

La colección incluye un entorno `Local` con la siguiente variable:
- `baseUrl`: http://localhost:3000

## Endpoints disponibles

### Usuario (7 endpoints)
- `GET /usuario/prueba` - Prueba del servicio
- `POST /usuario/crearUsuario` - Crear nuevo usuario
- `GET /usuario/consultarUsuarios` - Listar todos los usuarios
- `GET /usuario/consultarEmail/:email` - Buscar usuario por email
- `PUT /usuario/actualizarUsuario/:email` - Actualizar usuario
- `DELETE /usuario/eliminarUsuario/:email` - Eliminar usuario
- `POST /usuario/login` - Iniciar sesión

### Espacios (5 endpoints)
- `POST /espacios` - Crear espacio
- `GET /espacios` - Listar todos los espacios
- `GET /espacios/:id` - Obtener espacio por ID
- `PATCH /espacios/:id` - Actualizar espacio
- `DELETE /espacios/:id` - Eliminar espacio

### Reservas (9 endpoints)
- `POST /reservas` - Crear reserva
- `GET /reservas` - Listar todas las reservas
- `GET /reservas/disponibilidad/:idEspacio?fecha=YYYY-MM-DD` - Obtener disponibilidad
- `GET /reservas/:id` - Obtener reserva por ID
- `PATCH /reservas/:id` - Actualizar reserva
- `DELETE /reservas/eliminar/:id` - Eliminar reserva
- `GET /reservas/byEmail/:email` - Obtener reservas por email
- `PATCH /reservas/calificar/:id` - Calificar reserva
- `PATCH /reservas/observaciones/:id` - Actualizar observaciones

### Materiales (5 endpoints)
- `POST /materiales` - Crear material
- `GET /materiales` - Listar todos los materiales
- `GET /materiales/:id` - Obtener material por ID
- `PATCH /materiales/:id` - Actualizar material
- `DELETE /materiales/:id` - Eliminar material

### Reservas de Material (9 endpoints)
- `POST /reservas-material` - Crear reserva de material
- `GET /reservas-material` - Listar todas las reservas de material
- `GET /reservas-material/:id` - Obtener reserva de material por ID
- `PATCH /reservas-material/:id` - Actualizar reserva de material
- `DELETE /reservas-material/:id` - Eliminar reserva de material
- `GET /reservas-material/byEmail/:email` - Obtener reservas por email
- `PATCH /reservas-material/estado/:id` - Actualizar estado
- `PATCH /reservas-material/calificar/:id` - Calificar reserva
- `PATCH /reservas-material/observaciones/:id` - Actualizar observaciones

### Calendario (5 endpoints)
- `POST /calendario` - Crear entrada de calendario
- `GET /calendario` - Listar todos los calendarios
- `GET /calendario/:id` - Obtener calendario por ID
- `PATCH /calendario/:id` - Actualizar calendario
- `DELETE /calendario/:id` - Eliminar calendario

## Total: 40 endpoints

## Uso

1. Importa la carpeta `bruno-collection` en Bruno
2. Selecciona el entorno `Local`
3. Asegúrate de que tu backend esté corriendo en http://localhost:3000
4. Ejecuta los requests según tus necesidades

## Notas

- Todos los ejemplos incluyen datos de prueba que puedes modificar
- Los IDs en los ejemplos son genéricos (1, 2, etc.), ajústalos según tu base de datos
- Los endpoints de autenticación no están implementados actualmente en la API
