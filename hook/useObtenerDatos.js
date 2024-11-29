import { useState, useEffect } from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy, where, limit } from "firebase/firestore";

function useObtenerDatos(tabla){
    const [producto, setProducto] = useState([]);
    const [ultimoProducto, setUltimoProducto] = useState(null);
    
    useEffect(() => {
        const consulta = query(
            collection(FIRESTORE_DB,tabla),
        );

        const unsuscribe = onSnapshot(consulta, (snapshot) => {
            setProducto(snapshot.docs.map((producto) => {
                return {...producto.data(), id:producto.id}
            }))
        })

        return unsuscribe
    },[])
    return [producto]
}

export default useObtenerDatos