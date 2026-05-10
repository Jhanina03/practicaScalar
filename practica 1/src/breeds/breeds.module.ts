import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BreedsController } from './breeds.controller';
import { BreedsService } from './breeds.service';

@Module({
  imports: [HttpModule],
  controllers: [BreedsController],
  providers: [BreedsService],
})
export class BreedsModule {}
