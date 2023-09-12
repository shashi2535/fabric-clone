import { Module } from '@nestjs/common';
import { RegionController } from './region.controller';
import { RegionService } from './region.service';

@Module({
  imports: [],
  controllers: [RegionController],
  providers: [RegionService],
})
export class RegionModule {}
