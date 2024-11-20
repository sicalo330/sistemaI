import React, { useState, useEffect } from "react";
import {Text,SafeAreaView,StyleSheet,View,TouchableOpacity,FlatList,Button} from "react-native";
import { Picker } from "@react-native-picker/picker";
import getData from "../db/getData";
import updateProducto from "../db/updateProducto";
import { useNavigation } from "@react-navigation/native";
import LoadingScreen from "./LoadingScreen";

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
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
          const listData = await getData("producto");
          setListProducto(listData);
          setOriginalStock(listData.map((p) => ({ id: p.id, stock: p.stock })));
          // Guardar una copia de los productos originales en el pedido
          setProductosOriginales(pedido.pedido);
        }
    Promise.all([fetchData()]).then(() => setLoading(false));
      }, []);


  // Eliminar un producto del pedido
  const handleRemoveProduct = (id) => {
    setProductos(productos.filter((product) => product.id !== id));
  };

  const calcularAjustesStock = (productosOriginales, productosActuales) => {
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
    setLoading(true)
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
    setLoading(false)
    navigation.navigate("OrdenesStack")
  };

  if (loading) {
    return <LoadingScreen message="Cargando datos de ventas..." />;
  }
  

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
            color="orange"
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
            color="orange"
            />
            <Button title="Eliminar" onPress={() => handleRemoveProduct(item.id)} color="orange" />
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
    marginHorizontal: 5,
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
  }
});


export default FormularioActualizacionPedido;
