// Hook que centraliza la lógica de productos: leerlos en tiempo real desde
// Firestore, agregar uno nuevo, borrarlo y marcarlo como vendido/disponible.

import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { database } from '../config/firebase';

// Referencia a la colección "productos" de Firestore. La creamos una sola vez
// acá afuera porque no cambia entre renders, no hace falta volver a crearla
// cada vez que el componente se vuelve a dibujar.
const productsCollection = collection(database, 'productos');

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pedimos todos los productos ordenados por fecha de creación, del más
    // nuevo al más viejo.
    const productsQuery = query(productsCollection, orderBy('creado', 'desc'));

    // onSnapshot es lo que hace que esto sea "tiempo real": en vez de pedir
    // los datos una sola vez, nos suscribimos y Firestore ejecuta este
    // callback cada vez que algo cambia (se agrega, borra o edita un
    // producto, incluso desde otro dispositivo).
    const unsubscribe = onSnapshot(
      productsQuery,
      (querySnapshot) => {
        // Transformamos los documentos de Firestore en objetos JS normales,
        // agregando el id de cada uno (lo necesitamos después para poder
        // borrar o editar ese producto puntual).
        const docs = querySnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data(),
        }));

        setProducts(docs);
        setLoading(false);
        setError(null);
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  const addProduct = async ({ nombre, precio }) => {
    await addDoc(productsCollection, {
      nombre: nombre.trim(),
      precio,
      vendido: false,
      creado: new Date(),
    });
  };

  const deleteProduct = async (id) => {
    await deleteDoc(doc(database, 'productos', id));
  };

  const toggleSold = async (id, vendido) => {
    await updateDoc(doc(database, 'productos', id), {
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
