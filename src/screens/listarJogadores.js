import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Modal, Pressable, Image, Alert, ScrollView, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

const firebaseConfig = {
  apiKey: "AIzaSyDVBwB2T63KsTfxMPfAVXQgnqMqlmk5UjM",
  authDomain: "auth-firebase-projeto-au-d81b4.firebaseapp.com",
  projectId: "auth-firebase-projeto-au-d81b4",
  storageBucket: "auth-firebase-projeto-au-d81b4.firebasestorage.app",
  messagingSenderId: "641013292961",
  appId: "1:641013292961:web:b9a16ab14956c3769c35e0",
  measurementId: "G-KLXSMJ803Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db, collection, getDocs };

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Jogadores() {
  const [nome, setNome] = useState('');
  const [altura, setAltura] = useState('');
  const [camisa, setCamisa] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [jogadores, setJogadores] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [jogadorAtual, setJogadorAtual] = useState(null);

  useEffect(() => {
    const pedirPermissao = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Permissão para notificação não concedida 😢');
        }
      } else {
        alert('As notificações só funcionam em dispositivos físicos 😅');
      }
    };

    pedirPermissao();
    buscarDados();
  }, []);

  const buscarDados = async () => {
    const querySnapshot = await getDocs(collection(db, 'real-madrid'));
    const dados = [];
    querySnapshot.forEach((doc) => {
      dados.push({ ...doc.data(), id: doc.id });
    });
    setJogadores(dados);
  };

  const salvarJogador = async () => {
    if (!nome || !altura || !camisa || !nascimento) {
      alert('Preencha todos os campos!');
      return;
    }

    try {
      const [day, month, year] = nascimento.split('/');

      // Verificar se a data inserida é válida
      if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || month < 1 || month > 12) {
        alert('Data inválida, insira no formato dd/mm/aaaa');
        return;
      }

      // Verificar se o dia é válido para o mês
      const validDaysInMonth = new Date(year, month, 0).getDate();
      if (day > validDaysInMonth) {
        alert(`Esse mês tem apenas ${validDaysInMonth} dias!`);
        return;
      }

      // Criar a data com o formato correto para o JavaScript: yyyy-MM-dd
      const nascimentoDate = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
      
      // Verificar se a data é válida
      if (isNaN(nascimentoDate.getTime())) {
        alert('Data inválida, por favor insira uma data válida!');
        return;
      }

      const nascimentoTimestamp = Timestamp.fromDate(nascimentoDate);

      if (jogadorAtual) {
        const jogadorRef = doc(db, 'real-madrid', jogadorAtual.id);
        await updateDoc(jogadorRef, {
          nome,
          altura: parseFloat(altura),
          camisa,
          nascimento: nascimentoTimestamp,
        });
        alert('Sucesso', 'Jogador atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'real-madrid'), {
          nome,
          altura: parseFloat(altura),
          camisa,
          nascimento: nascimentoTimestamp,
        });
        alert('Sucesso', 'Jogador adicionado com sucesso!');

        // Notificação só quando for novo jogador
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Novo jogador no elenco!',
            body: `${nome} entrou pro Real Madrid!`,
            sound: true,
          },
          trigger: null,
        });
      }

      buscarDados();
      setJogadorAtual(null);
      setNome('');
      setAltura('');
      setCamisa('');
      setNascimento('');
      setModalVisible(false);

    } catch (error) {
      console.error('Erro ao salvar jogador:', error);
      alert('Erro', 'Não foi possível salvar as alterações.');
    }
  };

  const editarJogador = (jogador) => {
    setJogadorAtual(jogador);
    setNome(jogador.nome);
    setAltura(jogador.altura.toString());
    setCamisa(jogador.camisa);
    const nascimentoDate = new Date(jogador.nascimento.seconds * 1000).toISOString().split('T')[0];
    setNascimento(nascimentoDate);
    setModalVisible(true);
  };

  const excluirJogador = async (id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza que deseja excluir este jogador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir', style: 'destructive', onPress: async () => {
            await deleteDoc(doc(db, 'real-madrid', id));
            buscarDados();
          }
        }
      ]
    );
  };

  const limparCampos = () => {
    setNome('');
    setAltura('');
    setCamisa('');
    setNascimento('');
    setJogadorAtual(null);
  };

  return (
    <View style={styles.background}>
      <Image
        source={{ uri: 'https://logodetimes.com/times/real-madrid/logo-real-madrid-256.png' }}
        style={{ width: 100, height: 100, alignSelf: 'center', marginBottom: 10 }}
      />
      <Text style={styles.titulo}>Real Madrid - Elenco</Text>

      <FlatList
        data={jogadores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.nome}>Nome: {item.nome}</Text>
            <Text style={styles.info}>Altura: {item.altura} m</Text>
            <Text style={styles.info}>Camisa: {item.camisa}</Text>
            <Text style={styles.info}>Nascimento: {new Date(item.nascimento.seconds * 1000).toLocaleDateString()}</Text>
            <View style={styles.botoes}>
              <Pressable onPress={() => editarJogador(item)} style={styles.botaoEditar}>
                <Text style={styles.textoBotao}>Editar</Text>
              </Pressable>
              <Pressable onPress={() => excluirJogador(item.id)} style={styles.botaoExcluir}>
                <Text style={styles.textoBotao}>Excluir</Text>
              </Pressable>
            </View>
          </View>
        )}
      />

      <Pressable
        onPress={() => {
          limparCampos();
          setModalVisible(true);
        }}
        style={styles.botaoAdicionar}
      >
        <Text style={styles.textoBotao}>+ Jogador</Text>
      </Pressable>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ color: 'black', fontSize: 20, marginBottom: 20 }}>Preencha os dados:</Text>

            <TextInput
              placeholder="Nome"
              placeholderTextColor="#888"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
            />
            <TextInput
              placeholder="Altura (ex: 1.80)"
              placeholderTextColor="#888"
              keyboardType="decimal-pad"
              value={altura}
              onChangeText={setAltura}
              style={styles.input}
            />
            <TextInput
              placeholder="Número da camisa"
              placeholderTextColor="#888"
              value={camisa}
              onChangeText={setCamisa}
              style={styles.input}
            />
            <TextInput
              placeholder="Data de nascimento (DD-MM-YYYY)"
              placeholderTextColor="#888"
              value={nascimento}
              onChangeText={setNascimento}
              style={styles.input}
            />

            <Pressable
              onPress={salvarJogador}
              style={styles.botaoSalvar}
            >
              <Text style={styles.textoBotao}>Salvar</Text>
            </Pressable>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={styles.botaoFechar}
        >
          <Text style={styles.textoBotao}>Cancelar</Text>
        </Pressable>
      </View>
    </ScrollView>
  </Modal>
</View>
);
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 50,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#002b5c',
    textAlign: 'center',
    marginBottom: 20,
  },
  item: {
    backgroundColor: '#f0f0f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  info: {
    fontSize: 16,
    color: '#333',
  },
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoEditar: {
    backgroundColor: '#ffc107',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoExcluir: {
    backgroundColor: '#dc3545',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  botaoAdicionar: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  modalContent: {
    marginTop: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },
  botaoSalvar: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  botaoFechar: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 10,
  },
});
