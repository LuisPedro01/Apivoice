import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db } from "../services/firebase";
import { addDoc, collection, doc, documentId, getDoc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import { firebase } from "../services/firebase";


export default function AlterarApiario({ route }) {
  //const route = useRoute();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');
  const [buttonValue, setButtonValue] = useState(route.params.nomeApi.nome);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [userDoc, setUserDoc] = useState([]);
  const nomeApi = route.params.nomeApi.nome
  const idApi = route.params.nomeApi.id
  const idCol = route.params.nomeCol.id
  const [newDocRef, setNewDocRef] = useState(route.params.nomeApi.id)

  const originalDocRef = firebase.firestore().collection("apiarios").doc(idApi)
  const originalSubCollectionRef = originalDocRef.collection("colmeia").doc(idCol)

  const targetDocRef = firebase.firestore().collection('apiarios').doc(newDocRef)
  const targetSubCollectionRef = targetDocRef.collection('colmeia')


  useEffect(() => {
    getDadosApi();
  }, [])

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
  }

  const novoApi = (item) => {
    if (nomeApi != item.nome) {
      setButtonValue(item.nome)
    }
    else {
      setButtonValue(nomeApi)
    }

    if (idApi != item.id) {
      setNewDocRef(item.id)
    } else {
      setNewDocRef(idApi)
    }
    console.log(newDocRef)
  }

  const alterarApi = () => {
    //criar nova colmeia em um novo apiario 

    originalSubCollectionRef.get()
      .then(subdoc => {
        if(subdoc.exists){
          targetSubCollectionRef.add(subdoc.data())
          .then(()=> {
            Alert.alert("Colmeia alterada!", "A sua colmeia foi alterada de apiário com sucesso!") 
            navigation.navigate("Apiario");
            originalSubCollectionRef.delete()
            .then(()=>{
              console.log("Documento excluido com sucesso!")
            })
            .catch(error=>{
              console.log("Error ao excluir o documento: ", error)
            })      
          })
          .catch((error)=> {
            alert(error.message)
          })
        }else{
          console.log("Documento não encontrado!")
        }
      })

  };

  return (
    <View style={styles.container}>
      <Header name={"Lista de Apiários"} type="tool" />
      <View style={styles.buttons}>
        <CustomButton text="Apiário Atual" type="ALTERAR" />
        <CustomButton text={buttonValue} type="APIARIO" />
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

      <FlatList
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={userDoc}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton text={item.nome} type="COLMEIA" onPress={() => novoApi(item)} />
          </TouchableOpacity>
        )}
      />
      <CustomButton text="Alterar apiário" type="NOVACOLMEIA" onPress={alterarApi} />
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
  }
});
