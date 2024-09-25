import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {general} from '../Style/style'
import Icon from 'react-native-vector-icons/FontAwesome';

function Ordenes(){
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
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontSize:20}}>1</Text>
                    </View>
                    <TouchableOpacity style={general.plusMinus}> 
                        <Icon name="plus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={general.ordenes}>
                <View>
                    <Text>Sopa de pollo</Text>
                    <Text>Qty:1</Text>
                </View>
                <View style={general.containerPlusMinus}>
                    <TouchableOpacity style={general.plusMinus}>
                        <Icon name="minus" size={15} color="black" />
                    </TouchableOpacity>
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontSize:20}}>1</Text>
                    </View>
                    <TouchableOpacity style={general.plusMinus}> 
                        <Icon name="plus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={general.ordenes}>
                <View>
                    <Text>Sopa de pollo</Text>
                    <Text>Qty:1</Text>
                </View>
                <View style={general.containerPlusMinus}>
                    <TouchableOpacity style={general.plusMinus}>
                        <Icon name="minus" size={15} color="black" />
                    </TouchableOpacity>
                    <View style={{alignSelf:'center'}}>
                        <Text style={{fontSize:20}}>1</Text>
                    </View>
                    <TouchableOpacity style={general.plusMinus}> 
                        <Icon name="plus" size={15} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

export default Ordenes
