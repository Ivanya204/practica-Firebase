// Pantalla de login/registro. Es lo primero que ve alguien que abre la app
// sin sesión guardada (ver Navigation.js). Sirve para las dos cosas a la vez,
// controlado por el estado isLogin: true muestra login, false muestra registro.

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

import useAuth from '../hooks/useAuth';

const Auth = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // Arranca en true porque lo más común es que alguien ya tenga cuenta.
    const [isLogin, setIsLogin] = useState(true);
    const { loading, error, signIn, signUp } = useAuth();

    const handleSubmit = async () => {
        // Validación simple antes de llamar a Firebase, para no gastar una
        // llamada de red si falta algo.
        if (!email.trim() || !password.trim()) {
            Alert.alert('Campos vacíos', 'Completa correo y contraseña para continuar.');
            return;
        }

        try {
            if (isLogin) {
                await signIn(email.trim(), password);
            } else {
                await signUp(email.trim(), password);
            }
            // No hace falta navegar a mano a Home acá: en cuanto Firebase
            // confirma la sesión, useAuth actualiza "user" y Navigation.js
            // cambia de pantalla solo.
        } catch (authError) {
            Alert.alert('Error de autenticación', authError.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
                <View style={styles.card}>
                    <Text style={styles.badge}>Firebase Auth</Text>
                    <Text style={styles.title}>{isLogin ? 'Iniciar sesión' : 'Crear cuenta'}</Text>
                    <Text style={styles.subtitle}>
                        Usa tu correo para entrar a la app y mantener separados los productos por sesión.
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        placeholderTextColor="#8695A7"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        placeholderTextColor="#8695A7"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit} disabled={loading}>
                        <Text style={styles.primaryButtonText}>{loading ? 'Procesando...' : isLogin ? 'Entrar' : 'Registrarme'}</Text>
                    </TouchableOpacity>

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
        backgroundColor: '#0B1F33',
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
