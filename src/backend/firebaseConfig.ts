// src/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage'; // Importação do Storage

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBmp6WJ7OazMXg_x0s8H7sKkUATh42vDHw",
  authDomain: "preco-certo-backend.firebaseapp.com",
  databaseURL: "https://preco-certo-backend-default-rtdb.firebaseio.com",
  projectId: "preco-certo-backend",
  storageBucket: "preco-certo-backend.appspot.com",
  messagingSenderId: "769246994329",
  appId: "1:769246994329:web:eb8a7b5c5322d72ef7fd08"
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const database = getDatabase(app);
const storage = getStorage(app); // Inicialização do Storage

export { auth, database, storage }; // Exportação do Storage
