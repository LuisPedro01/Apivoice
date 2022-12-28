import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
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

export default function Home({ item, route }) {
  //const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const colRef = firebase.firestore().collection("colmeias");
  const [name, setName] = useState("");

  const getDadosCol = () => {
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
  };

  const getDados = () => {
    firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .collection("colmeia")
      .get()
      .then((querySnapshot) => {
        const userDoc = [];
        querySnapshot.forEach((doc) => {
          const { nomeColmeia } = doc.data();
          userDoc.push({
            id: doc.id,
            nomeColmeia,
          });
        });
        setUserDoc(userDoc);
      });
  };

  const getDadosNomes = () => {
    firebase
      .firestore()
      .collection("Nomes")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("User does not exists");
        }
      });
  };

  useEffect(() => {
    //getDadosCol();
    getDadosNomes();
    getDados();
  }, []);

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const onNovaColmeiaPress = () => {
    navigation.navigate("Nova Colmeia");
  };

  const deleteApi = () => {
    firebase
      .firestore()
      .collection("apiario")
      .doc(route.params.nomeApi.id)
      .delete()
      .then(() => {
        Alert.alert("Apiário apagado!", "Apiário apagado com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={styles.container}>
      <Header name={name.username} type="user" onPress={onUserPress} />
      <View style={styles.buttons}>
        <CustomButton text={route.params.nomeApi.nome} type="HOME" />

        <CustomButton
          text="Eliminar apiário"
          type="SECONDARY"
          onPress={() => {
            deleteApi();
          }}
        />
      </View>

      <CustomButton text={"Lista de colmeias"} type="COLMEIAS" />

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
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={userDoc}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton
              text={item.nomeColmeia}
              type="COLMEIA"
              onPress={() =>
                navigation.navigate("Colmeia", {
                  nomeCol: item,
                })
              }
            />
          </TouchableOpacity>
        )}
      />

      <CustomButton
        text="Nova colmeia"
        type="NOVACOLMEIA"
        onPress={() =>
          navigation.navigate("Nova Colmeia", {
            nomeCol: route.params.nomeApi.id,
          })}
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
  buttons: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
