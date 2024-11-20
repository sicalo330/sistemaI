import { useState, useEffect } from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, onSnapshot, query, orderBy, where, limit } from "firebase/firestore";

function useObtenerDatos(tabla){
    const [producto, setProducto] = useState([]);
    const [ultimoProducto, setUltimoProducto] = useState(null);
    const [hayMasPorCargar, setHayMasPorCargar] = useState(false)
    
    useEffect(() => {
        const consulta = query(
            collection(FIRESTORE_DB,tabla),
        );

        const unsuscribe = onSnapshot(consulta, (snapshot) => {
            if(snapshot.docs.length > 0){
                setUltimoProducto(snapshot.docs[snapshot.docs.length - 1])
                setHayMasPorCargar(true)
            }else{
                setHayMasPorCargar(false)
            }

            setProducto(snapshot.docs.map((producto) => {
                return {...producto.data(), id:producto.id}
            }))
        })

        return unsuscribe
    },[])
    return [producto, hayMasPorCargar]
}

export default useObtenerDatos