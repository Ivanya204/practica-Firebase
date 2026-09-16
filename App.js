// Componente raíz de la app, es lo que index.js registra y pone en pantalla primero.
// No dibuja nada él mismo, solo delega todo a Navigation, que es quien decide qué
// pantalla mostrar según si hay sesión iniciada o no.

import Navigation from './src/navigation/Navigation';

export default function App() {
  return (
    <Navigation />
  );
}
