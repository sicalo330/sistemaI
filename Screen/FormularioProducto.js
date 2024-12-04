import React, { useState, useEffect } from 'react';
import { Text,SafeAreaView,TextInput,Button,StyleSheet,View,TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { general } from './../Style/style';
import agregarProducto from '../db/agregarProducto';
import getData from '../db/getData';
import { useNavigation } from '@react-navigation/native';
import LoadingScreen from './LoadingScreen';
import { FormattedMessage } from 'react-intl';

function FormularioProducto() {
  const [nombreProducto, setNombreProducto] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [dropdowns, setDropdowns] = useState([{ id: 1, selectedValue: '' }]);
  const [options, setOption] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  const fetchData = async () => {
    const ingredientList = await getData('Ingrediente');
    setOption(ingredientList);
  };

  useEffect(() => {
    Promise.all([fetchData()]).then(() => setLoading(false));
  }, []);

  const addDropdown = () => {
    //Se inicaliza como vacío
    const newDropdown = { id: dropdowns.length + 1, selectedValue: '' };
    setDropdowns([...dropdowns, newDropdown]); // Agregar un nuevo dropdown al estado
  };

  const deleteDropDown = () => {
    if (dropdowns.length > 0) {
      //El .slice hará que se exclya el último por ejemplo si hay un array de esta forma [1,2,3] el .slice(0,-1) lo volverá [1,2]
      //El picker depende de la variable dropdowns
      setDropdowns((prevDropdowns) => prevDropdowns.slice(0, -1));
    }
  };

  const updateDropdownValue = (id, value) => {
    //id y value llegaría algo así {4,carne molida}
    const updatedDropdowns = dropdowns.map((dropdown) =>
    //Se recorre en la lista de valores que se tengan seleccionados en el picker y se hace una comparación
    //por ejemplo si se hace click en el segundo dropdown, se hará una compración hasta llegar al id = 2 y se va a clonar el array pero se reemplazá el value anterior por el que se da
      dropdown.id === id ? { ...dropdown, selectedValue: value } : dropdown
    );
    setDropdowns(updatedDropdowns);
  };

  const crearProducto = async () => {
    //Aquí se harán las validaciones de cada campo
    if (!nombreProducto.trim()) {//El nombre del producto no puede estar vació
      alert('El nombre del producto no puede estar vacío.');
      return;
    }
    if (!/^https?:\/\/.+/.test(url)){//La url de una imagen debe empezar por https://
      alert('La URL no es válida. Debe empezar con http:// o https://');
      return;
    }
    if (isNaN(price) || price <= 0){//El campo de precio no puede estar vació, en el caso de que sí tenga un número, este debe ser mayor a 0
      alert('El precio debe ser un número mayor a 0.');
      return;
    }
    if (isNaN(stock) || stock <= 0){//Lo miso que con el precio
      alert('El stock debe ser un número mayor o igual a 0.');
      return;
    }
    if (dropdowns.some((dropdown) => !dropdown.selectedValue)){//Se debe selccionar por lo menos una opción de cada dropdown que se haya generado
      alert('Todos los ingredientes deben estar seleccionados.');
      return;
    }
    let ingredients = [];
    let data = {
      nombreProducto: nombreProducto,
      urlProducto: url,
      price: price,
      stock: stock,
    };
    //Se hace un ciclo para agregar cada producto en la lista data.ingredients
    dropdowns.forEach((element) => {
      ingredients.push({ ingredient: element.selectedValue });
    });
    data.ingredients = ingredients;
    await agregarProducto(data, 'producto');
    navigation.navigate('InventarioStack');
  };

  if (loading) {
    return <LoadingScreen />; // Uso del componente reutilizable
  }

  return (
    <SafeAreaView style={styles.containerForm}>
      <View>
        <Text style={styles.h1}><FormattedMessage id='formularioAgregarProducto' /></Text>
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
        <TextInput
          onChangeText={setPrice}
          value={price}
          placeholder="Precio del producto"
          keyboardType="numeric"
          style={styles.inputContainer}
        />
        <TextInput
          onChangeText={setStock}
          value={stock}
          placeholder="Cantidad de existencia del producto"
          keyboardType="numeric"
          style={styles.inputContainer}
        />
        <View>
          <Text><FormattedMessage id='Selecciona_ingredientes' /></Text>
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
              <Picker selectedValue={dropdown.selectedValue} style={styles.picker} onValueChange={(value) => updateDropdownValue(dropdown.id, value)}>
                <Picker.Item label="Selecciona un ingrediente" value="" />
                {options.map((option) => (//Se ciclan entre las opciones con el nombre y el valor
                  <Picker.Item key={option.id} label={option.nombre} value={option.nombre}/>
                ))}
              </Picker>
            </View>
          ))}
        </View>

        <TouchableOpacity onPress={crearProducto} style={styles.button}>
          <Text style={styles.buttonText}><FormattedMessage id='boton' /></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 22,
    textAlign: 'center',
    color: '#FF6F00', // Naranja vibrante para el título
    marginBottom: 20,
    fontWeight: 'bold',
  },
  containerForm: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F4F4F4', // Fondo gris claro
  },
  inputContainer: {
    borderColor: '#E0E0E0', // Borde gris claro
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // Fondo blanco para los inputs
  },
  containerPlusMinus: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  row: {
    marginVertical: 10,
  },
  picker: {
    borderColor: '#E0E0E0', // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // Fondo blanco
    padding: 5,
  },
  plusMinus: {
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: '#FF6F00', // Naranja para los botones de + y -
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: 'orange', // Fondo naranja para el botón
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Texto blanco
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default FormularioProducto;
