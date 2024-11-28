import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebase/firebase";

const getSingleData = async (tabla, documentId) => {
    try {
        // Referencia al documento específico en la colección
        const docRef = doc(FIRESTORE_DB, tabla, documentId);
        
        // Obtiene el documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // Retorna el objeto del documento, junto con su ID
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            return null;
        }
    } catch (err) {
        console.error("Error al obtener el documento:", err);
        return { error: err.message }; // Guarda el error si ocurre
    }
};

export default getSingleData;
