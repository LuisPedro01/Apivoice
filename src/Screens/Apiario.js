import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { db } from "../services/firebase";
import { uid } from "uid";
import { deleteDoc, doc, getDoc, setDoc, getDocs } from "firebase/firestore";
import { firebase } from "../services/firebase";
import { onValue, ref } from "firebase/database";
import { FirebaseError } from "firebase/app";

export default function Apiario(item) {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [name, setName] = useState("")

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

  const getDadosNomes = () => {
    firebase.firestore()
    .collection("Nomes")
    .doc(firebase.auth().currentUser.uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        setName(snapshot.data())
      }
      else {
        console.log('User does not exists')
      }
    })
  }
  
  useEffect(() => {
    getDadosApi();
    getDadosNomes();
  }, []);

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const onNovoApiarioPress = () => {
    navigation.navigate("Novo Apiario", {NomeApi: '', LocalApi: '' });
  };

  return (
    <View style={styles.container}>

      <Header name={name.username} type="user" onPress={onUserPress} />

      <CustomButton text="Lista de apiários" type="COLMEIAS" />

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
        keyExtractor={item=> item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={userDoc}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton
              text={item.nome + ' - ' + item.localizacao}
              type="COLMEIA"
              onPress={()=> navigation.navigate("Home", {
                nomeApi: item,
                nomeApi1: item.nome
              })}
            />
          </TouchableOpacity>
        )}
      />

      <CustomButton
        text="Novo apiario"
        type="NOVACOLMEIA"
        onPress={onNovoApiarioPress}
      />

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
