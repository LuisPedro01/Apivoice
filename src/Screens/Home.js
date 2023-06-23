import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform,
} from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase } from "../services/firebase";
import * as FileSystem from "expo-file-system";

export default function Home({ item, route }) {
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const [name, setName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [ColmeiasLocais, setColmeiasLocais] = useState([])
  const ColmeiaRef = firebase.firestore().collection("apiarios").doc(route.params.nomeApi.id).collection("colmeia")

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
    CriarColmeiasAuto()
    if (name === null) {
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
    if (name.length == 0) {
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
                  LocalApi1: route.params.LocalApi
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
                      nomeApi: route.params.nomeApi,
                      IdCol: item.id,
                      IdApi: route.params.IdLocal,
                      colmeia: item
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
    if (name.length == 0) {
      listarColmeiasLocais()
    }
  }, []);

  const getDocumentList = async () => {
    if (Platform.OS == "android") {
      try {
        const documentDirectory = FileSystem.documentDirectory + route.params.nomeApi1
        const documentList = await FileSystem.readDirectoryAsync(documentDirectory);
        console.log(documentList);
      } catch (error) {
        console.log('Erro ao obter a lista de documentos:', error);
        return [];
      }
    }
    else {
      const NomeA = route.params.nomeApi1.replace(/\s/g, '_')
      try {
        const documentDirectory = FileSystem.documentDirectory + NomeA
        const documentList = await FileSystem.readDirectoryAsync(documentDirectory);
        console.log(documentList);
      } catch (error) {
        console.log('Erro ao obter a lista de documentos:', error);
        return [];
      }
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

  //download de colmeias
  const downloadFiles = async (folderPath) => {

    const apiarioRef = firebase.storage().ref(folderPath);
    const apiarioSnapshot = await apiarioRef.listAll();
    const colmeiasNomes = apiarioSnapshot.prefixes.map(colmeia => colmeia.name);

    const diretorioLocal = `${FileSystem.documentDirectory}apiario_${route.params.nomeApi.nome}`;
    for (const colmeiaNome of colmeiasNomes) {
      const colmeiaNome1 = colmeiaNome.replace(/\s/g, '_')
      console.log(colmeiaNome1)
      const diretorioColmeia = `${diretorioLocal}/${colmeiaNome1}`;
      await FileSystem.makeDirectoryAsync(diretorioColmeia, { intermediates: true });

      const colmeiaRef = apiarioRef.child(colmeiaNome);
      const colmeiaSnapshot = await colmeiaRef.listAll();
      const gravaçõesNomes = colmeiaSnapshot.items.map(item => item.name);
      console.log('gravaçoes->', gravaçõesNomes)
      for (const gravaçãoNome of gravaçõesNomes) {
        const gravaçãoNome1 = gravaçãoNome.replace(/\s/g, '_')
        const gravaçãoRef = colmeiaRef.child(gravaçãoNome);
        const downloadURL = await gravaçãoRef.getDownloadURL();
        const fileUri = `${diretorioLocal}/${colmeiaNome1}/${gravaçãoNome1}`;
        const downloadedFile = await FileSystem.downloadAsync(downloadURL, fileUri);

        // Verifique a existência do arquivo baixado
        const fileInfo = await FileSystem.getInfoAsync(downloadedFile.uri);
        if (!fileInfo.exists) {
          console.log('Erro ao guardar o ficheiro:', downloadedFile.uri);
          continue;
        }
        console.log('Ficheiro guardado:', downloadedFile.uri);
      }
      // Liste os arquivos dentro do diretório da colmeia
      const files = await FileSystem.readDirectoryAsync(diretorioColmeia);
      console.log('Arquivos na colmeia', colmeiaNome, ':', files);
    }
    Alert.alert('Colmeia disponibilizada offline!', 'Arquivos da colmeia disponiveis agora offline')

  };

  //listagem colmeias locais
  async function listarColmeiasLocais() {
    if (Platform.OS == "android") {
      const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;
      const colmeias = await FileSystem.readDirectoryAsync(localDirectory);
      setColmeiasLocais(colmeias)
      console.log(colmeias)
    }
    else {
      const localDirectory = `${FileSystem.documentDirectory}apiario_${route.params.nomeApi.nome}`;
      const colmeias = await FileSystem.readDirectoryAsync(localDirectory);
      setColmeiasLocais(colmeias)
    }
  }

  // Função para verificar se uma colmeia já existe em um apiário
  async function verificarColmeiaExistente(IdApiario, nomeColmeia) {
    const colmeiasRef = firebase.firestore().collection('apiarios').doc(IdApiario).collection("colmeia");
    const apiariosRef = firebase.firestore().collection('apiarios')
    const querySnapshot = await colmeiasRef
      .where('nomeColmeia', '==', nomeColmeia)
      .get();
      
    return !querySnapshot.empty;
  }

  //criar colmeias automaticamente quando houver conxao à Internet
  async function CriarColmeiasAuto() {
    if (Platform.OS == "ios") {
      const localDirectory = `${FileSystem.documentDirectory}apiario_${route.params.nomeApi.nome}`;
      const colmeias = await FileSystem.readDirectoryAsync(localDirectory);

      colmeias.forEach(async colmeia => {
        const partes = colmeia.split('_');
        const nomeColmeia = partes[1];
        const ExisteColmeia = await verificarColmeiaExistente(route.params.nomeApi.id, nomeColmeia)

        if (!ExisteColmeia) {
          await firebase.firestore().collection("apiarios").doc(route.params.nomeApi.id).collection("colmeia").add({
            nomeColmeia: nomeColmeia,
            createdAt: Date()
          })
          Alert.alert('Colmeia criada com sucesso!', 'Colmeia local, criada na base de dados.')
        } else {
          Alert.alert('Erro ao criar colmeia', 'Colmeia local, já existe na base de dados.')
        }
      })
    }
    else {
      const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;
      const colmeias = await FileSystem.readDirectoryAsync(localDirectory);

      colmeias.forEach(async colmeia => {
        const ExisteColmeia = await verificarColmeiaExistente(route.params.nomeApi.id, colmeia)

        if (!ExisteColmeia) {
          await firebase.firestore().collection("apiarios").doc(route.params.nomeApi.id).collection("colmeia").add({
            nomeColmeia: colmeia,
            createdAt: Date()
          })
          Alert.alert('Colmeia criada com sucesso!', 'Colmeia local, criada na base de dados.')
        } else {
          Alert.alert('Erro ao criar colmeia', 'Colmeia local, já existe na base de dados.')
        }
      })
    }
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
        onPress={listarColmeiasLocais}
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
