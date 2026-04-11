import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsIn,
    ValidateIf,
    IsEnum,
  } from 'class-validator';
  import { PartialType } from '@nestjs/swagger';
import { TipoUsuario } from 'src/database/Entidades/usuario.entity';
  
  export class crearUsuarioDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @IsString()
    nombre: string;
  
    @IsNotEmpty()
    @IsString()
    password: string;
  
    @IsNotEmpty()
    @IsString()
    cedula: string;
  
    @IsNotEmpty()
    @IsEnum(TipoUsuario)
    tipo: TipoUsuario;
  
    @ValidateIf(o => o.tipo === 'Estudiante')
    @IsNotEmpty()
    @IsString()
    codigoEstudiantil: string;
  }
  
  export class actualizarUsuarioDto extends PartialType(crearUsuarioDto) {}
  