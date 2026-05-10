# Guia Definitiva: Documentando tu API con Scalar (Paso a Paso)

Esta guia contiene todo lo que necesitas hacer para transformar una API de NestJS "muda" en una documentacion interactiva y profesional, lista para ser compartida en la web.

---

## 1. Instalacion de herramientas
Para que nuestro proyecto tenga documentación, base de datos y sea visible en la web, instalaremos estas herramientas.

### A. Dependencias del Proyecto
Ejecuta esto dentro de la carpeta del proyecto:

```bash
cd "practica 1"

# Instalacion de librerias
npm install @nestjs/swagger @scalar/nestjs-api-reference @nestjs/typeorm typeorm sqlite3
```

**¿Para que sirve cada una? (Explicación para la clase):**
*   **`@nestjs/swagger`**: Es el "cerebro" que genera el archivo `api.json`. Lee nuestro código y crea la especificación técnica automáticamente.
*   **`@scalar/nestjs-api-reference`**: Es el "diseñador". Toma los datos de Swagger y crea la interfaz visual moderna que vamos a usar para probar la API.
*   **`@nestjs/typeorm` & `typeorm`**: Es el "traductor" de base de datos. Nos permite hablar con la base de datos usando código TypeScript (Objetos) en lugar de consultas SQL complicadas.
*   **`sqlite3`**: Es el "motor" de la base de datos. Una base de datos real, ligera y que no requiere servidor externo (guarda todo en un archivo local).

### B. Herramienta de Tunel (Cloudflare)
Esto sirve para que tu `localhost` sea visible desde internet.

```bash
# Instalar de forma global en tu computadora
npm install -g @cloudflare/cloudflared
```
*   **`cloudflared`**: Es como un "teletransportador". Crea una URL pública que apunta directamente a tu puerto 3000 local para que Scalar Cloud pueda ver tu API.

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
  .setVersion('1.0') // Puedes subir esto (1.1, 2.0) para probar el versionado en Scalar
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
Los decoradores le dicen a Scalar exactamente qué mostrar y cómo probarlo.

### Diccionario de Decoradores:
*   **`@ApiTags('Nombre')`**: Agrupa rutas bajo un titulo (ej: "Usuarios", "Perros").
*   **`@ApiOperation({ summary: '...' })`**: Es el título descriptivo de cada endpoint.
*   **`@ApiResponse({ status: 200, description: '...' })`**: Documenta qué respuesta esperar (éxito o error).
*   **`@ApiParam({ name: 'id', example: 1 })`**: Explica qué es la variable que va en la URL (ej: `:id`).
*   **`@ApiProperty()`**: **(Muy importante en los DTOs)**. Define los campos que el usuario debe enviar en un `POST` o `PUT` (ej: nombre, edad).

### Ejemplo de CRUD Completo:
```typescript
@ApiTags('Base de Datos Local')
@Controller('internal-dogs')
export class DogsController {

  @Post()
  @ApiOperation({ summary: 'Crear nuevo perro' })
  @ApiResponse({ status: 201, description: 'Perro guardado en SQLite' })
  create(@Body() createDogDto: CreateDogDto) { ... }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar perro por ID' })
  @ApiParam({ name: 'id', description: 'ID del perro en la DB', example: 5 })
  update(@Param('id') id: string, @Body() updateDogDto: UpdateDogDto) { ... }
}
```

---

## 4. El puente a la Web: Cloudflare Tunnel
Cuando ya tengas tu server corriendo (`npm run start:dev`):

1. Abre una terminal nueva.
2. Ejecuta: `cloudflared tunnel --url http://localhost:3000`
3. **Busca la URL que termina en `.trycloudflare.com`** y cópiala.

---

## 5. Scalar Cloud: Gestion, Servidores y Versionado

### Paso A: Importar tu API
1. Abre `http://localhost:3000/api-json-json` en tu navegador.
2. **Click derecho -> Guardar como** -> `openapi.json`.
3. Sube ese archivo a [dashboard.scalar.com](https://dashboard.scalar.com).

### Paso B: Configurar Servidores (Multi-servidor)
Scalar permite tener varios servidores para una misma API:
1. En el Dashboard, ve a la sección de **"Servers"**.
2. Verás que está el `localhost:3000`.
3. Dale a **"Add Server"** y pega tu URL de **Cloudflare**.
4. ¡Ahora en la documentación web podrás elegir entre probarlo localmente o mediante el túnel!

### Paso C: Gestionar Versiones
Si haces un cambio importante (ej: añades un nuevo campo a los perros):
1. Cambia el `.setVersion('1.1')` en tu `main.ts`.
2. Descarga el nuevo JSON.
3. En el Dashboard ve a **"Versions"** -> **"Upload Version"**.
4. Esto permite que los desarrolladores vean qué ha cambiado entre la v1.0 y la v1.1.

---

## 6. Generar el Codigo (SDK)
En la interfaz de Scalar:
1. Selecciona un endpoint (ej: `POST /internal-dogs`).
2. Mira el panel derecho en la sección **"Code"**.
3. Elige **"JavaScript -> Fetch"**.
4. **Explicación:** "Miren, Scalar nos da el código exacto que necesitamos poner en nuestro Frontend para que esta petición funcione. No hay que adivinar las cabeceras ni la estructura".
