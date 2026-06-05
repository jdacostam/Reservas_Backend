import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class restablecerPasswordDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  cedula: string;

  @IsNotEmpty()
  @IsString()
  nuevaPassword: string;
}
