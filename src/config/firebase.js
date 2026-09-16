// Este archivo inicializa Firebase una sola vez y exporta los servicios que
// el resto de la app va a usar: auth (login), database (Firestore, donde
// guardamos los productos) y storage (para archivos). Cualquier archivo que
// necesite hablar con Firebase importa estas variables de acá en vez de
// inicializar Firebase de nuevo, así toda la app usa la misma conexión.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Estas variables no están escritas acá, vienen del módulo "falso" @env, que
// Babel reemplaza por los valores reales del archivo .env (ver babel.config.js).
// Así evitamos tener las claves de Firebase escritas en el código que se sube
// a GitHub.
import { API_KEY, AUTH_DOMAIN, PROJECT_ID, STORAGE_BUCKET, MESSAGING_SENDER_ID, APP_ID } from '@env';

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

const app = initializeApp(firebaseConfig);

let auth;

// El try/catch acá es porque con fast refresh (la recarga rápida durante el
// desarrollo), initializeAuth puede tirar error si Firebase ya tiene una
// instancia de auth creada para esta app. Si eso pasa, usamos getAuth(app)
// para recuperar la instancia que ya existía, en vez de romper la app.
try {
  auth = initializeAuth(app, {
    // Guardamos la sesión en AsyncStorage para que si cerrás y volvés a abrir
    // la app, siga logueado sin tener que escribir el usuario de nuevo.
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

const database = getFirestore(app);
const storage = getStorage(app);

export { app, auth, database, storage };
