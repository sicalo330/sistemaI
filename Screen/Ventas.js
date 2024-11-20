import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View,ActivityIndicator } from 'react-native';
import { StyleSheet } from "react-native";
import { titlePrice, linkContainer } from "../Style/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import { useNavigation } from "@react-navigation/native";
import useObtenerPedido from "../hook/useObtenerPedido";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage, useIntl } from 'react-intl';
import { SafeAreaView } from "react-native-safe-area-context";

function Ventas() {
    const [producto, setProducto] = useState([]);
    const [pedido, setPedido] = useState([]);
    const [precio, setPrecio] = useState(0);
    const [precioPedido, setPrecioPedido] = useState(0);
    const [precioVendido, setPrecioVendido] = useState(0);
    const [loading, setLoading] = useState(true); // Estado de carga

    const intl = useIntl();
    const [lista] = useObtenerPedido();
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchData() {
            const listProducto = await getData("producto");
            setProducto(listProducto);
        }

        async function fetchPedidos() {
            const listPedido = await getData('pedido');
            setPedido(listPedido);
        }

        // Llamamos ambas funciones y luego apagamos el indicador de carga
        Promise.all([fetchData(), fetchPedidos()]).then(() => setLoading(false));
    }, [lista]);

    useEffect(() => {
        function loopPrecio() {
            let precioTotal = 0;
            let precioTotalVendido = 0;
            let precioTotalPedido = 0;
    
            // Calcular el precio total de los productos en inventario
            producto.forEach((element) => {
                let precioInt = parseInt(element.price);
                precioTotal += precioInt * element.stock;
            });
    
            // Calcular el precio total de los pedidos activos
            pedido.forEach((element) => {
                if (element.estado !== "cancelado") { // Filtrar pedidos cancelados
                    let pedidos = element.pedido;
                    pedidos.forEach((item) => {
                        let precioInt = parseInt(item.price);
                        precioTotalPedido += precioInt * item.stock;
                    });
                }
            });
    
            setPrecio(precioTotal);
            setPrecioPedido(precioTotalPedido);
            setPrecioVendido(precioTotalVendido);
        }
    
        if (producto.length > 0 && pedido.length > 0) {
            loopPrecio();
        }
    }, [producto, pedido]);
    

    const navegarHistorial = () => {
        navigation.navigate("Historial");
    };

    // Mostrar pantalla de carga mientras `loading` esté en `true`
    if (loading){
        return <LoadingScreen message="Cargando datos de ventas..." />; // Uso del componente reutilizable
    }

    // Renderizar contenido principal cuando `loading` sea `false`
    return (
        <SafeAreaView style={styles.screenGeneral}>
            <View style={styles.containerPrice}>
                <View style={styles.inventarioContainer}>
                    <Text style={styles.title}>
                        <FormattedMessage id="ventas_encabezado_ventas" />
                    </Text>
                    <Text style={titlePrice.titleMain}>${precioPedido}</Text>
                </View>
            </View>
            <View style={styles.containerPrice}>
                <View style={styles.inventarioContainer}>
                    <Text style={styles.title}>
                        <FormattedMessage id="ventas_encabezado_inventario" />
                    </Text>
                    <Text style={titlePrice.titleMain}>${precio}</Text>
                </View>
            </View>
            <TouchableOpacity style={linkContainer.linkArrow} onPress={navegarHistorial}>
                <View>
                    <Text><FormattedMessage id="verVentas" /></Text>
                    <Text><FormattedMessage id="revisar" /></Text>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="arrow-right" size={25} color="black" />
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    containerPrice: {
        marginTop: 10,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    inventarioContainer: {
        justifyContent: 'center',
        width: 385,
        height: 100,
        backgroundColor: '#ddd',
        borderRadius: 10,
    },
    title: {
        fontSize: 15,
        textAlign: 'left',
        marginLeft: 10,
        color: '#66624f',
    },
    iconContainer: {
        alignContent: 'center',
        alignSelf: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    screenGeneral:{
        paddingTop:10
    }
});

export default Ventas;
