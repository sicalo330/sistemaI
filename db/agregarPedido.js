import react from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Alert } from "react-native";

const agregarPedido = async (item, tabla) => {
    try {
        await addDoc(collection(FIRESTORE_DB, tabla), {
            pedido:item,
            estado:"proceso"
        });
    } catch (error) {
        console.error("Error al agregar el producto: ", error);
        Alert.alert("Error al agregar producto",error)
    }
};

export default agregarPedido