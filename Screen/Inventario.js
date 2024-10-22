import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList,TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { collection, getDocs } from "firebase/firestore";   
import { FIRESTORE_DB } from '../firebase/firebase';
import getIngrediente from "../db/getData";
import getData from "../db/getData";

// Datos simulados de inventario

function Inventario() {
  const [inventarios, setInventario] = useState([]);

  const navigation = useNavigation()

  useEffect(() => {
    async function fetchData(params) {
      const listData = await getData("producto")
      setInventario(listData)
      console.log("Estos son los productos",inventarios)
    }
    fetchData()
  },[])

  const agregar = () => {
    navigation.navigate("FormularioProducto")
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      {/* Espacio para agregar una imagen */}
      <Image source={{ uri: item.urlProducto }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombreProducto}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario de Platillos</Text>
      <Button title="Agregar orden" onPress={agregar} />
      <FlatList
        data={inventarios}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default Inventario;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color:'#66624f'
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  imagen: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color:'#66624f'
  },
});
