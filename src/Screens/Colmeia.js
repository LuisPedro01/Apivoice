import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Platform
} from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase, db } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export default function NovaColmeia({ item, route }) {
  const navigation = useNavigation();
  const [Grav, setGrav] = useState([]);
  const [URL, setURL] = useState("");
  const storage = getStorage();
  const storage1 = firebase.storage();
  var listRef = ref(
    storage,
    `apiario ${route.params.nomeApi}/colmeia ${route.params.nomeCol}`
  );
  const [userDocOff, setUserDocOff] = useState([]);
  const [arquivos, setArquivos] = useState([]);
  const [name, setName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [GravaçoesLocais, setGravaçoesLocais] = useState([])

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

  useEffect(() => {
    if (name.length == 0) {
      listarGravacoesLocais()
    }
    listGrav();
    getDadosNomes();
    console.log('NOMECOLMEIA->',route.params.nomeCol)
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    if (name.length == 0) {
      listarGravacoesLocais()
    }
    listGrav();
    getDadosNomes();
    setRefreshing(false)
  };

  //apagar colmeia base de dados e localmente
  const deleteColmeia = async () => {
    if (name.length === 0) {
      //eliminar offline
      try {
        excluirArquivo()
        navigation.navigate("Página Inicial");
        Alert.alert("Apiário apagado!", "Apiário apagado com sucesso localmente!");
      } catch (error) {
        console.log(`Erro ao excluir o arquivo: ${error.message}`);
      }
    }
    else {
      //eliminar online
      const subCollection = firebase
        .firestore()
        .collection("apiarios")
        .doc(route.params.nomeApi.id)
        .collection("colmeia");
      subCollection
        .doc(route.params.nomeCol.id)
        .delete()
        .then(() => {
          Alert.alert("Colmeia apagada!", "Colmeia apagada com sucesso na base de dados!");
          navigation.navigate("Página Inicial");
          setUserDocOff("");
        })
        .catch((error) => {
          console.error("Erro ao eliminar colmeia: ", error);
        });
    }
  };

  //alterar colmeia de apiário
  const alterarApi = () => {
    navigation.navigate("Alterar Apiario", {
      nomeApi: route.params.nomeApi,
      nomeCol: route.params.nomeCol,
      IdApi: route.params.IdApi,
      IdCol: route.params.IdCol
    });
  };

  //obter gravações da base de dados
  const listGrav = () => {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((item) => {
          setGrav((arr) => [...arr, item.name]);
          getDownloadURL(item).then((url) => {
            setURL((prev) => [...prev, url]);
          });
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //botão nova gravação pressionado
  const NovaGravacaoPress = () => {
    navigation.navigate("Audio Recorder", {
      nomeCol: route.params.nomeCol,
      nomeApi: route.params.nomeApi,
    });
  };

  //reproduzir audio da base de dados
  const onPlayPress = (item) => {
    storage1
      .ref(`apiario ${route.params.nomeApi}/colmeia ${route.params.nomeCol}/${item}`)
      .getDownloadURL()
      .then(async (url) => {
        console.log(`url de ${item}->`, url);
        try {
          if (Platform.OS == "android") {
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            await sound.playAsync();
          }
          else {
            const { sound } = await Audio.Sound.createAsync({ uri: url });
            await sound.playAsync();
          }
        } catch (error) {
          console.log("Erro ao reproduzir o audio: ", error);
        }
      });
  };

  //reproduzir audio localmente
  const onPlayPressOffline = async (item) => {
    if(Platform.OS=="android"){
      console.log("Loading Sound");  
      const directory = FileSystem.documentDirectory;
      const filePath = `${directory}/apiario ${route.params.nomeApi.nome}/${route.params.nomeCol}/${item}`;  
      try {  
        const { sound } = await Audio.Sound.createAsync({ uri: filePath });
        await sound.replayAsync();
        console.log('audio reproduzido com sucesso')
      } catch (error) {
        console.log("Erro ao reproduzir o audio: ", error);
      }
    }
    else{
      console.log("Loading Sound");  
      const NomeA = route.params.nomeCol.replace(/\s/g, '_')
      const directory = FileSystem.documentDirectory;
      const filePath = `${directory}apiario_${route.params.nomeApi.nome}/${NomeA}/${item}`;
      console.warn('FILEPATH->', filePath)
      try {  
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
          console.log('Arquivo de áudio não encontrado:', filePath);
          console.warn('Arquivo de áudio não encontrado:', filePath);

          return;
        }
        const { sound } = await Audio.Sound.createAsync({ uri: filePath });
        await sound.replayAsync();
        console.log('audio reproduzido com sucesso')
      } catch (error) {
        console.log("Erro ao reproduzir o audio: ", error);
        console.warn("Erro ao reproduzir o audio: ", error)
      }
    }
  };

  //mostrar mensagem quando nao houver mensagem
  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhuma gravação encontrada</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    if (name.length == 0) {
      return (
        <FlatList
          style={styles.list}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={GravaçoesLocais}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item}
                type="COLMEIA"
                onPress={() => onPlayPressOffline(item)}
              />
            </TouchableOpacity>
          )}
        />
      );
    } else {
      return (
        <FlatList
          style={styles.list}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          data={Grav}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item}
                type="COLMEIA"
                onPress={() => onPlayPress(item)}
              />
            </TouchableOpacity>
          )}
        />
      );
    }
  };

  //listagem de gravaçoes locais
  async function listarGravacoesLocais() {
    if(Platform.OS=="android"){
      const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;;
      const colmeiaDirectory = `${localDirectory}/${route.params.nomeCol}`;
  
      // Verifique a existência do diretório da colmeia
      const directoryInfo = await FileSystem.getInfoAsync(colmeiaDirectory);
      if (!directoryInfo.exists || !directoryInfo.isDirectory) {
        console.log('Diretório da colmeia não encontrado:', route.params.nomeCol);
        return;
      }
  
      const gravacoes = await FileSystem.readDirectoryAsync(colmeiaDirectory);
      console.log('Gravações locais da colmeia', route.params.nomeCol, ':', gravacoes);
      setGravaçoesLocais(gravacoes)
    }
    else{
      const NomeA = route.params.nomeCol.replace(/\s/g, '_')
      const localDirectory = `${FileSystem.documentDirectory}apiario_${route.params.nomeApi.nome}`;;
      const colmeiaDirectory = `${localDirectory}/${NomeA}`;
      
      // Verifique a existência do diretório da colmeia
      const directoryInfo = await FileSystem.getInfoAsync(colmeiaDirectory);
      if (!directoryInfo.exists || !directoryInfo.isDirectory) {
        console.log('Diretório da colmeia não encontrado:', route.params.nomeCol);
        return;
      }
  
      const gravacoes = await FileSystem.readDirectoryAsync(colmeiaDirectory);
      console.log('Gravações locais da colmeia', route.params.nomeCol, ':', gravacoes);
      setGravaçoesLocais(gravacoes)
    }
  }

  //eliminar colmeia local
  async function excluirArquivo() {
    if(Platform.OS=="android"){
      const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;;
      const colmeiaDirectory = `${localDirectory}/${route.params.nomeCol}`;
      try {
        await FileSystem.deleteAsync(colmeiaDirectory);
        console.log('Arquivo excluído:', colmeiaDirectory);
      } catch (error) {
        console.log('Erro ao excluir o arquivo:', colmeiaDirectory);
        console.error(error);
      }
    }
    else{
      const localDirectory = `${FileSystem.documentDirectory}apiario_${route.params.nomeApi.nome}`;;
      const colmeiaDirectory = `${localDirectory}/${route.params.nomeCol}`;
      try {
        await FileSystem.deleteAsync(colmeiaDirectory);
        console.log('Arquivo excluído:', colmeiaDirectory);
      } catch (error) {
        console.log('Erro ao excluir o arquivo:', colmeiaDirectory);
        console.error(error);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Header name={"Gravações"} type="music" showIcon={'true'} />
      <CustomButton
        text={
          route.params.nomeCol || route.params.nomeCol1 +
          " - " +
          route.params.localCol
        }
        type="COLMEIAS"
      />
      <View style={styles.buttons}>
        <CustomButton
          text="Eliminar Colmeia"
          type="SECONDARY"
          onPress={deleteColmeia}
        />

        <CustomButton
          text="Alterar apiário"
          type="SECONDARY"
          onPress={alterarApi}
        />
      </View>

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

      <CustomButton
        text={"Nova gravação"}
        type="NOVACOLMEIA"
        onPress={NovaGravacaoPress}
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
  },
  message: {
    alignItems: "center",
  },
  cor: {
    color: "#939393",
  },
});
