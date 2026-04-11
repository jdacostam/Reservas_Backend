import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';
import { usuarioService } from '../servicios/usuario.services';
import { crearUsuarioDto, actualizarUsuarioDto } from '../dto/usuario.dto';
import { crearLoginDto } from '../dto/login.dto';
import { TipoUsuario } from 'src/database/Entidades/usuario.entity';

describe('UsuarioController', () => {
  let controller: UsuarioController;
  let service: usuarioService;

  const mockUsuarioService = {
    prueba: jest.fn(),
    crearUsuario: jest.fn(),
    consultarTodos: jest.fn(),
    consultarEmail: jest.fn(),
    actualizarUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
      providers: [
        {
          provide: usuarioService,
          useValue: mockUsuarioService,
        },
      ],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
    service = module.get<usuarioService>(usuarioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar el mensaje de prueba', () => {
      const resultado = 'Mi primer servicio';
      mockUsuarioService.prueba.mockReturnValue(resultado);

      expect(controller.findAll()).toBe(resultado);
      expect(mockUsuarioService.prueba).toHaveBeenCalledTimes(1);
    });
  });

  describe('crearUsuario', () => {
    it('debe crear un nuevo usuario exitosamente', async () => {
      const createUserDto: crearUsuarioDto = {
        email: 'test@example.com',
        nombre: 'Test User',
        password: 'password123',
        cedula: '1234567890',
        tipo: TipoUsuario.Estudiante,
        codigoEstudiantil: 'EST001',
      };

      const expectedResponse = {
        statusCode: 201,
        message: 'Usuario creado',
        response: {
          id: 1,
          ...createUserDto,
        },
      };

      mockUsuarioService.crearUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.crearUsuario(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.crearUsuario).toHaveBeenCalledWith(createUserDto);
      expect(mockUsuarioService.crearUsuario).toHaveBeenCalledTimes(1);
    });

    it('debe retornar error cuando el usuario ya existe', async () => {
      const createUserDto: crearUsuarioDto = {
        email: 'existing@example.com',
        nombre: 'Existing User',
        password: 'password123',
        cedula: '1234567890',
        tipo: TipoUsuario.Profesor,
        codigoEstudiantil: '',
      };

      const expectedResponse = {
        statusCode: 200,
        message: 'Usuario ya existe',
      };

      mockUsuarioService.crearUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.crearUsuario(createUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.crearUsuario).toHaveBeenCalledWith(createUserDto);
    });

    it('debe manejar errores internos', async () => {
      const createUserDto: crearUsuarioDto = {
        email: 'test@example.com',
        nombre: 'Test User',
        password: 'password123',
        cedula: '1234567890',
        tipo: TipoUsuario.Externo,
        codigoEstudiantil: '',
      };

      const expectedResponse = {
        statusCode: 500,
        message: 'Error Interno',
      };

      mockUsuarioService.crearUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.crearUsuario(createUserDto);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('consultarUsuarios', () => {
    it('debe retornar todos los usuarios', async () => {
      const usuarios = [
        {
          id: 1,
          email: 'user1@example.com',
          nombre: 'User One',
          cedula: '1234567890',
          tipo: TipoUsuario.Estudiante,
        },
        {
          id: 2,
          email: 'user2@example.com',
          nombre: 'User Two',
          cedula: '0987654321',
          tipo: TipoUsuario.Profesor,
        },
      ];

      mockUsuarioService.consultarTodos.mockResolvedValue(usuarios);

      const result = await controller.consultarUsuarios();

      expect(result).toEqual(usuarios);
      expect(mockUsuarioService.consultarTodos).toHaveBeenCalledTimes(1);
    });

    it('debe retornar un array vacío cuando no hay usuarios', async () => {
      mockUsuarioService.consultarTodos.mockResolvedValue([]);

      const result = await controller.consultarUsuarios();

      expect(result).toEqual([]);
      expect(mockUsuarioService.consultarTodos).toHaveBeenCalledTimes(1);
    });
  });

  describe('consultarEmail', () => {
    it('debe retornar un usuario por email', async () => {
      const email = 'test@example.com';
      const usuario = {
        id: 1,
        email: email,
        nombre: 'Test User',
        cedula: '1234567890',
        tipo: TipoUsuario.Estudiante,
      };

      mockUsuarioService.consultarEmail.mockResolvedValue(usuario);

      const result = await controller.consultarEmail(email);

      expect(result).toEqual(usuario);
      expect(mockUsuarioService.consultarEmail).toHaveBeenCalledWith(email);
      expect(mockUsuarioService.consultarEmail).toHaveBeenCalledTimes(1);
    });

    it('debe retornar null cuando el usuario no existe', async () => {
      const email = 'noexiste@example.com';

      mockUsuarioService.consultarEmail.mockResolvedValue(null);

      const result = await controller.consultarEmail(email);

      expect(result).toBeNull();
      expect(mockUsuarioService.consultarEmail).toHaveBeenCalledWith(email);
    });
  });

  describe('actualizarUsuario', () => {
    it('debe actualizar un usuario exitosamente', async () => {
      const email = 'test@example.com';
      const updateUserDto: actualizarUsuarioDto = {
        nombre: 'Updated Name',
        password: 'newpassword123',
      };

      const expectedResponse = {
        statusCode: 201,
        message: 'El usuario ha sido actualizado',
        response: {
          id: 1,
          email: email,
          ...updateUserDto,
        },
      };

      mockUsuarioService.actualizarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.actualizarUsuario(email, updateUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.actualizarUsuario).toHaveBeenCalledWith(
        email,
        updateUserDto,
      );
      expect(mockUsuarioService.actualizarUsuario).toHaveBeenCalledTimes(1);
    });

    it('debe retornar error cuando el usuario no existe', async () => {
      const email = 'noexiste@example.com';
      const updateUserDto: actualizarUsuarioDto = {
        nombre: 'Updated Name',
      };

      const expectedResponse = {
        statusCode: 200,
        message: 'Usuario no encontrado',
      };

      mockUsuarioService.actualizarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.actualizarUsuario(email, updateUserDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.actualizarUsuario).toHaveBeenCalledWith(
        email,
        updateUserDto,
      );
    });

    it('debe retornar error cuando se intenta cambiar el email', async () => {
      const email = 'test@example.com';
      const updateUserDto: actualizarUsuarioDto = {
        email: 'newemail@example.com',
        nombre: 'Updated Name',
      };

      const expectedResponse = {
        statusCode: 200,
        message: 'El email no es un campo editable',
      };

      mockUsuarioService.actualizarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.actualizarUsuario(email, updateUserDto);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('eliminarUsuario', () => {
    it('debe eliminar un usuario exitosamente', async () => {
      const email = 'test@example.com';

      const expectedResponse = {
        statusCode: 202,
        message: 'El usuario ha sido eliminado',
      };

      mockUsuarioService.eliminarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.eliminarUsuario(email);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.eliminarUsuario).toHaveBeenCalledWith(email);
      expect(mockUsuarioService.eliminarUsuario).toHaveBeenCalledTimes(1);
    });

    it('debe retornar error cuando el usuario no existe', async () => {
      const email = 'noexiste@example.com';

      const expectedResponse = {
        statusCode: 200,
        message: 'Usuario no encontrado',
      };

      mockUsuarioService.eliminarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.eliminarUsuario(email);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.eliminarUsuario).toHaveBeenCalledWith(email);
    });

    it('debe manejar errores internos', async () => {
      const email = 'test@example.com';

      const expectedResponse = {
        statusCode: 500,
        message: 'Error Interno',
      };

      mockUsuarioService.eliminarUsuario.mockResolvedValue(expectedResponse);

      const result = await controller.eliminarUsuario(email);

      expect(result).toEqual(expectedResponse);
    });
  });

  describe('login', () => {
    it('debe realizar login exitosamente con credenciales correctas', async () => {
      const loginDto: crearLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        statusCode: 200,
        user: [
          {
            id: 1,
            email: 'test@example.com',
            nombre: 'Test User',
            tipo: TipoUsuario.Estudiante,
          },
        ],
        Response: true,
      };

      mockUsuarioService.login.mockReturnValue(expectedResponse);

      const result = controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.login).toHaveBeenCalledWith(loginDto);
      expect(mockUsuarioService.login).toHaveBeenCalledTimes(1);
    });

    it('debe retornar error con credenciales incorrectas', async () => {
      const loginDto: crearLoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const expectedResponse = {
        statusCode: 404,
        message: 'Correo o contraseña incorrectos',
      };

      mockUsuarioService.login.mockReturnValue(expectedResponse);

      const result = controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
      expect(mockUsuarioService.login).toHaveBeenCalledWith(loginDto);
    });

    it('debe manejar errores internos durante el login', async () => {
      const loginDto: crearLoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResponse = {
        statusCode: 500,
        message: 'Error Interno',
      };

      mockUsuarioService.login.mockReturnValue(expectedResponse);

      const result = controller.login(loginDto);

      expect(result).toEqual(expectedResponse);
    });
  });
});
