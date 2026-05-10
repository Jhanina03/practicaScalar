import { Module } from '@nestjs/common';
import { BreedsModule } from './breeds/breeds.module';
import { ImagesModule } from './images/images.module';
import { FactsModule } from './facts/facts.module';

@Module({
  imports: [BreedsModule, ImagesModule, FactsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
