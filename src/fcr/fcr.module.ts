import { Module } from '@nestjs/common';
import { FcrController } from './fcr.controller';
import { FcrService } from './fcr.service';

@Module({
  imports: [],
  controllers: [FcrController],
  providers: [FcrService],
})
export class FcrModule {}
