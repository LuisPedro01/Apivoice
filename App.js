import Navigation from "./src/navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  NativeModules,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "./src/services/firebase";

export default function App() {
  const [data, setData] = useState([{}]);
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");

  const getDadosApi = () => {
    ApiRef.onSnapshot((querySnapshot) => {
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

  useEffect(() => {
    getDadosApi();
  }, []);

  useEffect(() => {
    fetch("http://192.168.1.106:3000", {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain",
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.text())
      .then((data) => {
        setData(data);
        console.log("data", data);
      })
      .catch((error) => console.log("error", error));
  }, []);

  if (`selecionar apiário ${userDoc.nome}` in data) {
    useNavigation.navigate("Home", {
      nomeApi: item,
    });
    if (`selecionar colmeia ${userDoc.nome}` in data) {
      useNavigation.navigate("Colmeia", {
        nomeApi: item,
      });
    }
  }
  if (`reproduzir ultima gravaççao` in data) {
    //reproduz gravação
  }
  if (`Criar apiario` in data) {
    useNavigation.navigate("Novo Apiario");
  }
  if (`Criar colmeia` in data) {
    useNavigation.navigate("Nova Colmeia");
  }
  if (`Gravar` in data) {
    useNavigation.navigate("Audio Recorder");
  }

  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
