import { AppDataSource } from '../AppDataSource';
import { Espacio, TipoEspacio } from '../../database/Entidades/espacio.entity';
import * as fs from 'fs';
import * as path from 'path';


async function cargarEspaciosDesdeArchivo() {
  try {
    // Inicializar la conexión a la base de datos
    await AppDataSource.initialize();
    console.log('Conexión a la base de datos establecida');

    // Leer el archivo
    const rutaArchivo = path.join(__dirname, '..', 'data', 'espacios.txt');
    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
    
    // Procesar las líneas del archivo
    const lineas = contenido.trim().split('\n');
    const espaciosRepository = AppDataSource.getRepository(Espacio);
    
    console.log(`Procesando ${lineas.length} espacios...`);
    
    for (const linea of lineas) {
      const [nombre, tipo, capacidad, descripcion] = linea.split(';');
      
      // Verificar si el espacio ya existe
      const espacioExistente = await espaciosRepository.findOne({
        where: { nombre: nombre.trim() }
      });
      
      if (espacioExistente) {
        console.log(`Espacio ${nombre} ya existe, saltando...`);
        continue;
      }
      
      // Mapear el tipo de espacio
      let tipoEspacio: TipoEspacio;
      const tipoLimpio = tipo.trim();
      
      switch (tipoLimpio) {
        case 'Aula':
          tipoEspacio = TipoEspacio.AULA;
          break;
        case 'Laboratorio de Computación':
          tipoEspacio = TipoEspacio.LAB_COMP;
          break;
        case 'Laboratorio de Física':
          tipoEspacio = TipoEspacio.LAB_FISICA;
          break;
        case 'Auditorio':
          tipoEspacio = TipoEspacio.AUDITORIO;
        default:
          console.warn(`Tipo de espacio no reconocido: ${tipoLimpio}, usando Aula por defecto`);
          tipoEspacio = TipoEspacio.AUDITORIO;
      }
      
      // Crear el nuevo espacio
      const nuevoEspacio = new Espacio();
      nuevoEspacio.nombre = nombre.trim();
      nuevoEspacio.tipo = tipoEspacio;
      nuevoEspacio.capacidad = parseInt(capacidad.trim());
      nuevoEspacio.descripcion = descripcion.trim();
      
      // Guardar en la base de datos
      await espaciosRepository.save(nuevoEspacio);
      console.log(`✓ Espacio ${nombre} creado exitosamente`);
    }
    
    console.log('¡Todos los espacios han sido cargados exitosamente!');
    
    // Mostrar resumen
    const totalEspacios = await espaciosRepository.count();
    console.log(`Total de espacios en la base de datos: ${totalEspacios}`);
    
  } catch (error) {
    console.error('Error al cargar los espacios:', error);
  } finally {
    // Cerrar la conexión
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('Conexión a la base de datos cerrada');
    }
  }
}

// Ejecutar el script
cargarEspaciosDesdeArchivo();