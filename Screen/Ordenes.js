import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button } from "react-native";
import { general } from '../Style/style';
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerGastos from "../hook/useObtenerProducto";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('Pendiente');
    const [lista] = useObtenerGastos();

    // Función para obtener datos desde la base de datos
    const fetchData = async () => {
        const listProducto = await getData("producto");
        setProducto(listProducto);
        setQuantities(new Array(listProducto.length).fill(0));
        setEstado(new Array(listProducto.length).fill(false));
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
            console.log("El producto ha sido agotado");
            return;
        }
        await updateProducto(item.id, { estado: nuevoEstado, stock: newStock });
        await fetchData();
    };

    const cambiarSubPestana = (pestana) => {
        setCurrentTab(pestana);
    };

    return (
        <>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => cambiarSubPestana('Pendiente')}>
                    <Text>Pendientes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cambiarSubPestana('proceso')}>
                    <Text>En proceso</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => cambiarSubPestana('completado')}>
                    <Text>Completados</Text>
                </TouchableOpacity>
            </View>
            <View style={general.hr} />
            {/* Recorre los productos y renderiza cada uno */}
            {producto.map((item, index) => (
                item.estado == currentTab ? 
                    <View key={index} style={general.ordenes}>
                        <View>
                            <Text>{item.nombreProducto}</Text>
                            <Text>{item.estado}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {currentTab == "Pendiente" ? 
                                <Button title="Preparar" onPress={() => cambiarEstado(index)} />
                                :
                                null    
                            }

                            {estado[index] ?
                                <Button title="Ordenar" onPress={() => updateEstado(item,"proceso", index)} />
                                :
                                null
                            }

                            {currentTab == "proceso" ? 
                                <Button title="Completar" onPress={() => updateEstado(item,"completado", index)} />
                                :
                                null
                            }
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
                :
                null
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
