import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Dimensions, Text } from 'react-native';

const { width } = Dimensions.get('window');

type Banner = {
  id: number;
  imageUrl: string;
};

type CarouselProps = {
  banners: Banner[];
  loading: boolean;
};

const Carousel: React.FC<CarouselProps> = ({ banners, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Configura a troca automática de banners
  useEffect(() => {
    if (banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % banners.length);
      }, 3000); // Trocar banner a cada 3 segundos
      return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
    }
  }, [banners]);

  const renderItem = ({ item }: { item: Banner }) => (
    <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} />
  );

  return (
    <View>
      {loading ? (
        <View style={styles.loading}>
          <Text>Carregando banners...</Text>
        </View>
      ) : banners.length > 0 ? (
        <FlatList
          data={banners}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          onScrollToIndexFailed={() => {}} // Evita erro ao tentar rolar para um índice inexistente
          ref={(flatList) => {
            if (flatList) {
              flatList.scrollToIndex({ index: currentIndex, animated: true });
            }
          }}
        />
      ) : (
        <View style={styles.loading}>
          <Text>Nenhum banner disponível</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    bannerImage: {
      width: width * 0.9, // Reduz a largura para 90% da largura da tela
      height: 150, // Ajuste a altura para 150 (você pode modificar conforme necessário)
      resizeMode: 'cover', // Mantém a proporção da imagem
      borderRadius: 10, // Opcional: adiciona bordas arredondadas
      marginHorizontal: width * 0.05, // Para centralizar o banner no meio da tela
    },
    loading: {
      justifyContent: 'center',
      alignItems: 'center',
      height: 150,
    },
  });

export default Carousel;
