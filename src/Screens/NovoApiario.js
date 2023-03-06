import React,  { useState, useEffect }  from "react";
import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db } from "../services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { uid } from "uid";

export default function NovoApiario({ item, route }) {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');
  const [text, setText] = useState("")
  const [nomeApi, SetNomeApi] = useState('')
  const [localizaçãoApi, SetLocalizaçãoApi] = useState('') 

   const Create = () => {
    // Criar apiarios na base de dados
    const myCol = collection(db, "apiarios");
    const colData = {
      nome: nome,
      localizacao: localizaçao,
      createdAt: Date()
    };

    addDoc(myCol, colData)
      .then(() => {
        Alert.alert("Apiario criado!", "Novo apiário criado com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        alert(error.message);
      });
      
  };


  useEffect(()=>{
    SetNomeApi(route.params.NomeApi)
    SetLocalizaçãoApi(route.params.LocalApi)
  })


  return (
    <View style={styles.container}>
      <Header name={"Novo Apiário"} type="plus-circle"/>

      <View style={styles.list}>  
        <CustomInput placeholder='Nome' value={nome || nomeApi} setValue={setNome}/>
        <CustomInput placeholder="Localização" value={localizaçao || localizaçãoApi} setValue={setLocalizaçao}/> 
      </View>
      <CustomButton text="Adicionar" type="NOVACOLMEIA" onPress={Create}/>
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
