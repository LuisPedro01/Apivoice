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

export default function NovaColmeia({ route }) {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');
  const [text, setText] = useState("")
  const [nomeCol, SetNomeCol] = useState('')
  const [localizaçãoCol, SetLocalizaçãoCol] = useState('')
  //console.log(route.params.nomeApi.nome)
  const subCollection1 = firebase.firestore().collection('apiarios').doc(route.params.nomeApi.nome).collection('colmeia')

  const CreateCol = async () => {
    //criar offline
    try {
      const directory = FileSystem.documentDirectory;
      const filePath = `${directory}apiario ${route.params.nomeApi.nome}/colmeia ${nome}`;
      const conteudo = `nome: ${nome}, localizacao: ${localizaçao}, createdAt: ${Date()}`
      FileSystem.makeDirectoryAsync(filePath, conteudo)
      console.log('Arquivo guardado localmente em, ', filePath)
      Alert.alert("Colmeia criada!", "Nova colmeia criada com sucesso!");
      navigation.navigate("Apiario");
    } catch (error) {
      console.log(`Erro: ${error.message}`);
    }


    const subCollection = firebase.firestore().collection('apiarios').doc(route.params.nomeApi.nome).collection('colmeia')
    subCollection
      .add({
        nomeColmeia: nome,
        localizacao: localizaçao,
        createdAt: Date()
      })
      .then(() => {
        Alert.alert("Colmeia criada!", "Nova colmeia criada com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        alert(error.message);
      });

  }

  useEffect(() => {
    SetNomeCol(route.params.NomeCol)
    SetLocalizaçãoCol(route.params.LocalCol)
  })

  return (
    <View style={styles.container}>
      <Header name={"Nova Colmeia"} type="plus-circle" />

      <View style={styles.list}>
        <CustomInput placeholder='Nome' value={nome || nomeCol} setValue={setNome} on />
        <CustomInput placeholder="Localização" value={localizaçao || localizaçãoCol} setValue={setLocalizaçao} />
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
