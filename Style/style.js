import { StyleSheet } from "react-native";

const general = StyleSheet.create({
    hr:{
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        width: '100%',
        marginVertical: 20,
    },
    ordenes:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:15
    },
    containerPlusMinus:{
        flexDirection:'row',
    },
    plusMinus:{
        backgroundColor:'#ddd',
        borderRadius:20,
        width:40,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:10
    }
})


const titlePrice = StyleSheet.create({
    titleMain:{
        textAlign:'left',
        fontSize:20,
        marginLeft:10,
        color:'#66624f'
    },
    containerPrice:{
        justifyContent:'center',
        width:180,
        height:100,
        backgroundColor:'#ddd',
        borderRadius:10
    }
})

const linkContainer = StyleSheet.create({
    linkArrow:{
        flexDirection:'row',
        justifyContent:'space-around',
        marginTop:10
    }
})


module.exports = {
    general,
    titlePrice,
    linkContainer
}