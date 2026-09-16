// ============================================================================
// index.js
// ----------------------------------------------------------------------------
// Este es el PRIMER archivo que se ejecuta cuando arranca la app. Es el punto
// de entrada (entry point) de todo el proyecto. Piensa en esto como la puerta
// principal de la casa: todo lo demás (pantallas, navegación, Firebase) se
// activa a partir de acá.
// ============================================================================

// registerRootComponent es una función que provee Expo. Sirve para "registrar"
// cuál es el componente raíz (el componente principal) de nuestra app, tanto
// si corremos en Expo Go (la app para probar) como si generamos una build
// nativa (una app instalable real de Android/iOS).
import { registerRootComponent } from 'expo';

// Importamos el componente principal de nuestra aplicación, definido en
// App.js (en la raíz del proyecto).
import App from './App';

// registerRootComponent hace, por dentro, algo equivalente a:
//   AppRegistry.registerComponent('main', () => App);
// Eso es la forma "nativa" (de React Native puro) de decir "esta es la
// pantalla inicial de la app". Expo nos da esta función de ayuda para no
// tener que escribir esa configuración nosotros mismos.
//
// También se asegura de que, sin importar si estamos usando Expo Go o una
// build nativa compilada, el entorno quede configurado correctamente antes
// de que la app arranque.
registerRootComponent(App);
