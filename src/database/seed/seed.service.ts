import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Espacio, TipoEspacio } from '../Entidades/espacio.entity';
import { Material } from '../Entidades/material.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  async runSeed() {
    await this.cargarEspacios();
    await this.cargarMateriales();
    return { message: 'Seed ejecutado correctamente' };
  }

  private async cargarEspacios() {
    try {
      const rutaArchivo = path.join(__dirname, '..', 'data', 'espacios.txt');

      if (!fs.existsSync(rutaArchivo)) {
        this.logger.warn(`Archivo no encontrado: ${rutaArchivo}`);
        return;
      }

      const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
      const lineas = contenido.trim().split('\n');

      this.logger.log(`Procesando ${lineas.length} espacios...`);

      for (const linea of lineas) {
        const partes = linea.split(';');
        if (partes.length < 4) continue;

        const [nombre, tipo, capacidad, descripcion] = partes;

        const espacioExistente = await this.espacioRepository.findOne({
          where: { nombre: nombre.trim() },
        });

        if (espacioExistente) {
          continue;
        }

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
            break;
          default:
            tipoEspacio = TipoEspacio.AULA;
        }

        const nuevoEspacio = this.espacioRepository.create({
          nombre: nombre.trim(),
          tipo: tipoEspacio,
          capacidad: parseInt(capacidad.trim()),
          descripcion: descripcion.trim(),
        });

        await this.espacioRepository.save(nuevoEspacio);
      }
      this.logger.log('Espacios cargados correctamente');
    } catch (error) {
      this.logger.error('Error cargando espacios', error);
    }
  }

  private async cargarMateriales() {
    try {
      const rutaArchivo = path.join(__dirname, '..', 'data', 'materiales.txt');

      if (!fs.existsSync(rutaArchivo)) {
        this.logger.warn(`Archivo no encontrado: ${rutaArchivo}`);
        return;
      }

      const contenido = fs.readFileSync(rutaArchivo, 'utf-8');
      const lineas = contenido.trim().split('\n');

      this.logger.log(`Procesando ${lineas.length} materiales...`);

      for (const linea of lineas) {
        const partes = linea.split(';');
        if (partes.length < 2) continue;

        const [nombre, cantidadStr, tiempoStr] = partes;
        const nombreLimpio = nombre.trim();
        const cantidad = parseInt(cantidadStr.trim());
        const tiempo = tiempoStr ? parseInt(tiempoStr.trim()) : null;

        const materialExistente = await this.materialRepository.findOne({
          where: { nombre: nombreLimpio },
        });

        if (materialExistente) {
          materialExistente.tiempoPrestamo =
            tiempo ?? materialExistente.tiempoPrestamo;
          materialExistente.cantidad = cantidad;
          materialExistente.cantidadDisponible = cantidad;
          await this.materialRepository.save(materialExistente);
          continue;
        }

        const nuevoMaterial = this.materialRepository.create({
          nombre: nombreLimpio,
          cantidad: cantidad,
          tiempoPrestamo: tiempo,
          cantidadDisponible: cantidad,
        });

        await this.materialRepository.save(nuevoMaterial);
      }
      this.logger.log('Materiales cargados correctamente');
    } catch (error) {
      this.logger.error('Error cargando materiales', error);
    }
  }
}
