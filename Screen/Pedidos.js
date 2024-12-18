import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Alert,SafeAreaView, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import updateData from "../db/updateData";
import useObtenerDatos from "../hook/useObtenerDatos";
import agregarPedido from "../db/agregarPedido";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage } from "react-intl";

function Pedidos() {
    const [producto, setProducto] = useState([]);
    const [quantities, setQuantities] = useState([]);
    const [estado, setEstado] = useState([]);
    const [listaChecked, setListaChecked] = useState([])
    const [loading, setLoading] = useState(true); // Estado de carga

    const [lista] = useObtenerDatos('pedido')

    // Función para obtener datos desde la base de datos
    const fetchData = async () => {
        const listProducto = await getData("producto");
        setProducto(listProducto);
        setQuantities(new Array(listProducto.length).fill(0));//Estas son las cantidad que cada producto va a manejar
        setEstado(new Array(listProducto.length).fill(false));//Esta es la lista de estados, cuando se le hace click a prepara, el estado cambia de false a true
        setListaChecked(new Array(listProducto.length).fill(0))//SetListaChecked es la lista de productos que se van a agregar como pedido
    };

    useEffect(() => {
        Promise.all([fetchData()]).then(() => setLoading(false));
    }, [lista]);

    const addQuantity = (index) => {
        const newQuantities = [...quantities];
        newQuantities[index] += 1;//Se agregar un 1 por cada vez que se hace click al icono de más en la posición dada
        setQuantities(newQuantities);//Se actualizan las cantidades
    };

    const downQuantity = (index) => {//Ocurre lo mismo que con addQuantity pero cuando la cantidad llega a 0, el if no permite bajar más
        const newQuantities = [...quantities];
        if (newQuantities[index] > 0) {
            newQuantities[index] -= 1;
            setQuantities(newQuantities);
        }
    };

    const cambiarEstado = (index, item) => {
        // Copiar el estado actual y alternar el valor en el índice seleccionado
        const newEstado = [...estado];
        //Index es la posicion del producto
        newEstado[index] = !newEstado[index];
        //Hay 6 falsos 
        setEstado(newEstado);
    
        // Crear una copia de `listaChecked` manteniendo los índices
        const newPedido = [...listaChecked];
        //Listachecked es la lista de productos que se van a enviar
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
    
    
    
    const updateEstado = async () => {
        setLoading(true)
        const pedidosSeleccionados = listaChecked.filter((item, index) => item !== 0 && quantities[index] > 0);
        if (pedidosSeleccionados.length === 0) {
            Alert.alert("Error", "No hay productos válidos seleccionados.");
            setLoading(false);
            return;
        }

        //¿Qué pasa si se piden 10 de un producto pero solo queda 1?
        //Verficcar el stck antes de hacer las actualizaciones
        for(let index = 0; index < listaChecked.length; index++){
            const item = listaChecked[index];
            //Si no es 0 significa que por lo menos está seleccionado
            if(item !== 0){
                const stockInt = parseInt(item.stock);
                const newStock = stockInt - quantities[index];
                //Si la diferencia entre el stock total y el stock elegido es negativo significa que ya no queda más existencia del mismo
                if(newStock < 0){
                    Alert.alert("Lo sentimos, pero se ha acabado la existencia del producto", item.nombreProducto)
                    setLoading(false)
                    return
                }
            }
        }
        //Después de verificar que las cantidades que se pidan no supere la cantidad total del inventario
        for (let index = 0; index < listaChecked.length; index++) {
            const item = listaChecked[index];
    
            // Verificar si la cantidad es 0, pero el producto está seleccionado en `listaChecked` o `estado` es `true`
            if (quantities[index] === 0 && (item !== 0 || estado[index])) {
                Alert.alert("Error", `La cantidad para el producto ${item.nombreProducto} es 0, pero está seleccionado.`);
                setLoading(false);
                return;
            }
    
            if (item !== 0) {
                const stockInt = parseInt(item.stock);
                const newStock = stockInt - quantities[index];
                item.stock = quantities[index];
                
                //Es necesario que esté debajo porque primero se debe hacer la transición del stock original al nuevo stock
                //Actualización del producto (se pueden habilitar las siguientes líneas según lo necesites)
                await updateData('producto',item.id, { stock: newStock });
                await fetchData();
            }
        }
        const elementosSeleccionados = listaChecked.filter(item => item !== 0);
        await agregarPedido(elementosSeleccionados, 'pedido'); // Llamada a agregarPedido si es necesario
        setLoading(false)
    };
    


    if (loading){
        return <LoadingScreen />; // Uso del componente reutilizable
    }

    return (
        <SafeAreaView style={styles.screenGeneral}>
            <ScrollView>
            <TouchableOpacity onPress={() => { updateEstado() }} style={styles.updateEstado}>
                <Text style={styles.agregarPedido}><FormattedMessage id="boton" /></Text>
            </TouchableOpacity>
    
            {producto.map((item, index) => (
                <View key={index} style={styles.productLoop}>
                    <View style={{ width: 150 }}>
                        {/*Si el nombre del producto supera los 20 caracteres se pondrán tres puntos a la derecha*/}
                        <Text style={styles.textoProducto}>{item.nombreProducto.length > 20 ? item.nombreProducto.substring(0, 20) + "..." : item.nombreProducto}</Text>
                    </View>
    
                    <View style={styles.containerPrepare}>
                        <TouchableOpacity onPress={() => cambiarEstado(index, item)} style={styles.buttonPrepare}>
                            <Text style={styles.textoPreparar}><FormattedMessage id="preparar" /></Text>
                        </TouchableOpacity>
                    </View>
    
                    {estado[index] && (
                        <View style={styles.plusminus}>
                            <TouchableOpacity onPress={() => downQuantity(index)} style={styles.touchableStyle}>
                                <Icon name="minus" size={15} color="#FF6F00" />
                            </TouchableOpacity>
                            <View style={styles.touchableStyle}>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#424242' }}>{quantities[index]}</Text>
                            </View>
                            <TouchableOpacity onPress={() => addQuantity(index)} style={styles.touchableStyle}>
                                <Icon name="plus" size={15} color="#FF6F00" />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ))}
            </ScrollView>
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
    textFontIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#424242', // Gris oscuro para el texto
    },
    containerIcon: {
        alignSelf: 'center',
        backgroundColor: '#F4F4F4', // Fondo gris claro
        borderRadius: 5,
        padding: 5,
        borderWidth: 1,
        borderColor: '#E0E0E0', // Borde gris claro
    },
    checkboxContainer: {
        width: 150,
        backgroundColor: '#FFFFFF', // Fondo blanco
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0', // Gris claro
    },
    containerProcess: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 10,
        backgroundColor: 'orange', // Naranja vibrante
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    headerText: {
        fontSize: 18,
        color: '#FFFFFF', // Texto blanco
        fontWeight: 'bold',
    },
    ordenes: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF', // Fondo blanco para las tarjetas de pedidos
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        borderWidth: 1,
        borderColor: '#E0E0E0', // Gris claro
    },
    containerPlusMinus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'orange', // Fondo naranja para los botones de cantidad
        padding: 5,
        borderRadius: 5,
    },
    plusMinus: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF', // Botón blanco con borde naranja
        borderWidth: 1,
        borderColor: '#FF6F00',
        borderRadius: 5,
    },
    plusMinusText: {
        color: 'orange', // Texto naranja
        fontSize: 16,
        fontWeight: 'bold',
    },
    prepararButton: {
        backgroundColor: 'orange', // Fondo naranja para el botón de preparar
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    prepararButtonText: {
        color: '#FFFFFF', // Texto blanco
        fontSize: 14,
        fontWeight: 'bold',
    },
    screenGeneral:{
        paddingTop:40
    },
    touchableStyle:{
        width: 30, 
        height: 30, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#FFFFFF', 
        borderWidth: 1, 
        borderColor: 'orange', 
        borderRadius: 5 
    },
    addStyle:{
        alignSelf: 'center', 
        backgroundColor: '#F4F4F4', 
        borderRadius: 5, 
        padding: 5, 
        borderWidth: 1, 
        borderColor: '#E0E0E0' 
    },buttonPrepare:{
        backgroundColor: 'orange', 
        paddingVertical: 5, 
        paddingHorizontal: 10, 
        borderRadius: 5, 
        alignItems: 'center',
        justifyContent: 'center' 
    },containerPrepare:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10
    },textoPreparar:{
        color: 'black',
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 3
    },updateEstado:{ 
        backgroundColor: 'orange', 
        padding: 10, 
        borderRadius: 5, 
        alignItems: 'center',
        marginVertical: 10 
    },productLoop:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        backgroundColor: '#FFFFFF', 
        padding: 15, 
        marginBottom: 10, 
        borderRadius: 10, 
        shadowColor: '#000', 
        shadowOpacity: 0.1, 
        shadowOffset: { width: 0, height: 2 }, 
        shadowRadius: 4, 
        borderWidth: 1, 
        borderColor: '#E0E0E0' 
    },agregarPedido:{ 
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold'
    },textoProducto:{ 
        color: '#424242', 
        fontSize: 14, 
        fontWeight: 'bold'
    },plusminus:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 5,
        backgroundColor: '#F4F4F4',
        borderRadius: 5
    }
});


export default Pedidos;