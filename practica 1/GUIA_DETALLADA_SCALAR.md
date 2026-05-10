# Guia Definitiva: Documentando tu API con Scalar (Paso a Paso)

Esta guia contiene todo lo que necesitas hacer para transformar una API de NestJS "muda" en una documentacion interactiva y profesional, lista para ser compartida en la web.

---

## 1. Instalacion de herramientas
Necesitamos librerias para Swagger (generador), Scalar (visualizador) y la Base de Datos (SQLite).

```bash
cd "practica 1"

# Instalacion de librerias de NestJS
npm install @nestjs/swagger @scalar/nestjs-api-reference @nestjs/typeorm typeorm sqlite3
```

---

## 2. Configurar el "Cerebro" (main.ts)
Abre `src/main.ts`. Aqui configuraremos Swagger para que escanee tu codigo y genere un archivo JSON.

```typescript
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

// ... dentro de bootstrap() ...

const config = new DocumentBuilder()
  .setTitle('API de Perros Pro - Mi Practica')
  .setDescription('Gestion de perros con SQLite, POST, PUT y Scalar Cloud')
  .setVersion('1.0') // Aqui puedes cambiar la version para Scalar Cloud
  .build();

const document = SwaggerModule.createDocument(app, config);

// Ruta para ver el JSON crudo (muy importante)
SwaggerModule.setup('api-json', app, document);

// Activamos la interfaz de Scalar en la ruta local /docs
app.use('/docs', apiReference({ 
  content: document,
  theme: 'purple' 
}));
```

---

## 3. Darle vida a los Controladores (Decoradores)
Los decoradores le dicen a Scalar qué mostrar. 

### Diccionario de Decoradores:
*   `@ApiTags('Nombre')`: Agrupa rutas bajo un titulo.
*   `@ApiOperation({ summary: '...' })`: Titulo corto del endpoint.
*   `@ApiResponse({ status: 200, description: '...' })`: Lo que devuelve la API.
*   `@ApiParam({ name: 'id', example: 1 })`: Explica variables en la URL.
*   `@ApiProperty()`: **(Usa esto en los DTOs)** para que Scalar sepa qué campos enviar en el Body.

### Ejemplo de CRUD Completo:
```typescript
@ApiTags('Base de Datos')
@Controller('internal-dogs')
export class DogsController {

  @Post()
  @ApiOperation({ summary: 'Crear nuevo perro' })
  create(@Body() createDogDto: CreateDogDto) { ... }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar perro' })
  @ApiParam({ name: 'id', example: 5 })
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) { ... }
}
```

---

## 4. El puente a la Web: Cloudflare Tunnel
Si quieres que Scalar Cloud (en internet) vea tu computadora local, necesitas un tunel.

### Paso A: Instalar Cloudflare (Solo la primera vez)
```bash
# Si tienes permisos de administrador:
npm install -g @cloudflare/cloudflared
```

### Paso B: Iniciar el Tunel
```bash
cloudflared tunnel --url http://localhost:3000
```
**Copia la URL que te genere**, sera algo como: `https://palabras-aleatorias.trycloudflare.com`.

---

## 5. Scalar Cloud: Gestion y Versionado

### Paso A: Importar tu API
1. Levanta tu server (`npm run start:dev`).
2. Ve a `http://localhost:3000/api-json-json` y **guarda el JSON** como `openapi.json`.
3. Sube ese archivo a [dashboard.scalar.com](https://dashboard.scalar.com).

### Paso B: Cambiar el Servidor (Para que funcione en la web)
Por defecto Scalar Cloud querra usar `localhost:3000`, pero eso no funciona en internet.
1. En tu Dashboard de Scalar, busca la seccion de **"Servers"**.
2. Añade un nuevo servidor con la **URL de Cloudflare** que generaste en el punto 4.
3. ¡Ahora ya puedes probar los botones de "Send" desde cualquier lugar!

### Paso C: Gestionar Versiones
Si cambias tu codigo (añades un campo o un endpoint):
1. Vuelve a descargar el JSON de tu `localhost`.
2. En Scalar Dashboard, ve a la seccion de **"Versions"**.
3. Haz clic en **"Upload Version"** y sube el nuevo JSON.
4. Scalar mantendra el historial y actualizara la documentacion automaticamente.

---

## 6. Generar el Codigo (SDK)
En tu documentacion de Scalar:
1. Elige un endpoint (ej: `POST /internal-dogs`).
2. Mira el panel derecho -> Seccion **"Code"**.
3. Elige **"JavaScript -> Fetch"**.
4. ¡Ahi tienes el codigo listo para pegar en tu Frontend!
