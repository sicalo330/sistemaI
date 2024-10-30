import React, { useEffect,useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import getSingleData from "../db/getSingleData";


function productDetail({route}){
    const { product } = route.params
    const [productDetail, setProductDetail] = useState([])

    useEffect(() => {
        async function fetchData(){
            const listData = await getSingleData("producto", product.id)
            setProductDetail(listData)
            //getSingleData('producto',product.id)
        }
        fetchData()
    },[])

    return(
        <View style={styles.container}>
            <Image source={{ uri: productDetail.urlProducto }} style={styles.productImage} />
            <Text style={styles.productName}>{productDetail.nombreProducto}</Text>
            <Text style={styles.productPrice}>Precio: ${productDetail.price}</Text>
            <Text style={styles.productStock}>Stock: {productDetail.stock} unidades</Text>
            <Text style={styles.productStatus}>Estado: {productDetail.estado}</Text>
            <Text style={styles.sectionTitle}>Ingredientes:</Text>
            <FlatList
                data={productDetail.ingredients}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.ingredientItem}>- {item.ingredient}</Text>
                )}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: "#f8f9fa",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        alignItems: "center",
    },
    productImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 16,
    },
    productName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 20,
        color: "#4CAF50",
        marginBottom: 4,
    },
    productStock: {
        fontSize: 18,
        color: "#ff5722",
        marginBottom: 4,
    },
    productStatus: {
        fontSize: 18,
        color: "#9e9e9e",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginVertical: 8,
        color: "#333",
    },
    ingredientItem: {
        fontSize: 16,
        color: "#555",
    },
});

export default productDetail

