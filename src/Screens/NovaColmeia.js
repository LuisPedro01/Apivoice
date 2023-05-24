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


  const CreateCol = () => {
    if (nome.trim() != "" && localizaçao.trim() != "") {
      if (Name != 0) {
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
      } else {
        //criar offline
        try {
          const createObjectLocally = async (objectKey, object) => {
            try {
              await AsyncStorage.setItem(objectKey, JSON.stringify(object));
              console.log('Objeto criado localmente com sucesso!');
            } catch (error) {
              console.log('Erro ao criar o objeto localmente:', error);
            }
          };
          const id = `${Date.now()}-${Math.random()}`
          const objectToCreate = { nome: nome, localizacao: localizaçao, createdAt: Date(), id: id, tipo: 'Colmeia', apiario: route.params.nomeApi.nome };
          const objectKey = nome;
          createObjectLocally(objectKey, objectToCreate);
          Alert.alert(
            "Colmeia criada!",
            "Nova colmeia criada com sucesso localmente!"
          );
          navigation.navigate("Página Inicial");
          console.log(objectToCreate)
        } catch (error) {
          console.log(`Erro: ${error.message}`); 
        }
      }
    } else {
      Alert.alert(
        "Campos obrigatórios!",
        'Os campos de "Nome" e de "Localização" são obrigatórios!'
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
          value={localizaçao || localizaçãoCol}
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
