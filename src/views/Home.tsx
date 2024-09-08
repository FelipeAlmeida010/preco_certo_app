import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, TextInput, TouchableOpacity, Text, Image } from 'react-native';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductCard from '../components/ProductCard';
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

  // Imagem de perfil do usuário (substituir pelo URL real da imagem)
  const userProfileImage = 'https://via.placeholder.com/50';

  // Função para buscar as imagens dos banners no Firebase Storage
  const fetchBannerImages = async () => {
    try {
      const storageRef = ref(storage, 'banners/');
      const result = await listAll(storageRef); // Lista todos os arquivos na pasta 'banners/'
      
      if (result.items.length === 0) {
        console.log("Nenhuma imagem de banner encontrada.");
        return;
      }

      const fetchedBanners = await Promise.all(
        result.items.map(async (itemRef, index) => {
          const imageUrl = await getDownloadURL(itemRef);
          return { id: index + 1, imageUrl }; // Gera URL pública para cada imagem
        })
      );

      setBanners(fetchedBanners);
    } catch (error) {
      console.error('Erro ao buscar as imagens dos banners:', error);
    }
  };

  useEffect(() => {
    // Função para buscar as imagens dos produtos
    const fetchImages = async () => {
      try {
        const storageRef = ref(storage, 'images/');
        const result = await listAll(storageRef);

        if (result.items.length === 0) {
          console.log("Nenhuma imagem de produto encontrada.");
          return;
        }

        const fetchedProducts: Product[] = await Promise.all(
          result.items.map(async (itemRef, index) => {
            const imageUrl = await getDownloadURL(itemRef); // Gera URL pública para cada imagem de produto
            return {
              id: index + 1,
              description: `Produto ${index + 1}`, // Aqui você pode customizar as descrições
              imageUrl,
            };
          })
        );

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Exibe todos os produtos inicialmente
      } catch (error) {
        console.error('Erro ao buscar as imagens:', error);
      } finally {
        setLoading(false);
      }
    };

    // Busca banners e produtos
    fetchBannerImages();
    fetchImages();
  }, []);

  // Filtrar produtos com base na barra de busca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      const filtered = products.filter(product =>
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Restaura a lista completa se a barra de busca estiver vazia
    }
  };

  // Funções de adicionar e remover produtos
  const handleAdd = (id: number) => {
    console.log(`Adicionar produto com id: ${id}`);
  };

  const handleRemove = (id: number) => {
    console.log(`Remover produto com id: ${id}`);
  };

  // Renderiza cada banner
  const renderBannerItem = ({ item }: { item: { id: number; imageUrl: string } }) => (
    <Image source={{ uri: item.imageUrl }} style={styles.banner} />
  );

  return (
    <View style={styles.container}>
      {/* Header com Barra de Busca, Menu Sanduíche, Imagem de Perfil e Carrinho */}
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

      {/* Menu Sanduíche */}
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
        <FlatList
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}  // Funciona como um carrossel
          style={{ marginVertical: 20 }}  // Estilização para o carrossel
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Carregando banners...</Text>
      )}

      {/* Lista de Produtos */}
      {loading ? (
        <View style={styles.loading}>
          <Text>Carregando produtos...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <ProductCard
              key={item.id}
              id={item.id}
              description={item.description}
              imageUrl={item.imageUrl}
              onAdd={handleAdd}
              onRemove={handleRemove}
            />
          )}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  banner: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
