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
import { firebase, storage } from "../services/firebase";
import { onValue, ref } from "firebase/database";
import { FirebaseError } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Apiario(item) {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [name, setName] = useState("");
  const [data, setData] = useState(null);

  const checkAuthentication = async () => {
    // get user authentication information from local storage
    const email = await AsyncStorage.getItem('email');
    const password = await AsyncStorage.getItem('password');
    const user = await AsyncStorage.getItem('user');

  
    // compare user authentication information with current user
    if (email === route.params.email && password === route.email.params) {
      // user is authenticated
    } else {
      // user is not authenticated
    }
  };


  // // Sincronização dos dados do Firestore com a aplicação
  // ApiRef.onSnapshot((querySnapshot) => {
  //   const apiarios = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("dados do firestore:", apiarios);
  //   // AsyncStorage.setItem("off", apiarios)
  //   //   .then(() => {
  //   //     // Recupera o valor da chave "foo" no AsyncStorage
  //   //     return AsyncStorage.getItem("off");
  //   //   })
  //   //   .then((value) => {
  //   //     console.log("Valor recuperado do AsyncStorage:", value);
  //   //   })
  //   //   .catch((err) => {
  //   //     console.error("Erro ao usar o AsyncStorage:", err);
  //   //   });
  // });

  // // Define um valor no AsyncStorage com a chave "foo" e o valor "bar"

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
    getDadosApi();
    getDadosNomes();
  }, []);

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const onNovoApiarioPress = () => {
    navigation.navigate("Novo Apiario", { NomeApi: "", LocalApi: "" });
  };

  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhum apiário encontrado</Text>
      </View>
    );
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
        keyExtractor={(item) => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={userDoc}
        ListEmptyComponent={EmptyListMessage}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.container}>
            <CustomButton
              text={item.nome + " - " + item.localizacao}
              type="COLMEIA"
              onPress={() =>
                navigation.navigate("Home", {
                  nomeApi: item,
                  nomeApi1: item.nome,
                })
              }
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
  buttons: {
    flexDirection: "row",
    alignSelf: "center",
    marginBottom: 40,
  },
  message: {
    alignItems: "center",
  },
  cor: {
    color: "#939393",
  },
});
