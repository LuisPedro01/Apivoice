import React,  { useState }  from "react";
import { StyleSheet, Text, View, FlatList, Button, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db, firebase } from "../services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { uid } from "uid";

export default function NovaColmeia({route}) {
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');
  const [text, setText] = useState("")
  //console.log(route.params.nomeCol)

   const Create = () => {
    // Criar colmeias na base de dados
    const myCol = collection(db, "colmeias");
    const colData = {
      nome: nome,
      localizacao: localizaçao,
      createdAt: Date()
    };

    addDoc(myCol, colData)
      .then(() => {
        Alert.alert("Colmeia criada!", "Nova colmeia criada com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        alert(error.message);
      });
      
  };

  const CreateCol = () => {
    const subCollection = firebase.firestore().collection('apiarios').doc(route.params.nomeCol.id).collection('colmeia')
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


  return (
    <View style={styles.container}>
      <Header name={"Nova Colmeia"} type="plus-circle"/>

      <View style={styles.list}>  
        <CustomInput placeholder='Nome' value={nome} setValue={setNome} />
        <CustomInput placeholder="Localização" value={localizaçao} setValue={setLocalizaçao}/> 
      </View>
      <CustomButton text="Adicionar" type="NOVACOLMEIA" onPress={CreateCol}/>
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
