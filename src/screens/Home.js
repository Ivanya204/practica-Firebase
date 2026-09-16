// ============================================================================
// src/screens/Home.js
// ----------------------------------------------------------------------------
// Pantalla PRINCIPAL de la app, una vez que el usuario ya inició sesión.
// Muestra:
//   - Un encabezado con el nombre de la tienda y el email del usuario.
//   - La lista de productos (usando CardProductos para cada uno).
//   - Un botón para ir a la pantalla de agregar producto (Add.js).
//   - Un botón para cerrar sesión.
// ============================================================================

import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Hook de autenticación: acá lo usamos para saber el email del usuario
// actual y para poder cerrar sesión.
import useAuth from '../hooks/useAuth';

// Hook de productos: nos da la lista de productos y las acciones sobre
// ellos (borrar, marcar vendido/disponible).
import useProducts from '../hooks/useProducts';

// Componente que dibuja UNA tarjeta de producto.
import CardProductos from '../components/CardProductos';

// "navigation" nos lo inyecta React Navigation automáticamente, porque Home
// está declarada como Stack.Screen en Navigation.js.
const Home = ({ navigation }) => {
    const { user, signOutUser } = useAuth();
    const { products, loading, error, deleteProduct, toggleSold } = useProducts();

    // Navega a la pantalla "Add" (definida en Navigation.js).
    const goToAdd = () => {
        navigation.navigate('Add');
    }

    // Esta función le dice a FlatList CÓMO dibujar cada elemento de la
    // lista. FlatList la llama automáticamente por cada producto, pasándole
    // un objeto { item, index, ... }; acá solo usamos "item".
    const renderItem = ({ item }) => (
        <CardProductos
            id={item.id}
            nombre={item.nombre}
            precio={item.precio}
            vendido={item.vendido}
            // Le pasamos las funciones del hook directamente. CardProductos
            // las va a llamar con el id correspondiente cuando el usuario
            // toque los botones "Eliminar" o "Vender/Devolver".
            onDelete={deleteProduct}
            onToggleSold={toggleSold}
        />
    );

    // Cierra la sesión del usuario actual. Al hacerlo, useAuth() detecta el
    // cambio (onAuthStateChanged) y Navigation.js automáticamente muestra
    // la pantalla de login otra vez.
    const handleSignOut = async () => {
        await signOutUser();
    };

    return (
        <View style={styles.container}>
            {/* Encabezado: nombre de la tienda + botón de cerrar sesión */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>Ivanya Store</Text>
                    <Text style={styles.title}>Productos disponibles</Text>
                </View>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/*
              user?.email usa "optional chaining" (el "?."): si "user"
              fuera null o undefined, en vez de romper la app con un error,
              esto devuelve undefined directamente (y no se muestra nada).
              Acá casi nunca va a ser null porque Home solo se muestra
              cuando SÍ hay usuario logueado (ver Navigation.js), pero es
              una protección extra por las dudas.
            */}
            <Text style={styles.userText}>{user?.email}</Text>

            {/*
              Mostramos UNA de tres cosas posibles, según el estado actual:
              1) Un spinner de carga mientras loading es true.
              2) Un mensaje de error si algo falló al leer Firestore.
              3) La lista de productos (si hay al menos uno).
              4) Un mensaje de "no hay productos" si la lista está vacía.
              Esto se resuelve encadenando operadores ternarios.
            */}
            {loading ? (
                <ActivityIndicator size="large" color="#0288d1" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : products.length !== 0 ? (
                // FlatList es el componente de React Native optimizado para
                // listas largas: solo dibuja en pantalla los elementos
                // visibles (y un poco más), en vez de renderizar TODOS los
                // productos de una sola vez, aunque haya miles.
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    // keyExtractor le dice a React/FlatList cómo identificar
                    // de forma única a cada elemento de la lista (necesario
                    // para que React pueda optimizar qué volver a dibujar).
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.subtitle}>No hay productos disponibles</Text>
            )}

            {/* Botón flotante (visualmente) para ir a agregar un producto */}
            <TouchableOpacity
                style={styles.Button}
                onPress={goToAdd}>
                <Text style={styles.ButtonText}>Agregar Producto</Text>
            </TouchableOpacity>
        </View>
    );
};


export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        padding: 20,
    },
    header: {
        flexDirection: 'row', // pone los elementos en fila (horizontal)
        justifyContent: 'space-between', // separa a los extremos
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    eyebrow: {
        // "eyebrow" es un término de diseño para un textito chico arriba de
        // un título principal, a modo de categoría/etiqueta.
        color: '#0288d1',
        fontSize: 13,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        marginTop: 4,
    },
    userText: {
        color: '#667085',
        marginBottom: 18,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 10,
        color: '#ff9800',
        marginTop: 30,
    },
    Button: {
        backgroundColor: '#0288d1',
        paddingVertical: 18,
        borderRadius: 14,
        marginTop: 20,
        marginHorizontal: 28,
    },
    ButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    signOutButton: {
        backgroundColor: '#E8EEF7',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    signOutText: {
        color: '#0B1F33',
        fontWeight: '700',
    },
    list: {
        flexGrow: 1,
    },
    errorText: {
        color: '#D92D20',
        textAlign: 'center',
        marginTop: 24,
    },
});
