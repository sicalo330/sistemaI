import React from "react";
import { Text, View, Image, StyleSheet, FlatList,TouchableOpacity, Button } from "react-native";
import agregarProducto from "../db/agregarProducto";
import { useNavigation } from "@react-navigation/native";

// Datos simulados de inventario
const inventarios = [
  { id: '1', nombre: 'Spaghetti', imagen: 'https://img.taste.com.au/sE-X5HqY/taste/2024/03/5-ingredient-turbo-charged-spaghetti-recipe-196959-1.jpg' },
  { id: '2', nombre: 'Sancocho', imagen: 'https://i0.wp.com/www.pasionthermomix.co/wp-content/uploads/2018/11/sancocho2-1.jpg?fit=1280%2C800&ssl=1' },
  { id: '3', nombre: 'Ensalada César', imagen: 'https://www.gourmet.cl/wp-content/uploads/2016/09/Ensalada_C%C3%A9sar-web.jpg   ' },
  { id: '4', nombre: 'Pizza Margarita', imagen: 'https://imag.bonviveur.com/pizza-margarita.jpg' },
];


function Inventario() {
  const navigation = useNavigation()

  const agregar = () => {
    navigation.navigate("FormularioProducto")
    //agregarProducto()
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer}>
      {/* Espacio para agregar una imagen */}
      <Image source={{ uri: item.imagen }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombre}</Text>
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
