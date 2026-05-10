// Test de humo: verifica que el módulo principal de la app se puede compilar correctamente.
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('debería estar definido', () => {
    expect(app).toBeDefined();
  });
});

