import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './enviroments';
import config from './config';
import { DatabaseModule } from './dataBase/database.module';
//import { UploadModule } from './Modelos/upload/upload.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsuarioModule } from './Modelos/usuario/usuario.module';
import { EspacioModule } from './Modelos/espacio/espacio.module';
import { ReservaModule } from './Modelos/reserva/reserva.module';
import { Material } from './database/Entidades/material.entity';
import { MaterialModule } from './Modelos/material/material.module';
import { Reserva } from './database/Entidades/reserva.entity';
import { ReservaMaterialModule } from './Modelos/reservaMaterial/reservaMaterial.module';
import { Calendario } from './database/Entidades/calendario.entity';
import { CalendarioModule } from './Modelos/calendario/calendario.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV] || '.dev.env',
      load: [config],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'Uploads'), // path to the static files
      serveRoot: '/uploads', // route to serve the static files
    }),
    DatabaseModule,
    UsuarioModule,
    EspacioModule,
    ReservaModule,
    MaterialModule,
    ReservaMaterialModule,
    CalendarioModule,
    //UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}