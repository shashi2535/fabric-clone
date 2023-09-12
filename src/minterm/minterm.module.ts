import { Module } from '@nestjs/common';
import { MintermController } from './minterm.controller';
import { MintermService } from './minterm.service';

@Module({
  imports: [],
  controllers: [MintermController],
  providers: [MintermService],
})
export class MintermModule {}
