import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button } from "react-native";
import { general } from '../Style/style';
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerPedido from "../hook/useObtenerPedido";
import agregarProducto from "../db/agregarProducto";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    //const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('proceso');
    const [lista] = useObtenerPedido();

    // Función para obtener datos desde la base de datos
    const fetchData = async () => {
        const listPedido = await getData("pedido");
        setProducto(listPedido)
        //etQuantities(new Array(listPedido.length).fill(0));
        setEstado(new Array(listPedido.length).fill(false));
    };

    useEffect(() => {
        fetchData();
    }, [lista]);

    const addQuantity = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;
        setQuantities(newQuantities);
    };

    const downQuantity = (index) => {
        const newQuantities = [...quantities];
        if (newQuantities[index] > 0) {
            newQuantities[index] -= 1;
        }
        setQuantities(newQuantities);
    };

    const cambiarEstado = (index) => {
        const newEstado = [...estado];
        newEstado[index] = !newEstado[index]; // Cambia el estado de true o false y viceversa
        setEstado(newEstado);
    };
    
    const updateEstado = async (item, nuevoEstado, index) => {
        const stockInt = parseInt(item.stock);
        const newStock = stockInt - quantities[index];
        if(newStock < 0){  
            Alert.Alert("El producto está agotado")
            return;
        }
        // await agregarProducto(item,'pedido')
        // await updateProducto(item.id, { estado: nuevoEstado, stock: newStock });
        // await fetchData();
    };

    const cambiarSubPestana = (pestana) => {
        setCurrentTab(pestana);
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => cambiarSubPestana('proceso')}>
                    <Text>En proceso</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cambiarSubPestana('completado')}>
                    <Text>Completados</Text>
                </TouchableOpacity>
            </View>
            <View style={general.hr} />
            {/* Recorre los productos y renderiza cada uno */}

            {producto.map((pedido, index) => (
                <View key={index}>
                    {pedido.pedido.map((producto, index) => (
                        <View key={index}>
                            <Text>{producto.nombreProducto}</Text>
                        </View>
                    ))}
                    <Text>-----------------------------</Text>
                </View>
            ))}
        </>
    );
}

const styles = StyleSheet.create({
    textFontIcon: {
        fontSize: 20
    },
    containerIcon: {
        alignSelf: 'center'
    },
    header:{
        flexDirection: 'row', 
        justifyContent: 'center', 
        justifyContent: 'space-evenly' 
    }
});

export default Ordenes;
