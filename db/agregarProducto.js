import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Alert } from "react-native";

const agregarProducto = async (item, tabla) => {
    try {
        await addDoc(collection(FIRESTORE_DB, tabla), {
            nombreProducto: item.nombreProducto,
            urlProducto: item.urlProducto,
            ingredients: item.ingredients,
            price:item.price,
            stock:item.stock
        });
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        Alert.alert("Error al agregar producto",error)
    }
};

export default agregarProducto