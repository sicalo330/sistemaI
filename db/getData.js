import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc,getDocs } from "firebase/firestore";

const getData = async (data) => {
  //data es el nombre de la tabla a la que queremos llamar
    try {
        const querySnapshot = await getDocs(collection(FIRESTORE_DB, data));
        
        //querysnapshot.docs es la lista de productos, se ciclan en estos y se retorna un clon de la lista de la tabla junto con la id de cada registro de la tabla
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