import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductCard from '../components/ProductCard';
import Carousel from '../components/Carousel'; // Importando o carrossel
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../backend/firebaseConfig';

type Product = {
  id: number;
  description: string;
  imageUrl: string;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories] = useState(['Frutas', 'Verduras', 'Carnes', 'Laticínios']);
  const [menuVisible, setMenuVisible] = useState(false);
  const [banners, setBanners] = useState<{ id: number; imageUrl: string }[]>([]);

  const userProfileImage = 'https://via.placeholder.com/50'; // Imagem de perfil temporária

  useEffect(() => {
    const fetchBannerImages = async () => {
      try {
        const storageRef = ref(storage, 'banners/');
        const result = await listAll(storageRef);

        if (result.items.length === 0) {
          console.log("Nenhuma imagem de banner encontrada.");
          return;
        }

        const fetchedBanners = await Promise.all(
          result.items.map(async (itemRef, index) => {
            const imageUrl = await getDownloadURL(itemRef);
            return { id: index + 1, imageUrl };
          })
        );

        setBanners(fetchedBanners);
      } catch (error) {
        console.error('Erro ao buscar as imagens dos banners:', error);
      }
    };

    const fetchProductImages = async () => {
      try {
        const storageRef = ref(storage, 'images/');
        const result = await listAll(storageRef);

        if (result.items.length === 0) {
          console.log("Nenhuma imagem de produto encontrada.");
          return;
        }

        const fetchedProducts: Product[] = await Promise.all(
          result.items.map(async (itemRef, index) => {
            const imageUrl = await getDownloadURL(itemRef);
            return {
              id: index + 1,
              description: `Produto ${index + 1}`,
              imageUrl,
            };
          })
        );

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error('Erro ao buscar as imagens dos produtos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBannerImages();
    fetchProductImages();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = products.filter(product =>
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleAdd = (id: number) => {
    console.log(`Adicionar produto com id: ${id}`);
  };

  const handleRemove = (id: number) => {
    console.log(`Remover produto com id: ${id}`);
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(!menuVisible)}>
          <MaterialIcons name="menu" size={30} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity onPress={() => console.log('Buscar')}>
          <MaterialIcons name="search" size={30} color="#000" />
        </TouchableOpacity>

        <Image source={{ uri: userProfileImage }} style={styles.profileImage} />

        <TouchableOpacity onPress={() => console.log('Carrinho de Compras')}>
          <MaterialIcons name="shopping-cart" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Menu de Categorias */}
      {menuVisible && (
        <View style={styles.menu}>
          {categories.map((category, index) => (
            <TouchableOpacity key={index} onPress={() => console.log(`Selecionou ${category}`)}>
              <Text style={styles.menuItem}>{category}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Carrossel de Banners */}
      {banners.length > 0 ? (
        <Carousel banners={banners} loading={loading} />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando banners...</Text>
      )}

      {/* Lista de Produtos */}
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard
            key={item.id}
            id={item.id}
            description={item.description}
            imageUrl={item.imageUrl}
            onAdd={handleAdd}
          />
        )}
        keyExtractor={item => item.id.toString()}
        numColumns={2} // Exibe 2 cards por linha
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Rodapé Fixo */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Seu app de Pesquisa de Preços</Text>
        <Text style={styles.footerText}>© 2024 Preço Certo. Todos os direitos reservados.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between', // Garante que o conteúdo da tela ocupe o espaço entre o cabeçalho e o rodapé
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  searchBar: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  menu: {
    padding: 10,
    backgroundColor: '#ffffff',
  },
  menuItem: {
    paddingVertical: 10,
    fontSize: 18,
  },
  footer: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
  },
});

export default Home;
