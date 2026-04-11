import { Test, TestingModule } from '@nestjs/testing';
import { ReservaController } from './reserva.controller';
import { ReservaService } from '../servicios/reserva.services';
import { CreateReservaDto } from '../dto/create.dto';
import { UpdateReservaDto } from '../dto/update.dto';
import { EstadoReserva } from 'src/database/Entidades/reserva.entity';
import { NotFoundException } from '@nestjs/common';

describe('ReservaController', () => {
  let controller: ReservaController;
  let service: ReservaService;

  const mockReservaService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDisponibilidadPorEspacioYFecha: jest.fn(),
    updateCalificacion: jest.fn(),
    updateObservacionesEntrega: jest.fn(),
  };

  const mockEspacio = {
    id: 1,
    nombre: 'Aula 101',
    capacidad: 30,
    tipo: 'Aula',
  };

  const mockCalendario = {
    id: 1,
    fecha: '2024-12-01',
    horaInicio: '08:00',
    horaFin: '10:00',
    capacidad: 30,
    disponibilidad: true,
    docenteAsignado: false,
    espacio: mockEspacio,
  };

  const mockUsuario = {
    email: 'test@example.com',
    nombre: 'Test User',
    cedula: '1234567890',
    tipo: 'Estudiante',
  };

  const mockReserva = {
    id: 1,
    calendario: mockCalendario,
    usuario: mockUsuario,
    estado: EstadoReserva.PENDIENTE,
    fechaReserva: new Date('2024-11-25'),
    calificacion: null,
    comentario: null,
    observacionesEntrega: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservaController],
      providers: [
        {
          provide: ReservaService,
          useValue: mockReservaService,
        },
      ],
    }).compile();

    controller = module.get<ReservaController>(ReservaController);
    service = module.get<ReservaService>(ReservaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una nueva reserva exitosamente', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 1,
        usuarioId: 'test@example.com',
        estado: EstadoReserva.PENDIENTE,
      };

      mockReservaService.create.mockResolvedValue(mockReserva);

      const result = await controller.create(createDto);

      expect(result).toEqual(mockReserva);
      expect(mockReservaService.create).toHaveBeenCalledWith(createDto);
      expect(mockReservaService.create).toHaveBeenCalledTimes(1);
    });

    it('debe crear una reserva con calificación y comentario', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 1,
        usuarioId: 'test@example.com',
        estado: EstadoReserva.PENDIENTE,
        calificacion: 5,
        comentario: 'Excelente espacio',
      };

      const reservaConCalificacion = {
        ...mockReserva,
        calificacion: 5,
        comentario: 'Excelente espacio',
      };

      mockReservaService.create.mockResolvedValue(reservaConCalificacion);

      const result = await controller.create(createDto);

      expect(result).toEqual(reservaConCalificacion);
      expect(result.calificacion).toBe(5);
      expect(result.comentario).toBe('Excelente espacio');
      expect(mockReservaService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe lanzar error cuando el calendario no existe', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 999,
        usuarioId: 'test@example.com',
      };

      mockReservaService.create.mockRejectedValue(
        new NotFoundException('Calendario no encontrado'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Calendario no encontrado',
      );
      expect(mockReservaService.create).toHaveBeenCalledWith(createDto);
    });

    it('debe lanzar error cuando el usuario no existe', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 1,
        usuarioId: 'noexiste@example.com',
      };

      mockReservaService.create.mockRejectedValue(
        new NotFoundException('Usuario no encontrado'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'Usuario no encontrado',
      );
    });

    it('debe lanzar error cuando no hay cupos disponibles', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 1,
        usuarioId: 'test@example.com',
      };

      mockReservaService.create.mockRejectedValue(
        new NotFoundException('No hay cupos'),
      );

      await expect(controller.create(createDto)).rejects.toThrow(
        'No hay cupos',
      );
    });

    it('debe crear una reserva de docente correctamente', async () => {
      const createDto: CreateReservaDto = {
        calendarioId: 1,
        usuarioId: 'profesor@example.com',
      };

      const reservaDocente = {
        ...mockReserva,
        usuario: {
          ...mockUsuario,
          email: 'profesor@example.com',
          tipo: 'Profesor',
        },
      };

      mockReservaService.create.mockResolvedValue(reservaDocente);

      const result = await controller.create(createDto);

      expect(result).toEqual(reservaDocente);
      expect(result.usuario.tipo).toBe('Profesor');
    });
  });

  describe('findAll', () => {
    it('debe retornar todas las reservas', async () => {
      const reservas = [
        mockReserva,
        {
          ...mockReserva,
          id: 2,
          estado: EstadoReserva.ACTIVA,
        },
      ];

      mockReservaService.findAll.mockResolvedValue(reservas);

      const result = await controller.findAll();

      expect(result).toEqual(reservas);
      expect(result).toHaveLength(2);
      expect(mockReservaService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío cuando no hay reservas', async () => {
      mockReservaService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(mockReservaService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debe retornar reservas con relaciones de calendario y usuario', async () => {
      mockReservaService.findAll.mockResolvedValue([mockReserva]);

      const result = await controller.findAll();

      expect(result[0].calendario).toBeDefined();
      expect(result[0].usuario).toBeDefined();
      expect(result[0].calendario.espacio).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('debe retornar una reserva por id', async () => {
      mockReservaService.findOne.mockResolvedValue(mockReserva);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockReserva);
      expect(mockReservaService.findOne).toHaveBeenCalledWith(1);
      expect(mockReservaService.findOne).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando la reserva no existe', async () => {
      mockReservaService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(result).toBeNull();
      expect(mockReservaService.findOne).toHaveBeenCalledWith(999);
    });

    it('debe retornar una reserva con todas sus relaciones', async () => {
      mockReservaService.findOne.mockResolvedValue(mockReserva);

      const result = await controller.findOne('1');

      expect(result.calendario).toBeDefined();
      expect(result.usuario).toBeDefined();
    });
  });

  describe('findByEmail', () => {
    it('debe retornar todas las reservas de un usuario por email', async () => {
      const reservasUsuario = [
        mockReserva,
        {
          ...mockReserva,
          id: 2,
          estado: EstadoReserva.COMPLETADA,
        },
      ];

      mockReservaService.findByEmail.mockResolvedValue(reservasUsuario);

      const result = await controller.findByEmail('test@example.com');

      expect(result).toEqual(reservasUsuario);
      expect(result).toHaveLength(2);
      expect(mockReservaService.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
      expect(mockReservaService.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('debe retornar array vacío si el usuario no tiene reservas', async () => {
      mockReservaService.findByEmail.mockResolvedValue([]);

      const result = await controller.findByEmail('sinreservas@example.com');

      expect(result).toEqual([]);
      expect(mockReservaService.findByEmail).toHaveBeenCalledWith(
        'sinreservas@example.com',
      );
    });
  });

  describe('getDisponibilidad', () => {
    it('debe retornar la disponibilidad de un espacio en una fecha', async () => {
      const disponibilidad = {
        disponibilidad: [
          {
            calendarioId: 1,
            horaInicio: '08:00',
            horaFin: '10:00',
            disponible: true,
            capacidad: 30,
            reservas: [],
            docenteAsignado: false,
          },
          {
            calendarioId: 2,
            horaInicio: '10:00',
            horaFin: '12:00',
            disponible: true,
            capacidad: 30,
            reservas: [],
            docenteAsignado: false,
          },
        ],
      };

      mockReservaService.getDisponibilidadPorEspacioYFecha.mockResolvedValue(
        disponibilidad,
      );

      const result = await controller.getDisponibilidad(1, '2024-12-01');

      expect(result).toEqual(disponibilidad);
      expect(result.disponibilidad).toHaveLength(2);
      expect(
        mockReservaService.getDisponibilidadPorEspacioYFecha,
      ).toHaveBeenCalledWith(1, '2024-12-01');
      expect(
        mockReservaService.getDisponibilidadPorEspacioYFecha,
      ).toHaveBeenCalledTimes(1);
    });

    it('debe mostrar calendarios con reservas existentes', async () => {
      const disponibilidad = {
        disponibilidad: [
          {
            calendarioId: 1,
            horaInicio: '08:00',
            horaFin: '10:00',
            disponible: false,
            capacidad: 0,
            reservas: [
              {
                reservaId: 1,
                usuarioNombre: 'Test User',
              },
            ],
            docenteAsignado: false,
          },
        ],
      };

      mockReservaService.getDisponibilidadPorEspacioYFecha.mockResolvedValue(
        disponibilidad,
      );

      const result = await controller.getDisponibilidad(1, '2024-12-01');

      expect(result.disponibilidad[0].disponible).toBe(false);
      expect(result.disponibilidad[0].reservas).toHaveLength(1);
      expect(result.disponibilidad[0].capacidad).toBe(0);
    });

    it('debe mostrar cuando un docente está asignado', async () => {
      const disponibilidad = {
        disponibilidad: [
          {
            calendarioId: 1,
            horaInicio: '08:00',
            horaFin: '10:00',
            disponible: false,
            capacidad: 29,
            reservas: [
              {
                reservaId: 1,
                usuarioNombre: 'Profesor Test',
              },
            ],
            docenteAsignado: true,
          },
        ],
      };

      mockReservaService.getDisponibilidadPorEspacioYFecha.mockResolvedValue(
        disponibilidad,
      );

      const result = await controller.getDisponibilidad(1, '2024-12-01');

      expect(result.disponibilidad[0].docenteAsignado).toBe(true);
    });
  });

  describe('update', () => {
    it('debe actualizar una reserva exitosamente', async () => {
      const updateDto: UpdateReservaDto = {
        estado: EstadoReserva.ACTIVA,
        calificacion: 4,
        comentario: 'Buen espacio',
      };

      const reservaActualizada = {
        ...mockReserva,
        estado: EstadoReserva.ACTIVA,
        calificacion: 4,
        comentario: 'Buen espacio',
      };

      mockReservaService.update.mockResolvedValue(reservaActualizada);

      const result = await controller.update('1', updateDto);

      expect(result).toEqual(reservaActualizada);
      expect(mockReservaService.update).toHaveBeenCalledWith(1, updateDto);
      expect(mockReservaService.update).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar el calendario de una reserva', async () => {
      const updateDto: UpdateReservaDto = {
        calendarioId: 2,
      };

      const reservaConNuevoCalendario = {
        ...mockReserva,
        calendario: { ...mockCalendario, id: 2, horaInicio: '10:00', horaFin: '12:00' },
      };

      mockReservaService.update.mockResolvedValue(reservaConNuevoCalendario);

      const result = await controller.update('1', updateDto);

      expect(result.calendario.id).toBe(2);
      expect(mockReservaService.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('debe retornar null cuando la reserva no existe', async () => {
      const updateDto: UpdateReservaDto = {
        estado: EstadoReserva.ACTIVA,
      };

      mockReservaService.update.mockResolvedValue(null);

      const result = await controller.update('999', updateDto);

      expect(result).toBeNull();
      expect(mockReservaService.update).toHaveBeenCalledWith(999, updateDto);
    });

    it('debe lanzar error cuando se actualiza con calendario inexistente', async () => {
      const updateDto: UpdateReservaDto = {
        calendarioId: 999,
      };

      mockReservaService.update.mockRejectedValue(
        new NotFoundException('Calendario no encontrado'),
      );

      await expect(controller.update('1', updateDto)).rejects.toThrow(
        'Calendario no encontrado',
      );
    });

    it('debe actualizar observaciones de entrega', async () => {
      const updateDto: UpdateReservaDto = {
        observacionesEntrega: 'Espacio dejado en buen estado',
      };

      const reservaActualizada = {
        ...mockReserva,
        observacionesEntrega: 'Espacio dejado en buen estado',
      };

      mockReservaService.update.mockResolvedValue(reservaActualizada);

      const result = await controller.update('1', updateDto);

      expect(result.observacionesEntrega).toBe('Espacio dejado en buen estado');
    });
  });

  describe('remove', () => {
    it('debe eliminar una reserva exitosamente', async () => {
      mockReservaService.remove.mockResolvedValue({ affected: 1 });

      const result = await controller.remove('1');

      expect(result).toEqual({ affected: 1 });
      expect(mockReservaService.remove).toHaveBeenCalledWith(1);
      expect(mockReservaService.remove).toHaveBeenCalledTimes(1);
    });

    it('debe retornar affected: 0 cuando la reserva no existe', async () => {
      mockReservaService.remove.mockResolvedValue({ affected: 0 });

      const result = await controller.remove('999');

      expect(result).toEqual({ affected: 0 });
      expect(mockReservaService.remove).toHaveBeenCalledWith(999);
    });
  });

  describe('updateCalificacion', () => {
    it('debe actualizar la calificación de una reserva', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaService.updateCalificacion.mockResolvedValue(updateResult);

      const result = await controller.updateCalificacion(
        1,
        5,
        'Excelente servicio',
      );

      expect(result).toEqual(updateResult);
      expect(mockReservaService.updateCalificacion).toHaveBeenCalledWith(
        1,
        5,
        'Excelente servicio',
      );
      expect(mockReservaService.updateCalificacion).toHaveBeenCalledTimes(1);
    });

    it('debe actualizar solo la calificación sin comentario', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaService.updateCalificacion.mockResolvedValue(updateResult);

      const result = await controller.updateCalificacion(1, 4, undefined);

      expect(result).toEqual(updateResult);
      expect(mockReservaService.updateCalificacion).toHaveBeenCalledWith(
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

      mockReservaService.updateCalificacion.mockResolvedValue(updateResult);

      // Calificación mínima válida
      await controller.updateCalificacion(1, 1, 'Comentario');
      expect(mockReservaService.updateCalificacion).toHaveBeenCalledWith(
        1,
        1,
        'Comentario',
      );

      // Calificación máxima válida
      await controller.updateCalificacion(1, 5, 'Comentario');
      expect(mockReservaService.updateCalificacion).toHaveBeenCalledWith(
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

      mockReservaService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(
        1,
        'Espacio en perfectas condiciones',
      );

      expect(result).toEqual(updateResult);
      expect(
        mockReservaService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, 'Espacio en perfectas condiciones');
      expect(
        mockReservaService.updateObservacionesEntrega,
      ).toHaveBeenCalledTimes(1);
    });

    it('debe permitir observaciones vacías', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      mockReservaService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(1, '');

      expect(result).toEqual(updateResult);
      expect(
        mockReservaService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, '');
    });

    it('debe manejar observaciones extensas', async () => {
      const updateResult = {
        affected: 1,
        raw: [],
        generatedMaps: [],
      };

      const observacionExtensa =
        'Espacio dejado limpio y ordenado. ' +
        'Todas las sillas y mesas en su lugar. ' +
        'Equipos apagados correctamente.';

      mockReservaService.updateObservacionesEntrega.mockResolvedValue(
        updateResult,
      );

      const result = await controller.updateObservacionesEntrega(
        1,
        observacionExtensa,
      );

      expect(result).toEqual(updateResult);
      expect(
        mockReservaService.updateObservacionesEntrega,
      ).toHaveBeenCalledWith(1, observacionExtensa);
    });
  });
});
