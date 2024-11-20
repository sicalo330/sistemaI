import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from './LanguageProvider';
import { FormattedMessage } from 'react-intl';

const CambiarIdioma = () => {
  const { setLocale } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <FormattedMessage id="seleccionar" defaultMessage="Seleccionar idioma" />
      </Text>
      <TouchableOpacity
        style={[styles.button, styles.orangeButton]}
        onPress={() => setLocale('es')}
      >
        <Text style={styles.buttonText}>Español</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.orangeButton]}
        onPress={() => setLocale('en')}
      >
        <Text style={styles.buttonText}>English</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7', // Fondo gris claro
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2, // Sombra ligera
  },
  orangeButton: {
    backgroundColor: 'orange',
  },
  grayButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CambiarIdioma;
