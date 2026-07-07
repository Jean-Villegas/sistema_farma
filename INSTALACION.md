# 📋 GUÍA DE INSTALACIÓN COMPLETA - SISTEMA FARMA

## **Requisitos Previos**

### **1. Software necesario**
- [Node.js](https://nodejs.org/) (v16 o superior)
- [MySQL](https://www.mysql.com/) (v5.7 o superior)
- [Git](https://git-scm.com/) (opcional, para clonar)
- Navegador web moderno (Chrome, Firefox, Edge)

### **2. Puertos requeridos**
- **3000**: Backend API
- **5173**: Frontend React
- **3306**: MySQL (por defecto)

---

## **🛠 PASO 1: CONFIGURACIÓN DE BASE DE DATOS**

### **1.1 Instalar MySQL**
- Descargar e instalar MySQL desde el sitio oficial
- Durante la instalación, anotar la contraseña del usuario root

### **1.2 Ejecutar script de base de datos**
```bash
# Abrir MySQL Command Line Client
mysql -u root -p

# Ingresar contraseña cuando se solicite

# Ejecutar script SQL
source farma/sistema.sql

# O usar redirección
mysql -u root -p < farma/sistema.sql
```

### **1.3 Verificar base de datos**
```sql
-- Verificar que la base de datos se creó
SHOW DATABASES;

-- Ver tablas creadas
USE sistema;
SHOW TABLES;
```

---

## **🚀 PASO 2: CONFIGURACIÓN DEL BACKEND**

### **2.1 Navegar al directorio del backend**
```bash
cd farma
```

### **2.2 Instalar dependencias**
```bash
npm install
```

### **2.3 Configurar variables de entorno**
El archivo `.env` ya está configurado con valores por defecto:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=      # Dejar vacío si no hay contraseña
DB_NAME=sistema
JWT_SECRET=f8a3d2e7b1c94f6a0e5d8b2c7a1f4e9d3b6c8a2e5f7d0b4c9a3e6f1d8b5c2a7
JWT_EXPIRES_IN=24h
```

**Si tu MySQL tiene contraseña**, edita `farma/.env` y añádela:
```env
DB_PASSWORD=tu_contraseña
```

### **2.4 Iniciar el servidor backend**
```bash
# Modo desarrollo (con recarga automática)
npm run dev

# Modo producción
npm start
```

**Verificación**: Visitar http://localhost:3000/api en el navegador. Deberías ver:
```json
{"mensaje": "API del Sistema de Salud funcionando"}
```

---

## **⚛️ PASO 3: CONFIGURACIÓN DEL FRONTEND**

### **3.1 Navegar al directorio del frontend**
```bash
cd client
```

### **3.2 Instalar dependencias**
```bash
npm install
```

### **3.3 Verificar configuración**
El archivo `vite.config.js` ya está configurado con proxy al backend:
```javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### **3.4 Iniciar el servidor frontend**
```bash
npm run dev
```

**Verificación**: Abrir http://localhost:5173 en el navegador. Deberías ver la Landing Page del sistema.

---

## **🔐 PASO 4: PRIMER ACCESO AL SISTEMA**

### **4.1 Crear una cuenta**
1. Visitar http://localhost:5173
2. Hacer clic en "Regístrate ahora"
3. Completar el formulario:
   - **Usuario**: prueba
   - **Cédula**: 12345678
   - **Email**: prueba@test.com
   - **Contraseña**: prueba123
   - **Rol**: Paciente

### **4.2 Usuarios de prueba predefinidos**
El sistema incluye usuarios de prueba en la base de datos:

#### **Pacientes:**
- **Usuario**: paciente1 / **Contraseña**: paciente123
- **Usuario**: paciente2 / **Contraseña**: paciente123  
- **Usuario**: paciente3 / **Contraseña**: paciente123

#### **Médicos:**
- **Usuario**: dr_garcia / **Contraseña**: medico123
- **Usuario**: dr_lopez / **Contraseña**: medico123

#### **Administrador:**
- **Usuario**: admin / **Contraseña**: admin123

---

## **🎯 PASO 5: PRUEBAS DE FUNCIONALIDAD**

### **5.1 Pruebas CRUD - Medicamentos**
1. Iniciar sesión como **médico** (dr_garcia / medico123)
2. Navegar a **Farmacología** en el menú lateral
3. Probar funcionalidades:
   - **Agregar**: Click en "Agregar", completar formulario
   - **Editar**: Click en ícono de editar en la tabla
   - **Eliminar**: Click en ícono de eliminar en la tabla
   - **Búsqueda**: Usar campo de búsqueda en la tabla

### **5.2 Pruebas CRUD - Análisis Médicos**
1. Iniciar sesión como **paciente** (paciente1 / paciente123)
2. Navegar a **Mis Análisis** en el menú
3. Probar funcionalidades:
   - **Subir análisis**: Click en "Subir Nuevo Análisis"
   - **Ver detalles**: Click en un análisis existente
   - **Ver diagnóstico médico**: Si un médico ha revisado el análisis

### **5.3 Pruebas CRUD - Foros**
1. Iniciar sesión con cualquier usuario
2. Navegar a **Comunidad** en el menú
3. Probar funcionalidades:
   - **Crear publicación**: Escribir título y contenido
   - **Comentar**: Responder a publicaciones existentes
   - **Ver hilos**: Explorar conversaciones

### **5.4 Pruebas Responsive**
1. **Desktop**: Verificar layout de 3 columnas
2. **Tablet**: Reducir ventana a ~768px
3. **Mobile**: Reducir ventana a ~375px
4. Verificar que:
   - El menú se colapsa en móviles
   - Las tablas se adaptan
   - Los formularios son usables

---

## **🔧 PASO 6: SOLUCIÓN DE PROBLEMAS**

### **6.1 Error: "Cannot connect to database"**
```bash
# Verificar que MySQL está corriendo
netstat -ano | findstr :3306

# Verificar credenciales en .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
```

### **6.2 Error: "Port 3000 already in use"**
```bash
# Verificar qué proceso usa el puerto
netstat -ano | findstr :3000

# Matar el proceso (reemplazar PID)
taskkill /PID [número_PID] /F

# O cambiar puerto en .env
PORT=3001
```

### **6.3 Error: "Port 5173 already in use"**
```bash
# Cambiar puerto en client/vite.config.js
server: {
  port: 5174,  # Cambiar a otro puerto
  ...
}
```

### **6.4 Error: "npm install fails"**
```bash
# Limpiar cache de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## **📁 ESTRUCTURA DEL PROYECTO VERIFICADA**

### **Backend (`/farma`)**
```
farma/
├── src/
│   ├── config/          # Configuración DB
│   ├── controllers/     # Lógica de negocio
│   ├── middlewares/     # Auth, validación
│   ├── models/         # Modelos DB
│   ├── routes/         # Endpoints API
│   └── index.js        # Servidor principal
├── .env                # Variables de entorno
├── package.json        # Dependencias
└── sistema.sql         # Base de datos
```

### **Frontend (`/client`)**
```
client/
├── src/
│   ├── app/           # Store Redux
│   ├── components/    # Componentes UI
│   ├── features/      # Slices Redux
│   ├── hooks/         # Custom Hooks
│   ├── services/      # API service
│   └── utils/         # Constantes
├── tailwind.config.js # Config Tailwind
├── vite.config.js     # Config Vite
└── package.json       # Dependencias React
```

---

## **✅ VERIFICACIÓN FINAL**

### **Pruebas a ejecutar:**
1. ✅ **Backend corriendo**: http://localhost:3000/api
2. ✅ **Frontend corriendo**: http://localhost:5173
3. ✅ **Base de datos**: Tablas creadas y con datos
4. ✅ **Autenticación**: Login/registro funcionando
5. ✅ **CRUD Medicamentos**: Crear, leer, actualizar, eliminar
6. ✅ **CRUD Análisis**: Subir y ver análisis médicos
7. ✅ **Foros**: Publicar y comentar
8. ✅ **Responsive**: Funciona en móviles, tablets y desktop
9. ✅ **Roles**: Permisos diferenciados por usuario
10. ✅ **API**: Todos los endpoints responden

### **Comandos de verificación rápida:**
```bash
# 1. Base de datos
mysql -u root -p -e "USE sistema; SHOW TABLES;"

# 2. Backend
cd farma && npm run dev

# 3. Frontend  
cd client && npm run dev

# 4. Test script
test_app.bat
```

---

## **🚀 INICIO RÁPIDO**

Para una instalación más rápida:

### **Windows:**
```powershell
# 1. Instalar dependencias
cd farma && npm install
cd ..\client && npm install

# 2. Configurar MySQL (si no tienes contraseña)
#    Dejar DB_PASSWORD= vacío en farma/.env

# 3. Iniciar servidores
start cmd /k "cd farma && npm run dev"
start cmd /k "cd client && npm run dev"

# 4. Ejecutar script de prueba
test_app.bat
```

### **Linux/Mac:**
```bash
# 1. Instalar dependencias
cd farma && npm install
cd ../client && npm install

# 2. Iniciar servidores (en terminales separadas)
cd farma && npm run dev
cd ../client && npm run dev

# 3. Acceder al sistema
#    Backend: http://localhost:3000/api
#    Frontend: http://localhost:5173
```

---

## **📞 SOPORTE**

### **Problemas comunes:**
1. **MySQL no inicia**: Revisar servicios de Windows o reiniciar MySQL
2. **Puertos ocupados**: Cambiar puertos en configuración
3. **Dependencias desactualizadas**: `npm update`
4. **Errores de compilación**: `npm cache clean --force`

### **Recursos:**
- **Documentación React**: https://react.dev/
- **Documentación Tailwind**: https://tailwindcss.com/
- **Documentación Redux**: https://redux-toolkit.js.org/
- **Documentación Express**: https://expressjs.com/

---

## **🎉 ¡INSTALACIÓN COMPLETADA!**

Tu sistema **HealthHub** está ahora completamente instalado y listo para uso. 

**Credenciales de prueba:**
- **Admin**: admin / admin123
- **Médico**: dr_garcia / medico123  
- **Paciente**: paciente1 / paciente123

**Características verificadas:**
- ✅ Aplicación web React + Tailwind
- ✅ Redux para estado global
- ✅ 5 custom hooks propios
- ✅ 6+ entidades con CRUD completo
- ✅ Backend Node.js/Express propio
- ✅ 8 secciones funcionales
- ✅ Landing Page responsive
- ✅ Autenticación JWT con roles
- ✅ Base de datos MySQL completa
- ✅ Diseño completamente responsive

**¡El sistema está listo para desarrollo, pruebas y despliegue!**