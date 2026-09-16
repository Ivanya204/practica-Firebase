// ============================================================================
// src/navigation/Navigation.js
// ----------------------------------------------------------------------------
// Este componente decide QUÉ PANTALLA mostrar según si hay un usuario
// logueado o no. Es el "cerebro" de la navegación de toda la app:
//
//   - Mientras se está comprobando la sesión -> pantalla de carga.
//   - Si HAY usuario logueado                -> pantallas Home y Add.
//   - Si NO hay usuario logueado             -> pantalla Auth (login/registro).
//
// Usa la librería React Navigation, que es el estándar en apps de React
// Native para manejar "pilas" de pantallas (como el historial del navegador,
// pero para apps móviles).
// ============================================================================

import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';

// createNativeStackNavigator crea un "navegador tipo pila": las pantallas se
// apilan una arriba de otra (como cartas), y se puede volver atrás.
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// NavigationContainer es el componente que debe envolver TODA la navegación
// de la app. Es obligatorio: sin él, React Navigation no funciona.
import { NavigationContainer } from '@react-navigation/native';

// Nuestro hook de autenticación, que nos dice quién está logueado.
import useAuth from '../hooks/useAuth';

// Las tres pantallas de la app.
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import Add from '../screens/Add';

// Creamos el "navegador": un objeto con componentes especiales
// (Stack.Navigator y Stack.Screen) para declarar las pantallas disponibles.
const Stack = createNativeStackNavigator();

const Navigation = () => {
    // Del hook useAuth solo necesitamos saber:
    // - user: si hay alguien logueado (o null si no).
    // - initializing: si todavía estamos comprobando la sesión guardada.
    const { user, initializing } = useAuth();

    // Mientras Firebase todavía está revisando si había una sesión guardada
    // (por ejemplo, al abrir la app por primera vez), mostramos una pantalla
    // de carga simple en vez de "parpadear" mostrando primero el login y
    // después, de golpe, el Home.
    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F7D66B" />
                <Text style={styles.loadingText}>Cargando sesión...</Text>
            </View>
        );
    }

    return (
        // NavigationContainer debe envolver todo el árbol de navegación.
        <NavigationContainer>
            {/* Stack.Navigator agrupa las pantallas disponibles. */}
            <Stack.Navigator>
                {/*
                  Acá está la clave de la navegación "condicional":
                  Si "user" existe (hay sesión), mostramos un GRUPO de
                  pantallas (Home y Add) usando un Fragment (<>...</>) porque
                  Stack.Navigator necesita que le pasemos elementos
                  Stack.Screen directamente como hijos.

                  Si "user" es null (no hay sesión), mostramos SOLO la
                  pantalla de autenticación.

                  Como React Navigation vuelve a evaluar esto cada vez que
                  "user" cambia, apenas alguien se loguea, automáticamente
                  cambia de la pantalla Auth a la pantalla Home sin que
                  nosotros tengamos que programar esa transición a mano.
                */}
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
                        <Stack.Screen
                            name="Add"
                            component={Add}
                            options={{
                                // 'modal' hace que esta pantalla aparezca
                                // deslizándose desde abajo, como un cuadro de
                                // diálogo, en vez de deslizarse desde el
                                // costado como una pantalla normal.
                                presentation: 'modal',
                                title: 'Agregar productos',
                            }}
                        />
                    </>
                ) : (
                    // headerShown: false oculta la barra superior (título +
                    // botón de volver) en la pantalla de login, porque ahí
                    // no tiene sentido mostrarla.
                    <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;

// Estilos únicamente para la pantalla de "Cargando sesión...".
// StyleSheet.create no hace magia especial en tiempo de ejecución, pero
// ayuda a detectar errores de tipeo en los estilos y es la forma
// recomendada de declarar estilos en React Native.
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, // ocupa toda la pantalla disponible
        backgroundColor: '#0B1F33',
        alignItems: 'center', // centra horizontalmente
        justifyContent: 'center', // centra verticalmente
    },
    loadingText: {
        color: '#FFFFFF',
        marginTop: 16,
        fontSize: 16,
    },
});
