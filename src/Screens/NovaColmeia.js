import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db, firebase } from "../services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NovaColmeia({ route }) {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [localizaçao, setLocalizaçao] = useState("");
  const [text, setText] = useState("");
  const [nomeCol, SetNomeCol] = useState("");
  const [localizaçãoCol, SetLocalizaçãoCol] = useState("");
  const [Name, setName] = useState("");
  const userId = firebase.auth().currentUser.uid;


  const CreateCol = async () => {
    if (nome.trim() != "") {
      if (Name.length == 0) {
        //criar offline
        try {
          const localDirectory = `${FileSystem.documentDirectory}apiario ${route.params.nomeApi.nome}`;
          const NovaColDirectory = `${localDirectory}/colmeia ${nome}`
          await FileSystem.makeDirectoryAsync(NovaColDirectory, { intermediates: true });
          Alert.alert(
            "Colmeia criada!",
            "Nova colmeia criada com sucesso localmente!"
          );
          navigation.navigate("Página Inicial");
        } catch (error) {
          console.log(`Erro: ${error.message}`); 
        }
      } else {        
        //criar online
        const subCollection = firebase
          .firestore()
          .collection("apiarios")
          .doc(route.params.nomeApi.id)
          .collection("colmeia");
        subCollection
          .add({
            nomeColmeia: nome,
            localizacao: localizaçao,
            createdAt: Date(),
          })
          .then(() => {
            Alert.alert(
              "Colmeia criada!",
              "Nova colmeia criada com sucesso na base de dados!"
            );
            navigation.navigate("Página Inicial");
            return;
          })
          .catch((error) => {
            alert(error.message);
          });
      }
    } else {
      Alert.alert(
        "Campos obrigatórios!",
        'O campos "Nome" é obrigatórios!'
      );
    }
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

  useEffect(() => {
    SetNomeCol(route.params.NomeCol);
    SetLocalizaçãoCol(route.params.LocalCol);
    getDadosNomes();
  });

  return (
    <View style={styles.container}>
      <Header name={"Nova Colmeia"} type="plus-circle" showIcon={"true"} />

      <View style={styles.list}>
        <CustomInput
          placeholder="Nome"
          value={nome || nomeCol}
          setValue={setNome}
          required={true}
        />
        <CustomInput
          placeholder="Localização"
          value={localizaçao? localizaçao:route.params.LocalApi1 }
          setValue={setLocalizaçao}
          required={true}
        />
      </View>
      <CustomButton text="Adicionar" type="NOVACOLMEIA" onPress={CreateCol} />
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
});
