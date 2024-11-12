import React,{useEffect, useState} from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import {titlePrice, linkContainer} from "../Style/style";
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";
import { useNavigation } from "@react-navigation/native";
import useObtenerPedido from "../hook/useObtenerPedido";

function Ventas(){
    const [producto, setProducto] = useState([])
    const [pedido, setPedido] = useState([])
    const [precio, setPrecio] = useState(0)
    const [precioVendido, setPrecionVendido] = useState(0)

    const [lista] = useObtenerPedido() 
    const navigation = useNavigation()

    useEffect(() => {
        async function fetchData() {
            const listProducto = await getData("producto");
            setProducto(listProducto);
        }

        async function fetchPedidos() {
            const listPedido = await getData('pedido')
            setPedido(listPedido)
        }
        fetchPedidos()
        fetchData();
    }, [lista]);

    useEffect(() => {
        async function loopPrecio() {
            let precioTotal = 0;
            let precioTotalVendido = 0;

            producto.forEach((element) => {
                let precioInt = parseInt(element.price);
                precioTotal += precioInt * element.stock;
            });

            pedido.forEach((element) => {
                console.log("--------------")
                console.log(element)
            })

            setPrecio(precioTotal);
            setPrecionVendido(precioTotalVendido);
        }

        if (producto.length > 0) {
            loopPrecio();
        }
    }, [producto]);

    const navegarHistorial = () => {
        navigation.navigate("Historial")
    }
    

    return(
        <>
            <View style={styles.containerPrice}>
                <View style={styles.inventarioContainer}>
                    <Text style={styles.title}>Ventas</Text>
                    <Text style={titlePrice.titleMain}>${precioVendido}</Text>
                </View>
            </View>
            <View style={styles.containerPrice}>
                <View style={styles.inventarioContainer}>
                    <Text style={styles.title}>Inventario</Text>
                    <Text style={titlePrice.titleMain}>${precio}</Text>
                </View>
            </View>
            <TouchableOpacity style={linkContainer.linkArrow} onPress={navegarHistorial}>
                <View>
                    <Text>Ver ventas</Text>
                    <Text>Revisar todas las transacciones</Text>
                </View>
                <View style={styles.iconContainer}>
                    <Icon name="arrow-right" size={25} color="black" />
                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    containerPrice: {
        marginTop:10,
        justifyContent:'center',
        justifyContent:'space-around',
        flexDirection:'row'
    },
    inventarioContainer:{
        justifyContent:'center',
        width:385,
        height:100,
        backgroundColor:'#ddd',
        borderRadius:10
    },
    title:{
        fontSize:15,
        textAlign:'left',
        marginLeft:10,
        color:'#66624f'
    },
    iconContainer:{
        alignContent:'center',
        alignSelf:'center'
    }
  });

export default Ventas