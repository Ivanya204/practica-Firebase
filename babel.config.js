// ============================================================================
// babel.config.js
// ----------------------------------------------------------------------------
// Este archivo configura Babel, que es la herramienta que "traduce" el código
// moderno de JavaScript/JSX que escribimos (React, sintaxis nueva de JS, etc.)
// a un código que los motores de React Native / Expo puedan entender y correr
// en el celular.
//
// Sin este archivo, cosas como el JSX (las etiquetas tipo <View> </View> que
// parecen HTML dentro de JS) o el "import ... from '@env'" no funcionarían.
// ============================================================================

// Expo espera que este archivo exporte una función. Esa función recibe "api",
// un objeto que Babel usa internamente para configurarse.
module.exports = function (api) {
  // api.cache(true) le dice a Babel: "esta configuración no cambia en cada
  // build, guárdala en caché". Esto hace que compilar sea más rápido, porque
  // Babel no tiene que volver a calcular esta configuración cada vez.
  api.cache(true);

  return {
    // "presets" es un conjunto de reglas ya armadas (un "paquete") que le dice
    // a Babel cómo transformar el código. Acá usamos el preset oficial de
    // Expo, que ya incluye todo lo necesario para React Native + JSX.
    //
    // OJO: la clave correcta es "presets" (con "s" al final), NO "presents".
    // Si se escribe mal el nombre de la clave, Babel simplemente la ignora
    // porque no la reconoce, y entonces el preset de Expo nunca se aplica.
    // Eso puede romper builds o dar errores raros de compilación difíciles
    // de rastrear. Por eso este typo quedó corregido aquí.
    presets: ["babel-preset-expo"],

    // "plugins" son transformaciones puntuales adicionales, más específicas
    // que un preset completo. Acá agregamos un solo plugin:
    plugins: [
      [
        // Este plugin permite escribir: import { API_KEY } from '@env';
        // y que Babel reemplace eso por el valor real que está definido en
        // el archivo .env (que no se sube a GitHub, ver .gitignore).
        "module:react-native-dotenv",
        {
          // moduleName: el "nombre falso" de módulo que vamos a usar en los
          // imports. Por eso en firebase.js se hace:
          //   import { API_KEY, ... } from '@env';
          moduleName: "@env",

          // path: en qué archivo están las variables de entorno reales.
          // Este archivo NO se sube al repositorio (está en .gitignore),
          // cada persona que clona el proyecto debe crear el suyo propio
          // copiando ".env.example" y completando sus propios valores de
          // Firebase.
          path: ".env",
        },
      ],
    ],
  };
};
