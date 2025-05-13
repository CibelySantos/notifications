// Cibely Cristiny dos Santos

import React, { useState } from 'react';
import { View, Button, ActivityIndicator, StyleSheet, TouchableOpacity, Text, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av'; 
import s3 from '../../awsConfig';

const bucket = "bucket-storage-senai-03";

export default function UploadVideoScreen({ navigation }) {
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const uploadVideo = async () => {
    if (!video) return;

    setUploading(true);
    const response = await fetch(video);
    const blob = await response.blob();

    const filename = `videos/${Date.now()}.mp4`;

    const params = {
      Key: filename,
      Bucket: bucket,
      Body: blob,
      ContentType: 'video/mp4',
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
    <ImageBackground 
      source={require('../assets/backgroundpaginic.jpg')}
      style={styles.container}
    >
      <Text style={styles.titulo}>Upload de Vídeo</Text>
      <Button title="Selecionar Vídeo" onPress={pickVideo} />
      {video && <Video source={{ uri: video }} style={styles.video} useNativeControls />}
      {uploading ? <ActivityIndicator size="large" color="#FFF" /> : <Button title="Fazer Upload" onPress={uploadVideo} />}
      
      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate('PaginaPrincipal')} 
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>Voltar para a página principal</Text>
      </TouchableOpacity>
    </ImageBackground>
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
});
