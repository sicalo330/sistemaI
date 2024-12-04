import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import getSingleData from "../db/getSingleData";
import LoadingScreen from "./LoadingScreen";
import { FormattedMessage } from "react-intl";

function Detail({ route }) {
  const { plato } = route.params;//Se extrae la id del producto desde la ruta
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const listData = await getSingleData("producto", plato);//la variable plato tiene la id del producto que se va a buscar
      setProductDetail(listData);
    }
    Promise.all([fetchData()]).then(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: productDetail.urlProducto }} style={styles.productImage} />
      <Text style={styles.productName}>{productDetail.nombreProducto}</Text>
      <Text style={styles.productPrice}><FormattedMessage id="tab_ingredientes_precio" />: ${productDetail.price}</Text>
      <Text style={styles.productStock}><FormattedMessage id="cantidad" />: {productDetail.stock}</Text>
      <Text style={styles.sectionTitle}><FormattedMessage id="tab_ingredientes_ingredientes" />:</Text>
      <FlatList
        data={productDetail.ingredients}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={styles.ingredientItem}>- {item.ingredient}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo gris claro
    alignItems: "center",
  },
  productImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "orange",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "orange", // Nombre destacado en naranja
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333", // Texto gris oscuro
    marginBottom: 4,
  },
  productStock: {
    fontSize: 18,
    color: "gray", // Color gris para información adicional
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "orange",
    marginVertical: 12,
    textAlign: "center",
  },
  ingredientItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
});

export default Detail;
