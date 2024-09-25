import React, { useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Cuenta() {
  const navigation = useNavigation(); // Hook para acceder a la navegación

  const [URL, setURL] = useState([
    {
      title: "Alfredo Morales",
      image:"https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png",
    },
  ]);

  function navigate(){
    navigation.navigate('Configuration')
  }

  return (
    <View style={styles.container}>
      {/* Contenedor con flex para alinear el perfil a la izquierda y el gear a la derecha */}
      <View style={styles.headerContainer}>
        <View style={styles.AccountPicture}>
          {URL.map((item, index) => (
            <View key={index} style={styles.accountInfo}>
              <Image source={{ uri: item.image }} style={styles.profileImage} />
              <Text style={styles.text}>{item.title}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.containerGear} onPress={navigate}>
          <Icon name="gear" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f6f7",
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row', // Alinea los hijos en fila
    justifyContent: 'space-between', // Separa la cuenta y el gear
    alignItems: 'center', // Centra verticalmente ambos elementos
  },
  containerGear: {
    paddingRight: 10,
  },
  AccountPicture: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    height: 100,
    width: 100,
    marginRight: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between", // Espacio uniforme entre las imágenes
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    margin: 5,
  },
});
