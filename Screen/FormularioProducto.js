import React, { useState } from 'react';
import {Text,SafeAreaView,TextInput,Button,StyleSheet,View,TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import {general} from './../Style/style'

function FormularioProducto() {
const [nombreProducto, setNombreProducto] = useState('');
const [url, setUrl] = useState('');
const [selectedLanguage, setSelectedLanguage] = useState();
const [dropdowns, setDropdowns] = useState([{ id: 1, selectedValue: '' }]);

const options = [
    { label: 'Harina', value: 'Harina' },
    { label: 'Carne de res', value: 'Carne de res' },
    { label: 'Papa', value: 'Papa' },
  ];

  const addDropdown = () => {
    const newDropdown = { id: dropdowns.length + 1, selectedValue: '' };
    setDropdowns([...dropdowns, newDropdown]); // Agregar un nuevo dropdown al estado
  };

  const deleteDropDown = () => {
    if (dropdowns.length > 0) {
      setDropdowns((prevDropdowns) => prevDropdowns.slice(0, -1));
    }
  };
  

  const updateDropdownValue = (id, value) => {
    const updatedDropdowns = dropdowns.map((dropdown) =>
      dropdown.id === id ? { ...dropdown, selectedValue: value } : dropdown
    );
    setDropdowns(updatedDropdowns);
  };

  const crearProducto = () => {
    let ingredients = [];
    let data = {
        nombreProducto: nombreProducto,
        url: url
    };
    dropdowns.forEach(element => {
        ingredients.push({ "ingredient": element.selectedValue });
    });
    data.ingredients = ingredients;
    console.log(JSON.stringify(data));
};


  return (
    <SafeAreaView style={styles.containerForm}>
      <View>
        <Text style={styles.h1}>Formulario para agregar productos</Text>
        <TextInput
          onChangeText={setNombreProducto}
          value={nombreProducto}
          placeholder="Nombre del producto"
          style={styles.inputContainer}
        />
        <TextInput
          onChangeText={setUrl}
          value={url}
          placeholder="URL del producto"
          style={styles.inputContainer}
        />
        <View>
            <Text>Selecciona los ingredientes</Text>
            <View style={styles.containerPlusMinus}>
                <TouchableOpacity style={general.plusMinus} onPress={addDropdown}> 
                        <Icon name="plus" size={15} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={general.plusMinus} onPress={deleteDropDown}> 
                        <Icon name="minus" size={15} color="black" />
                </TouchableOpacity>
            </View>
            {dropdowns.map((dropdown) => (
                <View key={dropdown.id} style={styles.row}>
                    <Picker
                        selectedValue={dropdown.selectedValue}
                        style={styles.picker}
                        onValueChange={(value) => updateDropdownValue(dropdown.id, value)}
                    >
                        <Picker.Item label="Selecciona un valor" value="" />
                        {options.map((option) => (
                        <Picker.Item
                            key={option.value}
                            label={option.label}
                            value={option.value}
                        />
                        ))}
                    </Picker>
                </View>
            ))}
        </View>

        <Button title="Agregar" onPress={crearProducto} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    textAlign: 'center',
    color: '#66624f',
    marginBottom: 20,
  },
  containerForm: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  containerPlusMinus:{
    flexDirection:'row'
  }
});

export default FormularioProducto;
