// ============================================================================
// src/hooks/useProducts.js
// ----------------------------------------------------------------------------
// Este hook centraliza TODA la lógica relacionada a los productos de la
// tienda: leerlos en tiempo real desde Firestore, agregar uno nuevo,
// borrarlo, y marcarlo como vendido/disponible.
//
// La idea es la misma que en useAuth.js: en vez de repetir código de
// Firestore en cada pantalla, cualquier componente que necesite productos
// simplemente hace:
//   const { products, addProduct, deleteProduct, toggleSold } = useProducts();
// ============================================================================

import { useEffect, useState } from 'react';

// Funciones de Firestore que vamos a usar:
// - addDoc: agrega un documento nuevo a una colección.
// - collection: apunta a una colección (como una "tabla", en términos de
//   bases de datos relacionales, aunque Firestore es NoSQL).
// - deleteDoc: borra un documento.
// - doc: apunta a UN documento específico dentro de una colección (por id).
// - onSnapshot: se "suscribe" a los cambios de una colección/consulta, y
//   Firestore nos avisa EN TIEMPO REAL cada vez que algo cambia (sin tener
//   que refrescar la pantalla a mano).
// - orderBy: para pedirle a Firestore que devuelva los resultados en un
//   orden específico.
// - query: arma una "consulta" combinando una colección con condiciones
//   (como orderBy, where, etc.).
// - updateDoc: actualiza campos puntuales de un documento ya existente.
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';

// Traemos la instancia de Firestore ya inicializada en firebase.js.
import { database } from '../config/firebase';

// Apuntamos a la colección "productos" de Firestore. Esta referencia se crea
// UNA sola vez (fuera del hook) porque no cambia entre renders; no hace
// falta volver a crearla cada vez que el componente se vuelve a dibujar.
const productsCollection = collection(database, 'productos');

const useProducts = () => {
  // products: el arreglo de productos que se está mostrando en pantalla.
  // Empieza vacío y se llena apenas Firestore nos manda los datos.
  const [products, setProducts] = useState([]);

  // loading: true mientras esperamos la primera respuesta de Firestore.
  const [loading, setLoading] = useState(true);

  // error: mensaje de error si algo falla al leer los productos.
  const [error, setError] = useState(null);

  useEffect(() => {
    // Armamos la consulta: "todos los documentos de la colección
    // productos, ordenados por el campo 'creado', del más nuevo al más
    // viejo ('desc' = descendente)".
    const productsQuery = query(productsCollection, orderBy('creado', 'desc'));

    // onSnapshot es la magia de "tiempo real" de Firestore: en vez de pedir
    // los datos UNA vez (como haría un fetch normal), nos suscribimos y
    // Firestore ejecuta esta función CADA VEZ que los datos cambian (alguien
    // agrega, borra o edita un producto, incluso desde otro dispositivo).
    const unsubscribe = onSnapshot(
      productsQuery,
      // Primer callback: se ejecuta cuando hay datos nuevos.
      (querySnapshot) => {
        // querySnapshot.docs es un arreglo de "documentos" de Firestore.
        // Cada "document" tiene un id y sus datos (document.data()).
        // Acá los transformamos a un arreglo simple de objetos JS, cada uno
        // con su id incluido (útil para poder borrarlo/editarlo después).
        const docs = querySnapshot.docs.map((document) => ({
          id: document.id,
          // El operador "..." (spread) copia todos los campos del producto
          // (nombre, precio, vendido, creado) dentro de este objeto.
          ...document.data(),
        }));

        setProducts(docs);
        setLoading(false);
        setError(null);
      },
      // Segundo callback: se ejecuta si ocurre un error (por ejemplo, sin
      // conexión a internet o permisos insuficientes en Firestore).
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    // Igual que en useAuth: cuando el componente se desmonta, cancelamos la
    // suscripción para no seguir escuchando cambios que ya nadie necesita.
    return unsubscribe;
  }, []);

  // addProduct: crea un producto nuevo en Firestore.
  // Recibe un objeto y usa "destructuring" para sacar directamente "nombre"
  // y "precio" de ese objeto.
  const addProduct = async ({ nombre, precio }) => {
    await addDoc(productsCollection, {
      // .trim() saca espacios en blanco sobrantes al principio/final del
      // texto (ej: si el usuario escribió "  Remera  ").
      nombre: nombre.trim(),
      precio,
      // Todo producto nuevo arranca como "no vendido".
      vendido: false,
      // Guardamos la fecha de creación; junto con orderBy('creado', 'desc')
      // de arriba, esto hace que los productos más nuevos aparezcan primero.
      creado: new Date(),
    });
  };

  // deleteProduct: borra un producto de Firestore por su id.
  const deleteProduct = async (id) => {
    // doc(database, 'productos', id) arma la "dirección" exacta del
    // documento a borrar: colección "productos", documento con ese id.
    await deleteDoc(doc(database, 'productos', id));
  };

  // toggleSold: cambia el estado de "vendido" de un producto (si estaba
  // vendido, pasa a disponible, y viceversa).
  const toggleSold = async (id, vendido) => {
    await updateDoc(doc(database, 'productos', id), {
      // El "!" invierte el valor booleano: !true es false, !false es true.
      vendido: !vendido,
    });
  };

  return {
    products,
    loading,
    error,
    addProduct,
    deleteProduct,
    toggleSold,
  };
};

export default useProducts;
