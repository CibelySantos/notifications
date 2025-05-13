// Cibely Cristiny dos Santos

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';

const backgroundImage = require('../assets/backgroundpaginic.jpg');

export default function Stack({ navigation }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Seja bem-vindo(a) ao nosso aplicativo!</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarJogadores')}>
          <Text style={styles.buttonText}>Lista de jogadores</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadImag')}>
          <Text style={styles.buttonText}>Upload de imagens</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('UploadVideo')}>
          <Text style={styles.buttonText}>Upload de vídeos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('listarVideo')}>
          <Text style={styles.buttonText}>Lista de vídeos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ListarImag')}>
          <Text style={styles.buttonText}>Lista de imagens</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.logoutButton, isPressed && styles.logoutButtonHover]}
          onPress={() => navigation.navigate('RealizarLogin')}
        >
          <Text style={styles.logoutButtonText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 35, 73, 0.85)',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'rgba(28, 58, 111, 0.8)', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 15,
    width: '80%',
    maxWidth: 300, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  logoutButtonHover: {
    backgroundColor: 'rgba(200, 200, 200, 1)', 
  },
  logoutButtonText: {
    color: 'black', 
    fontSize: 18,
    fontWeight: 'bold',
  },
});