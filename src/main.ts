// Punto de entrada de la app. Configura Swagger (genera el openapi.json) y Scalar (muestra la UI de docs).
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Dog API - Wrapper NestJS')
    .setDescription(
      `API REST que consume **TheDogAPI** y **Dog.CEO** para exponer endpoints de razas de perros e imágenes.

## Módulos disponibles
- **Razas (TheDogAPI)** — Listar, buscar y consultar razas por ID
- **Imágenes (TheDogAPI)** — Imágenes aleatorias y por raza
- **Dog.CEO** — Imágenes adicionales, sub-razas y listado completo`,
    )
    .setVersion('1.0')
    .setContact('Tu Nombre', '', 'tu@email.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Servidor local de desarrollo')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-json', app, document);

  app.use('/docs', apiReference({ content: document, theme: 'purple' }));

  await app.listen(3000);
  console.log('Aplicación corriendo en:     http://localhost:3000');
  console.log('Documentación Scalar en:     http://localhost:3000/docs');
  console.log('OpenAPI JSON en:             http://localhost:3000/api-json-json');
}
bootstrap();