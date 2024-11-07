import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc,getDocs } from "firebase/firestore";

const getData = async (data) => {
    try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, data));
        
        const ingredientList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        return ingredientList
      } catch (err) {
        console.error("Error fetching documents:", err);
        setError(err.message); // Guardar error si ocurre
      }
};

export default getData