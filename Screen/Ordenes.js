import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button } from "react-native";
import { general } from '../Style/style';
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('pendientes'); // Estado para la subpestaña actual

    useEffect(() => {
        async function fetchData() {
            const listProducto = await getData("producto");
            setProducto(listProducto);
            setQuantities(new Array(listProducto.length).fill(0)); // Inicializa las cantidades
            setEstado(new Array(listProducto.length).fill(false));  // Inicializa los estados (false = no ordenado)
        }
        fetchData();
    }, []);

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
        newEstado[index] = !newEstado[index]; //Cambia el estado de true o false y viceversa
        setEstado(newEstado);
    };

    // Filtra los productos según la subpestaña actual
    const filteredProducts = producto.filter((producto, index) => {
        if (currentTab === 'pendientes') return !estado[index];  // Mostrar productos pendientes
        if (currentTab === 'enProceso') return estado[index] && quantities[index] > 0;  // Mostrar productos en proceso
        if (currentTab === 'completados') return estado[index] && quantities[index] === 0;  // Mostrar productos completados
    });

    return (
        <>
            <View style={{ flexDirection: 'row', justifyContent: 'center', justifyContent: 'space-evenly' }}>
                <TouchableOpacity onPress={() => setCurrentTab('pendientes')}>
                    <Text>Pendientes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentTab('enProceso')}>
                    <Text>En proceso</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCurrentTab('completados')}>
                    <Text>Completados</Text>
                </TouchableOpacity>
            </View>
            <View style={general.hr} />

            {/* Para dada bloque se debe poner los bloques de jsx para mostrar datos de una subpestaña */}
            {currentTab === 'pendientes' && (
                <Text>Hola, esta es la pestaña de pendientes.</Text>
            )}
            {currentTab === 'enProceso' && (
                <Text>Hola, esta es la pestaña de en proceso.</Text>
            )}
            {currentTab === 'completados' && (
                <Text>Hola, esta es la pestaña de completados.</Text>
            )}

            {/* Renderiza los productos según la subpestaña seleccionada */}
            {filteredProducts.map((producto, index) => (
                <View key={index} style={general.ordenes}>
                    <View>
                        <Text>{producto.nombreProducto}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <Button title="Preparar" onPress={() => cambiarEstado(index)} />
                        <Button title="Ordenar" onPress={() => cambiarEstado(index)} />
                    </View>
                    {estado[index] ?  
                    <View style={general.containerPlusMinus}>
                        <TouchableOpacity style={general.plusMinus} onPress={() => downQuantity(index)}>
                            <Icon name="minus" size={15} color="black" />
                        </TouchableOpacity>
                        <View style={styles.containerIcon}>
                            <Text style={styles.textFontIcon}>{quantities[index]}</Text>
                        </View>
                        <TouchableOpacity style={general.plusMinus} onPress={() => addQuantity(index)}> 
                            <Icon name="plus" size={15} color="black" />
                        </TouchableOpacity>
                    </View>
                    :
                    null     
                    }
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
    }
});

export default Ordenes;
