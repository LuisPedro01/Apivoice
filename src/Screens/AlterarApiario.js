import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Alert } from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function AlterarApiario({ route }) {
  //const route = useRoute();
  const navigation = useNavigation();
  const [buttonValue, setButtonValue] = useState(route.params.nomeApi);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [userDoc, setUserDoc] = useState([]);
  const nomeApi = route.params.nomeApi
  const idApi = route.params.idApi
  const idCol = route.params.idCol
  const [newDocRef, setNewDocRef] = useState(route.params.nomeApi)
  const [arquivos, setArquivos] = useState([]);

  const originalDocRef = firebase.firestore().collection("apiarios").doc(idApi)
  const originalSubCollectionRef = originalDocRef.collection("colmeia").doc(idCol)

  const targetDocRef = firebase.firestore().collection('apiarios').doc(newDocRef)
  const targetSubCollectionRef = targetDocRef.collection('colmeia')

  const combinedData = [...userDoc.map(item => ({ type: 'userDoc', item })), ...arquivos.map(item => ({ type: 'arquivos', item }))];

  useEffect(() => {
    getDadosApi();
    getObjectsLocally()
  }, [])

  const getDadosApi = () => {
    const userAtual = firebase.auth().currentUser.uid
    const docsUser =  ApiRef.where('userId', '==', userAtual)
    docsUser.onSnapshot((querySnapshot) => {
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

  const getObjectsLocally = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log(keys)
      const objects = await AsyncStorage.multiGet(keys);
      const filteredKeys = keys.filter(key => key.includes('email') || key.includes('password'));
      await AsyncStorage.multiRemove(filteredKeys);

      // Converter os objetos de string para JSON
      const parsedObjects = objects.map(([key, value]) => {
        try {
          return key, JSON.parse(value);
        } catch (error) {
          console.log(`Erro ao fazer o parsing do objeto com chave ${key}:`, error);
          return [key, null];
        }
      });
      const apiarios = parsedObjects.filter(obj => obj.tipo === "Apiário");
      setArquivos(apiarios)
      return parsedObjects;
    } catch (error) {
      console.log('Erro ao recuperar a lista de objetos:', error);
      return [];
    }
  };

  const novoApi = (item) => {
    if (nomeApi != item.item.nome) {
      setButtonValue(item.item.nome)
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
      <Header name={"Lista de Apiários"} type="tool" showIcon={'true'}/>
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
        data={combinedData}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton text={item.item.nome} type="COLMEIA" onPress={() => novoApi(item)} />
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
