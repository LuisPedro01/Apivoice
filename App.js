import Navigation from "./src/navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  NativeModules,
  Alert
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "./src/services/firebase";

export default function App() {
  //const [data, setData] = useState([{}]);
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

  // useEffect(() => {
  //   const intervalID = setInterval(() => {
  //     console.log('A ouvir o comando')
  //     fetch("http://192.168.1.72:3000", {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json, text/plain",
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((resp) => resp.text())
  //       .then((data1) => {
  //         console.log("data", data1);
  //         Alert.alert("Voce disse", `${data1}`)
  //         if (data1 == 'parar') {
  //           Alert.alert('Comandos parados!', "Para voltar a ativar os comandos, reinicie a App.")
  //           clearInterval(intervalID);
  //        } 
  //       })
  //       .catch((error) => console.log("error", error));

  //     }, 5000);
  // }, []);

  

  // if (`selecionar apiário ${userDoc.nome}` in data) {
  //   useNavigation.navigate("Home", {
  //     nomeApi: item,
  //   });
  //   if (`selecionar colmeia ${userDoc.nome}` in data) {
  //     useNavigation.navigate("Colmeia", {
  //       nomeApi: item,
  //     });
  //     if (`Criar colmeia` in data) {
  //       useNavigation.navigate("Nova Colmeia");
  //     } 
  //     if (`Reproduzir ultima gravaççao` in data) {
  //       //reproduz gravação
  //     }
  //     if (`Gravar` in data) {
  //       useNavigation.navigate("Audio Recorder");
  //       //começar gravação
  //     }
  //   } else {
  //     console.log("Nenhuma colmeia selecionada!")
  //   }
  //   if (`Criar apiario` in data) {
  //     useNavigation.navigate("Novo Apiario");
  //     //pedir nome/localização do apiário
  //   }
  // } else {
  //   console.log("Nenhum apiário selecionado!") 
  // }


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
