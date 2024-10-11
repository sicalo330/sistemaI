import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Importar useNavigation


function Configuration() {
  const navigation = useNavigation(); // Hook para acceder a la navegación
  return (
    <View>
      <TouchableOpacity>
        <Text style={styles.optionItem}>Términos de Servicio</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.optionItem}>Seguridad</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.optionItem}>Cambiar tema</Text>{/*El plan es poner muchos temas*/}
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