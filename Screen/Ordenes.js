import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerPedido from "../hook/useObtenerPedido";
import LoadingScreen from "./LoadingScreen";
import { useNavigation } from "@react-navigation/native";
import { FormattedMessage } from "react-intl";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('proceso');
    const [lista] = useObtenerPedido();
    const [loading, setLoading] = useState(true); // Estado de carga
    const navigation = useNavigation();

    const fetchData = async () => {
        const listPedido = await getData("pedido");
        setProducto(listPedido);
        setEstado(new Array(listPedido.length).fill(false));
    };

    useEffect(() => {
        Promise.all([fetchData()]).then(() => setLoading(false));
    }, [lista]);

    const updateEstado = async (item, nuevoEstado) => {
        await updateProducto('pedido', item.id, { estado: nuevoEstado });
        await fetchData();
    };

    const cambiarSubPestana = (pestana) => {
        setCurrentTab(pestana);
    };

    const enviarFormulario = (pedido) => {
        navigation.navigate('FormularioActualizacionPedido',{pedido:pedido})
    }

    if (loading){
        return <LoadingScreen message="Cargando datos de ventas..." />; // Uso del componente reutilizable
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentTab === 'proceso' && styles.activeTab,
                    ]}
                    onPress={() => cambiarSubPestana('proceso')}
                >
                    <Text style={styles.tabText}><FormattedMessage id="enProceso" /></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentTab === 'completado' && styles.activeTab,
                    ]}
                    onPress={() => cambiarSubPestana('completado')}
                >
                    <Text style={styles.tabText}><FormattedMessage id="completados" /></Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentTab === 'cancelado' && styles.activeTab,
                    ]}
                    onPress={() => cambiarSubPestana('cancelado')}
                >
                    <Text style={styles.tabText}><FormattedMessage id="cancelados" /></Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                {producto.map((pedido, index) => (
                    pedido.estado === currentTab ? (
                        <View key={index} style={styles.pedidoContainer}>
                            {pedido.pedido.map((producto, index) => (
                                <View key={index} style={styles.productoContainer}>
                                    <Text style={styles.productText}>
                                        {producto.nombreProducto}
                                    </Text>
                                    <Text style={styles.productText}><FormattedMessage id="cantidad" />: {producto.stock}</Text>
                                </View>
                            ))}
                            <View style={styles.divider} />
                            <View>
                                {currentTab === "proceso" && (
                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity
                                            style={styles.completarButton}
                                            onPress={() => updateEstado(pedido, "completado")}
                                        >
                                            <Icon name="check" size={16} color="#000000" />
                                            <Text style={styles.completarButtonText}><FormattedMessage id="completar" /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.editarButton} 
                                            onPress={() => enviarFormulario(pedido)}
                                        >
                                            <Icon name="pencil" size={16} color="#000000" />
                                            <Text style={styles.completarButtonText}><FormattedMessage id="editar" /></Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.cancelarButton} 
                                            onPress={() => updateEstado(pedido,"cancelado")}
                                        >
                                            <Icon name="trash" size={16} color="#000000" />
                                            <Text style={styles.completarButtonText}><FormattedMessage id="cancelar" /></Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    ) : null
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
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
});

export default Ordenes;
