import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../../database/Entidades/usuario.entity';
import { UsuarioController } from './controladores/usuario.controller';
import { usuarioService } from './servicios/usuario.services';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [UsuarioController],
  providers: [usuarioService],
  exports: [usuarioService],
})
export class UsuarioModule {}
