import { AppDataSource } from '../AppDataSource';
import { Material } from '../../database/Entidades/material.entity';
import * as fs from 'fs';
import * as path from 'path';

async function cargarMaterial() {
  try {
    // Inicializar conexión a la base de datos
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    // Leer el archivo
    const rutaArchivo = path.join(__dirname, '..', 'data', 'materiales.txt');
    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

    const lineas = contenido.trim().split('\n');
    const materialRepository = AppDataSource.getRepository(Material);

    console.log(`Procesando ${lineas.length} materiales...`);

for (const linea of lineas) {
  const [nombre, cantidadStr, tiempoStr] = linea.split(';');

  const nombreLimpio = nombre.trim();
  const cantidad = parseInt(cantidadStr.trim());
  const tiempo = tiempoStr ? parseInt(tiempoStr.trim()) : null;

  // Buscar material por nombre
  const materialExistente = await materialRepository.findOne({
    where: { nombre: nombreLimpio },
  });

  if (materialExistente) {
    console.log(`Material "${nombreLimpio}" ya existe. Actualizando...`);

    materialExistente.tiempoPrestamo = tiempo ?? materialExistente.tiempoPrestamo; // actualiza si viene
    materialExistente.cantidad = cantidad; // opcional: actualizar cantidad
    materialExistente.cantidadDisponible = cantidad; // actualizar cantidad disponible

    await materialRepository.save(materialExistente);
    console.log(`✓ Material "${nombreLimpio}" actualizado con tiempo`);
    continue;
  }

  // Crear nuevo material
  const nuevoMaterial = new Material();
  nuevoMaterial.nombre = nombreLimpio;
  nuevoMaterial.cantidad = cantidad;
  nuevoMaterial.tiempoPrestamo = tiempo;
  nuevoMaterial.cantidadDisponible = cantidad; // establecer cantidad disponible igual a la cantidad total

  await materialRepository.save(nuevoMaterial);
  console.log(`✓ Material "${nombreLimpio}" creado exitosamente`);
}

    console.log('¡Todos los materiales han sido cargados exitosamente!');

    const total = await materialRepository.count();
    console.log(`Total de materiales en la base de datos: ${total}`);
  } catch (error) {
    console.error('Error al cargar los materiales:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar el script
cargarMaterial();
