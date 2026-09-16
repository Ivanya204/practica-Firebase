# Práctica

## Tecnologías utilizadas

- Expo
- React Native
- React Navigation
- Firebase Authentication
- Firebase Firestore
- react-native-dotenv

## Estructura del proyecto

```text
.
├── App.js
├── index.js
├── app.json
├── babel.config.js
├── .env.example
├── assets/
└── src/
    ├── config/
    │   └── firebase.js
    ├── hooks/
    │   ├── useAuth.js
    │   └── useProducts.js
    ├── navigation/
    │   └── Navigation.js
    ├── components/
    │   └── CardProductos.js
    └── screens/
        ├── Auth.js
        ├── Home.js
        └── Add.js
```

## Antes de empezar

Para poder ejecutar el proyecto necesitas tener:

- Node.js instalado.
- Expo Go en el celular o un emulador de Android/iOS.
- Un proyecto creado en Firebase.

En Firebase debes tener habilitados:

- Authentication con correo y contraseña.
- Firestore.

## Instalación

Primero instala las dependencias:

```bash
npm install
```

Después crea un archivo `.env` tomando como referencia el archivo `.env.example`.

```env
API_KEY=tu_api_key
AUTH_DOMAIN=tu_proyecto.firebaseapp.com
PROJECT_ID=tu_proyecto
STORAGE_BUCKET=tu_proyecto.appspot.com
MESSAGING_SENDER_ID=tu_sender_id
APP_ID=tu_app_id
```

Los datos se obtienen desde la configuración del proyecto en Firebase.

El archivo `.env` está incluido en `.gitignore`, por lo que no se sube al repositorio.

## Ejecutar el proyecto

Para iniciar la aplicación:

```bash
npm start
```

También se puede ejecutar directamente en:

```bash
npm run android
npm run ios
npm run web
```

## Funcionalidades

### Inicio de sesión y registro

Permite crear una cuenta e iniciar sesión utilizando correo y contraseña mediante Firebase Authentication.

### Productos

Muestra los productos registrados en la pantalla principal.

### Agregar productos

Permite agregar productos indicando su nombre y precio.

### Vender productos

Permite cambiar el estado de un producto entre vendido y disponible.

### Eliminar productos

Permite eliminar productos de Firestore.

### Actualización en tiempo real

Los productos se obtienen desde Firestore utilizando `onSnapshot`, por lo que los cambios se muestran automáticamente sin tener que recargar la aplicación.

## Lo que practico con este proyecto

Con esta práctica estoy aprendiendo a:

- Utilizar Expo y React Native.
- Manejar la navegación entre pantallas.
- Crear formularios.
- Utilizar hooks de React.
- Conectar una aplicación con Firebase.
- Utilizar Firebase Authentication.
- Guardar y consultar información con Firestore.
- Trabajar con información en tiempo real.
- Utilizar variables de entorno.
