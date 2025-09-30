# Minecraft PWA - Aplicación Web Progresiva

Una aplicación web progresiva con temática de Minecraft que demuestra el uso de todas las tecnologías modernas de PWA, incluyendo el acceso real a hardware del dispositivo.

## Características principales

- **Pantallas de splash y home** con diseño responsivo
- **Renderizado híbrido** (cliente y servidor)
- **Gestión de datos** local, remoto y offline
- **Notificaciones push** en tiempo real
- **Uso real de hardware** (cámara, GPS, vibración, batería)

## Stack tecnológico

- Frontend: React 18 con React Router
- Backend: Node.js con Express
- Base de datos: Firebase Firestore
- PWA: Service Workers y Web App Manifest
- Notificaciones: Firebase Cloud Messaging
- Estilos: CSS personalizado con tema pixel art

## Instalación

### Prerrequisitos
- Node.js 16 o superior
- npm o yarn
- Cuenta de Firebase (opcional para funcionalidades online)

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/minecraft-pwa.git
cd minecraft-pwa

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus datos de Firebase

# Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Configuración de Firebase (opcional)

Si quieres que funcionen las características online:

1. Crear proyecto en Firebase Console
2. Habilitar Firestore Database
3. Habilitar Cloud Messaging
4. Copiar la configuración al archivo `.env`

La app funciona perfectamente sin Firebase usando almacenamiento local.

## Funcionalidades implementadas

### Renderizado
- **CSR (Cliente)**: Rutas principales con React Router
- **SSR (Servidor)**: Páginas especiales en `/ssr/*` generadas con Express

### Gestión de datos
- **Remoto**: Firebase Firestore para sincronización
- **Local**: localStorage como fallback
- **Offline**: Service Worker con cache automático

### Hardware del dispositivo
- **Cámara**: Acceso real para tomar fotos
- **GPS**: Obtención de coordenadas precisas
- **Vibración**: Feedback háptico en interacciones
- **Batería**: Información en tiempo real
- **Sensores**: Acelerómetro y giroscopio

### PWA
- Instalable en dispositivos móviles y desktop
- Funciona completamente offline
- Notificaciones push y locales
- Splash screen personalizada

## Estructura del proyecto

```
minecraft-pwa/
├── public/              # Archivos estáticos y configuración PWA
├── src/
│   ├── components/      # Componentes React
│   ├── firebase.js      # Configuración Firebase
│   ├── App.js          # Componente principal
│   └── index.js        # Punto de entrada
├── server.js           # Servidor Express
├── .env.example        # Variables de entorno ejemplo
└── package.json        # Dependencias y scripts
```

## Scripts disponibles

```bash
npm run dev    
npm run client 
npm run server    
npm run build    
npm start       
```

## Testing de funcionalidades

### PWA
1. Abrir DevTools > Application > Service Workers
2. Verificar registro del Service Worker
3. Probar modo offline desconectando red
4. Intentar instalar la app desde el navegador

### Hardware
1. **Cámara**: Botón "Abrir Cámara" en home
2. **Sensores**: Botón "Mostrar Sensores" para sensores basicos de un dispositivo.
3. **Notificaciones**: Se activan automáticamente en interacciones
