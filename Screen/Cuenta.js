import React, { useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useContext } from "react";
import { AuthContext } from "../context/auth-context";
import { jwtDecode } from "jwt-decode";
import { FormattedMessage } from "react-intl";

export default function Cuenta() {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const decoded = jwtDecode(authCtx.token);//jwtDecode decodifica el token y genera la información que venga de este para posteriormente mostrarlo en la vista
  const [URL, setURL] = useState("https://cdn.pixabay.com/photo/2021/07/02/04/48/user-6380868_640.png")//Url de la imagen del usuario

  function navigate(){
    navigation.navigate('Configuration')
  }

  return (
    <View style={styles.container}>
      {/* Contenedor con flex para alinear el perfil a la izquierda y el gear a la derecha */}
      <View style={styles.headerContainer}>
        <View style={styles.AccountPicture}>
          <View style={styles.accountInfo}>
            <Image source={{ uri: URL }} style={styles.profileImage} />
            <Text style={styles.text}>{decoded.email}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.containerGear} onPress={navigate}>
          <Icon name="gear" size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Mostrar los datos decodificados */}
      <View style={styles.decodedContainer}>
        <Text style={styles.title}><FormattedMessage id="datos" /></Text>
        {Object.entries(decoded).map(([key, value], index) => (//Object.enttries convierte la estructura del token en arrays bidimensionales para poder ciclar en estos
          <Text key={index} style={styles.tokenText}>
            {key}: {typeof value === "object" ? JSON.stringify(value) : value}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f6f7",
    padding: 10,
    paddingTop:40
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
  decodedContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  tokenText: {
    fontSize: 14,
    marginBottom: 5,
  },
});