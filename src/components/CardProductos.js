// Componente de presentación, no maneja lógica de Firebase ni estado propio,
// solo recibe datos por props y dibuja una tarjeta con la info de un producto.
// Se usa dentro de Home.js una vez por cada producto de la lista.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// onDelete y onToggleSold son funciones que nos pasa Home.js. Este componente
// no sabe borrar productos ni nada de eso, solo avisa al padre qué producto
// tocaron.
const CardProductos = ({ id, nombre, precio, vendido, onDelete, onToggleSold }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.nombre}>{nombre}</Text>
            <Text style={styles.text}>${precio}</Text>
            <Text style={[styles.text, vendido ? styles.vendido : styles.disponible]}>
                {vendido ? "Vendido" : "Disponible"}
            </Text>

            <View style={styles.buttonContainer}>
                {/*
                  Usamos una función flecha para poder pasarle el id de este
                  producto en el momento en que se toca el botón. Si
                  pusiéramos onPress={onDelete(id)} a secas se ejecutaría
                  apenas se dibuja la pantalla, no cuando se toca el botón.
                */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(id)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.updateButton, vendido ? styles.regresarButton : styles.venderButton]}
                    onPress={() => onToggleSold(id, vendido)}>
                    <Text style={styles.updateButtonText}>
                        {vendido ? "Devolver Producto" : "Vender"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3, // sombra en Android (en iOS la dan las propiedades shadow* de arriba)
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginBottom: 5,
    },
    vendido: {
        color: 'red',
        fontWeight: 'bold',
    },
    disponible: {
        color: 'green',
        fontWeight: 'bold',
    },
    image: {
        // Queda por si en algún momento se agregan imágenes de producto,
        // hoy no se usa en ningún Image.
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    updateButton: {
        padding: 10,
        borderRadius: 5,
    },
    updateButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    venderButton: {
        backgroundColor: '#4caf50',
    },
    regresarButton: {
        backgroundColor: '#ff9800',
    },
});

export default CardProductos;
