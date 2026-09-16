// ============================================================================
// src/hooks/useAuth.js
// ----------------------------------------------------------------------------
// Un "hook" en React es una función que empieza con "use" y nos permite
// reutilizar lógica (con estado incluido) entre distintos componentes.
//
// Este hook, useAuth, centraliza TODA la lógica de autenticación de la app:
//   - saber si hay un usuario logueado (user)
//   - saber si todavía estamos comprobando la sesión al abrir la app
//     (initializing)
//   - iniciar sesión (signIn)
//   - registrarse (signUp)
//   - cerrar sesión (signOutUser)
//
// Cualquier componente que necesite estas cosas simplemente hace:
//   const { user, signIn, ... } = useAuth();
// en vez de repetir toda esta lógica de Firebase en cada pantalla.
// ============================================================================

// useEffect: para ejecutar código quirúrgicamente en momentos concretos del
//            ciclo de vida del componente (ej: "cuando se monta el hook").
// useState:  para guardar valores que, cuando cambian, hacen que React vuelva
//            a dibujar (re-renderizar) lo que dependa de ellos.
import { useEffect, useState } from 'react';

// Funciones de Firebase Authentication que vamos a usar:
// - createUserWithEmailAndPassword: registra un usuario nuevo con email/clave.
// - onAuthStateChanged: se "suscribe" a los cambios de sesión (login/logout),
//   y Firebase nos avisa automáticamente cada vez que cambian.
// - signInWithEmailAndPassword: inicia sesión con un usuario ya existente.
// - signOut: cierra la sesión actual.
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Traemos la instancia de "auth" que ya inicializamos en firebase.js. Todo
// este hook trabaja sobre esa única instancia.
import { auth } from '../config/firebase';

const useAuth = () => {
  // user: el objeto de usuario de Firebase si hay sesión iniciada, o null si
  // no hay nadie logueado.
  const [user, setUser] = useState(null);

  // initializing: true mientras todavía no sabemos si hay sesión o no (justo
  // al abrir la app). Sirve para mostrar una pantalla de carga en vez de
  // "parpadear" mostrando el login y después el Home.
  const [initializing, setInitializing] = useState(true);

  // loading: true mientras se está procesando un login/registro/logout (por
  // ejemplo, para deshabilitar un botón y evitar dobles clics).
  const [loading, setLoading] = useState(false);

  // error: guarda el último mensaje de error de autenticación, si lo hubo.
  const [error, setError] = useState(null);

  // useEffect con [] (arreglo de dependencias vacío) significa: "ejecutá
  // esto SOLO UNA VEZ, cuando el hook se usa por primera vez" (equivalente a
  // "componentDidMount" en componentes de clase).
  useEffect(() => {
    // onAuthStateChanged registra un "listener": una función que Firebase va
    // a llamar automáticamente cada vez que el estado de sesión cambia
    // (alguien se loguea, se desloguea, o al abrir la app y detectar que ya
    // había una sesión guardada).
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // currentUser es el usuario logueado, o null si no hay ninguno.
      setUser(currentUser);

      // Ya sabemos el estado real de la sesión, así que dejamos de
      // "inicializar".
      setInitializing(false);
    });

    // IMPORTANTE: useEffect puede devolver una función de "limpieza", que
    // React ejecuta cuando el componente que usa este hook se desmonta.
    // Acá devolvemos "unsubscribe" (la función que Firebase nos dio) para
    // cancelar la suscripción y evitar fugas de memoria (memory leaks).
    return unsubscribe;
  }, []);

  // signIn: inicia sesión con email y contraseña.
  const signIn = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      // Esta llamada es asíncrona: le habla al servidor de Firebase y
      // esperamos (await) la respuesta antes de seguir.
      await signInWithEmailAndPassword(auth, email, password);
    } catch (authError) {
      // Si Firebase devuelve un error (ej: contraseña incorrecta), guardamos
      // el mensaje para poder mostrarlo en la pantalla...
      setError(authError.message);
      // ...y además volvemos a lanzar el error (throw) para que quien haya
      // llamado a signIn() (por ejemplo, la pantalla Auth.js) también se
      // entere y pueda reaccionar (mostrar una alerta, por ejemplo).
      throw authError;
    } finally {
      // "finally" se ejecuta SIEMPRE, haya habido error o no. Acá lo usamos
      // para asegurarnos de "apagar" el estado de carga pase lo que pase.
      setLoading(false);
    }
  };

  // signUp: crea una cuenta nueva con email y contraseña. La estructura es
  // igual a signIn, solo cambia qué función de Firebase se llama.
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

  // signOutUser: cierra la sesión del usuario actual.
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

  // El hook devuelve un objeto con todo lo que los componentes puedan
  // necesitar: tanto los datos (user, initializing, loading, error) como las
  // funciones para actuar (signIn, signUp, signOutUser).
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
