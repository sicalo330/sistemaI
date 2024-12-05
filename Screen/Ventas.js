import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { StyleSheet } from "react-native";
import { titlePrice, linkContainer } from "../Style/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";
import useObtenerDatos from "../hook/useObtenerDatos";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage, useIntl } from 'react-intl';
import { SafeAreaView } from "react-native-safe-area-context";

function Ventas() {
    const [precio, setPrecio] = useState(0);
    const [precioPedido, setPrecioPedido] = useState(0);
    const [loading, setLoading] = useState(true); // Estado de carga

    const intl = useIntl();
    const [listaPedido] = useObtenerDatos('pedido');
    const [listaProducto] = useObtenerDatos('producto');
    const navigation = useNavigation();

    useEffect(() => {
        function calcularPrecios() {
            let precioTotal = 0;//Precio total es el precio del inventario
            let precioTotalPedido = 0;//Precio total pedido es el precio de pedidos que están en estado proceso o completado
    
            // Calcular el precio total de los productos en inventario
            //Aprovechando que de por sí ya se está trayendo los productos actualizados por useObtenerDatos
            //Ya no es necesario volverlos a llamar con getData
            listaProducto.forEach((element) => {
                let precioInt = parseInt(element.price, 10);// el ,10 es para la base decimal, js ya lo tiene por defecto
                //Pero por seguridad, ¿Por qué no?
                precioTotal += precioInt * element.stock;
                //Se multiplica la cantidad de producto que existe en el invetnario con el stock y se agrega a precioTotal
            });
    
            // Calcular el precio total de los pedidos no cancelados
            listaPedido.forEach((element) => {
                if (element.estado !== "cancelado") {
                    element.pedido.forEach((item) => {
                        let precioInt = parseInt(item.price, 10);//Base decimal, ver comentarios de arriba
                        precioTotalPedido += precioInt * item.stock;
                    });
                }
            });
    
            setPrecio(precioTotal);
            setPrecioPedido(precioTotalPedido);
        }
        //Siempre y cuando haya más de un producto o un pedido se hará el calculo, en el caso de que ambos estén vacíos no vale
        //la pena
        if (listaProducto.length > 0 || listaPedido.length > 0) {
            calcularPrecios();
        }
        Promise.all([calcularPrecios()]).then(() => setLoading(false));
    }, [listaProducto, listaPedido]);
    
    

    const navegarHistorial = () => {
        //Para navegar se cambia esto
        //                         |
        //                         v
        navigation.navigate("Historial");//navigation es un hook que nos permite navetgar entre las rutas de la aplicación
    };

    // Mostrar pantalla de carga mientras `loading` esté en `true`
    if (loading) {
        return <LoadingScreen />;
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
