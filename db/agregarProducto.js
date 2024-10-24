import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";

const agregarProducto = async (ingredient) => {
    console.log("Agregando producto...")
    try {
        await addDoc(collection(FIRESTORE_DB, 'producto'), {
            nombreProducto: ingredient.nombreProducto,
            urlProducto: ingredient.url,
            ingredients: ingredient.ingredients,
            price:ingredient.price,
            stock:ingredient.stock,
            estado:"Pendiente"
        });
        console.log("Producto agregado con éxito.");
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
    }
};

export default agregarProducto