import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import getData from "../db/getData";
import useObtenerPedido from "../hook/useObtenerPedido";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage, useIntl } from 'react-intl';

function Historial() {
    const navigation = useNavigation()
    const [producto, setProducto] = useState([]);
    const [lista] = useObtenerPedido();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const listPedido = await getData("pedido");
    
            // Filtrar los pedidos cuyo estado sea 'completado'
            const filteredPedidos = listPedido.filter((element) => element.estado === 'completado');
    
            // Calcular el precio total de cada pedido
            const updatedPedidos = filteredPedidos.map((element) => {
                let pedidoTotal = 0;
                element.pedido.forEach((pedido) => {
                    let precioInt = parseInt(pedido.price);
                    pedidoTotal += pedido.stock * precioInt;
                });
                return { ...element, precioTotal: pedidoTotal };
            });
    
            setProducto(updatedPedidos); // Actualizar el estado con los pedidos filtrados
        }
    
        Promise.all([fetchData()]).then(() => setLoading(false));
    }, [lista]);
    
    

    const detailFactura = (factura) => {
        navigation.navigate("DetailFactura", {factura:factura})
    }

    if (loading){
        return <LoadingScreen message="Cargando datos de ventas..." />; // Uso del componente reutilizable
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                {producto.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.container} onPress={() => detailFactura(item)}>
                        <Text style={styles.productName}><FormattedMessage id="pedido" /> #{index + 1}</Text>
                        <Text style={styles.productId}>ID: {item.id.slice(0, 5)}</Text>
                        <Text style={styles.price}>Total: ${item.precioTotal}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginVertical: 5,
        backgroundColor: '#FFFFFF',
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
