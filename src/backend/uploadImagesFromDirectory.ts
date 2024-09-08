import { ref, uploadBytes } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset'; 
import { storage } from './firebaseConfig'; // Use a instância existente

export const uploadImagesToFirebase = async () => {
  try {
    const imageAssets = [
      require('../../assets/images/1.png'),
      require('../../assets/images/2.png'),
      require('../../assets/images/3.png'),
      require('../../assets/images/4.png'),
      require('../../assets/images/5.png'),
      require('../../assets/images/6.png'),
      require('../../assets/images/7.png'),
      require('../../assets/images/8.png'),
      require('../../assets/images/9.png'),
      require('../../assets/images/10.png'),
      require('../../assets/images/11.png'),
      require('../../assets/images/12.png'),
      require('../../assets/images/13.png'),
      require('../../assets/images/14.png'),
      require('../../assets/images/15.png'),
      require('../../assets/images/16.png'),
      require('../../assets/images/17.png'),
      require('../../assets/images/18.png'),
    ];

    const assets = await Asset.loadAsync(imageAssets);

    for (const asset of assets) {
      const localUri = asset.localUri || asset.uri;
      const fileName = localUri.split('/').pop();
      const fileRef = ref(storage, `images/${fileName}`);

      console.log(`Local URI: ${localUri}`);
      console.log(`File Name: ${fileName}`);
      console.log(`File Reference: ${fileRef.fullPath}`);

      const response = await fetch(localUri);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();

      await uploadBytes(fileRef, blob, {
        contentType: 'image/png',
      });

      console.log(`Imagem enviada: ${fileName}`);
    }

    console.log('Upload completo.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('Erro ao fazer upload das imagens:', error.message);
    } else {
      console.error('Erro ao fazer upload das imagens:', error);
    }
  }
};

// Chama a função ao iniciar o app
uploadImagesToFirebase().catch(console.error);
