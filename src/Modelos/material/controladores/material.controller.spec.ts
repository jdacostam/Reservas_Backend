import { Test, TestingModule } from '@nestjs/testing';
import { MaterialController } from './material.controller';
import { MaterialService } from '../servicios/material.services';
import { CreateMaterialDto } from '../dto/create.dto';
import { UpdateMaterialDto } from '../dto/update.dto';

describe('MaterialController', () => {
  let controller: MaterialController;
  let service: MaterialService;

  const mockMaterialService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockMaterial = {
    id: 1,
    nombre: 'Laptop HP',
    cantidad: 10,
    tiempoPrestamo: 7,
    cantidadDisponible: 8,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaterialController],
      providers: [
        {
          provide: MaterialService,
          useValue: mockMaterialService,
        },
      ],
    }).compile();

    controller = module.get<MaterialController>(MaterialController);
    service = module.get<MaterialService>(MaterialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un nuevo material exitosamente', async () => {
      const createDto: CreateMaterialDto = {
        nombre: 'Laptop HP',
        cantidad: 10,
        tiempoPrestamo: 7,
        cantidadDisponible: 10,
      };

      mockMaterialService.create.mockResolvedValue(mockMaterial);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockMaterial);
      expect(mockMaterialService.create).toHaveBeenCalledWith(createDto);
      expect(mockMaterialService.create).toHaveBeenCalledTimes(1);
    });

    it('debe crear material con cantidad disponible igual a cantidad inicial', async () => {
      const createDto: CreateMaterialDto = {
        nombre: 'Proyector Epson',
        cantidad: 5,
        tiempoPrestamo: 3,
        cantidadDisponible: 5,
      };

      const nuevoMaterial = {
        id: 2,
        ...createDto,
      };

      mockMaterialService.create.mockResolvedValue(nuevoMaterial);

      const result = await controller.create(createDto);

      expect(result).toEqual(nuevoMaterial);
      expect(result.cantidad).toBe(result.cantidadDisponible);
      expect(mockMaterialService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear material con diferentes tiempos de préstamo', async () => {
      const createDto: CreateMaterialDto = {
        nombre: 'Tablet Samsung',
        cantidad: 15,
        tiempoPrestamo: 14,
        cantidadDisponible: 15,
      };

      const nuevoMaterial = {
        id: 3,
        ...createDto,
      };

      mockMaterialService.create.mockResolvedValue(nuevoMaterial);

      const result = await controller.create(createDto);

      expect(result.tiempoPrestamo).toBe(14);
      expect(mockMaterialService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe crear material con cantidad disponible menor a cantidad total', async () => {
      const createDto: CreateMaterialDto = {
        nombre: 'Mouse Inalámbrico',
        cantidad: 20,
        tiempoPrestamo: 7,
        cantidadDisponible: 15,
      };

      const nuevoMaterial = {
        id: 4,
        ...createDto,
      };

      mockMaterialService.create.mockResolvedValue(nuevoMaterial);

      const result = await controller.create(createDto);

      expect(result.cantidadDisponible).toBeLessThanOrEqual(result.cantidad);
      expect(mockMaterialService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findAll', () => {
    it('debe retornar todos los materiales', async () => {
      const materiales = [
        mockMaterial,
        {
          id: 2,
          nombre: 'Proyector Epson',
          cantidad: 5,
          tiempoPrestamo: 3,
          cantidadDisponible: 4,
        },
        {
          id: 3,
          nombre: 'Tablet Samsung',
          cantidad: 15,
          tiempoPrestamo: 14,
          cantidadDisponible: 12,
        },
      ];

      mockMaterialService.findAll.mockResolvedValue(materiales);

      const result = await controller.findAll();

      expect(result).toEqual(materiales);
      expect(result).toHaveLength(3);
      expect(mockMaterialService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío cuando no hay materiales', async () => {
      mockMaterialService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockMaterialService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar materiales con diferentes disponibilidades', async () => {
      const materiales = [
        { ...mockMaterial, cantidadDisponible: 10 }, // Todos disponibles
        { ...mockMaterial, id: 2, cantidadDisponible: 5 }, // Algunos prestados
        { ...mockMaterial, id: 3, cantidadDisponible: 0 }, // Ninguno disponible
      ];

      mockMaterialService.findAll.mockResolvedValue(materiales);

      const result = await controller.findAll();

      expect(result[0].cantidadDisponible).toBe(10);
      expect(result[1].cantidadDisponible).toBe(5);
      expect(result[2].cantidadDisponible).toBe(0);
    });
  });

  describe('findOne', () => {
    it('debe retornar un material por id', async () => {
      mockMaterialService.findOne.mockResolvedValue(mockMaterial);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockMaterial);
      expect(mockMaterialService.findOne).toHaveBeenCalledWith(1);
      expect(mockMaterialService.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando el material no existe', async () => {
      mockMaterialService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockMaterialService.findOne).toHaveBeenCalledWith(999);
    });

    it('debe convertir string a número en el id', async () => {
      mockMaterialService.findOne.mockResolvedValue(mockMaterial);

      await controller.findOne('5');

      expect(mockMaterialService.findOne).toHaveBeenCalledWith(5);
    });

    it('debe retornar material con todos sus campos', async () => {
      mockMaterialService.findOne.mockResolvedValue(mockMaterial);

      const result = await controller.findOne('1');

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('nombre');
      expect(result).toHaveProperty('cantidad');
      expect(result).toHaveProperty('tiempoPrestamo');
      expect(result).toHaveProperty('cantidadDisponible');
    });
  });

  describe('update', () => {
    it('debe actualizar un material exitosamente', async () => {
      const updateDto: UpdateMaterialDto = {
        nombre: 'Laptop HP Actualizada',
        cantidadDisponible: 7,
      };

      const materialActualizado = {
        ...mockMaterial,
        nombre: 'Laptop HP Actualizada',
        cantidadDisponible: 7,
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(materialActualizado);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockMaterialService.update).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar solo el nombre del material', async () => {
      const updateDto: UpdateMaterialDto = {
        nombre: 'Laptop Dell',
      };

      const materialActualizado = {
        ...mockMaterial,
        nombre: 'Laptop Dell',
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.nombre).toBe('Laptop Dell');
      expect(result.cantidad).toBe(mockMaterial.cantidad);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar solo la cantidad disponible', async () => {
      const updateDto: UpdateMaterialDto = {
        cantidadDisponible: 5,
      };

      const materialActualizado = {
        ...mockMaterial,
        cantidadDisponible: 5,
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.cantidadDisponible).toBe(5);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar la cantidad total del material', async () => {
      const updateDto: UpdateMaterialDto = {
        cantidad: 15,
        cantidadDisponible: 15,
      };

      const materialActualizado = {
        ...mockMaterial,
        cantidad: 15,
        cantidadDisponible: 15,
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.cantidad).toBe(15);
      expect(result.cantidadDisponible).toBe(15);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar el tiempo de préstamo', async () => {
      const updateDto: UpdateMaterialDto = {
        tiempoPrestamo: 10,
      };

      const materialActualizado = {
        ...mockMaterial,
        tiempoPrestamo: 10,
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.tiempoPrestamo).toBe(10);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe actualizar múltiples campos a la vez', async () => {
      const updateDto: UpdateMaterialDto = {
        nombre: 'Laptop HP Pro',
        cantidad: 12,
        tiempoPrestamo: 5,
        cantidadDisponible: 10,
      };

      const materialActualizado = {
        id: 1,
        ...updateDto,
      };

      mockMaterialService.update.mockResolvedValue(materialActualizado);

      const result = await controller.update('1', updateDto);

      expect(result.nombre).toBe('Laptop HP Pro');
      expect(result.cantidad).toBe(12);
      expect(result.tiempoPrestamo).toBe(5);
      expect(result.cantidadDisponible).toBe(10);
      expect(mockMaterialService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe retornar null cuando el material no existe', async () => {
      const updateDto: UpdateMaterialDto = {
        nombre: 'Material inexistente',
      };

      mockMaterialService.update.mockResolvedValue(null);

      const result = await controller.update('999', updateDto);

      expect(result).toBeNull();
      expect(mockMaterialService.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('remove', () => {
    it('debe eliminar un material exitosamente', async () => {
      mockMaterialService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(result).toEqual({ affected: 1 });
      expect(mockMaterialService.remove).toHaveBeenCalledWith(1);
      expect(mockMaterialService.remove).toHaveBeenCalledTimes(1);
    });

    it('debe retornar affected: 0 cuando el material no existe', async () => {
      mockMaterialService.remove.mockResolvedValue({ affected: 0 });

      const result = await controller.remove('999');

      expect(result).toEqual({ affected: 0 });
      expect(mockMaterialService.remove).toHaveBeenCalledWith(999);
    });

    it('debe convertir string a número en el id', async () => {
      mockMaterialService.remove.mockResolvedValue({ affected: 1 });

      await controller.remove('5');

      expect(mockMaterialService.remove).toHaveBeenCalledWith(5);
    });

    it('debe eliminar material independientemente de su disponibilidad', async () => {
      mockMaterialService.remove.mockResolvedValue({ affected: 1 });

      // Material con disponibilidad completa
      await controller.remove('1');
      expect(mockMaterialService.remove).toHaveBeenCalledWith(1);

      // Material sin disponibilidad
      await controller.remove('2');
      expect(mockMaterialService.remove).toHaveBeenCalledWith(2);

      expect(mockMaterialService.remove).toHaveBeenCalledTimes(2);
    });
  });

  describe('integration scenarios', () => {
    it('debe manejar el ciclo completo de un material', async () => {
      // Crear
      const createDto: CreateMaterialDto = {
        nombre: 'Mouse Inalámbrico',
        cantidad: 20,
        tiempoPrestamo: 7,
        cantidadDisponible: 20,
      };

      const materialCreado = { id: 1, ...createDto };
      mockMaterialService.create.mockResolvedValue(materialCreado);
      const created = await controller.create(createDto);
      expect(created).toEqual(materialCreado);

      // Consultar
      mockMaterialService.findOne.mockResolvedValue(materialCreado);
      const found = await controller.findOne('1');
      expect(found).toEqual(materialCreado);

      // Actualizar
      const updateDto: UpdateMaterialDto = { cantidadDisponible: 15 };
      const materialActualizado = { ...materialCreado, cantidadDisponible: 15 };
      mockMaterialService.update.mockResolvedValue(materialActualizado);
      const updated = await controller.update('1', updateDto);
      expect(updated.cantidadDisponible).toBe(15);

      // Eliminar
      mockMaterialService.remove.mockResolvedValue({ affected: 1 });
      const removed = await controller.remove('1');
      expect(removed).toEqual({ affected: 1 });
    });

    it('debe validar que cantidad disponible no exceda cantidad total', async () => {
      const createDto: CreateMaterialDto = {
        nombre: 'Teclado Mecánico',
        cantidad: 10,
        tiempoPrestamo: 7,
        cantidadDisponible: 10,
      };

      const material = { id: 1, ...createDto };
      mockMaterialService.create.mockResolvedValue(material);

      const result = await controller.create(createDto);

      expect(result.cantidadDisponible).toBeLessThanOrEqual(result.cantidad);
    });

    it('debe manejar materiales con nombres similares', async () => {
      const materiales = [
        { id: 1, nombre: 'Laptop HP', cantidad: 10, tiempoPrestamo: 7, cantidadDisponible: 8 },
        { id: 2, nombre: 'Laptop Dell', cantidad: 8, tiempoPrestamo: 7, cantidadDisponible: 6 },
        { id: 3, nombre: 'Laptop Lenovo', cantidad: 12, tiempoPrestamo: 7, cantidadDisponible: 10 },
      ];

      mockMaterialService.findAll.mockResolvedValue(materiales);

      const result = await controller.findAll();

      expect(result).toHaveLength(3);
      expect(result[0].nombre).toContain('Laptop');
      expect(result[1].nombre).toContain('Laptop');
      expect(result[2].nombre).toContain('Laptop');
    });
  });
});
