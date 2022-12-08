import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Header from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from '../components/CustomInput'
import { firebase } from "../services/firebase";


export default function Profile() {
  const route = useRoute();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('')

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


  return (
    <View style={styles.container}>
      <Header name="Perfil" type="user"/>

      <CustomButton text={name.username} type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: '#939393',
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10
        }}
      />

      <CustomInput placeholder='Nome' value={nome} setValue={setNome} />
      <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry />

      <CustomButton
        text="Alterar perfil"
        type="NOVACOLMEIA"        
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
