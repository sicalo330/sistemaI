import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { general } from '../Style/style';
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerGastos from "../hook/useObtenerProducto";
import { CheckBox } from "react-native-web";

function Ordenes() {
    const [producto, setProducto] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('Pendiente')
    const [listaProducto, setListaProducto] = useState([])
    const [listaChecked, setListaChecked] = useState([])

    const [lista] = useObtenerGastos();

    // Función para obtener datos desde la base de datos
    const fetchData = async () => {
        const listProducto = await getData("producto");
        setProducto(listProducto);
        setQuantities(new Array(listProducto.length).fill(0));
        setEstado(new Array(listProducto.length).fill(false));
        setListaChecked(new Array(listProducto.length).fill(this))
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

    const cambiarEstado = (index,item) => {
        console.log("----------------------")
        const newEstado = [...estado];
        console.log(newEstado)
        
        newEstado[index] = !newEstado[index];
        setEstado(newEstado);

        const newPedido = [...listaChecked]
        newPedido[index] = item
        setListaChecked(newPedido)
        console.log(newEstado[index])
        if(!newEstado[index]){
            listaChecked.splice(index,1)
        }

        console.log(newPedido)
        //Agregar animaciones
    };
    
    const updateEstado = async (item, nuevoEstado, index) => {
        const stockInt = parseInt(item.stock);
        const newStock = stockInt - quantities[index];

        if(newStock < 0){  
            Alert.Alert("El producto está agotado")
            return;
        }
        await updateProducto(item.id, { estado: nuevoEstado, stock: newStock });
        await fetchData();
    };

    const actualizarEstado = (item) => {
        setListaProducto(item)
    }
    
    const verProductos = () => {
        console.log(listaProducto);
    }

    return (
        <>
            <Button title="Enviar" onPress={verProductos}/>
            {producto.map((item, index) => (
                    <View key={index} style={general.ordenes}>
                        <View style={styles.checkboxContainer}>
                                <Text>{item.nombreProducto}</Text>
                                <Text>{item.estado}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {currentTab == "Pendiente" ? 
                                <Button title="Preparar" onPress={() => cambiarEstado(index, item)} />
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
    checkboxContainer:{
        width:100
    },
    header:{
        flexDirection: 'row', 
        justifyContent: 'center', 
        justifyContent: 'space-evenly' 
    }
});

export default Ordenes;
