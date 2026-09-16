// Pantalla para agregar un producto nuevo. Se muestra como modal (ventana que
// aparece desde abajo) cuando el usuario toca "Agregar Producto" en Home.js
// (ver Navigation.js, donde se configura presentation: 'modal').

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

import useProducts from '../hooks/useProducts';

// navigation es una prop que React Navigation le inyecta automáticamente a
// cualquier componente declarado como Stack.Screen, nos deja movernos entre
// pantallas sin armar esa lógica nosotros.
const Add = ({ navigation }) => {
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');
    const { addProduct } = useProducts();

    const goToHome = () => {
        navigation.goBack();
    };

    const agregarProducto = async () => {
        try {
            await addProduct({
                nombre,
                // El input siempre guarda texto, así que convertimos a número
                // antes de mandarlo a Firestore.
                precio: Number(precio),
            });
            setNombre('');
            setPrecio('');
            Alert.alert('Producto agregado', 'El producto se agregó correctamente', [
                { text: 'Ok', onPress: goToHome },
            ]);
        } catch (error) {
            console.error('Error al agregar el producto', error);
            Alert.alert('Error', 'Ocurrió un error al agregar el producto. Por favor, intenta nuevamente.');
        }
    };

    return (
        // KeyboardAvoidingView evita que el teclado tape los inputs al escribir.
        // En iOS conviene 'padding' y en Android 'height'.
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
            >
                <Text style={styles.title}>Agregar producto</Text>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setNombre}
                        value={nombre}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPrecio}
                        value={precio}
                        keyboardType='numeric'
                    />
                </View>

                <TouchableOpacity style={styles.button} onPress={agregarProducto}>
                    <Text style={styles.buttonText}>Agregar producto</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={goToHome}>
                    <Text style={styles.buttonText}>Volver a home</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Add;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingLeft: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
        width: '100%'
    },
    button: {
        backgroundColor: '#0288d1',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    inputContainer: {
        width: '100%',
        padding: 16,
        backgroundColor: '#f8f9fa',
        marginBottom: 16,
    },
});
