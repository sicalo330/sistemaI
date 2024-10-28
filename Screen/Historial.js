import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import getData from "../db/getData";

function Historial() {
    const [producto, setProducto] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const listProducto = await getData("producto");
            setProducto(listProducto);
        }
        fetchData();
    }, []);

    return (
        <View style={styles.mainContainer}>
            {producto.map((item, index) => (
                <View key={index} style={styles.container}>
                    <Text style={styles.productName}>{item.nombreProducto}</Text>
                    <Text style={styles.price}>${item.price}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5', // Fondo suave y neutro
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        backgroundColor: '#FFFFFF', // Fondo blanco para destacar
        borderRadius: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 2,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: '400',
        color: '#777'
    }
});

export default Historial;
