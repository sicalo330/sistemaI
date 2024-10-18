import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const agregarProducto = async () => {
    console.log("Intentando agregar producto...");
    try {
        await addDoc(collection(FIRESTORE_DB, 'producto'), {
            nombre: "Miguel es una loca"
        });
        console.log("Producto agregado con éxito.");
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
    }
};

export default agregarProducto