import { doc, updateDoc } from "firebase/firestore"; 
import { FIRESTORE_DB } from "../firebase/firebase";

const updateProducto = async (productoId, newData) => {
    try {
        // Filtramos valores undefined antes de la actualización (opcional pero recomendable)
        const sanitizedData = Object.fromEntries(
            Object.entries(newData).filter(([_, v]) => v !== undefined)
        );

        // Referencia al documento que deseas actualizar
        const productoRef = doc(FIRESTORE_DB, 'producto', productoId);

        // Actualizamos el campo con los datos que pasamos
        await updateDoc(productoRef, sanitizedData);
    } catch (error) {
        console.error('Error actualizando el producto:', error);
    }
};

export default updateProducto;
