// ============================================================================
// src/screens/Add.js
// ----------------------------------------------------------------------------
// Pantalla para AGREGAR un producto nuevo. Se muestra como un "modal"
// (ventana que aparece desde abajo) cuando el usuario toca el botón
// "Agregar Producto" en Home.js (ver Navigation.js, donde se configura
// presentation: 'modal').
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

// Hook con toda la lógica de productos (leer, agregar, borrar, etc.).
// Acá solo usamos "addProduct".
import useProducts from '../hooks/useProducts';

// "navigation" es una prop que React Navigation le inyecta AUTOMÁTICAMENTE a
// cualquier componente que esté declarado como Stack.Screen. Nos permite
// movernos entre pantallas (navigate, goBack, etc.) sin tener que armar esa
// lógica nosotros mismos.
const Add = ({ navigation }) => {
    // Estado local del formulario: lo que el usuario va escribiendo en los
    // campos de texto, ANTES de guardarlo en Firestore.
    const [nombre, setNombre] = useState('');
    const [precio, setPrecio] = useState('');

    // Solo necesitamos la función para agregar productos.
    const { addProduct } = useProducts();

    // Vuelve a la pantalla anterior (Home), cerrando este modal.
    const goToHome = () => {
        navigation.goBack();
    };

    // Se ejecuta cuando el usuario toca "Agregar producto".
    const agregarProducto = async () => {
        try {
            // Llamamos a la función del hook, que habla con Firestore.
            await addProduct({
                nombre,
                // El input de precio guarda un STRING (todo lo que se
                // escribe en un TextInput es texto), así que lo convertimos
                // a número con Number(...) antes de guardarlo.
                precio: Number(precio),
            });

            // Si todo salió bien, limpiamos el formulario...
            setNombre('');
            setPrecio('');

            // ...y mostramos una alerta nativa de confirmación. Cuando el
            // usuario toca "Ok", volvemos automáticamente a Home gracias al
            // callback onPress: goToHome.
            Alert.alert('Producto agregado', 'El producto se agregó correctamente', [
                { text: 'Ok', onPress: goToHome },
            ]);
        } catch (error) {
            // Si algo falla (sin conexión, permisos de Firestore, etc.),
            // lo registramos en consola (útil para depurar durante el
            // desarrollo) y avisamos al usuario con una alerta.
            console.error('Error al agregar el producto', error);
            Alert.alert('Error', 'Ocurrió un error al agregar el producto. Por favor, intenta nuevamente.');
        }
    };

    return (
        // KeyboardAvoidingView evita que el teclado tape los campos de
        // texto al escribir. El comportamiento correcto varía según la
        // plataforma:
        // - iOS: 'padding' (empuja el contenido hacia arriba).
        // - Android: 'height' (achica el alto disponible).
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {/*
              ScrollView permite que el contenido se pueda desplazar si no
              entra todo en la pantalla (por ejemplo, cuando el teclado
              ocupa la mitad de la pantalla).
              keyboardShouldPersistTaps='handled' permite tocar botones
              aunque el teclado esté abierto, sin que el toque se "pierda"
              cerrando primero el teclado.
            */}
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps='handled'
            >
                <Text style={styles.title}>Agregar producto</Text>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre:</Text>
                    <TextInput
                        style={styles.input}
                        // onChangeText se ejecuta en CADA letra que el
                        // usuario escribe; acá directamente le pasamos la
                        // función setNombre, que actualiza el estado con el
                        // nuevo texto completo.
                        onChangeText={setNombre}
                        // "value" hace que este sea un input "controlado":
                        // el TextInput siempre muestra lo que hay en el
                        // estado "nombre", nunca un valor "propio" separado.
                        value={nombre}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Precio:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={setPrecio}
                        value={precio}
                        // Muestra el teclado numérico del celular en vez del
                        // teclado de letras, para que sea más cómodo
                        // escribir un precio.
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
        // flexGrow (en vez de flex) permite que, aunque el contenido sea
        // chico, siga ocupando toda la altura disponible para poder
        // centrarlo verticalmente con justifyContent.
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
        width: '100%',
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
