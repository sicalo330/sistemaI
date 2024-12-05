import React, { useState, useEffect } from "react";
import {Text,SafeAreaView,StyleSheet,View,TouchableOpacity,FlatList,Button, Alert} from "react-native";
import { Picker } from "@react-native-picker/picker";
import getData from "../db/getData";
import updateData from "../db/updateData";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";
import Icon from 'react-native-vector-icons/FontAwesome';
import { FormattedMessage } from "react-intl";

function FormularioActualizacionPedido({ route }) {
    const navigation = useNavigation()
    const { pedido } = route.params;
    const [productos, setProductos] = useState(pedido.pedido || []); // Lista de productos
    const [listProducto,setListProducto] = useState([])
    const [dropdowns, setDropdowns] = useState([{ id: 1, selectedValue: '' }]);
    const [productosOriginales, setProductosOriginales] = useState([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
          const listData = await getData("producto");
          setListProducto(listData);//Se guardan aquí los datos de todos los productos que existen
          // Guardar una copia de los productos originales en el pedido
          setProductosOriginales(pedido.pedido);//Aquí la lista productos que conforman un pedido, este será el pedido cuyo valor será actualizado
        }
    Promise.all([fetchData()]).then(() => setLoading(false));//Simplemente se mostrará la pantalla de carga
    //loading = true -> setLoading(false) -> loading = false
      }, []);


  // Eliminar un producto del pedido
  const handleRemoveProduct = (id) => {
    //Tengo entendido que esto hará una copia de la lista de productos excluyendo al producto que tenga una id igual al que se le está pasando a la función
    setProductos(productos.filter((product) => product.id !== id));
  };

  const calcularAjustesStock = (productosOriginales, productosActuales) => {
    //Se inicializa la variable ajustes como una lista vacía
    const ajustes = [];
  
    productosActuales.forEach((productoActual) => {
      const productoOriginal = productosOriginales.find((p) => p.id === productoActual.id);
      if (productoOriginal) {
        //Si encuentra a este if, significa que el producto se mantuvo en el pedido sin embargo se hace algun calculo para ver si la cantidad cambio
        //Esto calcula la diferencia en la cantidad del pedido
        const diferencia = productoActual.stock - productoOriginal.stock;
        //Si la diferencia es positiva significa que se pidió más del producto
        //Si la diferencia es negativa significa que se pidió menos del producto
        //¿Por qué un negativo en diferencia al hacer el push?
        //Si se pide más significa que hay que restar el precio del inventario total, pero si se pide menos significa que hay que sumar el precio total del inventario
        //Es solo usar ley de signos -*- = + y -*+ = -
        ajustes.push({
          id: productoActual.id,
          ajuste: -diferencia, // Restar la diferencia al stock global
        });
      } else {
        // Producto nuevo agregado al pedido
        ajustes.push({
          id: productoActual.id,
          ajuste: -productoActual.stock, // Todo el stock pedido se descuenta
        });
      }
    });
  
    // Productos eliminados del pedido
    productosOriginales.forEach((productoOriginal) => {
      if (!productosActuales.find((p) => p.id === productoOriginal.id)) { 
        /*
          Esto quiere decir que si un producto que estaba originalmente no se encuentra en los productos actuales significa que fue eliminado
        */
        ajustes.push({
          id: productoOriginal.id,
          ajuste: productoOriginal.stock, // Devolver el stock eliminado
        });
      }
    });
  
    return ajustes;
  };
  

  // Actualizar el pedido completo
  const updatePedido = async () => {
    setLoading(true);

    //Necesitamos sumar los productos agregados o eliminados junto con su cantidad
    const ajustesStock = await calcularAjustesStock(productosOriginales, productos);

    //El for va a validar si todas las cantidades son validas, si encuentra una cantidad negativa aparecerá una alaerta y el return detendrá todo
    for (const ajuste of ajustesStock) {
        const productoGlobal = listProducto.find((p) => p.id === ajuste.id);
        if (productoGlobal) {
            const nuevoStock = productoGlobal.stock + ajuste.ajuste;
            if (nuevoStock < 0) {
                Alert.alert("Se ha excedido la cantidad disponible del producto", productoGlobal.nombreProducto);
                setLoading(false);
                return;
            }
        }
    }

    // Si todos los ajustes son válidos, proceder con las actualizaciones
    for (const ajuste of ajustesStock) {
        const productoGlobal = listProducto.find((p) => p.id === ajuste.id);
        if (productoGlobal) {
            const nuevoStock = productoGlobal.stock + ajuste.ajuste;

            await updateData("producto", ajuste.id, { stock: nuevoStock });

            // Actualizar localmente el stock global
            // setListProducto((prev) =>
            //     prev.map((p) => (p.id === ajuste.id ? { ...p, stock: nuevoStock } : p))
            // );
        }
    }

    //Actualizar el pedido en Firebase
    const updatedPedido = {
        pedido: productos,
    };

    //Aquí se actualiza definitivamente el pedido con las cantidades que se hayan escogido
    await updateData("pedido", pedido.id, updatedPedido);
    setLoading(false);
    navigation.navigate("OrdenesStack");
};


  if (loading) {
    return <LoadingScreen />;
  }
  

  return (
    <SafeAreaView style={styles.containerForm}>
      <Text style={styles.h1}><FormattedMessage id="actualizar_pedido" /></Text>

      {/* Selector de estado del pedido */}
      <View>
        <View style={styles.row}>
        <Picker style={styles.picker} onValueChange={(itemValue) => {
                {/*Cuando se presione una opción, sacará el nombre del producto que corresponda con el nombre de dicha opción*/}
                {/*Luego en el if se va a compar las id de la opción seleccionada con algúno de los productos del inventario*/}
                const selectedProduct = listProducto.find((product) => product.nombreProducto === itemValue);
                if (selectedProduct && !productos.some((p) => p.id === selectedProduct.id)) {
                  {/*Al final se hace un clon de los productos que ya habían sido seleccionados pero se agrega otro pero inicializandolo con un stock de 1*/}
                setProductos([...productos,{...selectedProduct,stock: 1}]);
                }
            }}>
        <Picker.Item label="Selecciona un producto" value="" />
        {/*Se ponen como opciones la cantidad de productos que existen en el inventario, el nombre de lo sproductos es su valor*/}
        {listProducto.map((element) => (
            <Picker.Item
            key={element.id}
            label={element.nombreProducto}
            value={element.nombreProducto}
            />
        ))}
        </Picker>
        </View>
        </View>


      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={styles.productContainer}>
          <Text><FormattedMessage id="tab_actualizar_producto" />: {item.nombreProducto}</Text>
          <Text><FormattedMessage id="tab_ingredientes_precio" />: {item.price}</Text>
          <Text><FormattedMessage id="cantidad" />: {item.stock}</Text>
          <View style={styles.containerPlusMinus}>
          <TouchableOpacity onPress={() => setProductos(productos.map((prod) => prod.id === item.id && prod.stock > 1 ? { ...prod, stock: prod.stock - 1 } : prod))} style={styles.button}>
              <Icon name="minus" size={15} color="white" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setProductos(productos.map((prod) => prod.id === item.id ? { ...prod, stock: prod.stock + 1 } : prod))} style={styles.button}>
              <Icon name="plus" size={15} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleRemoveProduct(item.id)} style={styles.button}>
                <Text style={styles.buttonText}><FormattedMessage id="tab_actualizar_eliminar" /></Text>
            </TouchableOpacity>
          </View>
        </View>
        )}
    />
    <TouchableOpacity style={styles.saveButton} onPress={updatePedido}>
      <Text style={styles.saveButtonText}><FormattedMessage id="tab_actualizar_guardar" /></Text>
    </TouchableOpacity>
    </SafeAreaView> 
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 22,
    textAlign: "center",
    color: "orange", // Naranja para destacar el título
    marginBottom: 20,
    fontWeight: "bold",
  },
  containerForm: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F4", // Fondo gris claro
  },
  picker: {
    height: 50,
    marginBottom: 20,
    backgroundColor: "#FFFFFF", // Fondo blanco para el selector
    borderColor: "#E0E0E0", // Borde gris claro
    borderWidth: 1,
    borderRadius: 5,
  },
  productContainer: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#FFFFFF", // Fondo blanco para los productos
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0", // Gris claro
  },
  containerPlusMinus: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "orange", // Botón naranja
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  saveButtonText: {
    color: "#FFFFFF", // Texto blanco
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    color: "orange", // Fondo naranja
    marginHorizontal: 0,
    backgroundColor:'orange'
  },
  buttonText: {
    color: "#FFFFFF", // Texto blanco
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    marginVertical: 10,
  },
  butonPlusMinus:{
    color:'black',
  },
  touchableStyle:{
    width: 30, 
    height: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF', 
    borderWidth: 1, 
    borderColor: 'orange', 
    borderRadius: 5 
},
});


export default FormularioActualizacionPedido;
