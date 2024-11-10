import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerPedido from "../hook/useObtenerPedido";
import agregarProducto from "../db/agregarProducto";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('proceso');
    const [lista] = useObtenerPedido();

    const fetchData = async () => {
        const listPedido = await getData("pedido");
        setProducto(listPedido);
        setEstado(new Array(listPedido.length).fill(false));
    };

    useEffect(() => {
        fetchData();
    }, [lista]);

    const updateEstado = async (item, nuevoEstado) => {
        await updateProducto('pedido', item.id, { estado: nuevoEstado });
        await fetchData();
    };

    const cambiarSubPestana = (pestana) => {
        setCurrentTab(pestana);
    };

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
                    <Text style={styles.tabText}>En proceso</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.tab,
                        currentTab === 'completado' && styles.activeTab,
                    ]}
                    onPress={() => cambiarSubPestana('completado')}
                >
                    <Text style={styles.tabText}>Completados</Text>
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
                                    <Text style={styles.productText}>Cantidad: {producto.stock}</Text>
                                </View>
                            ))}
                            <View style={styles.divider} />
                            <View style={styles.buttonContainer}>
                                {currentTab === "proceso" && (
                                    <TouchableOpacity
                                        style={styles.completarButton}
                                        onPress={() => updateEstado(pedido, "completado")}
                                    >
                                        <Icon name="check" size={16} color="#fff" />
                                        <Text style={styles.completarButtonText}>Completar</Text>
                                    </TouchableOpacity>
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
    },
    completarButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "orange",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    completarButtonText: {
        color: "#fff",
        marginLeft: 5,
    },
});

export default Ordenes;
