import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import getData from "../db/getData";
import useObtenerDatos from "../hook/useObtenerDatos";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage, useIntl } from 'react-intl';

function Historial() {
    const navigation = useNavigation()
    const [pedido, setPedido] = useState([]);
    const [lista] = useObtenerDatos('pedido');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const listPedido = await getData("pedido");
    
            // Filtrar los pedidos cuyo estado sea 'completado'
            const filteredPedidos = listPedido.filter((element) => element.estado === 'completado');
    
            // Calcular el precio total de cada pedido
            const updatedPedidos = filteredPedidos.map((element) => {
                let pedidoTotal = 0;//Es necesario volver a 0 para rehacer la suma para cada producto
                element.pedido.forEach((pedido) => {
                    //Por alguna razón el precio de cada producto es un string y no un entero por lo tanto es necesario convertirlo a entero
                    let precioInt = parseInt(pedido.price);
                    //Se suma el stock multiplicado por la cantidad
                    pedidoTotal += pedido.stock * precioInt;
                });
                return { ...element, precioTotal: pedidoTotal };//Se hace un clon del producto y se le agrega un atributo extra llamado pedido total
            });
    
            setPedido(updatedPedidos); // Actualizar el estado con los pedidos filtrados
        }
    
        Promise.all([fetchData()]).then(() => setLoading(false));
    }, [lista]);
    
    

    const detailFactura = (factura) => {
        navigation.navigate("DetailFactura", {factura:factura})
    }

    if (loading){
        return <LoadingScreen />; // Uso del componente reutilizable
    }

    return (
        <View style={styles.mainContainer}>
            <ScrollView>
                {pedido.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.container} onPress={() => detailFactura(item)}>
                        <Text style={styles.productId}><FormattedMessage id="pedido" /> #{index + 1}</Text>
                        <Text style={styles.productId}>ID: {item.id.slice(0, 5)}</Text>
                        <Text style={styles.price}><FormattedMessage id="total" />: ${item.precioTotal}</Text>
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
    productId: {
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
