// src/views/Cart.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

type Product = {
  id: number;
  description: string;
  imageUrl: string;
  price: number; // Propriedade de preço adicionada para cálculo do valor total
};

type CartItems = {
  [key: number]: number; // { id: quantidade }
};

const Cart: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cartItems, products } = route.params as { cartItems: CartItems; products: Product[] };

  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Filtra os produtos que estão no carrinho
    const itemsInCart = products.filter(product => cartItems[product.id]);
    setCartProducts(itemsInCart);
  }, [cartItems, products]);

  useEffect(() => {
    // Atualiza o valor total
    const calculatedTotal = cartProducts.reduce(
      (sum, product) => sum + product.price * (cartItems[product.id] || 0),
      0
    );
    setTotal(calculatedTotal);
  }, [cartProducts, cartItems]);

  const handleIncrement = (id: number) => {
    cartItems[id] += 1;
    setCartProducts([...cartProducts]);
  };

  const handleDecrement = (id: number) => {
    if (cartItems[id] > 1) {
      cartItems[id] -= 1;
    } else {
      delete cartItems[id]; // Remove do carrinho se a quantidade for 0
      setCartProducts(cartProducts.filter(product => product.id !== id));
    }
    setCartProducts([...cartProducts]);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.detailsContainer}>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.priceText}>R$ {item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleDecrement(item.id)}>
            <MaterialIcons name="remove-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{cartItems[item.id]}</Text>
          <TouchableOpacity onPress={() => handleIncrement(item.id)}>
            <MaterialIcons name="add-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carrinho de Compras</Text>
      </View>

      {/* Lista de Produtos no Carrinho */}
      <FlatList
        data={cartProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Valor Total */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: R$ {total.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
  },
  itemDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 16,
    color: '#00C2BB',
    marginBottom: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 18,
  },
  totalContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Cart;
