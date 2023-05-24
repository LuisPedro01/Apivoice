import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db } from "../services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { firebase } from "../services/firebase";
import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function NovoApiario({ item, route }) {
  const navigation = useNavigation();
  const [nome, setNome] = useState("");
  const [localizaçao, setLocalizaçao] = useState("");
  const [text, setText] = useState("");
  const [nomeApi, SetNomeApi] = useState("");
  const [localizaçãoApi, SetLocalizaçãoApi] = useState("");
  const userId = firebase.auth().currentUser.uid;
  const [Name, setName] = useState("");

  const Create = async () => {
    if (nome.trim() != "" && localizaçao.trim() != "") {
      if (Name.length != 0) {
        //Criar apiarios na base de dados
        const myCol = collection(db, "apiarios");
        const colData = {
          nome: nome,
          localizacao: localizaçao,
          createdAt: Date(),
          userId: userId,
        };

        addDoc(myCol, colData)
          .then(() => {
            Alert.alert(
              "Apiario criado!",
              "Novo apiário criado com sucesso na base de dados!"
            );
            navigation.navigate("Página Inicial");
            return;
          })
          .catch((error) => {
            alert(error.message)
          });
      }
      else {
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
          const objectToCreate = { nome: nome, localizacao: localizaçao, createdAt: Date(), id: id, tipo: 'Apiário' };
          const objectKey = nome;
          createObjectLocally(objectKey, objectToCreate); 
          Alert.alert(
            "Apiario criado!",
            "Novo apiário criado com sucesso localmente!"
          );
          navigation.navigate("Página Inicial");

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
    SetNomeApi(route.params.NomeApi);
    SetLocalizaçãoApi(route.params.LocalApi);
    getDadosNomes();
  });

  return (
    <View style={styles.container}>
      <Header name={"Novo Apiário"} type="plus-circle" showIcon={"true"} />

      <View style={styles.list}>
        <CustomInput
          placeholder="Nome"
          value={nome || nomeApi}
          setValue={setNome}
        />
        <CustomInput
          placeholder="Localização"
          value={localizaçao || localizaçãoApi}
          setValue={setLocalizaçao}
        />
      </View>
      <CustomButton text="Adicionar" type="NOVACOLMEIA" onPress={Create} />
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
