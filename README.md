# Ivanya Store

Aplicación móvil hecha con **Expo (React Native)** y **Firebase** para gestionar
los productos de una tienda: iniciar sesión, ver el listado de productos,
agregar productos nuevos y marcarlos como vendidos o disponibles.

Este proyecto está pensado como práctica/estudio de Firebase (Authentication
y Firestore) combinado con React Native, por eso el código incluye
comentarios detallados explicando qué hace cada parte.

## Tecnologías principales

- [Expo](https://expo.dev/) / React Native
- [React Navigation](https://reactnavigation.org/) (navegación entre pantallas)
- [Firebase](https://firebase.google.com/) — Authentication y Firestore
- [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) para
  manejar variables de entorno (credenciales de Firebase)

## Estructura del proyecto

```
.
├── App.js                     # Componente raíz de la app
├── index.js                   # Punto de entrada (registra App.js)
├── app.json                   # Configuración de Expo
├── babel.config.js            # Configuración de Babel
├── .env.example                # Plantilla de variables de entorno
├── assets/                    # Íconos y splash screen
└── src/
    ├── config/
    │   └── firebase.js        # Inicialización de Firebase (auth, Firestore, storage)
    ├── hooks/
    │   ├── useAuth.js         # Lógica de login / registro / logout
    │   └── useProducts.js     # Lógica de lectura/alta/baja de productos
    ├── navigation/
    │   └── Navigation.js      # Decide qué pantalla mostrar según la sesión
    ├── components/
    │   └── CardProductos.js   # Tarjeta visual de un producto
    └── screens/
        ├── Auth.js            # Pantalla de login / registro
        ├── Home.js            # Pantalla principal con el listado de productos
        └── Add.js             # Pantalla (modal) para agregar un producto
```

## Requisitos previos

- [Node.js](https://nodejs.org/) instalado (v18 o superior recomendado).
- La app [Expo Go](https://expo.dev/go) instalada en tu celular (para probar
  rápido), o un emulador de Android/iOS configurado.
- Un proyecto creado en [Firebase Console](https://console.firebase.google.com/)
  con **Authentication** (método Email/Contraseña) y **Firestore** habilitados.

## Configuración

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo de variables de entorno a partir de la plantilla:

   ```bash
   cp .env.example .env
   ```

3. Completar `.env` con los datos de tu proyecto de Firebase (Firebase
   Console → ⚙️ Configuración del proyecto → Tus apps → SDK setup and
   configuration):

   ```
   API_KEY=tu_api_key
   AUTH_DOMAIN=tu_proyecto.firebaseapp.com
   PROJECT_ID=tu_proyecto
   STORAGE_BUCKET=tu_proyecto.appspot.com
   MESSAGING_SENDER_ID=tu_sender_id
   APP_ID=tu_app_id
   ```

   > ⚠️ El archivo `.env` está en `.gitignore` y nunca se sube al repositorio.
   > Cada persona que clona el proyecto debe crear el suyo propio.

## Cómo correr el proyecto

```bash
npm start        # abre el menú de Expo (elegís dónde correrlo)
npm run android  # abre directamente en un emulador/dispositivo Android
npm run ios      # abre directamente en un simulador/dispositivo iOS
npm run web      # abre una versión web (soporte limitado)
```

## Funcionalidades

- **Autenticación**: iniciar sesión o crear una cuenta con correo y
  contraseña (Firebase Authentication). La sesión se guarda en el
  dispositivo, así que no hace falta loguearse cada vez que se abre la app.
- **Listado de productos en tiempo real**: los productos se leen desde
  Firestore usando `onSnapshot`, por lo que la lista se actualiza sola si
  cambian los datos (sin recargar la pantalla).
- **Agregar producto**: pantalla modal con formulario de nombre y precio.
- **Vender / devolver producto**: cambia el estado `vendido` de un producto.
- **Eliminar producto**: borra el producto de Firestore.

## Notas

- Este repositorio fue preparado para estudio: los comentarios en el código
  explican, paso a paso, qué hace cada línea relevante (hooks de React,
  llamadas a Firebase, estilos, navegación, etc.).
