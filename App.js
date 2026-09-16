// ============================================================================
// App.js
// ----------------------------------------------------------------------------
// Este es el componente RAÍZ de la aplicación (el "padre de todos"). Es el
// componente que index.js registra y pone en pantalla primero.
//
// Su trabajo aquí es muy simple a propósito: no dibuja pantallas él mismo,
// solo delega todo el trabajo de "qué pantalla mostrar" al componente
// Navigation (definido en src/navigation/Navigation.js). Esto es una buena
// práctica: mantener App.js chiquito y dejar que la lógica de navegación
// viva en su propio archivo.
// ============================================================================

// Importamos el componente de navegación, que decide si mostrar la pantalla
// de login (Auth) o las pantallas ya autenticadas (Home / Add), según si hay
// un usuario logueado o no.
import Navigation from './src/navigation/Navigation';

// Todo componente de React (en este caso, una función) que se exporta como
// "default" y devuelve JSX (código parecido a HTML) es un componente visual.
// "export default function App()" es la forma estándar de declarar el
// componente principal en un proyecto de Expo/React Native.
export default function App() {
  return (
    // Como no hay más de un elemento hermano, alcanza con devolver
    // directamente <Navigation />. React exige que un componente devuelva
    // UN SOLO elemento raíz (o un fragmento <>...</>), por eso no hay nada
    // más envolviendo esto.
    <Navigation />
  );
}
