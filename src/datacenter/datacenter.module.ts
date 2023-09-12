import { Module } from '@nestjs/common';
import { DatacenterController } from './datacenter.controller';
import { DataceterService } from './datacenter.service';

@Module({
  imports: [],
  controllers: [DatacenterController],
  providers: [DataceterService],
})
export class DatacenterModule {}
