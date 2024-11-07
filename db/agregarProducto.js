import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Alert } from "react-native";

const agregarProducto = async (ingredient) => {
    try {
        await addDoc(collection(FIRESTORE_DB, 'producto'), {
            nombreProducto: ingredient.nombreProducto,
            urlProducto: ingredient.url,
            ingredients: ingredient.ingredients,
            price:ingredient.price,
            stock:ingredient.stock,
            estado:"Pendiente"
        });
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        Alert.alert("Error al agregar producto",error)
    }
};

export default agregarProducto