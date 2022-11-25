import React, { useState, useEffect } from "react";
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
import CustomInput from "../components/CustomInput";
import ColmeiasGrav from "../components/ColmeiasGrav";
import { addDoc, collection, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { firebase, db } from "../services/firebase";

export default function NovaColmeia() {
  const route = useRoute();
  const navigation = useNavigation();
  const [Grav, setGrav] = useState([]);
  const graRef = firebase.firestore().collection("gravações");
  const [texto, setTexto] = useState("");
  const [nome, setNome] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    graRef.onSnapshot((querySnapshot) => {
      const Grav = [];
      querySnapshot.forEach((doc) => {
        const { texto, nome } = doc.data();
        Grav.push({
          id: doc.id,
          texto,
          nome,
        });
      });
      setGrav(Grav);
    });
  }, []);

  const Create = () => {
    // Criar gravaçoes na base de dados
    const myCol = collection(db, "gravações");
    const colData = {
      texto: texto,
      nome: nome,
    };

    addDoc(myCol, colData)
      .then(() => {
        alert("Gravação criada!");
        setText("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const Delete = () => {
    const myCol = collection(db, "gravações");

    deleteDoc(myCol)
    .then(() => {
      alert("Gravação apagada com sucesso!")
      setText("")
    })
    .catch((error) => {
      alert(error.messsage)
    })
  };

  const NovaGravacaoPress = () => {
    navigation.navigate("Audio Recorder");
  };

  return (
    <View style={styles.container}> 
      <Header name={"Gravações"} type="music" />

      <CustomButton text={""} type="COLMEIAS" />

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
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={Grav}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <ColmeiasGrav data={item}/>
          </TouchableOpacity>
        )}
      />

      <CustomButton
        text={"Adicionar nova gravação"}
        type="NOVACOLMEIA"
        onPress={NovaGravacaoPress}
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
