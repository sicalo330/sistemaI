import { useState, useEffect } from "react";
import { FIRESTORE_DB } from "../firebase/firebase";
import { collection, onSnapshot, query } from "firebase/firestore";

function useObtenerDatos(tabla){
    const [producto, setProducto] = useState([]);
    const [ultimoProducto, setUltimoProducto] = useState(null);
    
    useEffect(() => {
        const consulta = query(
            collection(FIRESTORE_DB,tabla),
        );

        const unsuscribe = onSnapshot(consulta, (snapshot) => {//OnSnapshot es un obnservador que detecta cambios en el nombre de la tabla que se encuentra envuelto en consulta
            //Retorna un clon de la tabal con los registros de firebase a tiempo real
            setProducto(snapshot.docs.map((producto) => {
                return {...producto.data(), id:producto.id}
            }))
        })

        return unsuscribe
    },[])
    return [producto]
}

export default useObtenerDatos