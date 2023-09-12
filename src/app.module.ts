import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { KnexModule } from 'nest-knexjs';
import { UserModule } from './login/user.module';
import { JwtModule } from '@nestjs/jwt';
import { RegionModule } from './region/region.module';
import { LoggerMiddleware } from 'src/middleware/token.middleware';
import { RegionController } from './region/region.controller';
import { MintermModule } from './minterm/minterm.module';
import { DatacenterModule } from './datacenter/datacenter.module';
import { join } from 'path';
import { PodModule } from './pod/pod.module';
import { Portmodule } from './port/port.module';
import { PortController } from './port/port.controller';
import { VrfModule } from './vrfGlobal/vrf.module';
import { FcrModule } from './fcr/fcr.module';
import { FcrController } from './fcr/fcr.controller';
import { ConnectionModule } from './connection/connection.module';
@Module({
  imports: [
    JwtModule.register({
      secret: 'iamuser',
    }),
    KnexModule.forRoot({
      config: {
        client: 'postgres',
        connection: {
          host: '127.0.0.1',
          user: 'postgres',
          password: '1234',
          database: 'fabric-nest',
        },
        migrations: {
          directory: join(__dirname, '../../migrations'),
          tableName: 'knex_migrations',
        },
      },
    }),
    UserModule,
    RegionModule,
    MintermModule,
    DatacenterModule,
    PodModule,
    Portmodule,
    VrfModule,
    FcrModule,
    ConnectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(RegionController, PortController, FcrController);
  }
}
