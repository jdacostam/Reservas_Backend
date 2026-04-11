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
  
  @Controller('usuario')
  export class UsuarioController {
    constructor(private usuarioService: usuarioService) {}
  
    @Get('prueba')
    findAll(): string {
      return this.usuarioService.prueba();
    }
  
    @Post('crearUsuario')
    @UsePipes(new ValidationPipe())
    async crearUsuario(@Body() data: crearUsuarioDto) {
      return await this.usuarioService.crearUsuario(data);
    }
  
    @Get('consultarUsuarios')
    async consultarUsuarios() {
      return await this.usuarioService.consultarTodos();
    }
  
    @Get('consultarEmail/:email')
    async consultarEmail(@Param('email') email: string) {
      return await this.usuarioService.consultarEmail(email);
    }
  
    @Put('actualizarUsuario/:email')
    @UsePipes(new ValidationPipe())
    async actualizarUsuario(
      @Param('email') email: string,
      @Body() data: actualizarUsuarioDto,
    ) {
      return await this.usuarioService.actualizarUsuario(email, data);
    }
  
    @Delete('eliminarUsuario/:email')
    @UsePipes(new ValidationPipe())
    async eliminarUsuario(@Param('email') email: string) {
      return await this.usuarioService.eliminarUsuario(email);
    }
  
    @Post('login')
    @UsePipes(new ValidationPipe())
    login(@Body() data: crearLoginDto) {
      return this.usuarioService.login(data);
    }
  }
  