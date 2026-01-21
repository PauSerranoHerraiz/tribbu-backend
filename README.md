# Tribbu · Backend

Backend de **Tribbu**, una aplicación web para crear, organizar y compartir planes en grupo de forma sencilla y humana.

Este proyecto expone una **API REST** responsable de la autenticación, la lógica de negocio y la persistencia de datos, diseñada para ser clara, escalable y fácil de mantener.

---

## Stack tecnológico

- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JSON Web Tokens (JWT)** - Autenticación segura
- **Firebase Admin** - Autenticación con Google
- **Nodemailer** - Envío de emails
- **Bcrypt** - Hash de contraseñas
- **Dotenv** - Gestión de variables de entorno
- **Nodemon** - Recarga automática en desarrollo

---

## Instalación y ejecución


### Pasos de instalación

```bash
# Clonar el repositorio
git clone <repo-url>

# Acceder a la carpeta del backend
cd tribbu-backend

# Instalar dependencias
npm install

# Crear archivo .env con las variables necesarias
cp .env.example .env

# Iniciar servidor en modo desarrollo
npm run dev
```

El servidor estará disponible en `https://tribbu-backend.vercel.app`

---




## Estructura del proyecto

```
tribbu-backend/
├── db/                      # Conexión a MongoDB
├── models/                  # Esquemas Mongoose
│   ├── User.model.js
│   ├── Tribbu.model.js
│   ├── Event.model.js
│   ├── Child.model.js
│   └── Invitation.model.js
├── routes/                  # Rutas de la API
│   ├── auth.routes.js
│   ├── tribbu.routes.js
│   ├── events.routes.js
│   ├── children.routes.js
│   ├── user.routes.js
│   └── index.routes.js
├── middleware/              # Middlewares personalizados
│   ├── jwt.middleware.js    # Autenticación JWT
│   └── auth.middleware.js   # Control de roles
├── services/                # Servicios externos
│   └── firebaseAdmin.js
├── utils/                   # Utilidades
│   └── mailer.js
├── error-handling/          # Manejo global de errores
├── config/                  # Configuración de la app
├── app.js                   # Archivo principal
└── package.json
```

---

## Autenticación

El sistema utiliza **JWT** para autenticar las peticiones. El token debe enviarse en el header:

```
Authorization: Bearer <token>
```

### Rutas de autenticación
- `POST /auth/signup` - Registro de usuario
- `POST /auth/login` - Login con email/contraseña
- `POST /auth/google` - Login con Google OAuth
- `GET /auth/verify` - Verificar token válido

---

## Roles y permisos

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **GUARDIÁN** | Padre/Madre | Crear/editar/eliminar tribbu, invitar miembros, gestionar eventos |
| **PROTECTOR** | Tutor/Cuidador | Crear/editar eventos, ver información |
| **SABIO** | Familia extendida | Ver información, crear eventos |
| **CACHORRO** | Niño | Solo lectura |

---

## Principales endpoints

### Tribbus
- `POST /api/tribbus` - Crear tribbu
- `GET /api/tribbus` - Obtener todas las tribbus
- `GET /api/tribbus/user/my-tribbus` - Mis tribbus (autenticado)
- `GET /api/tribbus/:tribbuId` - Detalle de una tribbu
- `PUT /api/tribbus/:tribbuId` - Actualizar tribbu
- `DELETE /api/tribbus/:tribbuId` - Eliminar tribbu

### Eventos
- `POST /api/events` - Crear evento (autenticado)
- `GET /api/events` - Listar eventos
- `GET /api/events/:eventId` - Detalle del evento
- `PUT /api/events/:eventId` - Actualizar evento (autenticado, rol requerido)
- `DELETE /api/events/:eventId` - Eliminar evento

### Niños
- `POST /api/children` - Añadir niño a una tribbu (autenticado)
- `GET /api/tribbu/:tribbuId/children` - Niños de una tribbu (autenticado)
- `GET /api/children/:childId` - Detalle del niño (autenticado)
- `PUT /api/children/:childId` - Actualizar niño (autenticado, rol requerido)
- `DELETE /api/children/:childId` - Eliminar niño

### Usuarios
- `GET /api/users/search?email=...` - Buscar usuarios por email (autenticado)
- `GET /api/users` - Listar todos los usuarios

---

## Modelos de datos

### User
```javascript
{
  email: String (único, minúsculas),
  password: String (hasheada con bcrypt),
  name: String,
  tribbuId: ObjectId (ref: Tribbu),
  createdAt: Date,
  updatedAt: Date
}
```

### Tribbu
```javascript
{
  name: String,
  ownerId: ObjectId (ref: User),
  members: [{
    userId: ObjectId (ref: User),
    role: String (GUARDIÁN | PROTECTOR | SABIO | CACHORRO)
  }],
  children: [ObjectId] (ref: Child),
  createdAt: Date,
  updatedAt: Date
}
```

### Event
```javascript
{
  tribbuId: ObjectId (ref: Tribbu),
  title: String,
  start: Date,
  end: Date,
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  completed: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Child
```javascript
{
  tribbuId: ObjectId (ref: Tribbu),
  name: String,
  birthDate: Date,
  notes: String,
  role: String (default: CACHORRO),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Troubleshooting

### Error de conexión a MongoDB
Verifica que MongoDB esté ejecutándose y que la URI en `.env` sea correcta:
```bash
# Mac con Homebrew
brew services start mongodb-community
```

### Error de autenticación JWT
Asegúrate de que:
- El token esté en el header `Authorization: Bearer <token>`
- El token no esté expirado
- La variable `TOKEN_SECRET` en `.env` sea la correcta

### Error en envío de emails
Verifica las credenciales SMTP en `.env` y que tengas habilitada la autenticación de apps en Gmail.

---

## Scripts disponibles

```bash
npm run dev     # Inicia el servidor en modo desarrollo (con nodemon)
npm start       # Inicia el servidor en modo producción
npm test        # Ejecuta los tests (si están configurados)
```

---

## Autor

**Pau Serrano Herraiz** - Junior Full Stack Developer

- 🔗 [GitHub](https://github.com/PauSerranoHerraiz/)
- 🔗 [LinkedIn](https://www.linkedin.com/in/pau-serrano-herraiz-a1785384/)