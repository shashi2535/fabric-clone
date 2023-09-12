import { Module } from '@nestjs/common';
import { PodController } from './pod.controller';
import { PodService } from './pod.service';

@Module({
  imports: [],
  controllers: [PodController],
  providers: [PodService],
})
export class PodModule {}
