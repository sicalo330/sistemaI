import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateData from "../db/updateData";
import useObtenerDatos from "../hook/useObtenerDatos";
import LoadingScreen from "./LoadingScreen";
import { useNavigation } from "@react-navigation/native";
import { FormattedMessage } from "react-intl";
import LottieView from 'lottie-react-native';
import manifest from './../assets/manifest.json'

function Ordenes() {
    const [listPedido, setPedido] = useState([]);
    const [productoOriginal, setProductoOriginal] = useState([]);
    // const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('proceso');
    const [lista] = useObtenerDatos('pedido');
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigation = useNavigation();

    const fetchData = async () => {
        const listP = await getData("pedido");//Se obtienen todos los pedidos
        setPedido(listP);
        const listProducto = await getData("producto")//Se obtienen todos los producto
        setProductoOriginal(listProducto)
        // setEstado(new Array(listP.length).fill(false));
    };

    useEffect(() => {
        Promise.all([fetchData()]).then(() => setLoading(false));
    }, [lista]);

    const updateEstado = async (item, nuevoEstado) => {
        //Se entra a este if, significa que el pedido fue cancelado y por lo tanto las cantidades se deben devolver a cada producto
        //Si se pidio una cantidad de 7 esos 7 se debe sumar al inventario total 
        if (nuevoEstado === "cancelado") {
            // Itera sobre el array "pedido" de "item"
            for (let i = 0; i < item.pedido.length; i++) {
                //Compara cada id de cada producto del pedido con los ids de productoOriginal
                for (let j = 0; j < productoOriginal.length; j++) {
                    if (item.pedido[i].id === productoOriginal[j].id) {
                        let recuperacion = productoOriginal[j].stock + item.pedido[i].stock;
                        updateData("producto",productoOriginal[j].id,{stock:recuperacion})
                    }
                }
            }
        }
        //Si no entra al if significa el pedido se va a completar y por lo tanto solo basta con cambiar su estado
        //Se actualiza el estado de cada pedido
        await updateData('pedido', item.id, { estado: nuevoEstado });
        //El tema de fetchData sería para algo similar a recargar la página
        await fetchData();
    };    

    const enviarFormulario = (pedido) => {
        navigation.navigate('FormularioActualizacionPedido',{pedido:pedido})
    }

    if (loading){
        return <LoadingScreen />; // Uso del componente reutilizable
    }

    return (
        <View style={styles.container}>
            {/*Más abajo se hace una condicional, si la variable currentTab es igual al estado de un pedido, este se podrá ver, de no ser así simplemente se pasará de largo*/}
            <View style={styles.header}>
                <TouchableOpacity style={[styles.tab,currentTab === 'proceso' && styles.activeTab]} onPress={() => {setCurrentTab('proceso')}}>
                    <Text style={styles.tabText}><FormattedMessage id="enProceso" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab,currentTab === 'completado' && styles.activeTab]} onPress={() => {setCurrentTab('completado')}}>
                    <Text style={styles.tabText}><FormattedMessage id="completados" /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab,currentTab === 'cancelado' && styles.activeTab]}onPress={() => {setCurrentTab('cancelado')}}>
                    <Text style={styles.tabText}><FormattedMessage id="cancelados" /></Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {listPedido.filter(pedido => pedido.estado === currentTab).length === 0 ? (
                    <View style={styles.noDataContainer}>
                        <LottieView source={manifest} autoPlay loop style={styles.animation}/>
                    </View>
                ) : (
                    listPedido.map((pedido, index) =>
                        //Si el estado de un pedido es igual a la variable currentTab, este se verá en pantalla, de no ser así significa que no se verá
                        pedido.estado === currentTab ? (
                            <View key={index} style={styles.pedidoContainer}>
                                {pedido.pedido.map((producto, index) => (
                                    <View key={index} style={styles.productoContainer}>
                                        <Text style={styles.productText}>{producto.nombreProducto}</Text>
                                        <Text style={styles.productText}><FormattedMessage id="cantidad" />: {producto.stock}</Text>
                                    </View>
                                ))}
                                <View style={styles.divider} />
                                <View>
                                    {/*Si currentTab es igual a proceso, se podrán ver los botones para completar, cancelar o editar, si no es así simplemente no se verá*/}
                                    {currentTab === "proceso" ? (
                                        <View style={styles.buttonContainer}>
                                            <TouchableOpacity style={styles.completarButton} onPress={() => updateEstado(pedido, "completado")}>
                                                <Icon name="check" size={16} color="#000000" />
                                                <Text style={styles.completarButtonText}><FormattedMessage id="completar" /></Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.editarButton} onPress={() => enviarFormulario(pedido)}>
                                                <Icon name="pencil" size={16} color="#000000" />
                                                <Text style={styles.completarButtonText}><FormattedMessage id="editar" /></Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.cancelarButton} onPress={() => updateEstado(pedido, "cancelado")}>
                                                <Icon name="trash" size={16} color="#000000" />
                                                <Text style={styles.completarButtonText}><FormattedMessage id="cancelar" /></Text>
                                            </TouchableOpacity>
                                        </View>
                                    ):null}
                                </View>
                            </View>
                        ) : null
                    )
                )}
            </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
        paddingTop:40
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-around",
        paddingVertical: 16,
        backgroundColor: "#ddd",
        borderRadius: 10,
        marginVertical: 8,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 5,
    },
    activeTab: {
        backgroundColor: "#FFA726",
    },
    tabText: {
        fontSize: 16,
        color: "#616161"
    },
    scrollView: {
        marginVertical: 10,
    },
    pedidoContainer: {
        backgroundColor: "#ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    productoContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        justifyContent:'space-around'
    },
    productText: {
        fontSize: 16,
        color: "#616161",
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 8,
    },
    buttonContainer: {
        alignItems: "center",
        marginTop: 8,
        flexDirection:'row',
        justifyContent:'space-evenly'
    },
    completarButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "orange",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    cancelarButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "red",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    editarButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fce700",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    completarButtonText: {
        color: "#000000",
        marginLeft: 5,
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    noDataText: {
        fontSize: 16,
        color: '#616161',
    },
    animation: {
        width: 200,
        height: 200,
    },    
});

export default Ordenes;
