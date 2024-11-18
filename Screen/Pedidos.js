import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Button, Alert,ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { general } from '../Style/style';
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import useObtenerGastos from "../hook/useObtenerProducto";
import { CheckBox } from "react-native-web";
import agregarProducto from "../db/agregarProducto";
import agregarPedido from "../db/agregarPedido";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage } from "react-intl";

function Pedidos() {
    const [producto, setProducto] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [currentTab, setCurrentTab] = useState('Pendiente')
    const [listaProducto, setListaProducto] = useState([])
    const [listaChecked, setListaChecked] = useState([])
    const [loading, setLoading] = useState(true); // Estado de carga

    const [lista] = useObtenerGastos();

    // Función para obtener datos desde la base de datos
    const fetchData = async () => {
        const listProducto = await getData("producto");
        setProducto(listProducto);
        setQuantities(new Array(listProducto.length).fill(0));
        setEstado(new Array(listProducto.length).fill(false));
        setListaChecked(new Array(listProducto.length).fill(0))
    };

    useEffect(() => {
        Promise.all([fetchData()]).then(() => setLoading(false));
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
            setQuantities(newQuantities);
        }
    };

    const cambiarEstado = (index, item) => {
        // Copiar el estado actual y alternar el valor en el índice seleccionado
        const newEstado = [...estado];
        newEstado[index] = !newEstado[index];
        setEstado(newEstado);
    
        // Crear una copia de `listaChecked` manteniendo los índices
        const newPedido = [...listaChecked];
        const newQuantities = [...quantities];
    
        if (newEstado[index]) {
            // Si `estado[index]` es `true`, asigna el objeto completo en esa posición
            newPedido[index] = item;
        } else {
            // Si `estado[index]` es `false`, asigna `null` en esa posición y reinicia la cantidad a 0
            newPedido[index] = 0;
            newQuantities[index] = 0;
        }
    
        setListaChecked(newPedido);
        setQuantities(newQuantities);
    };
    
    
    
    const updateEstado = async (nuevoEstado) => {
        if (listaChecked.length <= 0) {
            Alert.alert("No hay nada seleccionado")
            return;
        }
    
        for (let index = 0; index < listaChecked.length; index++) {
            const item = listaChecked[index];
    
            // Verificar si la cantidad es 0, pero el producto está seleccionado en `listaChecked` o `estado` es `true`
            if (quantities[index] === 0 && (item !== 0 || estado[index])) {
                Alert.alert("Error", `La cantidad para el producto ${item.nombreProducto} es 0, pero está seleccionado.`);
                return;
            }
    
            if (item !== 0) {
                const stockInt = parseInt(item.stock);
                const newStock = stockInt - quantities[index];
    
                if (newStock < 0) {  
                    Alert.alert("El producto ha sido agotado");
                    return;
                }
                //Qué pasa si carne tiene 40 en stock pero pido 50? Asegurarme de arreglar ese pequeño error de lógica
                item.stock = quantities[index];
                item.estado = nuevoEstado;
                
                //Es necesario que esté debajo porque primero se debe hacer la transición del stock original al nuevo stock
                cantidadTotal += item.stock
                item.cantidadTotal = cantidadTotal
                //Actualización del producto (se pueden habilitar las siguientes líneas según lo necesites)
                await updateProducto('producto',item.id, { estado: nuevoEstado, stock: newStock });
                await fetchData();
            }
        }
        const elementosSeleccionados = listaChecked.filter(item => item !== 0);
        await agregarPedido(elementosSeleccionados, 'pedido'); // Llamada a agregarPedido si es necesario
    };
    

    // const actualizarEstado = (item) => {
    //     setListaProducto(item)
    // }

    if (loading){
        return <LoadingScreen message="Cargando datos de ventas..." />; // Uso del componente reutilizable
    }

    return (
        <>
            <TouchableOpacity onPress={() => {updateEstado("proceso")}}>
                <Text><FormattedMessage id="boton" /></Text>
            </TouchableOpacity>
            {producto.map((item, index) => (
                    <View key={index} style={general.ordenes}>
                        <View style={styles.checkboxContainer}>
                                <Text>{item.nombreProducto.length > 20 ? item.nombreProducto.substring(0, 20) + "..." : item.nombreProducto}</Text>
                        </View>
                        <View style={styles.containerProcess}>
                            {currentTab == "Pendiente" ? 
                                <TouchableOpacity onPress={() => cambiarEstado(index, item)}>
                                    <Text><FormattedMessage id="preparar" /></Text>
                                </TouchableOpacity>
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
        width:150
    },
    containerProcess:{
        flexDirection:'row'
    },
    header:{
        flexDirection: 'row', 
        justifyContent: 'center', 
        justifyContent: 'space-evenly' 
    },
});

export default Pedidos;