import React, { useState, useEffect } from "react";
import {Text,TextInput,SafeAreaView,StyleSheet,View,TouchableOpacity,FlatList,Button} from "react-native";
import { Picker } from "@react-native-picker/picker";
import getData from "../db/getData";
import {general} from './../Style/style'
import { Icon } from "react-native-paper";
import updateProducto from "../db/updateProducto";
import { useNavigation } from "@react-navigation/native";

function FormularioActualizacionPedido({ route }) {
    const navigation = useNavigation()
    const { pedido } = route.params;
    const [estado, setEstado] = useState(pedido.estado || "proceso"); // Estado del pedido
    const [productos, setProductos] = useState(pedido.pedido || []); // Lista de productos
    const [cantidadOriginal,setCantidadOriginal] = useState(0)
    const [listProducto,setListProducto] = useState([])
    const [dropdowns, setDropdowns] = useState([{ id: 1, selectedValue: '' }]);
    const [productosOriginales, setProductosOriginales] = useState([]);
    const [originalStock, setOriginalStock] = useState([]); // Copia del stock inicial

    useEffect(() => {
        async function fetchData() {
          const listData = await getData("producto");
          setListProducto(listData);
          setOriginalStock(listData.map((p) => ({ id: p.id, stock: p.stock })));
      
          // Guardar una copia de los productos originales en el pedido
          setProductosOriginales(pedido.pedido);
        }
        fetchData();
      }, []);


  // Eliminar un producto del pedido
  const handleRemoveProduct = (id) => {
    setProductos(productos.filter((product) => product.id !== id));
  };

  const calcularAjustesStock = (productosOriginales, productosActuales) => {
    console.log(productosOriginales)
    console.log(productosActuales)
    const ajustes = [];
  
    productosActuales.forEach((productoActual) => {
      const productoOriginal = productosOriginales.find(
        (p) => p.id === productoActual.id
      );
  
      if (productoOriginal) {
        // Calcular la diferencia en la cantidad del pedido
        const diferencia = productoActual.stock - productoOriginal.stock;
  
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
    const ajustesStock = await calcularAjustesStock(productosOriginales, productos);

    // Actualizar el stock global
    for (const ajuste of ajustesStock) {
      const productoGlobal = listProducto.find((p) => p.id === ajuste.id);
      if (productoGlobal) {
        const nuevoStock = productoGlobal.stock + ajuste.ajuste;
  
        await updateProducto("producto", ajuste.id, { stock: nuevoStock });
  
        // Actualizar localmente el stock global
        setListProducto((prev) =>
          prev.map((p) =>
            p.id === ajuste.id ? { ...p, stock: nuevoStock } : p
          )
        );
      }
    }
  
    // Actualizar el pedido en Firebase
    const updatedPedido = {
      estado,
      pedido: productos,
    };
  
    await updateProducto("pedido", pedido.id, updatedPedido);
    navigation.navigate("Ordenes")
    //console.log("Pedido actualizado con éxito:", updatedPedido);
  };
  

  return (
    <SafeAreaView style={styles.containerForm}>
      <Text style={styles.h1}>Actualizar Pedido</Text>

      {/* Selector de estado del pedido */}
      <View>
          {dropdowns.map((dropdown) => (
            <View key={dropdown.id} style={styles.row}>
            <Picker
                selectedValue={estado}
                onValueChange={(itemValue) => {
                    const selectedProduct = listProducto.find(
                    (product) => product.nombreProducto === itemValue
                    );

                    if (selectedProduct && !productos.some((p) => p.id === selectedProduct.id)) {
                    setProductos([
                        ...productos,
                        {
                        ...selectedProduct,
                        stock: 1,
                        },
                    ]);
                    }
                }}
                style={styles.picker}
            >
            <Picker.Item label="Selecciona un producto" value="" />
            {listProducto.map((element) => (
                <Picker.Item
                key={element.id}
                label={element.nombreProducto}
                value={element.nombreProducto}
                />
            ))}
            </Picker>
            </View>
          ))}
        </View>


      {/* Lista de productos */}
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <View style={styles.productContainer}>
        <Text>Producto: {item.nombreProducto}</Text>
        <Text>Precio: {item.price}</Text>
        <Text>Cantidad: {item.stock}</Text>
        <View style={styles.containerPlusMinus}>
            <Button
            title="+"
            onPress={() =>
                setProductos(
                productos.map((prod) =>
                    prod.id === item.id ? { ...prod, stock: prod.stock + 1 } : prod
                )
                )
            }
            />
            <Button
            title="-"
            onPress={() =>
                setProductos(
                productos.map((prod) =>
                    prod.id === item.id && prod.stock > 1
                    ? { ...prod, stock: prod.stock - 1 }
                    : prod
                )
                )
            }
            />
            <Button title="Eliminar" onPress={() => handleRemoveProduct(item.id)} />
            </View>
            </View>
        )}
    />
      <TouchableOpacity style={styles.saveButton} onPress={updatePedido}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    textAlign: "center",
    color: "#66624f",
    marginBottom: 20,
  },
  containerForm: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
  inputContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  productContainer: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  containerPlusMinus: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FormularioActualizacionPedido;
