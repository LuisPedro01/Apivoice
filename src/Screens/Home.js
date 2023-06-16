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

  const combinedData = [
    ...userDoc.map((item, index) => ({
      key: `userDoc_${index}`,
      type: "userDoc",
      item,
    })),
    ...arquivos.map((item, index) => ({
      key: `arquivos_${index}`,
      type: "arquivos",
      item,
    })),
  ];

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

  const onRefresh = () => {
    setRefreshing(true);
    getDadosNomes();
    getDados();
    getObjectsLocally();
    if (userDoc.length === 0) {
    }
    setRefreshing(false);
  };

  const removeAllObjects = async () => {
    try {
      await AsyncStorage.clear();
      console.log("Todos os objetos foram removidos do armazenamento.");
    } catch (error) {
      console.log("Erro ao remover objetos:", error);
    }
  };

  const getObjectsLocally = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const objects = await AsyncStorage.multiGet(keys);
      console.log("keys", keys);
      const filteredKeys = keys.filter(
        (key) => key.includes("email") || key.includes("password")
      );
      await AsyncStorage.multiRemove(filteredKeys);

      // Converter os objetos de string para JSON
      const parsedObjects = objects.map(([key, value]) => {
        try {
          return key, JSON.parse(value);
        } catch (error) {
          console.log(
            `Erro ao fazer o parsing do objeto com chave ${key}:`,
            error
          );
          return { key, parsedValue: null };
        }
      });

      const colmeias = parsedObjects.filter(
        (obj) => obj.tipo === "Colmeia" && obj.apiario === route.params.nomeApi1
      );
      setArquivos(colmeias);
      console.log("colmeias", colmeias);

      return colmeias;
    } catch (error) {
      console.log("Erro ao recuperar a lista de objetos:", error);
      return [];
    }
  };

  const removeKeys = async (keys) => {
    try {
      await AsyncStorage.multiRemove(keys);
      console.log("Chaves removidas com sucesso:", keys);
    } catch (error) {
      console.log("Erro ao remover chaves:", error);
    }
  };

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

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

  const removeObjectLocally = (key) => {
    try {
      AsyncStorage.removeItem(key);
      console.log("Objeto removido com sucesso!");
      navigation.navigate("Página Inicial");
    } catch (error) {
      console.log("Erro ao remover o objeto:", error);
    }
  };

  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhuma colmeia encontrada</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    if (userDoc.length === 0 && route.params.TipoDeApi != "arquivos") {
      return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            data={arquivos}
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
                      nomeCol: item,
                      nomeApi: route.params.nomeApi,
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
                })
              }
            />

            <CustomButton
              text="Disponivel off-line"
              type="teste"
              onPress={() =>
                baixarArquivos(`apiario ${route.params.nomeApi.nome}/`)
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
    getObjectsLocally();
    console.log('localautomatico->', route.params.LocalApi)
    if (userDoc.length === 0) {
    }
  }, []);

  const listarArquivos1 = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(
        `file:///data/user/0/com.luispedro.Apivoice/files/apiario ${route.params.nomeApi.nome}/`
      );
      if (dirInfo.exists && dirInfo.isDirectory) {
        const arquivosInfo = await FileSystem.readDirectoryAsync(dirInfo.uri);
        setArquivos(arquivosInfo);
        console.log(arquivos);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const storage = getStorage();
  var listRef = ref(storage, `apiario ${route.params.nomeApi.nome}/`);
  const [URL, setURL] = useState("");
  const [Grav, setGrav] = useState([]);

  async function listarSubdiretorios(diretorio) {
    const lista = await firebase.storage().ref(diretorio).listAll();
    const subdiretorios = lista.prefixes.map((p) => p.fullPath);

    const arquivos = lista.items.map((i) => i.fullPath);
    for (const subdiretorio of lista.prefixes) {
      const sublista = await listarArquivos(subdiretorio.fullPath);
      arquivos.push(...sublista);
    }
    console.log(arquivos);

    return arquivos;
  }

  async function listarArquivos(diretorio) {
    const lista = await firebase.storage().ref(diretorio).listAll();
    const arquivos = lista.items.map((i) => i.fullPath);
    for (const subdiretorio of lista.prefixes) {
      const sublista = await listarArquivos(subdiretorio.fullPath);
      arquivos.push(...sublista);
    }
    return arquivos;
  }

  async function baixarArquivo(caminho) {
    const referencia = firebase.storage().ref(caminho);
    const url = await referencia.getDownloadURL();
    const info = await FileSystem.getInfoAsync(
      FileSystem.documentDirectory + caminho
    );
    if (!info.exists) {
      const diretorio = caminho.substring(0, caminho.lastIndexOf("/"));
      const diretorioLocal = FileSystem.documentDirectory + diretorio;
      const infoDiretorio = await FileSystem.getInfoAsync(diretorioLocal);
      if (!infoDiretorio.exists) {
        await FileSystem.makeDirectoryAsync(diretorioLocal, {
          intermediates: true,
        });
      }
      const arquivo = await FileSystem.downloadAsync(
        url,
        FileSystem.documentDirectory + caminho + ".m4a"
      );
      console.log("Arquivo baixado em: " + arquivo.uri);
    } else {
      console.log("Arquivo já existe localmente: " + info.uri);
    }
  }

  async function baixarArquivos(diretorio) {
    const arquivos = await listarArquivos(diretorio);
    for (const caminho of arquivos) {
      await baixarArquivo(caminho);
    }
    Alert.alert(
      "Download feito com sucesso!",
      "O apiário encontra-se agora disponível offline."
    );
  }
  const teste = () => {
    console.log(arquivos);
  };
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
        onPress={teste}
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

      <View style={styles.container}>
        <FlatList
          keyExtractor={(item) => item.key}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={combinedData}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item.item.nomeColmeia || item.item.nome}
                type="COLMEIA"
                onPress={() =>
                  navigation.navigate("Gravações", {
                    nomeCol: item.item.nomeColmeia,
                    nomeCol1: item.item.nome,
                    localCol: item.item.localizacao,
                    nomeApi: route.params.nomeApi1,
                    TipoDeApi: route.params.TipoDeApi,
                    IdCol: item.item.id,
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
              baixarArquivos(`apiario ${route.params.nomeApi.nome}/`)
            }
          />
        </View>
      </View>
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
