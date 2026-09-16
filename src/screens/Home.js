// Pantalla principal, una vez que el usuario ya inició sesión. Muestra el
// encabezado con el nombre de la tienda, la lista de productos, el botón
// para ir a agregar un producto y el botón de cerrar sesión.

import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useAuth from '../hooks/useAuth';
import useProducts from '../hooks/useProducts';
import CardProductos from '../components/CardProductos';

const Home = ({ navigation }) => {
    const { user, signOutUser } = useAuth();
    const { products, loading, error, deleteProduct, toggleSold } = useProducts();

    const goToAdd = () => {
        navigation.navigate('Add');
    }

    // FlatList llama a esta función por cada producto para saber cómo dibujarlo.
    const renderItem = ({ item }) => (
        <CardProductos
            id={item.id}
            nombre={item.nombre}
            precio={item.precio}
            vendido={item.vendido}
            onDelete={deleteProduct}
            onToggleSold={toggleSold}
        />
    );

    // Al cerrar sesión, useAuth detecta el cambio y Navigation.js muestra
    // la pantalla de login automáticamente.
    const handleSignOut = async () => {
        await signOutUser();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.eyebrow}>Ivanya Store</Text>
                    <Text style={styles.title}>Productos disponibles</Text>
                </View>
                <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                    <Text style={styles.signOutText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/* user?.email por las dudas de que user sea null en algún momento */}
            <Text style={styles.userText}>{user?.email}</Text>

            {/* Según el estado mostramos una de cuatro cosas: loading, error,
                la lista de productos, o el mensaje de que no hay productos. */}
            {loading ? (
                <ActivityIndicator size="large" color="#0288d1" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : products.length !== 0 ? (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            ) : (
                <Text style={styles.subtitle}>No hay productos disponibles</Text>
            )}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 8,
    },
    eyebrow: {
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
