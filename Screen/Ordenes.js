import React,{useEffect, useState} from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import {general} from '../Style/style'
import Icon from 'react-native-vector-icons/FontAwesome';
import getData from "../db/getData";

function Ordenes(){
    const [producto, setProducto] = useState([])

    useEffect(() => {
        async function fetchData(){
            const listProducto = await getData("producto")
            setProducto(listProducto)
            console.log(JSON.stringify(listProducto))
        }
        fetchData()
    },[])

    return(
        <>
            <View style={{flexDirection:'row', justifyContent:'center', justifyContent:'space-evenly'}}>
                <Text>Pendientes</Text>
                <Text>En proceso</Text>
                <Text>Completados</Text>
            </View>
            <View style={general.hr} />
            <View style={general.ordenes}>
                <View>
                    <Text>Sopa de pollo</Text>
                    <Text>Qty:1</Text>
                </View>
                <View style={general.containerPlusMinus}>
                    <TouchableOpacity style={general.plusMinus}>
                        <Icon name="minus" size={15} color="black" />
                    </TouchableOpacity>
                    <View style={styles.containerIcon}>
                        <Text style={styles.textFontIcon}>1</Text>
                    </View>
                    <TouchableOpacity style={general.plusMinus}> 
                        <Icon name="plus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    textFontIcon:{
        fontSize:20
    },
    containerIcon:{
        alignSelf:'center'
    }
  });

export default Ordenes
