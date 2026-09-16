// Este componente decide qué pantalla mostrar dependiendo de si hay un usuario logueado o no.
// Básicamente es el cerebro de la navegación: mientras se comprueba la sesión muestra un loading,
// si hay usuario muestra Home/Add, y si no hay usuario muestra la pantalla de login.
// Usa React Navigation, que es la librería estándar para manejar pantallas en React Native
// (funciona parecido a una pila, se puede apilar pantallas y volver atrás).

import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import useAuth from '../hooks/useAuth';
import Auth from '../screens/Auth';
import Home from '../screens/Home';
import Add from '../screens/Add';

// createNativeStackNavigator nos da los componentes Stack.Navigator y Stack.Screen
// que usamos abajo para declarar qué pantallas existen.
const Stack = createNativeStackNavigator();

const Navigation = () => {
    // Del hook de auth solo nos interesa saber quién está logueado (user) y si todavía
    // estamos revisando si había una sesión guardada (initializing).
    const { user, initializing } = useAuth();

    // Mientras Firebase está chequeando si había sesión guardada mostramos un loading,
    // para no hacer parpadear el login y después de golpe mostrar el Home.
    if (initializing) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F7D66B" />
                <Text style={styles.loadingText}>Cargando sesión...</Text>
            </View>
        );
    }

    return (
        // NavigationContainer tiene que envolver toda la navegación, es obligatorio.
        <NavigationContainer>
            <Stack.Navigator>
                {/*
                  Acá está la parte importante: si hay usuario mostramos Home y Add
                  (usamos un fragment porque Stack.Navigator necesita recibir los
                  Stack.Screen directamente como hijos), y si no hay usuario mostramos
                  solo la pantalla de Auth. Como esto se vuelve a evaluar cada vez que
                  "user" cambia, apenas alguien inicia sesión React Navigation cambia
                  de pantalla solo, sin que tengamos que programar esa transición.
                */}
                {user ? (
                    <>
                        <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
                        <Stack.Screen
                            name="Add"
                            component={Add}
                            options={{ presentation: 'modal', title: 'Agregar productos' }}
                        />
                    </>
                ) : (
                    // headerShown: false porque en el login no tiene sentido mostrar la barra de arriba
                    <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;

// Estilos solo para la pantalla de "Cargando sesión..."
const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: '#0B1F33',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: '#FFFFFF',
        marginTop: 16,
        fontSize: 16,
    },
});
