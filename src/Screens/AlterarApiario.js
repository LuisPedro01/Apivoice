import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Alert } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { db } from "../services/firebase";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { uid } from "uid";
import { firebase } from "../services/firebase";


export default function AlterarApiario() {
  const route = useRoute();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');
  const [text, setText] = useState("")
  const ApiRef = firebase.firestore().collection("apiarios");
  const [userDoc, setUserDoc] = useState([]);


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


  const alterarApi = () => {
    //copiar dados da colmeia (copiar dados da subcollection)
    //enviar os dados para a nova colmeia (criar nova subcollection noutra collection)
    //apagar dados da colmeia (apagar subcollection original)

  };
  return (
    <View style={styles.container}>
      <Header name={"Lista de Apiários"} type="tool" />
      <View style={styles.buttons}>
        <CustomButton text="Apiário Atual" type="ALTERAR" />
        <CustomButton text="Apiario X" type="APIARIO" />
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
            <CustomButton text={item.nome} type="COLMEIA" />
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
