import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PortController } from './port.controller';
import { PortService } from './port.service';
@Module({
  imports: [],
  controllers: [PortController],
  providers: [PortService],
})
export class Portmodule {}
