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
import { firebase } from "../services/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref } from "firebase/storage";

export default function Home({ item, route }) {
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const [userDocOff, setUserDocOff] = useState([]);
  const colRef = firebase.firestore().collection("colmeias");
  const [name, setName] = useState("");
  const ApiRef = firebase
    .firestore()
    .collection("apiarios")
    .doc(route.params.nomeApi.id);
  const IdApi = route.params.nomeApi.id;

  //guarda as subcollections
  const offline = async () => {
    try {
      await AsyncStorage.setItem(IdApi, JSON.stringify(userDoc)); // converte a array em uma string JSON e a armazena no AsyncStorage
      Alert.alert(
        "Apiário salvo com sucesso!",
        "O apiário encontra-se agora disponível off-line."
      );
    } catch (error) {
      console.log(error);
    }
  };

  const carregarUserDoc = async () => {
    try {
      const valorArmazenado = await AsyncStorage.getItem(IdApi); // busca o valor armazenado no AsyncStorage com a chave 'userDoc'
      if (valorArmazenado !== null) {
        setUserDocOff(JSON.parse(valorArmazenado)); // converte a string JSON em uma array de objetos e a define como o valor atual de userDoc
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const offline = async () => {

  //   try {
  //     await AsyncStorage.setItem("userDocOff", userDocOff);
  //     Alert.alert('Apiário salvo com sucesso!', 'O apiário encontra-se agora disponível off-line.')
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const carregarDados = async () => {
  //   try {
  //     const valorArmazenado = await AsyncStorage.getItem('userDocOff');
  //     if (valorArmazenado !== null) {
  //       setUserDocOff(valorArmazenado);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

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
          const { nomeColmeia, localizacao } = doc.data();
          userDoc.push({
            id: doc.id,
            nomeColmeia,
            localizacao,
          });
        });
        setUserDoc(userDoc);
        console.log(userDoc);
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

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };

  const deleteApi = () => {
    firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .delete()
      .then(() => {
        Alert.alert("Apiário apagado!", "Apiário apagado com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    getDadosNomes();
    getDados();
    if (userDoc.length === 0 && IdApi == route.params.nomeApi.id) {
      carregarUserDoc();
    }
    //console.log(userDoc) // Retorna mesmo offline
  }, []);

  const collectionRef = firebase
    .firestore()
    .collection("apiarios")
    .doc(route.params.nomeApi.id);

  const EmptyListMessage = ({ item }) => {
    return (
      <View style={styles.message}>
        <Text style={styles.cor}>Nenhuma colmeia encontrada</Text>
      </View>
    );
  };

  const renderFlatList = () => {
    if (userDoc.length === 0) {
      return (
        <FlatList
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={userDocOff}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item.nomeColmeia}
                type="COLMEIA"
                onPress={() =>
                  navigation.navigate("Colmeia", {
                    nomeCol: item,
                    nomeApi: route.params.nomeApi,
                  })
                }
              />
            </TouchableOpacity>
          )}
        />
      );
    } else {
      return (
        <FlatList
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={userDoc}
          ListEmptyComponent={EmptyListMessage}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item.nomeColmeia}
                type="COLMEIA"
                onPress={() =>
                  navigation.navigate("Colmeia", {
                    nomeCol: item,
                    nomeApi: route.params.nomeApi,
                  })
                }
              />
            </TouchableOpacity>
          )}
        />
      );
    }
  };
  const teste = () => {
    console.log("userdoc->", userDoc);
    console.log("userdocoff->", userDocOff);
  };

  // Storage
  //Create the file reference
  const storage = getStorage();
  const storageRef = ref(storage, `audio ${route.params.nomeCol}`);

  return (
    <View style={styles.container}>
      <Header name={name.username} type="user" onPress={onUserPress} />
      <View style={styles.buttons}>
        <CustomButton text={route.params.nomeApi1} type="HOME" />

        <CustomButton
          text="Eliminar apiário"
          type="SECONDARY"
          onPress={() => {
            deleteApi();
          }}
        />
      </View>

      <CustomButton
        text={"Lista de colmeias"}
        type="COLMEIAS"
        onPress={teste}
      />
      {/* <CustomButton text={"variavel guardada localmente"} type="COLMEIAS" onPress={guardarUserDoc}/> */}

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />

      {renderFlatList()}

      <View style={styles.buttons1}>
        <CustomButton
          text="Nova colmeia"
          type="teste1"
          onPress={() =>
            navigation.navigate("Nova Colmeia", {
              nomeCol: route.params.nomeApi,
              NomeCol: "",
              LocalApi: "",
            })
          }
        />

        <CustomButton
          text="Disponivel off-line"
          type="teste"
          onPress={offline}
        />
      </View>
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
  buttons1: {
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
