import React, { useState, useEffect } from "react";
import { Text, View, Image, StyleSheet, FlatList,TouchableOpacity, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import getData from "../db/getData";
import useObtenerDatos from "../hook/useObtenerDatos";
import { FormattedMessage } from "react-intl";

// Datos simulados de inventario

function Inventario() {
  const [producto, setProducto] = useState([]);

  const navigation = useNavigation()
  const [lista] = useObtenerDatos('producto')//Cada vez que la tabla produyctos cambia, la lista cambia, y por lo tanto se llama otra vez a useEffect
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData(){
      const listData = await getData("producto")//Se obtienen todos los productos
      setProducto(listData)//Los productos se agregan a useState
    }
    //                         Después
    //                           |
    //                           v
    Promise.all([fetchData()]).then(() => setLoading(false));//Aquí se maneja la pantalla de carga, esta se verá hasta que se carguen todos los productos
    //loading = true -> setLoading(false) -> loading = false
  },[lista])

  const agregar = () => {
    navigation.navigate("FormularioProducto")//Esto lleavará al formulario de actualización de productos para crear productos
  }

  const handlePress = (item) => {//Aquí se mostrará los detalles de cada producto
    navigation.navigate('Detail',{plato:item.id})
  };

  //Siempre empieza como un true
  if (loading){
    return <LoadingScreen />; //Pantalla de carga
  }

  const renderItem = ({ item }) => (//Aquí se muestra la información superficial de cada producto, es decir el bloque en donde solo se muestra el nombre y la imágen
    <TouchableOpacity style={styles.itemContainer} onPress={() => handlePress(item)}>
      {/* Espacio para agregar una imagen */}
      <Image source={{ uri: item.urlProducto }} style={styles.imagen} />
      <Text style={styles.nombre}>{item.nombreProducto}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}><FormattedMessage id="inventario_platillos" /></Text>
      <TouchableOpacity onPress={agregar} style={styles.botonAgregar}>{/*Al hacer click aquí se va al formulario para agregar productos*/}
        <Text><FormattedMessage id="boton" /></Text>
      </TouchableOpacity>
      <FlatList
        data={producto}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4', // Fondo gris claro para un aspecto limpio
    paddingTop:50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'orange', // Naranja vibrante para destacar el título
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // Fondo blanco para contraste
    borderWidth: 1,
    borderColor: '#E0E0E0', // Borde gris claro
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  imagen: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#FF6F00', // Borde naranja para un detalle llamativo
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#424242', // Gris oscuro para el texto
  },
  botonAgregar: {
    alignSelf: 'center',
    backgroundColor: 'orange', // Botón naranja
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  botonTexto: {
    color: '#FFFFFF', // Texto blanco para el botón
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Inventario;