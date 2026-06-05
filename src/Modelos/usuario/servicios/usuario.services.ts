import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from 'src/database/Entidades/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { crearLoginDto } from '../dto/login.dto';
import {
  crearUsuarioDto,
  actualizarUsuarioDto,
} from '../dto/usuario.dto';
import { restablecerPasswordDto } from '../dto/restablecer-password.dto';

@Injectable()
export class usuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) { }

  /**
   * Método de prueba simple para verificar la inyección de dependencias y la conexión del servicio.
   * @returns Un mensaje de texto básico.
   */
  prueba(): string {
    return 'Mi primer servicio';
  }

  /**
   * Autentica un usuario en el sistema verificando sus credenciales.
   * @param data DTO con el correo electrónico y la contraseña a validar.
   * @returns Objeto con el código de estado, datos del usuario autenticado si es exitoso o mensaje de error.
   */
  async login(data: crearLoginDto) {
    try {
      const user = await this.usuarioRepo.findOne({
        where: { email: data.email },
      });

      if (!user) {
        return {
          statusCode: 404,
          message: 'Correo no registrado, por favor regístrese',
        };
      }

      const passwordValida = await bcrypt.compare(data.password, user.password);
      if (!passwordValida) {
        return {
          statusCode: 404,
          message: 'Correo o contraseña incorrectos',
        };
      }

      return {
        statusCode: 200,
        user: user,
        Response: true,
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Interno',
      };
    }
  }

  /**
   * Crea un nuevo usuario en la base de datos, encriptando su contraseña con bcrypt.
   * @param data DTO con los datos del nuevo usuario.
   * @returns Objeto indicando el estado de la creación o si el usuario ya existe.
   */
  async crearUsuario(data: crearUsuarioDto) {
    try {
      const user = await this.usuarioRepo.find({
        where: [{ email: data.email }],
      });

      if (user.length > 0) {
        return {
          statusCode: 200,
          message: 'Usuario ya existe',
        };
      } else {
        const passwordHasheada = await bcrypt.hash(data.password, 10);
        const nuevoUsuario = this.usuarioRepo.create({
          ...data,
          password: passwordHasheada,
        });
        return {
          statusCode: 201,
          message: 'Usuario creado',
          response: await this.usuarioRepo.save(nuevoUsuario),
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Interno',
      };
    }
  }

  /**
   * Restablece la contraseña de un usuario mediante el hasheo de la nueva contraseña con bcrypt.
   * @param data DTO con el correo electrónico y la nueva contraseña.
   * @returns Mensaje indicando éxito o que el usuario no fue encontrado.
   */
  async restablecerPassword(data: restablecerPasswordDto) {
    try {
      const user = await this.usuarioRepo.findOne({
        where: { email: data.email },
      });

      if (!user) {
        return {
          statusCode: 404,
          message: 'Usuario no encontrado',
        };
      }

      if (user.cedula !== data.cedula) {
        return {
          statusCode: 400,
          message: 'La cédula no coincide con el correo registrado',
        };
      }

      const passwordHasheada = await bcrypt.hash(data.nuevaPassword, 10);
      user.password = passwordHasheada;
      await this.usuarioRepo.save(user);

      return {
        statusCode: 200,
        message: 'Contraseña restablecida exitosamente',
      };
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Interno',
      };
    }
  }

  /**
   * Obtiene la lista completa de usuarios registrados.
   * @returns Un arreglo con todos los usuarios.
   */
  async consultarTodos() {
    return await this.usuarioRepo.find();
  }

  /**
   * Busca un usuario por su correo electrónico.
   * @param email Correo electrónico a buscar.
   * @returns El usuario encontrado o null si no se encuentra.
   */
  async consultarEmail(email: string) {
    return await this.usuarioRepo.findOne({ where: { email: email } });
  }

  /**
   * Actualiza la información de un usuario registrado, asegurando que el email no sea modificado.
   * @param email Correo electrónico actual del usuario.
   * @param data DTO con los datos a actualizar.
   * @returns Objeto indicando el estado de la actualización.
   */
  async actualizarUsuario(email: string, data: actualizarUsuarioDto) {
    try {
      const user = await this.usuarioRepo.findOne({
        where: { email: email },
      });
      if (user) {
        if (!data.email || data.email === email) {
          await this.usuarioRepo.merge(user, data);
          return {
            statusCode: 201,
            message: 'El usuario ha sido actualizado',
            response: await this.usuarioRepo.save(user),
          };
        } else {
          return {
            statusCode: 200,
            message: 'El email no es un campo editable',
          };
        }
      } else {
        return {
          statusCode: 200,
          message: 'Usuario no encontrado',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Interno',
      };
    }
  }

  /**
   * Elimina un usuario por su correo electrónico.
   * @param email Correo electrónico del usuario a eliminar.
   * @returns Mensaje de confirmación del estado del borrado.
   */
  async eliminarUsuario(email: string) {
    try {
      const user = await this.usuarioRepo.findOne({
        where: { email: email },
      });
      if (user) {
        await this.usuarioRepo.delete(user);
        return {
          statusCode: 202,
          message: 'El usuario ha sido eliminado',
        };
      } else {
        return {
          statusCode: 200,
          message: 'Usuario no encontrado',
        };
      }
    } catch (error) {
      return {
        statusCode: 500,
        message: 'Error Interno',
      };
    }
  }
}
