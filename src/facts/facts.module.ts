import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FactsController } from './facts.controller';
import { FactsService } from './facts.service';

@Module({
  imports: [HttpModule],
  controllers: [FactsController],
  providers: [FactsService],
})
export class FactsModule {}
