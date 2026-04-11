import { Test, TestingModule } from '@nestjs/testing';
import { ReservaMaterialController } from './reservaMaterial.controller';
import { ReservaMaterialService } from '../servicios/reservaMaterial.services';
import { CreateReservaMaterialDto } from '../dto/create.dto';
import { UpdateReservaMaterialDto } from '../dto/update.dto';
import { EstadoReservaMaterial } from 'src/database/Entidades/reservaMaterial.entity';

describe('ReservaMaterialController', () => {
  let controller: ReservaMaterialController;
  let service: ReservaMaterialService;

  const mockReservaMaterialService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    updateEstado: jest.fn(),
    updateCalificacion: jest.fn(),
    updateObservacionesEntrega: jest.fn(),
  };

  const mockMaterial = {
    id: 1,
    nombre: 'Laptop HP',
    cantidad: 10,
    cantidadDisponible: 8,
    tiempoPrestamo: 7,
  };

  const mockUsuario = {
    email: 'test@example.com',
    nombre: 'Test User',
    cedula: '1234567890',
    tipo: 'Estudiante',
  };

  const mockReserva = {
    id: 1,
    material: mockMaterial,
    usuario: mockUsuario,
    cantidad: 2,
    fecha: '2024-12-01',
    horaInicio: '10:00',
    horaFin: '14:00',
    fechaReserva: new Date('2024-11-25'),
    estado: EstadoReservaMaterial.Pendiente,
    calificacion: null,
    comentario: null,
    observacionesEntrega: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaMaterialController],
      providers: [
        {
          provide: ReservaMaterialService,
          useValue: mockReservaMaterialService,
        },
      ],
    }).compile();

    controller = module.get<ReservaMaterialController>(
      ReservaMaterialController,
    );
    service = module.get<ReservaMaterialService>(ReservaMaterialService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una nueva reserva de material exitosamente', async () => {
      const createDto: CreateReservaMaterialDto = {
        materialId: 1,
        usuarioId: 'test@example.com',
        cantidad: 2,
        fecha: '2024-12-01',
        horaInicio: '10:00',
        horaFin: '14:00',
        fechaReserva: new Date('2024-11-25'),
      };

      mockReservaMaterialService.create.mockResolvedValue(mockReserva);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockReserva);
      expect(mockReservaMaterialService.create).toHaveBeenCalledWith(createDto);
      expect(mockReservaMaterialService.create).toHaveBeenCalledTimes(1);
    });

    it('debe crear una reserva sin usuario (opcional)', async () => {
      const createDto: CreateReservaMaterialDto = {
        materialId: 1,
        cantidad: 1,
        fecha: '2024-12-01',
        horaInicio: '10:00',
        horaFin: '14:00',
        fechaReserva: new Date('2024-11-25'),
      };

      const reservaSinUsuario = {
        ...mockReserva,
        usuario: null,
        cantidad: 1,
      };

      mockReservaMaterialService.create.mockResolvedValue(reservaSinUsuario);

      const result = await controller.create(createDto);

      expect(result).toEqual(reservaSinUsuario);
      expect(result.usuario).toBeNull();
      expect(mockReservaMaterialService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe lanzar error cuando no hay suficiente material disponible', async () => {
      const createDto: CreateReservaMaterialDto = {
        materialId: 1,
        cantidad: 20,
        fecha: '2024-12-01',
        horaInicio: '10:00',
        horaFin: '14:00',
        fechaReserva: new Date('2024-11-25'),
      };

      mockReservaMaterialService.create.mockRejectedValue(
        new Error('No hay suficiente cantidad disponible. Solo quedan 8 < 20.'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'No hay suficiente cantidad disponible. Solo quedan 8 < 20.',
      );
      expect(mockReservaMaterialService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe lanzar error cuando el material no existe', async () => {
      const createDto: CreateReservaMaterialDto = {
        materialId: 999,
        cantidad: 1,
        fecha: '2024-12-01',
        horaInicio: '10:00',
        horaFin: '14:00',
        fechaReserva: new Date('2024-11-25'),
      };

      mockReservaMaterialService.create.mockRejectedValue(
        new Error('Material no encontrado'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Material no encontrado',
      );
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las reservas de material', async () => {
      const reservas = [
        mockReserva,
        {
          ...mockReserva,
          id: 2,
          cantidad: 3,
          estado: EstadoReservaMaterial.Entregado,
        },
      ];

      mockReservaMaterialService.findAll.mockResolvedValue(reservas);

      const result = await controller.findAll();

      expect(result).toEqual(reservas);
      expect(result).toHaveLength(2);
      expect(mockReservaMaterialService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío cuando no hay reservas', async () => {
      mockReservaMaterialService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockReservaMaterialService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('debe retornar una reserva por id', async () => {
      mockReservaMaterialService.findOne.mockResolvedValue(mockReserva);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockReserva);
      expect(mockReservaMaterialService.findOne).toHaveBeenCalledWith(1);
      expect(mockReservaMaterialService.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando la reserva no existe', async () => {
      mockReservaMaterialService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockReservaMaterialService.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('findByEmail', () => {
    it('debe retornar todas las reservas de un usuario por email', async () => {
      const reservasUsuario = [
        mockReserva,
        {
          ...mockReserva,
          id: 2,
          estado: EstadoReservaMaterial.Devuelto,
        },
      ];

      mockReservaMaterialService.findByEmail.mockResolvedValue(
        reservasUsuario,
      );

      const result = await controller.findByEmail('test@example.com');

      expect(result).toEqual(reservasUsuario);
      expect(result).toHaveLength(2);
      expect(mockReservaMaterialService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockReservaMaterialService.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('debe retornar array vacío si el usuario no tiene reservas', async () => {
      mockReservaMaterialService.findByEmail.mockResolvedValue([]);

      const result = await controller.findByEmail('sinreservas@example.com');

      expect(result).toEqual([]);
      expect(mockReservaMaterialService.findByEmail).toHaveBeenCalledWith(
        'sinreservas@example.com',
      );
    });
  });

  describe('update', () => {
    it('debe actualizar una reserva exitosamente', async () => {
      const updateDto: UpdateReservaMaterialDto = {
        cantidad: 3,
        observacionesEntrega: 'Material en buen estado',
      };

      const reservaActualizada = {
        ...mockReserva,
        cantidad: 3,
        observacionesEntrega: 'Material en buen estado',
      };

      mockReservaMaterialService.update.mockResolvedValue(reservaActualizada);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(reservaActualizada);
      expect(mockReservaMaterialService.update).toHaveBeenCalledWith(
        1,
        updateDto,
      );
      expect(mockReservaMaterialService.update).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar el material de una reserva', async () => {
      const updateDto: UpdateReservaMaterialDto = {
        materialId: 2,
      };

      const reservaConNuevoMaterial = {
        ...mockReserva,
        material: { ...mockMaterial, id: 2, nombre: 'Proyector' },
      };

      mockReservaMaterialService.update.mockResolvedValue(
        reservaConNuevoMaterial,
      );

      const result = await controller.update('1', updateDto);

      expect(result.material.id).toBe(2);
      expect(mockReservaMaterialService.update).toHaveBeenCalledWith(
        1,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('debe eliminar una reserva exitosamente', async () => {
      mockReservaMaterialService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(result).toEqual({ affected: 1 });
      expect(mockReservaMaterialService.remove).toHaveBeenCalledWith(1);
      expect(mockReservaMaterialService.remove).toHaveBeenCalledTimes(1);
    });

    it('debe retornar affected: 0 cuando la reserva no existe', async () => {
      mockReservaMaterialService.remove.mockResolvedValue({ affected: 0 });

      const result = await controller.remove('999');

      expect(result).toEqual({ affected: 0 });
      expect(mockReservaMaterialService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('updateEstado', () => {
    it('debe actualizar el estado a Entregado desde Pendiente', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateEstado.mockResolvedValue(updateResult);

      const result = await controller.updateEstado(
        1,
        EstadoReservaMaterial.Entregado,
      );

      expect(result).toEqual(updateResult);
      expect(mockReservaMaterialService.updateEstado).toHaveBeenCalledWith(
        1,
        EstadoReservaMaterial.Entregado,
      );
      expect(mockReservaMaterialService.updateEstado).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar el estado a Devuelto desde Entregado', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateEstado.mockResolvedValue(updateResult);

      const result = await controller.updateEstado(
        1,
        EstadoReservaMaterial.Devuelto,
      );

      expect(result).toEqual(updateResult);
      expect(mockReservaMaterialService.updateEstado).toHaveBeenCalledWith(
        1,
        EstadoReservaMaterial.Devuelto,
      );
    });

    it('debe lanzar error cuando la transición de estado no es válida', async () => {
      mockReservaMaterialService.updateEstado.mockRejectedValue(
        new Error('Estado no válido para la transición'),
      );

      await expect(
        controller.updateEstado(1, EstadoReservaMaterial.Atrasado),
      ).rejects.toThrow('Estado no válido para la transición');
    });
  });

  describe('updateCalificacion', () => {
    it('debe actualizar la calificación de una reserva', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateCalificacion.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateCalificacion(
        1,
        5,
        'Excelente servicio',
      );

      expect(result).toEqual(updateResult);
      expect(mockReservaMaterialService.updateCalificacion).toHaveBeenCalledWith(
        1,
        5,
        'Excelente servicio',
      );
      expect(
        mockReservaMaterialService.updateCalificacion,
      ).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar solo la calificación sin comentario', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateCalificacion.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateCalificacion(1, 4, undefined);

      expect(result).toEqual(updateResult);
      expect(mockReservaMaterialService.updateCalificacion).toHaveBeenCalledWith(
        1,
        4,
        undefined,
      );
    });

    it('debe validar calificaciones dentro del rango 1-5', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateCalificacion.mockResolvedValue(
        updateResult,
      );

      // Calificación mínima válida
      await controller.updateCalificacion(1, 1, 'Comentario');
      expect(mockReservaMaterialService.updateCalificacion).toHaveBeenCalledWith(
        1,
        1,
        'Comentario',
      );

      // Calificación máxima válida
      await controller.updateCalificacion(1, 5, 'Comentario');
      expect(mockReservaMaterialService.updateCalificacion).toHaveBeenCalledWith(
        1,
        5,
        'Comentario',
      );
    });
  });

  describe('updateObservacionesEntrega', () => {
    it('debe actualizar las observaciones de entrega', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(
        1,
        'Material entregado sin daños',
      );

      expect(result).toEqual(updateResult);
      expect(
        mockReservaMaterialService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, 'Material entregado sin daños');
      expect(
        mockReservaMaterialService.updateObservacionesEntrega,
      ).toHaveBeenCalledTimes(1);
    });

    it('debe permitir observaciones vacías', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaMaterialService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(1, '');

      expect(result).toEqual(updateResult);
      expect(
        mockReservaMaterialService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, '');
    });

    it('debe manejar observaciones extensas', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      const observacionExtensa =
        'Material entregado con pequeños rayones en la carcasa. ' +
        'Cable de alimentación en buen estado. ' +
        'Se incluyen accesorios originales.';

      mockReservaMaterialService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(
        1,
        observacionExtensa,
      );

      expect(result).toEqual(updateResult);
      expect(
        mockReservaMaterialService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, observacionExtensa);
    });
  });
});
