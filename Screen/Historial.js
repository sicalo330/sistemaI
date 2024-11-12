import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import getData from "../db/getData";
import useObtenerPedido from "../hook/useObtenerPedido";

function Historial() {
    const [producto, setProducto] = useState([]);
    const [cantidadPedidoTotal, setCantidadPedidoTotal] = useState(0)
    const [lista] = useObtenerPedido()

    useEffect(() => {
        let pedidoTotal = 0
        async function fetchData() {
            const listPedido = await getData("pedido");
            setProducto(listPedido);
            listPedido.forEach((element) => {
                element.pedido.forEach((pedido) => {
                    let precioInt = parseInt(pedido.price);
                    pedidoTotal += pedido.stock * precioInt
                })
                element.precioTotal = pedidoTotal
            })
            console.log(listPedido)
        }
        fetchData();
    }, [lista]);

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                {producto.map((item, index) => (
                    item.pedido.map((pedido,index) => (
                        <View key={index} style={styles.container}>
                            <Text style={styles.productName}>{pedido.nombreProducto}</Text>
                            <Text style={styles.price}>${item.precioTotal}</Text>
                        </View>
                    ))
                ))}
            </ScrollView>
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
