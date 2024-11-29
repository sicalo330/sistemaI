import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FormattedMessage } from 'react-intl';


function Configuration() {
  const navigation = useNavigation()

  const cambiarIdioma = () => {
    navigation.navigate("CambiarIdioma")
  }

  const info = (tipoInformacion) => {
    navigation.navigate("Info", {tipoInformacion:tipoInformacion})
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
        <Text style={styles.optionItem}><FormattedMessage id="cambiar_idioma" /></Text>{/*El plan sería poner muchos temas*/}
      </TouchableOpacity>
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