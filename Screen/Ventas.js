import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { StyleSheet } from "react-native";
import {titlePrice, linkContainer} from "../Style/style";
import Icon from 'react-native-vector-icons/FontAwesome';

function Ventas(){
    return(
        <>
            <View style={styles.containerPrice}>
                <View style={titlePrice.containerPrice}>
                    <Text style={{fontSize:15, textAlign:'left', marginLeft:10}}>Ventas</Text>
                    <Text style={titlePrice.titleMain}>$4.500</Text>
                </View>
                <View style={titlePrice.containerPrice}>
                    <Text style={{fontSize:15, textAlign:'left', marginLeft:10}}>Gastos</Text>
                    <Text style={titlePrice.titleMain}>$1.000</Text>
                </View>
            </View>
            <View style={styles.containerPrice}>
                <View style={styles.inventarioContainer}>
                    <Text style={{fontSize:15, textAlign:'left', marginLeft:10}}>Inventario</Text>
                    <Text style={titlePrice.titleMain}>$5.000</Text>
                </View>
            </View>
            <TouchableOpacity style={linkContainer.linkArrow}>
                <View>
                    <Text>Ver ventas</Text>
                    <Text>Revisar todas las transacciones</Text>
                </View>
                <View style={{alignContent:'center', alignSelf:'center'}}>
                    <Icon name="arrow-right" size={25} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={linkContainer.linkArrow}>
                <View>
                    <Text>Ver ventas</Text>
                    <Text>Revisar todas las transacciones</Text>
                </View>
                <View style={{alignContent:'center', alignSelf:'center'}}>
                    <Icon name="arrow-right" size={25} color="black" />
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={linkContainer.linkArrow}>
                <View>
                    <Text>Ver ventas</Text>
                    <Text>Revisar todas las transacciones</Text>
                </View>
                <View style={{alignContent:'center', alignSelf:'center'}}>
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
    }
  });

export default Ventas