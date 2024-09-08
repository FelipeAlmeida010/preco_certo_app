// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

interface ProductCardProps {
  id: number;
  description: string;
  imageUrl: string;
  onAdd: (id: number) => void;
  onRemove: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, description, imageUrl, onAdd, onRemove }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.description}>{description}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Add" onPress={() => onAdd(id)} />
        <Button title="Remove" onPress={() => onRemove(id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: '45%',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});

export default ProductCard;
