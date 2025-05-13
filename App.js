import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListarJogadores from './src/screens/listarJogadores';
import PaginaPrincipal from './src/screens/paginaPrincipal';
import UploadImag from './src/screens/uploadImag';
import ListarImag from './src/screens/listarImag';
import UploadVideo from './src/screens/uploadVideos';  
import listarVideo from './src/screens/listaVideo';  

const Stack = createNativeStackNavigator();

const app = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="PaginaPrincipal" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PaginaPrincipal" component={PaginaPrincipal} />
      <Stack.Screen name="ListarJogadores" component={ListarJogadores} />
      <Stack.Screen name="UploadImag" component={UploadImag} />
      <Stack.Screen name="ListarImag" component={ListarImag} />
      <Stack.Screen name="UploadVideo" component={UploadVideo} />
      <Stack.Screen name="listarVideo" component={listarVideo} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default app;
