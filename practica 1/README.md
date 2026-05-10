# Dog API - NestJS + Swagger + Scalar

Proyecto de demostración de documentación automática de APIs REST usando:
- NestJS - Framework de Node.js
- @nestjs/swagger - Genera el archivo openapi.json automáticamente
- @scalar/nestjs-api-reference - Renderiza la documentación con interfaz visual

---

## Como funciona?

```
Tu código NestJS
  │
  │  Decoradores: @ApiTags, @ApiOperation, @ApiResponse...
  │
  ▼
@nestjs/swagger  ← Lee los decoradores y genera openapi.json
  │
  ├──> /api-json-json  -> Archivo OpenAPI (JSON crudo)
  │
  └──> /docs           -> Scalar UI (interfaz visual bonita)
```

La librería lee los decoradores que pones en el código y genera el archivo de documentación automáticamente. No tienes que escribir el JSON a mano.

---

## Requisitos previos

- Node.js v18 o superior
- npm (viene con Node.js)

Verifica con:
```bash
node -v
npm -v
```

---

## Instalacion (desde cero)

### 1. Clonar el repositorio
```bash
git clone <URL-DEL-REPO>
cd scalar-api-test
cd "practica 1"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Arrancar el servidor
```bash
npm run start:dev
```

Deberías ver en la terminal:
```
Aplicación corriendo en:     http://localhost:3000
Documentación Scalar en:     http://localhost:3000/docs
OpenAPI JSON en:             http://localhost:3000/api-json-json
```

---

## URLs disponibles

| URL | Descripción |
|-----|-------------|
| http://localhost:3000/docs | Interfaz Scalar - documentación visual |
| http://localhost:3000/api-json-json | OpenAPI JSON crudo - para importar a otras herramientas |
| http://localhost:3000/breeds | Endpoint de razas (API) |
| http://localhost:3000/images/random | Imagen aleatoria (API) |
| http://localhost:3000/dogs/breeds | Listado dog.ceo (API) |

> Nota: http://localhost:3000 solo muestra un 404 - eso es normal, no hay ruta en la raíz.

---

## Endpoints disponibles

### Razas de Perros (/breeds) - TheDogAPI
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /breeds | Listar todas las razas (paginado) |
| GET | /breeds/search?q=labrador | Buscar raza por nombre |
| GET | /breeds/:id | Obtener raza por ID numérico |

### Imagenes (/images) - TheDogAPI
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /images/random | Una imagen aleatoria |
| GET | /images/random/5 | 5 imágenes aleatorias |
| GET | /images/breed/1 | Imágenes de la raza con ID 1 |
| GET | /images/:imageId | Imagen por ID de cadena |

### Dog.CEO (/dogs)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /dogs/image/random | Imagen aleatoria |
| GET | /dogs/image/random/10 | 10 imágenes aleatorias |
| GET | /dogs/breeds | Todas las razas con conteo total |
| GET | /dogs/breeds/labrador/images | Imágenes de la raza "labrador" |
| GET | /dogs/breeds/bulldog/french/images | Imágenes sub-raza bulldog francés |

---

## Usar la interfaz de Scalar (local)

1. Arranca el servidor: npm run start:dev
2. Abre en el browser: http://localhost:3000/docs
3. Navega por los endpoints en el sidebar izquierdo
4. Haz clic en un endpoint -> aparecen los detalles
5. Clic en "Test Request" -> puedes probar el endpoint en vivo

---

## Subir documentación a Scalar Cloud

Para compartir la documentación en línea (sin necesitar que el server esté corriendo):

### Opción A - Subir archivo JSON
1. Con el servidor corriendo, ve a: http://localhost:3000/api-json-json
2. Presiona Ctrl + S -> guarda como openapi.json
3. Ve a dashboard.scalar.com
4. Clic en "Import API" -> botón { } OpenAPI -> selecciona openapi.json
5. Clic en "Continue" -> ¡ya tienes URL pública!

### Opción B - Usar sandbox (sin cuenta)
1. Ve a sandbox.scalar.com
2. Borra el JSON de ejemplo (Ctrl+A, Delete)
3. Copia todo el contenido de http://localhost:3000/api-json-json
4. Pégalo en el editor (Ctrl+V)
5. Clic en "Preview" -> visualización inmediata

---

## Por que los decoradores generan la documentación?

Ejemplo de cómo funciona:

```typescript
// El decorador @ApiTags agrupa el endpoint en la UI
@ApiTags('Razas de Perros')
@Controller('breeds')
export class BreedsController {

  @Get()
  // @ApiOperation describe qué hace el endpoint
  @ApiOperation({ summary: 'Listar todas las razas' })
  // @ApiResponse documenta las respuestas posibles
  @ApiResponse({ status: 200, description: 'Lista de razas' })
  @ApiResponse({ status: 502, description: 'Error externo' })
  findAll() {
    return this.breedsService.findAll();
  }
}
```

@nestjs/swagger lee todos esos decoradores en tiempo de compilación y construye el openapi.json con toda esa información. ¡No tienes que escribirlo a mano!

---

### El servidor arranca pero localhost:3000 muestra 404
Es normal. No hay ruta en /. Ve directamente a:
- http://localhost:3000/docs para la documentación
- http://localhost:3000/breeds para la API
