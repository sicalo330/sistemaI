import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, FlatList } from "react-native";
import getSingleData from "../db/getSingleData";
import LoadingScreen from "./LoadingScreen";

function Detail({ route }) {
  const { product } = route.params;
  const [productDetail, setProductDetail] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const listData = await getSingleData("producto", product.id);
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
      <Text style={styles.productPrice}>Precio: ${productDetail.price}</Text>
      <Text style={styles.productStock}>Stock: {productDetail.stock} unidades</Text>
      <Text style={styles.sectionTitle}>Ingredientes:</Text>
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
