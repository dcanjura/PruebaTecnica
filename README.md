# StockFlow — Angular 21 + Spring Boot

Aplicación full stack para administrar productos con autenticación JWT. Incluye
login, cierre de sesión, rutas protegidas y CRUD de productos con validaciones en
frontend y backend.

## Tecnologías

- Angular 21.1, TypeScript, formularios reactivos y Signals
- Java 21, Spring Boot 3.5, Spring Security y Spring Data JPA
- JWT firmado con HMAC y contraseñas cifradas con BCrypt
- SQL Server (MSSQL)
- JUnit 5, Mockito y Vitest

## Estructura

```text
.
├── backend/                   API REST Spring Boot
├── frontend/                  SPA Angular
└── database/
    └── create-database.sql    Creación de base, tablas y restricciones
```

## Requisitos

- Java JDK 21
- Maven 3.9 o superior
- Node.js 20.19 o superior
- npm 10 o superior
- Angular CLI 21
- SQL Server 2019 o superior

## 1. Crear la base de datos

Ejecuta `database/create-database.sql` desde SQL Server Management Studio,
Azure Data Studio o `sqlcmd`. El script puede ejecutarse más de una vez.

Ejemplo con `sqlcmd`:

```powershell
sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -C -i database/create-database.sql
```

## 2. Ejecutar el backend

Los valores por defecto esperan SQL Server en `localhost:1433`, usuario `sa` y
contraseña `YourStrong!Passw0rd`. Puedes sobrescribirlos con variables de entorno:

```powershell
cd backend
$env:DB_USERNAME="sa"
$env:DB_PASSWORD="tu-clave-de-sql-server"
$env:JWT_SECRET="un-secreto-base64-de-al-menos-32-bytes"
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

> Para un entorno real, no uses el secreto JWT ni la contraseña de ejemplo.
> El backend usa `ddl-auto=validate`: primero debe ejecutarse el script SQL.

Al iniciar por primera vez, el backend crea un usuario administrador con la
contraseña almacenada mediante BCrypt:

- Correo: `admin@demo.com`
- Contraseña: `Admin123!`

## 3. Ejecutar el frontend

En otra terminal:

```powershell
cd frontend
npm install
npm start
```

Abre `http://localhost:4200` e inicia sesión con las credenciales de demostración.

## API

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | Público | Autentica y devuelve un JWT |
| POST | `/api/auth/register` | Público | Registra un usuario con rol `USER` |
| GET | `/api/products` | USER/ADMIN | Lista productos |
| GET | `/api/products/{id}` | USER/ADMIN | Obtiene un producto |
| POST | `/api/products` | USER/ADMIN | Crea un producto |
| PUT | `/api/products/{id}` | USER/ADMIN | Actualiza un producto |
| DELETE | `/api/products/{id}` | USER/ADMIN | Elimina un producto |

Ejemplo de login:

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@demo.com",
  "password": "Admin123!"
}
```

Usa el token devuelto en los endpoints protegidos:

```http
Authorization: Bearer <token>
```

## Seguridad implementada

- Contraseñas cifradas con BCrypt; nunca se devuelven desde la API.
- JWT con expiración configurable y validación en cada petición.
- API sin sesión de servidor (`STATELESS`).
- Autorización por roles `USER` y `ADMIN`.
- CORS limitado a `http://localhost:4200`.
- Guard de Angular para rutas privadas.
- Interceptor que agrega el token y cierra la sesión ante respuestas 401.
- Validaciones equivalentes en ambos lados y restricciones `CHECK` en SQL Server.

## Pruebas y compilación

```powershell
cd backend
mvn test

cd ../frontend
npm test -- --watch=false
npm run build
```

Estado verificado del proyecto:

- Backend: 2 pruebas aprobadas.
- Frontend: 1 prueba aprobada.
- Build de producción Angular: correcto.
