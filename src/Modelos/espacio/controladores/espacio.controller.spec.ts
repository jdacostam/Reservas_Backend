import { Test, TestingModule } from '@nestjs/testing';
import { EspacioController } from './espacio.controller';
import { EspacioService } from '../servicios/espacio.services';
import { CreateEspacioDto } from '../dto/create.dto';
import { UpdateEspacioDto } from '../dto/update.dto';
import { TipoEspacio } from 'src/database/Entidades/espacio.entity';

describe('EspacioController', () => {
  let controller: EspacioController;
  let service: EspacioService;

  const mockEspacioService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockEspacio = {
    id: 1,
    nombre: 'Aula 101',
    tipo: TipoEspacio.AULA,
    capacidad: 30,
    descripcion: 'Aula con proyector y pizarra inteligente',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspacioController],
      providers: [
        {
          provide: EspacioService,
          useValue: mockEspacioService,
        },
      ],
    }).compile();

    controller = module.get<EspacioController>(EspacioController);
    service = module.get<EspacioService>(EspacioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un nuevo espacio tipo AULA exitosamente', async () => {
      const createDto: CreateEspacioDto = {
        nombre: 'Aula 101',
        tipo: TipoEspacio.AULA,
        capacidad: 30,
        descripcion: 'Aula con proyector y pizarra inteligente',
      };

      mockEspacioService.create.mockResolvedValue(mockEspacio);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockEspacio);
      expect(mockEspacioService.create).toHaveBeenCalledWith(createDto);
      expect(mockEspacioService.create).toHaveBeenCalledTimes(1);
    });

    it('debe crear un espacio tipo LABORATORIO DE COMPUTACIÓN', async () => {
      const createDto: CreateEspacioDto = {
        nombre: 'Lab Comp 201',
        tipo: TipoEspacio.LAB_COMP,
        capacidad: 25,
        descripcion: 'Laboratorio con 25 computadoras HP',
      };

      const nuevoEspacio = {
        id: 2,
        ...createDto,
      };

      mockEspacioService.create.mockResolvedValue(nuevoEspacio);

      const result = await controller.create(createDto);

      expect(result).toEqual(nuevoEspacio);
      expect(result.tipo).toBe(TipoEspacio.LAB_COMP);
      expect(mockEspacioService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear un espacio tipo LABORATORIO DE FÍSICA', async () => {
      const createDto: CreateEspacioDto = {
        nombre: 'Lab Física 301',
        tipo: TipoEspacio.LAB_FISICA,
        capacidad: 20,
        descripcion: 'Laboratorio de física con equipo especializado',
      };

      const nuevoEspacio = {
        id: 3,
        ...createDto,
      };

      mockEspacioService.create.mockResolvedValue(nuevoEspacio);

      const result = await controller.create(createDto);

      expect(result.tipo).toBe(TipoEspacio.LAB_FISICA);
      expect(mockEspacioService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear un espacio tipo AUDITORIO', async () => {
      const createDto: CreateEspacioDto = {
        nombre: 'Auditorio Principal',
        tipo: TipoEspacio.AUDITORIO,
        capacidad: 200,
        descripcion: 'Auditorio con sistema de sonido profesional',
      };

      const nuevoEspacio = {
        id: 4,
        ...createDto,
      };

      mockEspacioService.create.mockResolvedValue(nuevoEspacio);

      const result = await controller.create(createDto);

      expect(result.tipo).toBe(TipoEspacio.AUDITORIO);
      expect(result.capacidad).toBe(200);
      expect(mockEspacioService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear un espacio sin descripción (opcional)', async () => {
      const createDto: CreateEspacioDto = {
        nombre: 'Aula 102',
        tipo: TipoEspacio.AULA,
        capacidad: 25,
      };

      const nuevoEspacio = {
        id: 5,
        ...createDto,
        descripcion: null,
      };

      mockEspacioService.create.mockResolvedValue(nuevoEspacio);

      const result = await controller.create(createDto);

      expect(result.descripcion).toBeNull();
      expect(mockEspacioService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear espacios con diferentes capacidades', async () => {
      const espaciosPequeño: CreateEspacioDto = {
        nombre: 'Aula Pequeña',
        tipo: TipoEspacio.AULA,
        capacidad: 15,
      };

      const espacioGrande: CreateEspacioDto = {
        nombre: 'Auditorio Grande',
        tipo: TipoEspacio.AUDITORIO,
        capacidad: 500,
      };

      mockEspacioService.create.mockResolvedValueOnce({ id: 1, ...espaciosPequeño, descripcion: null });
      mockEspacioService.create.mockResolvedValueOnce({ id: 2, ...espacioGrande, descripcion: null });

      const resultPequeño = await controller.create(espaciosPequeño);
      const resultGrande = await controller.create(espacioGrande);

      expect(resultPequeño.capacidad).toBe(15);
      expect(resultGrande.capacidad).toBe(500);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los espacios', async () => {
      const espacios = [
        mockEspacio,
        {
          id: 2,
          nombre: 'Lab Comp 201',
          tipo: TipoEspacio.LAB_COMP,
          capacidad: 25,
          descripcion: 'Laboratorio de computación',
        },
        {
          id: 3,
          nombre: 'Auditorio Principal',
          tipo: TipoEspacio.AUDITORIO,
          capacidad: 200,
          descripcion: 'Auditorio principal',
        },
      ];

      mockEspacioService.findAll.mockResolvedValue(espacios);

      const result = await controller.findAll();

      expect(result).toEqual(espacios);
      expect(result).toHaveLength(3);
      expect(mockEspacioService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío cuando no hay espacios', async () => {
      mockEspacioService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockEspacioService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar espacios de diferentes tipos', async () => {
      const espacios = [
        { id: 1, nombre: 'Aula 101', tipo: TipoEspacio.AULA, capacidad: 30, descripcion: null },
        { id: 2, nombre: 'Lab Comp', tipo: TipoEspacio.LAB_COMP, capacidad: 25, descripcion: null },
        { id: 3, nombre: 'Lab Física', tipo: TipoEspacio.LAB_FISICA, capacidad: 20, descripcion: null },
        { id: 4, nombre: 'Auditorio', tipo: TipoEspacio.AUDITORIO, capacidad: 200, descripcion: null },
      ];

      mockEspacioService.findAll.mockResolvedValue(espacios);

      const result = await controller.findAll();

      expect(result).toHaveLength(4);
      expect(result.map(e => e.tipo)).toContain(TipoEspacio.AULA);
      expect(result.map(e => e.tipo)).toContain(TipoEspacio.LAB_COMP);
      expect(result.map(e => e.tipo)).toContain(TipoEspacio.LAB_FISICA);
      expect(result.map(e => e.tipo)).toContain(TipoEspacio.AUDITORIO);
    });

    it('debe retornar espacios con diferentes capacidades ordenadas', async () => {
      const espacios = [
        { id: 1, nombre: 'Aula Pequeña', tipo: TipoEspacio.AULA, capacidad: 15, descripcion: null },
        { id: 2, nombre: 'Aula Mediana', tipo: TipoEspacio.AULA, capacidad: 30, descripcion: null },
        { id: 3, nombre: 'Auditorio Grande', tipo: TipoEspacio.AUDITORIO, capacidad: 200, descripcion: null },
      ];

      mockEspacioService.findAll.mockResolvedValue(espacios);

      const result = await controller.findAll();

      expect(result[0].capacidad).toBeLessThan(result[1].capacidad);
      expect(result[1].capacidad).toBeLessThan(result[2].capacidad);
    });
  });

  describe('findOne', () => {
    it('debe retornar un espacio por id', async () => {
      mockEspacioService.findOne.mockResolvedValue(mockEspacio);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockEspacio);
      expect(mockEspacioService.findOne).toHaveBeenCalledWith(1);
      expect(mockEspacioService.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando el espacio no existe', async () => {
      mockEspacioService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockEspacioService.findOne).toHaveBeenCalledWith(999);
    });

    it('debe convertir string a número en el id', async () => {
      mockEspacioService.findOne.mockResolvedValue(mockEspacio);

      await controller.findOne('5');

      expect(mockEspacioService.findOne).toHaveBeenCalledWith(5);
    });

    it('debe retornar espacio con todos sus campos', async () => {
      mockEspacioService.findOne.mockResolvedValue(mockEspacio);

      const result = await controller.findOne('1');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('nombre');
      expect(result).toHaveProperty('tipo');
      expect(result).toHaveProperty('capacidad');
      expect(result).toHaveProperty('descripcion');
    });

    it('debe retornar un laboratorio específico', async () => {
      const laboratorio = {
        id: 2,
        nombre: 'Lab Comp 201',
        tipo: TipoEspacio.LAB_COMP,
        capacidad: 25,
        descripcion: 'Laboratorio de computación',
      };

      mockEspacioService.findOne.mockResolvedValue(laboratorio);

      const result = await controller.findOne('2');

      expect(result.tipo).toBe(TipoEspacio.LAB_COMP);
      expect(result.nombre).toContain('Lab');
    });
  });

  describe('update', () => {
    it('debe actualizar un espacio exitosamente', async () => {
      const updateDto: UpdateEspacioDto = {
        nombre: 'Aula 101 Renovada',
        descripcion: 'Aula renovada con nuevo equipo',
      };

      const espacioActualizado = {
        ...mockEspacio,
        nombre: 'Aula 101 Renovada',
        descripcion: 'Aula renovada con nuevo equipo',
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(espacioActualizado);
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockEspacioService.update).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar solo el nombre del espacio', async () => {
      const updateDto: UpdateEspacioDto = {
        nombre: 'Aula 101-A',
      };

      const espacioActualizado = {
        ...mockEspacio,
        nombre: 'Aula 101-A',
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.nombre).toBe('Aula 101-A');
      expect(result.tipo).toBe(mockEspacio.tipo);
      expect(result.capacidad).toBe(mockEspacio.capacidad);
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar la capacidad del espacio', async () => {
      const updateDto: UpdateEspacioDto = {
        capacidad: 35,
      };

      const espacioActualizado = {
        ...mockEspacio,
        capacidad: 35,
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.capacidad).toBe(35);
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar el tipo de espacio', async () => {
      const updateDto: UpdateEspacioDto = {
        tipo: TipoEspacio.LAB_COMP,
      };

      const espacioActualizado = {
        ...mockEspacio,
        tipo: TipoEspacio.LAB_COMP,
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.tipo).toBe(TipoEspacio.LAB_COMP);
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar la descripción del espacio', async () => {
      const updateDto: UpdateEspacioDto = {
        descripcion: 'Nueva descripción actualizada',
      };

      const espacioActualizado = {
        ...mockEspacio,
        descripcion: 'Nueva descripción actualizada',
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.descripcion).toBe('Nueva descripción actualizada');
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar múltiples campos a la vez', async () => {
      const updateDto: UpdateEspacioDto = {
        nombre: 'Lab Comp 201 Actualizado',
        tipo: TipoEspacio.LAB_COMP,
        capacidad: 30,
        descripcion: 'Laboratorio actualizado con nuevos equipos',
      };

      const espacioActualizado = {
        id: 1,
        ...updateDto,
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.nombre).toBe('Lab Comp 201 Actualizado');
      expect(result.tipo).toBe(TipoEspacio.LAB_COMP);
      expect(result.capacidad).toBe(30);
      expect(result.descripcion).toBe('Laboratorio actualizado con nuevos equipos');
      expect(mockEspacioService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe retornar null cuando el espacio no existe', async () => {
      const updateDto: UpdateEspacioDto = {
        nombre: 'Espacio inexistente',
      };

      mockEspacioService.update.mockResolvedValue(null);

      const result = await controller.update('999', updateDto);

      expect(result).toBeNull();
      expect(mockEspacioService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('debe convertir un aula en laboratorio', async () => {
      const updateDto: UpdateEspacioDto = {
        tipo: TipoEspacio.LAB_FISICA,
        descripcion: 'Convertido a laboratorio de física',
      };

      const espacioActualizado = {
        ...mockEspacio,
        tipo: TipoEspacio.LAB_FISICA,
        descripcion: 'Convertido a laboratorio de física',
      };

      mockEspacioService.update.mockResolvedValue(espacioActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.tipo).toBe(TipoEspacio.LAB_FISICA);
    });
  });

  describe('remove', () => {
    it('debe eliminar un espacio exitosamente', async () => {
      mockEspacioService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(result).toEqual({ affected: 1 });
      expect(mockEspacioService.remove).toHaveBeenCalledWith(1);
      expect(mockEspacioService.remove).toHaveBeenCalledTimes(1);
    });

    it('debe retornar affected: 0 cuando el espacio no existe', async () => {
      mockEspacioService.remove.mockResolvedValue({ affected: 0 });

      const result = await controller.remove('999');

      expect(result).toEqual({ affected: 0 });
      expect(mockEspacioService.remove).toHaveBeenCalledWith(999);
    });

    it('debe convertir string a número en el id', async () => {
      mockEspacioService.remove.mockResolvedValue({ affected: 1 });

      await controller.remove('5');

      expect(mockEspacioService.remove).toHaveBeenCalledWith(5);
    });

    it('debe eliminar espacios de cualquier tipo', async () => {
      mockEspacioService.remove.mockResolvedValue({ affected: 1 });

      // Eliminar aula
      await controller.remove('1');
      expect(mockEspacioService.remove).toHaveBeenCalledWith(1);

      // Eliminar laboratorio
      await controller.remove('2');
      expect(mockEspacioService.remove).toHaveBeenCalledWith(2);

      // Eliminar auditorio
      await controller.remove('3');
      expect(mockEspacioService.remove).toHaveBeenCalledWith(3);

      expect(mockEspacioService.remove).toHaveBeenCalledTimes(3);
    });
  });

  describe('integration scenarios', () => {
    it('debe manejar el ciclo completo de un espacio', async () => {
      // Crear
      const createDto: CreateEspacioDto = {
        nombre: 'Aula 201',
        tipo: TipoEspacio.AULA,
        capacidad: 40,
        descripcion: 'Aula estándar',
      };

      const espacioCreado = { id: 1, ...createDto };
      mockEspacioService.create.mockResolvedValue(espacioCreado);
      const created = await controller.create(createDto);
      expect(created).toEqual(espacioCreado);

      // Consultar
      mockEspacioService.findOne.mockResolvedValue(espacioCreado);
      const found = await controller.findOne('1');
      expect(found).toEqual(espacioCreado);

      // Actualizar
      const updateDto: UpdateEspacioDto = { capacidad: 45 };
      const espacioActualizado = { ...espacioCreado, capacidad: 45 };
      mockEspacioService.update.mockResolvedValue(espacioActualizado);
      const updated = await controller.update('1', updateDto);
      expect(updated.capacidad).toBe(45);

      // Eliminar
      mockEspacioService.remove.mockResolvedValue({ affected: 1 });
      const removed = await controller.remove('1');
      expect(removed).toEqual({ affected: 1 });
    });

    it('debe manejar diferentes tipos de espacios correctamente', async () => {
      const tiposEspacios = [
        { nombre: 'Aula 101', tipo: TipoEspacio.AULA, capacidad: 30 },
        { nombre: 'Lab Comp 201', tipo: TipoEspacio.LAB_COMP, capacidad: 25 },
        { nombre: 'Lab Física 301', tipo: TipoEspacio.LAB_FISICA, capacidad: 20 },
        { nombre: 'Auditorio', tipo: TipoEspacio.AUDITORIO, capacidad: 200 },
      ];

      for (const [index, espacio] of tiposEspacios.entries()) {
        const createDto: CreateEspacioDto = { ...espacio };
        const espacioCreado = { id: index + 1, ...createDto, descripcion: null };
        mockEspacioService.create.mockResolvedValueOnce(espacioCreado);

        const result = await controller.create(createDto);
        expect(result.tipo).toBe(espacio.tipo);
      }

      expect(mockEspacioService.create).toHaveBeenCalledTimes(4);
    });

    it('debe validar capacidades según tipo de espacio', async () => {
      const aula: CreateEspacioDto = {
        nombre: 'Aula 101',
        tipo: TipoEspacio.AULA,
        capacidad: 30,
      };

      const auditorio: CreateEspacioDto = {
        nombre: 'Auditorio',
        tipo: TipoEspacio.AUDITORIO,
        capacidad: 200,
      };

      mockEspacioService.create.mockResolvedValueOnce({ id: 1, ...aula, descripcion: null });
      mockEspacioService.create.mockResolvedValueOnce({ id: 2, ...auditorio, descripcion: null });

      const resultAula = await controller.create(aula);
      const resultAuditorio = await controller.create(auditorio);

      expect(resultAula.capacidad).toBeLessThan(resultAuditorio.capacidad);
      expect(resultAuditorio.tipo).toBe(TipoEspacio.AUDITORIO);
    });

    it('debe listar espacios y encontrar uno específico', async () => {
      const espacios = [
        { id: 1, nombre: 'Aula 101', tipo: TipoEspacio.AULA, capacidad: 30, descripcion: null },
        { id: 2, nombre: 'Lab Comp', tipo: TipoEspacio.LAB_COMP, capacidad: 25, descripcion: null },
      ];

      mockEspacioService.findAll.mockResolvedValue(espacios);
      const all = await controller.findAll();
      expect(all).toHaveLength(2);

      mockEspacioService.findOne.mockResolvedValue(espacios[0]);
      const one = await controller.findOne('1');
      expect(one.id).toBe(1);
      expect(one.nombre).toBe('Aula 101');
    });
  });
});
