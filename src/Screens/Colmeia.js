import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase, db } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { collection, deleteDoc, getDocs } from "firebase/firestore";
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
    `apiario ${route.params.nomeApi.nome}/colmeia ${route.params.nomeCol.nomeColmeia}`
  );
  const [userDocOff, setUserDocOff] = useState([]);
  const [arquivos, setArquivos] = useState([]);

  useEffect(() => {
    listGrav();
    if (Grav.length === 0) {
      listarArquivos1();
    }
  }, []);

  const listarArquivos1 = async () => {
    try {
      const dirInfo = await FileSystem.getInfoAsync(
        `file:///data/user/0/com.luispedro.Apivoice/files/apiario ${route.params.nomeApi.nome}/${route.params.nomeCol}`
      );

      if (dirInfo.exists && dirInfo.isDirectory) {
        const arquivosInfo = await FileSystem.readDirectoryAsync(dirInfo.uri);
        setArquivos(arquivosInfo);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const teste = async () => {
    const directory = FileSystem.cacheDirectory;
    const filename = 'recording-d8d2803f-d5d9-465f-9d69-97e638e1bbcb.m4a';
    const filePath = `${directory}Audio/${filename}`;
    
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (fileInfo.exists) {
      console.log('Arquivo encontrado no diretório:', filePath);
    } else {
      console.log('Arquivo não encontrado no diretório.');
    }
  };

  const deleteColmeia = async () => {
    const subCollection = firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .collection("colmeia");
    subCollection
      .doc(route.params.nomeCol.id)
      .delete()
      .then(() => {
        Alert.alert("Colemia apagada!", "Colmeia apagada com sucesso!");
        navigation.navigate("Apiario");
        console.log(userDocOff);
        setUserDocOff("");
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
      const directory = FileSystem.documentDirectory;
      const filePath = `${directory}/apiario ${route.params.nomeApi.nome}/${route.params.nomeCol}`;
      try {
        await FileSystem.deleteAsync(filePath);
        console.log('Arquivo excluído com sucesso.');
      } catch (error) {
        console.log(`Erro ao excluir o arquivo: ${error.message}`);
      }
  };

  const alterarApi = () => {
    navigation.navigate("Alterar Apiario", {
      nomeApi: route.params.nomeApi,
      nomeCol: route.params.nomeCol,
    });
  };

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

  const NovaGravacaoPress = () => {
    navigation.navigate("Audio Recorder", {
      nomeCol: route.params.nomeCol.nomeColmeia,
      nomeApi: route.params.nomeApi.nome,
    });
  };

  const onPlayPress = (item) => {
    storage1
      .ref(
        `apiario ${route.params.nomeApi.nome}/colmeia ${route.params.nomeCol.nomeColmeia}/${item}`
      )
      .getDownloadURL()
      .then(async (url) => {
        console.log(`url de ${item}->`, url);
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          await sound.replayAsync();
        } catch (error) {
          console.log("Erro ao reproduzir o audio: ", error);
        }
      });
  };

  const onPlayPressOffline = async (item) => {
    console.log("Loading Sound");

    const directory = FileSystem.documentDirectory;
    const filePath = `${directory}/apiario ${route.params.nomeApi.nome}/${route.params.nomeCol}/${item}`;
    
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: filePath });
      await sound.replayAsync();
    } catch (error) {
      console.log("Erro ao reproduzir o audio: ", error);
    }
  };

  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhuma gravação encontrada</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    if (Grav.length === 0) {
      return (
        <FlatList
          style={styles.list}
          ListEmptyComponent={EmptyListMessage}
          showsVerticalScrollIndicator={false}
          data={arquivos}
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

  return (
    <View style={styles.container}>
      <Header name={"Gravações"} type="music" />
      <CustomButton
        text={
          route.params.nomeCol.nomeColmeia +
          " - " +
          route.params.nomeCol.localizacao
        }
        type="COLMEIAS"
        onPress={teste}
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
