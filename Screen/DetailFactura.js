import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { FormattedMessage } from "react-intl";

function DetailFactura({ route }) {
    const { factura } = route.params;//Se obtienen los datos de la factura para agregarlos en la vista
    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}><FormattedMessage id="tab_sales_order_detail" /></Text>
            </View>
            <View style={styles.facturaContainer}>
                <Text style={styles.facturaText}>ID: {factura.id}</Text>
                <Text style={styles.facturaText}><FormattedMessage id="total" />: ${factura.precioTotal}</Text>
                <Text style={styles.facturaText}><FormattedMessage id="tab_sales_order_estado" />: {factura.estado}</Text>
            </View>
            <Text style={styles.pedidosTitle}><FormattedMessage id="tabs.ask" />:</Text>
            {factura.pedido.map((item, index) => (
                <View key={index} style={styles.pedidoContainer}>
                    <Text style={styles.productText}><FormattedMessage id="tab_sales_order_nombre" />: {item.nombreProducto}</Text>
                    <Text style={styles.productText}><FormattedMessage id="cantidad" />: {item.stock}</Text>
                    <View style={styles.divider}></View>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 16,
    },
    header: {
        paddingVertical: 16,
        backgroundColor: "#ddd",
        borderRadius: 10,
        marginVertical: 8,
        alignItems: "center",
    },
    headerText: {
        fontSize: 20,
        fontWeight: "600",
        color: "#616161",
    },
    facturaContainer: {
        backgroundColor: "#ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    facturaText: {
        fontSize: 16,
        color: "#616161",
        marginVertical: 4,
    },
    pedidosTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#616161",
        marginBottom: 8,
    },
    pedidoContainer: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
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
        backgroundColor: "#FFA726",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 5,
    },
    completarButtonText: {
        color: "#fff",
        marginLeft: 5,
        fontWeight: "500",
    },
});

export default DetailFactura;
