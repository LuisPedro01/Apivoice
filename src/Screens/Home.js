import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
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
  const [userDocOff, setUserDocOff] = useState([]);
  const [name, setName] = useState("");

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

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const deleteApi = async () => {
    firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .delete()
      .then(() => {
        Alert.alert("Apiário apagado!", "Apiário apagado com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => console.log(error));

    const fileUri = `file:///data/user/0/com.luispedro.Apivoice/files/apiario ${route.params.nomeApi.nome}`;
    try {
      await FileSystem.deleteAsync(fileUri);
      console.log("Arquivo excluído com sucesso.");
    } catch (error) {
      console.log(`Erro ao excluir o arquivo: ${error.message}`);
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
    if (userDoc.length === 0) {
      return (
        <View style={styles.container}>
          <FlatList
            keyExtractor={(item) => item.id}
            style={styles.list}
            showsVerticalScrollIndicator={false}
            data={arquivos}
            ListEmptyComponent={EmptyListMessage}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.container}>
                <CustomButton
                  text={item}
                  type="COLMEIA"
                  onPress={() =>
                    navigation.navigate("Colmeia", {
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
                  nomeCol: route.params.nomeApi,
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
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.container}>
                <CustomButton
                  text={item.nomeColmeia}
                  type="COLMEIA"
                  onPress={() =>
                    navigation.navigate("Colmeia", {
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
                  nomeCol: route.params.nomeApi,
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
    if (userDoc.length === 0) {
      listarArquivos1();
    }
  }, []);

  const [arquivos, setArquivos] = useState([]);

  const listarArquivos1 = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(
        `file:///data/user/0/com.luispedro.Apivoice/files/apiario ${route.params.nomeApi.nome}`
      );
      if (dirInfo.exists && dirInfo.isDirectory) {
        const arquivosInfo = await FileSystem.readDirectoryAsync(dirInfo.uri);
        setArquivos(arquivosInfo);
        console.log(arquivos)
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
    
  };
  return (
    <View style={styles.container}>
      <Header name={name.username} type="user" onPress={onUserPress} />
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
