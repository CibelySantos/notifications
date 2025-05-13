import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';  // Importar o pacote de notificações
import s3 from '../../awsConfig';
import { ImageBackground } from 'react-native-web';

const bucket = "bucket-storage-senai-03";

export default function UploadImageScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    setUploading(true);
    const response = await fetch(image);
    const blob = await response.blob();

    const filename = `imagens/${Date.now()}.jpg`;

    const params = {
      Key: filename,
      Bucket: bucket,
      Body: blob,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    };

    s3.upload(params, async (err, data) => {
      setUploading(false);
      if (err) {
        alert('Erro ao fazer upload');
        console.log(err);
      } else {
        alert('Upload feito com sucesso!');
        console.log('URL:', data.Location);

        // Agendar uma notificação após o upload ser bem-sucedido
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Imagem Carregada!",
            body: "Sua imagem foi carregada com sucesso.",
            data: { url: data.Location },
          },
          trigger: null,  // A notificação será enviada imediatamente
        });
      }
    });
  };

  return (
    <ImageBackground
    source={require('../assets/backgroundpaginic.jpg')}
          style={styles.container}
        >
  <Pressable style={styles.buttonPrimary} onPress={pickImage}>
    <Text style={styles.buttonText}>Selecionar Imagem</Text>
  </Pressable>

  { image && <Image source={{ uri: image }} style={styles.image} /> }

  {
    uploading ? (
      <ActivityIndicator size="large" color="#FFF" />
    ) : (
      <Pressable style={styles.buttonPrimary} onPress={uploadImage}>
        <Text style={styles.buttonText}>Fazer Upload</Text>
      </Pressable>
    )
  }
</ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 20, 40, 0.85)',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
  },
  video: {
    width: 300,
    height: 300,
    marginVertical: 10,
    alignSelf: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },

  buttonPrimary: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
  },
});
