# HealthHub — Sistema de Salud

Plataforma web full-stack para gestión de salud: red social médica, vademécum farmacológico, y panel de diagnóstico.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Node.js + Express 4.18 |
| Base de datos | MariaDB 10.4 (mysql2/promise) |
| Autenticación | JWT (jsonwebtoken) + bcryptjs |
| Frontend | Vanilla HTML/CSS/JS (sin frameworks) |
| Iconos | Font Awesome 6 (CDN) |
| CSS | 6 módulos con variables, glass morphism, gradientes |

## Estructura

```
farma/
├── src/
│   ├── index.js              # Servidor Express
│   ├── config/
│   │   ├── db.js             # Pool MySQL
│   │   ├── initDb.js         # Creación de tablas
│   │   ├── seedDb.js         # Datos semilla (6 usuarios, 20 medicamentos)
│   │   └── updateDb.js       # Migraciones
│   ├── controllers/          # Lógica de negocio
│   ├── models/               # Consultas SQL
│   ├── routes/               # Endpoints REST
│   └── middlewares/
│       └── auth.js           # JWT + RBAC (3 roles)
├── frontend/
│   ├── index.html            # Login / Registro
│   ├── dashboard.html        # Red social + perfil + bandeja médica
│   ├── farmacologia.html     # Vademécum farmacológico
│   ├── css/                  # 6 archivos modulares
│   └── js/                   # api.js, auth.js, app.js, farmacologia.js, validators.js
└── .env                      # Configuración
```

## Roles y permisos

| Rol | Capacidades |
|-----|------------|
| **Cliente** (Paciente) | Perfil de salud, análisis médicos, foro, favoritos, compartir medicamentos al dashboard |
| **Médico** | Todo lo de Cliente + diagnosticar pacientes, crear/editar/eliminar medicamentos, bandeja médica |
| **Administrador** | Control total: CRUD de usuarios, médicos, pacientes, medicamentos, posts, foros |

## Credenciales de prueba

| Usuario | Password | Rol |
|---------|----------|-----|
| `admin` | `Admin123!` | Administrador |
| `dr_garcia` | `Medico123!` | Médico (Cardiología) |
| `dr_lopez` | `Medico123!` | Médico (Endocrinología) |
| `paciente1` | `Paciente1!` | Cliente |
| `paciente2` | `Paciente2!` | Cliente |
| `paciente3` | `Paciente3!` | Cliente |

## Base de datos — 12 tablas

| Tabla | Descripción |
|-------|------------|
| `usuarios` | Cuentas con roles |
| `clientes` | Datos personales de pacientes |
| `medicos` | Especialidad y cédula profesional |
| `perfiles_salud` | Peso, altura, sangre, alergias |
| `analisis_medicos` | Exámenes de sangre con diagnóstico |
| `posts` | Diagnósticos médico → paciente |
| `foros` | Posts del foro comunitario |
| `foro_comentarios` | Comentarios en foros |
| `foro_medicamentos` | Medicamentos asociados a foros |
| `medicamentos` | Vademécum (20 fármacos con datos clínicos) |
| `medicamentos_favoritos` | Favoritos por usuario |
| `post_medicamentos` | Medicamentos en diagnósticos |

## API Endpoints

| Prefijo | Endpoints |
|---------|----------|
| `/api/auth` | `POST /register`, `POST /login`, `POST /logout`, `GET /me` |
| `/api/usuarios` | CRUD + search + profile |
| `/api/medicos` | CRUD |
| `/api/clientes` | GET, PUT |
| `/api/posts` | CRUD + `/cliente/:id` |
| `/api/foros` | CRUD + search + comentarios |
| `/api/perfiles-salud` | GET, PUT |
| `/api/analisis` | CRUD + diagnosis |
| `/api/medicamentos` | CRUD + search + categorías + stats + favoritos |

## Páginas

### 1. index.html — Login / Registro
- Panel de vidrio esmerilado con gradiente superior
- Validación client-side (validators.js)
- JWT almacenado en localStorage + cookies

### 2. dashboard.html — HealthHub Feed
- **Layout 3 columnas**: widgets izq + feed central + sugerencias/bandeja der
- **Foro comunitario**: crear posts, comentar, buscar
- **Perfil de salud**: editar datos personales, peso, sangre, análisis
- **Bandeja médica** (visible solo para Médico): preview de 3 pacientes pendientes, botón al panel completo
- **Tags de medicamentos**: al compartir desde farmacología, aparecen como tags en el formulario de publicación
- **Modal detalle medicamento**: click en tag → modal con info completa sin salir del dashboard

### 3. farmacologia.html — Vademécum Farmacológico
- **Hero**: gradiente azul profundo con decoraciones geométricas, título con texto degradado, stats bar (medicamentos, categorías, laboratorios)
- **Buscador integrado**: placeholder conversacional, búsqueda en 8 campos del medicamento, disclaimer de automedicación antes de buscar
- **Filtro por categoría**: dropdown con buscador interno y conteos por categoría
- **Lista paginada** (8 por página): filas con icono coloreado por categoría, nombre, laboratorio, descripción corta, dosis, badge de categoría, presentación
- **Favoritos**: botón ❤ en cada fila y en el modal. Botón "Mis Favoritos" con toggle para filtrar
- **Compartir al Dashboard**: botón ↗ en fila y modal. Toast de confirmación. Los medicamentos aparecen como tags en el formulario del foro
- **Modal detalle**: 2 columnas (info general + efectos/contraindicaciones), cabecera con gradiente, animación de entrada
- **CRUD** (Médico/Admin): agregar, editar, eliminar medicamentos con selector de ícono y color personalizado

## Comandos

```bash
# Iniciar
node src/index.js          # Producción
npm run dev                # Desarrollo con nodemon

# Base de datos
node src/config/initDb.js  # Crear tablas (primera vez)
node src/config/seedDb.js  # Insertar datos semilla
node src/config/updateDb.js # Migraciones
```

## Variables de entorno (.env)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sistema
JWT_SECRET=tu_secreto_jwt_aqui
JWT_EXPIRES_IN=24h
```

## Diseño visual

- **Glass morphism**: fondos semitransparentes con `backdrop-filter: blur`
- **Gradientes**: `linear-gradient(135deg, ...)` en botones, badges, cabeceras
- **Tarjetas**: bordes redondeados (12-24px), sombras suaves azules
- **Colores**: primario `#0ea5e9`, éxito `#22c55e`, warning `#f59e0b`, peligro `#ef4444`
- **Tipografía**: Inter (Google Fonts), pesos 400-800
- **Animaciones**: fadeIn, slideUp, slideDown, heartBeat, orbFloat, heroFloat
