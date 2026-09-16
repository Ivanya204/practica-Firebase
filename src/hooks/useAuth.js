// Hook que centraliza toda la lógica de autenticación: saber si hay usuario
// logueado, iniciar sesión, registrarse y cerrar sesión. Cualquier componente
// que necesite esto hace const { user, signIn, ... } = useAuth() en vez de
// repetir la lógica de Firebase en cada pantalla.

import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);
  // initializing es true mientras todavía no sabemos si hay sesión guardada
  // (justo al abrir la app), sirve para mostrar un loading en vez de mostrar
  // primero el login y después de golpe el Home.
  const [initializing, setInitializing] = useState(true);
  // loading es para cuando se está procesando un login/registro/logout puntual,
  // sirve para deshabilitar botones y evitar dobles clics.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // onAuthStateChanged se suscribe a los cambios de sesión: Firebase llama
    // a esta función automáticamente cada vez que alguien se loguea, se
    // desloguea, o al abrir la app y detectar que ya había sesión guardada.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    // Devolvemos unsubscribe para que cuando el componente se desmonte se
    // cancele la suscripción, si no se queda escuchando cambios para siempre
    // y eso genera un memory leak.
    return unsubscribe;
  }, []);

  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (authError) {
      // Guardamos el mensaje para poder mostrarlo en pantalla, pero también
      // volvemos a lanzar el error para que quien llamó a signIn (la pantalla
      // Auth) se entere y pueda reaccionar, por ejemplo mostrando una alerta.
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (authError) {
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    setError(null);

    try {
      await signOut(auth);
    } catch (authError) {
      setError(authError.message);
      throw authError;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    initializing,
    loading,
    error,
    signIn,
    signUp,
    signOutUser,
  };
};

export default useAuth;
