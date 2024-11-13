import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList,TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import getData from "../db/getData";
import useObtenerGastos from "../hook/useObtenerProducto";

// Datos simulados de inventario

function Inventario() {
  const [inventarios, setInventario] = useState([]);

  const navigation = useNavigation()
  const [lista] = useObtenerGastos()
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchData() {
      const listData = await getData("producto")
      setInventario(listData)
    }
    Promise.all([fetchData()]).then(() => setLoading(false));
  },[lista])

  const agregar = () => {
    navigation.navigate("FormularioProducto")
  }

  const handlePress = (item) => {
    navigation.navigate('Detail',{product:item})
  };

  if (loading){
    return <LoadingScreen message="Cargando datos de ventas..." />; // Uso del componente reutilizable
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      {/* Espacio para agregar una imagen */}
      <Image source={{ uri: item.urlProducto }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombreProducto}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventario de Platillos</Text>
      <Button title="Agregar producto" onPress={agregar} />
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
