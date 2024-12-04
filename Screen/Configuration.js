import React,{useContext} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormattedMessage } from 'react-intl';
import { AuthContext } from '../context/auth-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


function Configuration() {
  const navigation = useNavigation()
  const { logout } = useContext(AuthContext)

  const cambiarIdioma = () => {
    navigation.navigate("CambiarIdioma")
  }

  const info = (tipoInformacion) => {
    navigation.navigate("Info", {tipoInformacion:tipoInformacion})
  }

  const cerrar = async () => {
    await AsyncStorage.removeItem("authToken");
    navigation.navigate("Login")
  }

  return (
    <View>
      <TouchableOpacity onPress={() => {info("cookies")}}>
        <Text style={styles.optionItem}><FormattedMessage id="servicios" /></Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {info("seguridad")}}>
        <Text style={styles.optionItem}><FormattedMessage id="seguridad" /></Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={cambiarIdioma}>
        <Text style={styles.optionItem}><FormattedMessage id="cambiar_idioma" /></Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={cerrar}>
        <Text style={styles.optionItem}><FormattedMessage id="tab_account_cerrar" /></Text>
      </TouchableOpacity>
      <Text>sldfjsdkjfs</Text>
    </View>
  );
}


const styles = StyleSheet.create({
  headerText: {
    textAlign: 'center',
    fontSize: 18,
    marginVertical: 10,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  optionText: {
    fontSize: 16,
  },
});

export default Configuration;