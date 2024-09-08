import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp, ParamListBase } from '@react-navigation/native';
import { uploadImagesToFirebase } from '../backend/uploadImagesFromDirectory'; // Certifique-se de que o caminho esteja correto

const Index = ({ navigation }: IndexProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(true);

  useEffect(() => {
    const checkInitialSetup = async () => {
      try {
        // Inicia o upload das imagens ao iniciar o app
        await uploadImagesToFirebase();
        setUploading(false);

        // Simula outras inicializações
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('Erro ao realizar a configuração inicial:', error);
        setIsLoading(false);
        setUploading(false);
      }
    };

    checkInitialSetup();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo_preco_01.png')} style={styles.logo} />

      {isLoading || uploading ? (
        <ActivityIndicator size="large" color="#00C2BB" />
      ) : (
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <LinearGradient
            colors={['#00C2BB', '#008B00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Começar</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Seu app de Pesquisa de Preços</Text>
        <Text style={styles.footerText}>© 2024 Preço Certo. Todos os direitos reservados.</Text>
      </View>
    </View>
  );
};

interface IndexProps {
  navigation: NavigationProp<ParamListBase>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logo: {
    width: 305,
    height: 207,
    marginBottom: 40,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
});

export default Index;
