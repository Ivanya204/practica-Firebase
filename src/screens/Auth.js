// ============================================================================
// src/screens/Auth.js
// ----------------------------------------------------------------------------
// Pantalla de LOGIN / REGISTRO. Es lo primero que ve cualquier persona que
// abre la app sin una sesión guardada (ver Navigation.js: si no hay "user",
// se muestra esta pantalla).
//
// Esta misma pantalla sirve para DOS cosas, controladas por un solo estado
// booleano (isLogin):
//   - Iniciar sesión (isLogin === true)
//   - Crear una cuenta nueva (isLogin === false)
// ============================================================================

import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Hook con toda la lógica de autenticación (login, registro, errores, etc.).
import useAuth from '../hooks/useAuth';

const Auth = () => {
    // Estado local del formulario (lo que el usuario está escribiendo).
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // isLogin decide qué "modo" mostrar: true = login, false = registro.
    // Arranca en true porque lo más común es que alguien YA tenga cuenta.
    const [isLogin, setIsLogin] = useState(true);

    // Del hook de autenticación usamos:
    // - loading: para deshabilitar el botón mientras se procesa.
    // - error: mensaje de error para mostrar en pantalla.
    // - signIn / signUp: las acciones de Firebase.
    const { loading, error, signIn, signUp } = useAuth();

    // Se ejecuta al tocar el botón de "Entrar" / "Registrarme".
    const handleSubmit = async () => {
        // Validación simple ANTES de llamar a Firebase: si falta el email o
        // la contraseña (o están vacíos de espacios), avisamos y frenamos
        // acá, sin gastar una llamada de red innecesaria.
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos vacíos', 'Completa correo y contraseña para continuar.');
            return;
        }

        try {
            // Según el modo actual, llamamos a una función u otra del hook.
            if (isLogin) {
                await signIn(email.trim(), password);
            } else {
                await signUp(email.trim(), password);
            }
            // Si todo sale bien, NO hace falta navegar a mano a Home: en
            // cuanto Firebase confirma la sesión, useAuth() actualiza "user"
            // y Navigation.js automáticamente cambia de pantalla.
        } catch (authError) {
            // Si signIn/signUp lanzan un error (por ejemplo, contraseña
            // incorrecta), lo mostramos en una alerta nativa.
            Alert.alert('Error de autenticación', authError.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            // En Android, "undefined" deja que el sistema operativo maneje
            // el comportamiento por defecto ante el teclado (a diferencia de
            // Add.js, que usa 'height' explícitamente).
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.badge}>Firebase Auth</Text>

                    {/*
                      El título cambia dinámicamente según el modo actual,
                      usando un operador ternario: condición ? siVerdadero : siFalso
                    */}
                    <Text style={styles.title}>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
                    <Text style={styles.subtitle}>
                        Usa tu correo para entrar a la app y mantener separados los productos por sesión.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#8695A7"
                        // Muestra un teclado optimizado para escribir emails
                        // (con la @ más accesible, por ejemplo).
                        keyboardType="email-address"
                        // Evita que el teclado ponga en mayúscula la primera
                        // letra automáticamente (los emails no llevan
                        // mayúsculas por convención).
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#8695A7"
                        // Oculta el texto escrito (muestra puntos/asteriscos)
                        // para que nadie vea la contraseña por encima del
                        // hombro.
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {/*
                      Mostramos el mensaje de error SOLO si existe. Si
                      "error" es null/undefined/"" (valor "falsy"), no se
                      renderiza nada (React ignora null).
                    */}
                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleSubmit}
                        // Deshabilita el botón mientras se está procesando
                        // la petición, para evitar que el usuario lo toque
                        // varias veces seguidas.
                        disabled={loading}
                    >
                        <Text style={styles.primaryButtonText}>
                            {loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}
                        </Text>
                    </TouchableOpacity>

                    {/*
                      Botón para alternar entre modo login y modo registro.
                      "current => !current" invierte el valor anterior de
                      isLogin (true pasa a false, y viceversa).
                    */}
                    <TouchableOpacity style={styles.secondaryButton} onPress={() => setIsLogin((current) => !current)}>
                        <Text style={styles.secondaryButtonText}>
                            {isLogin ? 'No tengo cuenta' : 'Ya tengo cuenta'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Auth;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1F33', // azul oscuro de fondo
    },
    content: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: '#102943',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    badge: {
        color: '#F7D66B',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.4,
        marginBottom: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 10,
    },
    subtitle: {
        color: '#C5D0DE',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#0F2239',
        borderRadius: 14,
        color: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
        marginBottom: 14,
    },
    primaryButton: {
        backgroundColor: '#F7D66B',
        paddingVertical: 15,
        borderRadius: 14,
        marginTop: 8,
    },
    primaryButtonText: {
        color: '#0B1F33',
        textAlign: 'center',
        fontWeight: '800',
        fontSize: 16,
    },
    secondaryButton: {
        paddingVertical: 14,
        marginTop: 8,
    },
    secondaryButtonText: {
        color: '#C5D0DE',
        textAlign: 'center',
        fontWeight: '700',
    },
    errorText: {
        color: '#FF9A9A',
        marginBottom: 10,
    },
});
