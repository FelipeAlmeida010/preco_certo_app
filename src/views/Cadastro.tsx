// src/views/Cadastro.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { signUp } from '../backend/auth';
import { getDatabase, ref, set } from 'firebase/database'; // Importações para o Realtime Database
import { getAuth } from 'firebase/auth'; // Importação para obter o UID do usuário autenticado

const Cadastro = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }
    try {
      // Cria o usuário usando a função signUp
      await signUp(email, password);

      // Obtenha o UID do usuário autenticado
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const uid = user.uid;

        // Adiciona o campo isAdmin no Realtime Database
        const database = getDatabase();
        const userRef = ref(database, `users/${uid}`);
        await set(userRef, {
          email: user.email,
          isAdmin: true, // Defina se o usuário é admin
        });

        console.log('Usuário cadastrado e campo isAdmin definido no Realtime Database');
      }

      Alert.alert('Sucesso', 'Conta criada com sucesso');
      navigation.navigate('Login');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro', error.message);
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crie sua conta!</Text>
      <Image source={require('../../assets/sign-up.png')} style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        style={styles.buttonContainer} 
        onPress={handleSignup}
      >
        <LinearGradient 
          colors={['#00C2BB', '#008B00']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cadastrar</Text>
        </LinearGradient>
      </TouchableOpacity>

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
          <Text style={styles.buttonText}>Já possui uma conta?</Text>
        </LinearGradient>
      </TouchableOpacity>

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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
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
    width: '100%',
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
});

export default Cadastro;
