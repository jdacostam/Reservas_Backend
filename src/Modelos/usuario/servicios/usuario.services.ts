import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from 'src/database/Entidades/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { crearLoginDto } from '../dto/login.dto';
import {
  crearUsuarioDto,
  actualizarUsuarioDto,
} from '../dto/usuario.dto';

@Injectable()
export class usuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  prueba(): string {
    return 'Mi primer servicio';
  }

  async login(data: crearLoginDto) {
    try {
      const user = await this.usuarioRepo.find({
        where: [{ email: data.email, password: data.password }],
      });
      if (user.length === 0) {
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
        
        const nuevoUsuario = this.usuarioRepo.create(data);
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

  async consultarTodos() {
    return await this.usuarioRepo.find();
  }

  async consultarEmail(email: string) {
    return await this.usuarioRepo.findOne({ where: { email: email } });
  }

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
