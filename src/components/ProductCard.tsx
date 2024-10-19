// src/components/ProductCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface ProductCardProps {
  id: number;
  description: string;
  imageUrl: string;
  onAdd: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, description, imageUrl, onAdd }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <Text style={styles.description}>{description}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => onAdd(id)}>
        <Text style={styles.addButtonText}>Adicionar item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 30,
    margin: 10,
    width: '45%',
    alignItems: 'center',
    
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    
  },
  description: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#00C2BB',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default ProductCard;
