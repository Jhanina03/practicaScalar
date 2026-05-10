import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BreedsModule } from './breeds/breeds.module';
import { ImagesModule } from './images/images.module';
import { FactsModule } from './facts/facts.module';
import { DogsModule } from './dogs/dogs.module';

@Module({
  imports: [
    // Configuracion de la base de datos SQLite
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-crea las tablas (solo para desarrollo)
    }),
    BreedsModule, 
    ImagesModule, 
    FactsModule,
    DogsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
