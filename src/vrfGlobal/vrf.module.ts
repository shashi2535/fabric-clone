import { Module } from '@nestjs/common';
import { VrfService } from './vrf.service';
import { VrfGlobalController } from './vrfGlobal.controller';

@Module({
  imports: [],
  controllers: [VrfGlobalController],
  providers: [VrfService],
})
export class VrfModule {}
