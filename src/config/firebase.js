// ============================================================================
// src/config/firebase.js
// ----------------------------------------------------------------------------
// Este archivo se encarga de INICIALIZAR Firebase una sola vez y de exportar
// los "servicios" de Firebase que el resto de la app va a usar:
//   - auth      -> autenticación (login, registro, cerrar sesión)
//   - database  -> Firestore (la base de datos donde se guardan los productos)
//   - storage   -> Firebase Storage (para guardar archivos, ej. imágenes)
//
// Cualquier otro archivo que necesite hablar con Firebase importa estas
// variables desde acá, en vez de inicializar Firebase de nuevo. Así nos
// aseguramos de que TODA la app use la misma conexión/configuración.
// ============================================================================

// AsyncStorage es una especie de "localStorage" pero para apps móviles: un
// almacenamiento simple de clave-valor que persiste en el dispositivo aunque
// se cierre la app. Firebase lo usa para guardar la sesión del usuario
// (para no tener que loguearse de nuevo cada vez que se abre la app).
import AsyncStorage from '@react-native-async-storage/async-storage';

// initializeApp es la función principal del SDK de Firebase: arranca la
// conexión con nuestro proyecto de Firebase usando la configuración
// (firebaseConfig) que armamos más abajo.
import { initializeApp } from 'firebase/app';

// Funciones relacionadas a autenticación de usuarios:
// - getAuth: obtiene la instancia de autenticación "por defecto" (sin
//   configuración especial de persistencia).
// - initializeAuth: como getAuth, pero nos deja elegir CÓMO se guarda la
//   sesión (en este caso, usando AsyncStorage, ver más abajo).
// - getReactNativePersistence: le dice a Firebase "guarda la sesión del
//   usuario usando AsyncStorage", que es la forma correcta de hacerlo en
//   apps de React Native (en la web se usaría otro mecanismo).
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';

// getFirestore nos da acceso a Firestore, la base de datos NoSQL (basada en
// documentos) donde vamos a guardar los productos de la tienda.
import { getFirestore } from 'firebase/firestore';

// getStorage nos da acceso a Firebase Storage, un servicio para subir y
// servir archivos (imágenes, videos, etc.). En este proyecto se deja
// preparado, aunque hoy no se esté usando activamente para imágenes.
import { getStorage } from 'firebase/storage';

// Estas variables (API_KEY, AUTH_DOMAIN, etc.) NO están escritas literalmente
// en este archivo. Vienen del módulo falso "@env", que en realidad es
// reemplazado por Babel (ver babel.config.js) por los valores reales que
// están en el archivo ".env" de la raíz del proyecto.
//
// Esto es MUY importante para la seguridad: así evitamos escribir las claves
// de Firebase directamente en el código fuente que se sube a GitHub. El
// archivo .env está en .gitignore, así que cada persona que clona el repo
// debe crear su propio .env (podés basarte en .env.example) con sus propias
// credenciales de Firebase.
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

// Este objeto es la "tarjeta de identidad" que le decimos a Firebase para
// que sepa a qué proyecto de Firebase nos queremos conectar.
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Inicializamos Firebase UNA sola vez, en este archivo, usando la
// configuración de arriba. "app" representa la conexión activa con nuestro
// proyecto de Firebase.
const app = initializeApp(firebaseConfig);

// Declaramos "auth" acá afuera del try/catch para poder exportarla después.
let auth;

// ¿Por qué un try/catch acá?
// - Con "fast refresh" (recarga rápida durante el desarrollo) o si este
//   archivo se llega a ejecutar más de una vez, initializeAuth() puede
//   lanzar un error porque Firebase ya tiene una instancia de auth creada
//   para esta "app".
// - Si eso pasa, el catch atrapa el error y, en vez de romper la aplicación,
//   simplemente usamos getAuth(app), que devuelve la instancia de auth que
//   YA existía. Así la app no se rompe por un doble-inicializado.
try {
  auth = initializeAuth(app, {
    // Le decimos a Firebase que guarde la sesión del usuario usando
    // AsyncStorage, para que si cerrás y volvés a abrir la app, siga
    // logueado sin tener que escribir el usuario/contraseña de nuevo.
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

// Instancia de Firestore (la base de datos) conectada a nuestra app.
const database = getFirestore(app);

// Instancia de Firebase Storage conectada a nuestra app.
const storage = getStorage(app);

// Exportamos todo lo que el resto de la app va a necesitar para hablar con
// Firebase. Por ejemplo:
//   - src/hooks/useAuth.js      usa "auth"
//   - src/hooks/useProducts.js  usa "database"
export { app, auth, database, storage };
