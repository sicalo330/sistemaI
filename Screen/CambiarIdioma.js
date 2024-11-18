import React from 'react';
import { View, Button, Text,StyleSheet } from 'react-native';
import { useLanguage } from './LanguageProvider';
import { FormattedMessage } from 'react-intl';

const CambiarIdioma = () => {
  const { setLocale } = useLanguage();

  return (
    <View style={styles.container}>
      <Text><FormattedMessage id="seleccionar" /></Text>
      <Button title="Español" onPress={() => setLocale('es')} />
      <Button title="English" onPress={() => setLocale('en')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CambiarIdioma;
