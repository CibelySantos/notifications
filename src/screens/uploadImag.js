// Cibely Cristiny dos Santos

import React, { useState } from 'react';
import { View, Button, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import s3 from '../../awsConfig';

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

    s3.upload(params, (err, data) => {
      setUploading(false);
      if (err) {
        alert('Erro ao fazer upload');
        console.log(err);
      } else {
        alert('Upload feito com sucesso!');
        console.log('URL:', data.Location);
      }
    });
  };

  return (
    <View style={styles.container}>
      <Button title="Selecionar Imagem" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {uploading ? <ActivityIndicator /> : <Button title="Fazer Upload" onPress={uploadImage} />}

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('PaginaPrincipal')} 
        activeOpacity={0.7}
      >
        <Text style={[styles.buttonText, { color: 'black' }]}>
          Voltar para a página principal
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
  },
  image: {
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
});
