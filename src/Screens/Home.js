import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, } from "react-native";
import Header from "../components/Header";
import ListaColmeias from "../components/ListasColmeias";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { db } from "../services/firebase";
import { uid } from "uid";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firebase } from "../services/firebase";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { getLastNotificationResponseAsync } from "expo-notifications";

export default function Home() {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const colRef = firebase.firestore().collection("colmeias");

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

  //CRUD Functions
 
  const Update = () => {};

  const Delete = () => {};

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const onNovaColmeiaPress = () => {
    navigation.navigate("Nova Colmeia");
  };

  const onColmeiaPress = () => {
    navigation.navigate("Colmeia");
};

  return (
    <View style={styles.container}>
      <Header name={route.params.username} type="user" onPress={onUserPress} />

      <CustomButton text="Colmeias" type="COLMEIAS" />

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
        data={userDoc}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton
              text={item.nome}
              type="COLMEIA"
              onPress={onColmeiaPress}
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
