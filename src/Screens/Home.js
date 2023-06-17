import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

export default function Home({ item, route }) {
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [name, setName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [ColmeiasLocais, setColmeiasLocais] = useState([])

  //receber lista de colmeias
  const getDados = () => {
    firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .collection("colmeia")
      .get()
      .then((querySnapshot) => {
        const userDoc = [];
        querySnapshot.forEach((doc) => {
          const { nomeColmeia, localizacao } = doc.data();
          userDoc.push({
            id: doc.id,
            nomeColmeia,
            localizacao,
          });
        });
        setUserDoc(userDoc);
      });
  };

  //receber nomes
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

  //funçao do refresh
  const onRefresh = () => {
    setRefreshing(true);
    getDadosNomes();
    getDados();
    getDocumentList()
    if (name===null) {
      listarColmeiasLocais()
    }
    setRefreshing(false);
  };

  //navegação para a pagina user
  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  //eliminar apiário
  const deleteApi = async () => {
    if (name != null && route.params.TipoDeApi != "arquivos") {
      //Online
      firebase
        .firestore()
        .collection("apiarios")
        .doc(route.params.nomeApi.id)
        .delete()
        .then(() => {
          Alert.alert(
            "Apiário apagado!",
            "Apiário apagado com sucesso da base de dados!"
          );
          navigation.navigate("Página Inicial");
        })
        .catch((error) => console.log(error));
    } else {
      //offline
      try {
        removeObjectLocally(route.params.nomeApi1);
        navigation.navigate("Página Inicial");
        Alert.alert(
          "Apiário apagado!",
          "Apiário apagado com sucesso localmente!"
        );
      } catch (error) {
        console.log(`Erro ao excluir o arquivo: ${error.message}`);
      }
    }
  };

  //mostrar mensagem se nao tiver colmeias
  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhuma colmeia encontrada</Text>
      </View>
    );
  };

  //render flatlist(verificar se é necessário)
  const renderFlatList = () => {
    if (name.length==0) {
      return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            data={ColmeiasLocais}
            ListEmptyComponent={EmptyListMessage}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.container}>
                <CustomButton
                  text={item}
                  type="COLMEIA"
                  onPress={() =>
                    navigation.navigate("Gravações", {
                      nomeCol: item,
                      nomeApi: route.params.nomeApi,
                    })
                  }
                />
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttons}>
            <CustomButton
              text="Nova colmeia"
              type="NOVACOLMEIA"
              onPress={() =>
                navigation.navigate("Nova Colmeia", {
                  nomeApi: route.params.nomeApi,
                  NomeCol: "",
                  LocalApi: "",
                })
              }
            />
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            data={userDoc}
            ListEmptyComponent={EmptyListMessage}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.container}>
                <CustomButton
                  text={item.nomeColmeia}
                  type="COLMEIA"
                  onPress={() =>
                    navigation.navigate("Gravações", {
                      nomeCol: item.nomeColmeia,
                      nomeCol1: item.nome,
                      localCol: item.localizacao,
                      nomeApi: route.params.nomeApi1,
                      IdCol: item.id,
                      IdApi: route.params.IdLocal
                    })
                  }
                />
              </TouchableOpacity>
            )}
          />

          <View style={styles.buttons1}>
            <CustomButton
              text="Nova colmeia"
              type="teste1"
              onPress={() =>
                navigation.navigate("Nova Colmeia", {
                  nomeApi: route.params.nomeApi,
                  NomeCol: "",
                  LocalApi: "",
                  LocalApi1: route.params.LocalApi
                })
              }
            />

            <CustomButton
              text="Disponivel off-line"
              type="teste"
              onPress={() =>
                downloadFiles(`apiario ${route.params.nomeApi.nome}/`)
                //checkDirectoryExists(`apiario exemplo/colmeia teste`)
                //getDocumentList()
                //excluirArquivo(`${FileSystem.documentDirectory}apiario [object Object]`)
              }
            />
          </View>
        </View>
      );
    }
  };

  useEffect(() => {
    getDadosNomes();
    getDados();
    if (name.length==0) {
      listarColmeiasLocais()
    }
  }, []);

  const getDocumentList = async () => {
    try {
      const documentDirectory = FileSystem.documentDirectory + 'apiario exemplo'
      const documentList = await FileSystem.readDirectoryAsync(documentDirectory);
      console.log(documentList);
    } catch (error) {
      console.log('Erro ao obter a lista de documentos:', error);
      return [];
    }
  };

  const checkDirectoryExists = async (directoryPath) => {
    const fileInfo = await FileSystem.documentDirectory.getInfoAsync(directoryPath);
    if (fileInfo.exists) {
      console.log('EXISTE')
    }
    else (
      console.log('NAO EXISTE')

    )
  };

  const downloadFiles = async (folderPath) => {
    const apiarioRef = firebase.storage().ref(folderPath);
    const apiarioSnapshot = await apiarioRef.listAll();
    const colmeiasNomes = apiarioSnapshot.prefixes.map(colmeia => colmeia.name);


    const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;
    for (const colmeiaNome of colmeiasNomes) {
      const colmeiaDirectory = `${localDirectory}/${colmeiaNome}`;
      await FileSystem.makeDirectoryAsync(colmeiaDirectory, { intermediates: true });

      const colmeiaRef = apiarioRef.child(colmeiaNome);
      const colmeiaSnapshot = await colmeiaRef.listAll();

      const gravaçõesNomes = colmeiaSnapshot.items.map(item => item.name);

      for (const gravaçãoNome of gravaçõesNomes) {
        const gravaçãoRef = colmeiaRef.child(gravaçãoNome);
        const downloadURL = await gravaçãoRef.getDownloadURL();

        const fileUri = `${localDirectory}/${colmeiaNome}/${gravaçãoNome}`;
        const downloadedFile = await FileSystem.downloadAsync(downloadURL, fileUri);

        // Verifique a existência do arquivo baixado
        const fileInfo = await FileSystem.getInfoAsync(downloadedFile.uri);
        if (!fileInfo.exists) {
          console.log('Erro ao baixar o arquivo:', downloadedFile.uri);
          continue;
        }

        console.log('Arquivo baixado:', downloadedFile.uri);
      }
      // Liste os arquivos dentro do diretório da colmeia
      const files = await FileSystem.readDirectoryAsync(colmeiaDirectory);
      console.log('Arquivos na colmeia', colmeiaNome, ':', files);
    }

  };

  //listagem colmeias locais
  async function listarColmeiasLocais() {
    const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;;
    const colmeias = await FileSystem.readDirectoryAsync(localDirectory);
    setColmeiasLocais(colmeias)
  }

  return (
    <View style={styles.container}>
      <Header
        name={name.username}
        type="user"
        onPress={onUserPress}
        showIcon={"true"}
      />
      <View style={styles.buttons}>
        <CustomButton text={route.params.nomeApi1} type="HOME" />

        <CustomButton
          text="Eliminar apiário"
          type="SECONDARY"
          onPress={() => {
            deleteApi();
          }}
        />
      </View>

      <CustomButton
        text={"Lista de colmeias"}
        type="COLMEIAS"
      />

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />

      {renderFlatList()}
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
  },
  buttons1: {
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
