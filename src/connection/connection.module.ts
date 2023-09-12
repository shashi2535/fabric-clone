import { Module } from '@nestjs/common';
import { ConnectionController } from './connection.controller';
import { ConnectionService } from './connection.service';

@Module({
  imports: [],
  controllers: [ConnectionController],
  providers: [ConnectionService],
})
export class ConnectionModule {}
