import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebase/firebase";

const getSingleData = async (collectionName, documentId) => {
    console.log("Obteniendo un único registro...");
    try {
        // Referencia al documento específico en la colección
        const docRef = doc(FIRESTORE_DB, collectionName, documentId);
        
        // Obtiene el documento
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Documento obtenido:", docSnap.data());
            // Retorna el objeto del documento, junto con su ID
            return { id: docSnap.id, ...docSnap.data() };
        } else {
            console.log("No existe un documento con ese ID");
            return null;
        }
    } catch (err) {
        console.error("Error al obtener el documento:", err);
        return { error: err.message }; // Guarda el error si ocurre
    }
};

export default getSingleData;
