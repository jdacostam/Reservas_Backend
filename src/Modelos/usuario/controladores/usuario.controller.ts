import {
  Controller,
  Get,
  Post,
  Param,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { usuarioService } from '../servicios/usuario.services';
import {
  crearUsuarioDto,
  actualizarUsuarioDto,
} from '../dto/usuario.dto';
import { crearLoginDto } from '../dto/login.dto';
import { restablecerPasswordDto } from '../dto/restablecer-password.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private usuarioService: usuarioService) {}

  /**
   * Método de prueba para verificar que el controlador y servicio estén funcionando correctamente.
   * @returns Un mensaje de saludo simple.
   */
  @Get('prueba')
  findAll(): string {
    return this.usuarioService.prueba();
  }

  /**
   * Crea un nuevo usuario en el sistema.
   * @param data Datos del usuario a crear.
   * @returns El usuario creado con el estado correspondiente.
   */
  @Post('crearUsuario')
  @UsePipes(new ValidationPipe())
  async crearUsuario(@Body() data: crearUsuarioDto) {
    return await this.usuarioService.crearUsuario(data);
  }

  /**
   * Obtiene la lista completa de todos los usuarios registrados.
   * @returns Una lista de usuarios.
   */
  @Get('consultarUsuarios')
  async consultarUsuarios() {
    return await this.usuarioService.consultarTodos();
  }

  /**
   * Obtiene la información de un usuario específico a través de su correo electrónico.
   * @param email Correo electrónico del usuario a consultar.
   * @returns El usuario encontrado o null si no existe.
   */
  @Get('consultarEmail/:email')
  async consultarEmail(@Param('email') email: string) {
    return await this.usuarioService.consultarEmail(email);
  }

  /**
   * Actualiza los datos de un usuario existente identificado por su correo electrónico.
   * @param email Correo electrónico del usuario.
   * @param data Datos actualizados.
   * @returns El resultado de la actualización.
   */
  @Put('actualizarUsuario/:email')
  @UsePipes(new ValidationPipe())
  async actualizarUsuario(
    @Param('email') email: string,
    @Body() data: actualizarUsuarioDto,
  ) {
    return await this.usuarioService.actualizarUsuario(email, data);
  }

  /**
   * Elimina un usuario del sistema a partir de su correo electrónico.
   * @param email Correo electrónico del usuario a eliminar.
   * @returns El estado de la operación de eliminación.
   */
  @Delete('eliminarUsuario/:email')
  @UsePipes(new ValidationPipe())
  async eliminarUsuario(@Param('email') email: string) {
    return await this.usuarioService.eliminarUsuario(email);
  }

  /**
   * Autentica a un usuario en el sistema.
   * @param data Credenciales de inicio de sesión (email y contraseña).
   * @returns La respuesta de éxito con los datos del usuario o un mensaje de error.
   */
  @Post('login')
  @UsePipes(new ValidationPipe())
  login(@Body() data: crearLoginDto) {
    return this.usuarioService.login(data);
  }

  /**
   * Permite restablecer la contraseña de un usuario mediante su correo electrónico.
   * @param data DTO con el correo electrónico y la nueva contraseña.
   * @returns El resultado de la operación.
   */
  @Put('restablecerPassword')
  @UsePipes(new ValidationPipe())
  async restablecerPassword(@Body() data: restablecerPasswordDto) {
    return await this.usuarioService.restablecerPassword(data);
  }
}