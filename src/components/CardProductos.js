// ============================================================================
// src/components/CardProductos.js
// ----------------------------------------------------------------------------
// Este es un componente "de presentación" (o "tonto"): no maneja lógica de
// Firebase ni estado propio, solo recibe datos por "props" (propiedades) y
// dibuja UNA tarjeta con la información de un producto.
//
// Se usa dentro de Home.js, una vez por cada producto que hay en la lista
// (ver el FlatList y su renderItem en Home.js).
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// Este componente recibe sus datos por "props". Usamos destructuring
// directamente en los parámetros de la función para no tener que escribir
// "props.nombre", "props.precio", etc. en todos lados.
//
// - id: identificador del producto en Firestore (para poder borrarlo).
// - nombre, precio, vendido: los datos del producto a mostrar.
// - onDelete: función que el componente PADRE (Home.js) nos pasa, para que
//   cuando el usuario toque "Eliminar", le avisemos al padre CUÁL producto
//   borrar (este componente no sabe borrar productos, solo avisa).
// - onToggleSold: función que el padre nos pasa para avisar "cambiá el
//   estado de vendido/disponible de este producto".
const CardProductos = ({ id, nombre, precio, vendido, onDelete, onToggleSold }) => {
    return (
        <View style={styles.card}>
            {/* Nombre del producto */}
            <Text style={styles.nombre}>{nombre}</Text>

            {/* Precio, con un "$" delante */}
            <Text style={styles.text}>${precio}</Text>

            {/*
              Este Text combina DOS estilos en un arreglo: el estilo base
              (styles.text) y, además, un estilo distinto según si está
              vendido o no (rojo para "Vendido", verde para "Disponible").
              React Native permite pasar un ARREGLO de estilos y los combina
              en orden (el último gana si hay propiedades repetidas).
            */}
            <Text style={[styles.text, vendido ? styles.vendido : styles.disponible]}>
                {vendido ? "Vendido" : "Disponible"}
            </Text>

            <View style={styles.buttonContainer}>
                {/*
                  TouchableOpacity es un botón "invisible" (sin estilo por
                  defecto) que baja la opacidad al tocarlo, dando feedback
                  visual de que fue presionado.

                  onPress recibe una función. Usamos una función flecha
                  "() => onDelete(id)" para poder pasarle el "id" de ESTE
                  producto en particular en el momento en que se toca el
                  botón (si escribiéramos onPress={onDelete(id)} a secas, se
                  ejecutaría inmediatamente al dibujar la pantalla, ¡no
                  cuando se toca el botón!).
                */}
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(id)}>
                    <Text style={styles.deleteButtonText}>Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    // Igual que arriba: combinamos el estilo base del botón
                    // con un color distinto según el estado actual.
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

// Todos los estilos de esta tarjeta, agrupados con StyleSheet.create.
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        // Estas 4 propiedades juntas generan una sombra debajo de la
        // tarjeta (solo tienen efecto visible en iOS; en Android además
        // hace falta "elevation").
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        // elevation es el equivalente de la sombra, pero para Android.
        elevation: 3,
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
        // Estilo reservado por si en el futuro se agregan imágenes de
        // producto (hoy no se usa en ningún <Image>, pero se deja listo).
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row', // pone los botones uno al lado del otro
        justifyContent: 'space-between', // separa los botones a los extremos
        marginTop: 10,
    },
    deleteButton: {
        backgroundColor: '#ff4d4d', // rojo, para indicar acción destructiva
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
        backgroundColor: '#4caf50', // verde: acción de "marcar como vendido"
    },
    regresarButton: {
        backgroundColor: '#ff9800', // naranja: acción de "volver a disponible"
    },
});

export default CardProductos;
