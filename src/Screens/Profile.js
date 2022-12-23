import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { firebase } from "../services/firebase";
import { DocumentSnapshot } from "firebase/firestore";

export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [userData, setUserData] = useState(null);

  const getUser = () => {
    firebase
      .firestore()
      .collection("Nomes")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  const getNameUser = () => {
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

  const userUpdate = () => {
    firebase
      .firestore()
      .collection("Nomes")
      .doc(firebase.auth().currentUser.uid)
      .update({
        username: userData.username,
        cidade: userData.cidade,
      })
      .then(() => {
        console.log("User Updated!");
        Alert.alert(
          "Perfil atualizado!",
          "O seu perfil foi atualizado com sucesso!"
        );
        navigation.navigate("Home");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  useEffect(() => {
    getUser();
    getNameUser();
  }, []);

  return (
    <View style={styles.container}>
      <Header name="Perfil" type="user" />

      <CustomButton text={name.username} type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />
      <View style={styles.list}>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          value={userData ? userData.username : ""}
          onChangeText={(txt) => setUserData({ ...userData, username: txt })}
        />
        <TextInput
          style={styles.input}
          placeholder="Localidade"
          value={userData ? userData.cidade : ""}
          onChangeText={(txt) => setUserData({ ...userData, cidade: txt })}
        />
      </View>

      <CustomButton
        text="Alterar perfil"
        type="NOVACOLMEIA"
        onPress={() => userUpdate()}
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
  input: {
    backgroundColor: "#F5F9FE",
    width: "100%",
    height: 60,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginVertical: 10,
  },
  list: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20,
  },
});
