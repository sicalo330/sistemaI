import React from "react";
import { Text } from "react-native-web";

function productDetail({route}){
    const { product } = route.params
    return(
        <View>
            <Text>Estamos en la ventana productDetail</Text>
            <Text>{product.nombreProducto}</Text>
        </View>
    )
}

export default productDetail