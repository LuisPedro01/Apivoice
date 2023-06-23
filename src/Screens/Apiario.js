import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert
} from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase, storage } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export default function Apiario(item) {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [name, setName] = useState("");
  const [arquivos, setArquivos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [ApiariosLocais, setApiariosLocais] = useState([])


  const getDadosApi = () => {
    const userAtual = firebase.auth().currentUser.uid
    const docsUser = ApiRef.where('userId', '==', userAtual)

    docsUser.onSnapshot((querySnapshot) => {
      const userDoc = [];
      querySnapshot.forEach((doc) => {
        const { localizacao, nome } = doc.data();
        userDoc.push({
          id: doc.id,
          localizacao,
          nome,
        });
      });
      setUserDoc(userDoc);
    });
  };

  const getDadosNomes = () => {
    firebase
      .firestore()
      .collection("Nomes")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("User does not exists");
        }
      });
  };
  const combinedData = [
    ...userDoc.map((item, index) => ({ key: `userDoc_${index}`, type: 'userDoc', item })),
    ...arquivos.map((item, index) => ({ key: `arquivos_${index}`, type: 'arquivos', item }))
  ];
  const nomes = userDoc.map(obj => obj.nome);

  useEffect(() => {
    getDadosApi();
    getDadosNomes();
    if (userDoc.length === 0) {
      listarApiariosLocais()
    }
  }, []);

  const onNovoApiarioPress = () => {
    navigation.navigate("Novo Apiario", { NomeApi: "", LocalApi: "" });
  };

  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhum apiário encontrado</Text>
      </View>
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    getDadosApi();
    getDadosNomes();
    getObjectsLocally();
    console.log('userDoc id->', userDoc.map(obj => obj.id))
    setRefreshing(false)
  };

  const getObjectsLocally = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('keys->', keys)
      const objects = await AsyncStorage.multiGet(keys);
      const filteredKeys = keys.filter(key => key.includes('email') || key.includes('password'));
      await AsyncStorage.multiRemove(filteredKeys);

      // Converter os objetos de string para JSON                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
      const parsedObjects = objects.map(([key, value]) => {
        try {
          return { key, ...JSON.parse(value) };
        } catch (error) {
          console.log(`Erro ao fazer o parsing do objeto com chave ${key}:`, error);
          return [key, null];
        }
      });
      const apiarios = parsedObjects.filter(obj => obj.tipo === "Apiário");
      setArquivos(apiarios)
      console.log(apiarios)
      return parsedObjects;
    } catch (error) {
      console.log('Erro ao recuperar a lista de objetos:', error);
      return [];
    }
  };

  const eli = () => {
    FileSystem.deleteAsync(`${FileSystem.documentDirectory}apiario_undefined`)
  }

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  //listagem colmeias locais
  async function listarApiariosLocais() {
    if (Platform.OS == "android") {
      const localDirectory = FileSystem.documentDirectory;
      const apiarios = await FileSystem.readDirectoryAsync(localDirectory);
      const apiariosComPrefixo = apiarios.filter(apiario => apiario.startsWith('apiario '));
      setApiariosLocais(apiariosComPrefixo)
    }
    else {
      const localDirectory = FileSystem.documentDirectory;
      const apiarios = await FileSystem.readDirectoryAsync(localDirectory);
      const apiariosComPrefixo = apiarios.filter(apiario => apiario.startsWith('apiario_'));

      setApiariosLocais(apiariosComPrefixo)
    }
  }

  //criar apiarios automaticamente quando houver conxao à Internet
  async function CriarApiariosAuto () {
    if(Platform.OS=="ios"){
      const localDirectory = FileSystem.documentDirectory;
      const apiarios = await FileSystem.readDirectoryAsync(localDirectory);
      const apiariosComPrefixo = apiarios.filter(apiario => apiario.startsWith('apiario_'));
  
      apiariosComPrefixo.forEach(async apiario =>{
        await ApiRef.add({
          nome: apiario,
          createdAt: Date(),
          userId: firebase.auth().currentUser.uid
        })
      })  
      Alert.alert('Apiário criado com sucesso!', 'Apiário local, criado na base de dados.')
    }
    else{
      const localDirectory = FileSystem.documentDirectory;
      const apiarios = await FileSystem.readDirectoryAsync(localDirectory);
      const apiariosComPrefixo = apiarios.filter(apiario => apiario.startsWith('apiario '));
  
      apiariosComPrefixo.forEach(async apiario =>{
        await ApiRef.add({
          nome: apiario,
          createdAt: Date(),
          userId: firebase.auth().currentUser.uid
        })
      })  
      Alert.alert('Apiário criado com sucesso!', 'Apiário local, criado na base de dados.')
    }
  }

  return (
    <View style={styles.container}>
      <Header name={"Olá, " + name.username + "!"} type="user" onPress={onUserPress} />

      <CustomButton text="Lista de apiários" type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />

      <FlatList
        keyExtractor={(item) => item.key}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={combinedData}
        ListEmptyComponent={EmptyListMessage}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton
              text={item.item.nome + " - " + item.item.localizacao}
              type="COLMEIA"
              onPress={() =>
                navigation.navigate("Colmeia", {
                  nomeApi: item.item,
                  nomeApi1: item.item.nome,
                  IdLocal: item.item.id,
                  TipoDeApi: item.type,
                  LocalApi: item.item.localizacao
                })
              }
            />
          </TouchableOpacity>
        )}
      />
      <CustomButton
        text="Novo apiario"
        type="NOVACOLMEIA"
        onPress={onNovoApiarioPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  grav: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 14,
    marginRight: 14,
    marginTop: 14,
  },
  list: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20,
  },
  buttons: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 40,
  },
  message: {
    alignItems: "center",
  },
  cor: {
    color: "#939393",
  },
});
