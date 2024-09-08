// src/backend/auth.ts
import { auth } from './firebaseConfig'; // Certifique-se de que o caminho está correto
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Função para criar um novo usuário
export const signUp = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Função para fazer login
export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Retorne as credenciais do usuário
    return { userCredential };
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export { auth };
