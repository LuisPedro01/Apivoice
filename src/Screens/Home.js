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

export default function Home(item) {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const [nomeDoc, setNomeDoc] = useState([])
  const [text, setText] = useState("");
  const colRef = firebase.firestore().collection("colmeias");
  const [name, setName] = useState("")

  useEffect(() => {
    colRef.onSnapshot((querySnapshot) => {
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
  }, []);

  useEffect(() => {
    firebase.firestore().collection("Nomes")
      .doc(firebase.auth().currentUser.uid).get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data())
        }
        else {
          console.log('User does not exists')
        }
      })
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "colmeias", id))
      setNomeDoc(nomeDoc.filter((item) => item.id !== id))
    } catch (err) {
      console.log(err)
    }
  }

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const onNovaColmeiaPress = () => {
    navigation.navigate("Nova Colmeia");
  };

  return (
    <View style={styles.container}>

      <Header name={name.username} type="user" onPress={onUserPress} />

      <CustomButton text="Lista de colmeias" type="COLMEIAS" />

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
              text={item.nome}
              type="COLMEIA"
              onPress={()=> navigation.navigate("Colmeia", {
                nomeCol: item
              })}
            />
          </TouchableOpacity>
        )}
      />

      <CustomButton
        text="Adicionar nova colmeia"
        type="NOVACOLMEIA"
        onPress={onNovaColmeiaPress}
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
