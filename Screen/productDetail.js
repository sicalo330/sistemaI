import React, { useEffect } from "react";
import { Text } from "react-native-web";
import getSingleData from "../db/getSingleData";

function productDetail({route}){
    const { product } = route.params

    useEffect(() => {
        function fetchData(){
            console.log(product)
            //getSingleData('producto',product.id)
        }
        fetchData()
    },[])

    return(
        <View>
            <Text>Estamos en la ventana productDetail</Text>
            <Text>{product.nombreProducto}</Text>
        </View>
    )
}

export default productDetail