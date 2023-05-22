import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl
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
import * as FileSystem from "expo-file-system";

export default function Apiario(item) {
  const route = useRoute();
  const navigation = useNavigation();
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  const [name, setName] = useState("");
  const [data, setData] = useState(null);
  const [arquivos, setArquivos] = useState([]);
  const [refreshing, setRefreshing] = useState(false);


  const getDadosApi = () => {
    const userAtual = firebase.auth().currentUser.uid
    const docsUser = ApiRef.where('userId', '==', userAtual)

    docsUser.onSnapshot((querySnapshot) => {
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
    getObjectsLocally();
    if (userDoc.length === 0) {
    }
  }, []);

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

  const onRefresh = () => {
    setRefreshing(true);
    getObjectsLocally()
    setRefreshing(false)
  };

  const renderFlatList = () => {
    if (userDoc.length === 0) {
      return (
        <FlatList
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          data={arquivos}
          ListEmptyComponent={EmptyListMessage}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.container}>
              <CustomButton
                text={item.nome + " - " + item.localizacao}
                type="COLMEIA"
                onPress={() =>
                  navigation.navigate("Colmeia", {
                    nomeApi: item,
                    nomeApi1: item.nome,
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
                text={item.nome + " - " + item.localizacao}
                type="COLMEIA"
                onPress={() =>
                  navigation.navigate("Colmeia", {
                    nomeApi: item,
                    nomeApi1: item.nome,
                  })
                }
              />
            </TouchableOpacity>
          )}
        />
      );
    }
  };

  const getObjectLocally = async () => {
    try {
      const object = await AsyncStorage.getItem('myObject');
      if (object !== null) {
        // Fazer algo com o objeto recuperado
        console.log('Objeto recuperado:', JSON.parse(object));
      } else {
        console.log('Objeto não encontrado com a chave fornecida:', 'myObject');
      }
    } catch (error) {
      console.log('Erro ao recuperar o objeto:', error);
    }
  };

  const getObjectsLocally = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const objects = await AsyncStorage.multiGet(keys);

      // Converter os objetos de string para JSON
       // Converter os objetos de string para JSON
    const parsedObjects = objects.map(([key, value]) => {
      try {
        return key,JSON.parse(value);
      }  catch (error) {
          console.log(`Erro ao fazer o parsing do objeto com chave ${key}:`, error);
          return [key, null];
        }
      });
      const apiarios = parsedObjects.filter(obj => obj.tipo === 'Apiário');
      setArquivos(apiarios)
      console.log(apiarios)
      return parsedObjects;
    } catch (error) {
      console.log('Erro ao recuperar a lista de objetos:', error);
      return [];
    }
  };

  const eli = () => {
    FileSystem.deleteAsync(`file:///data/user/0/com.luispedro.Apivoice/files/`)
  }

  const onUserPress = () => {
    navigation.navigate("Perfil");
  };


  const removeAllObjectsLocally = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(keys);
      console.log('Todos os objetos foram removidos com sucesso!');
    } catch (error) {
      console.log('Erro ao remover os objetos:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Header name={"Olá, " + name.username + "!"} type="user" onPress={onUserPress} />

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

      {renderFlatList()}

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
