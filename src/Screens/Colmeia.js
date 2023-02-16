import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../components/Header";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { firebase, db } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { collection, deleteDoc, getDocs } from "firebase/firestore";

export default function NovaColmeia({ item, route }) {
  const navigation = useNavigation();
  const [Grav, setGrav] = useState("");
  const storage = getStorage();
  var listRef = ref(storage, `audio ${route.params.nomeCol.nomeColmeia}/`);
  const [data, setData] = useState([]);

  useEffect(() => {
    listGrav();
  }, []);

  const deleteColmeia = () => {
    const subCollection = firebase
      .firestore()
      .collection("apiarios")
      .doc(route.params.nomeApi.id)
      .collection("colmeia");
    subCollection
      .doc(route.params.nomeCol.id)
      .delete()
      .then(() => {
        Alert.alert("Colemia apagada!", "Colmeia apagada com sucesso!");
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

  const alterarApi = () => {
    navigation.navigate("Alterar Apiario", {
      nomeApi: route.params.nomeApi
    })
  }
  
  const listGrav = () => {
    listAll(listRef)
      .then((res) => {
        res.items.forEach((item) => {
          setGrav((arr) => [...arr, item.name]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const NovaGravacaoPress = () => {
    navigation.navigate("Audio Recorder", {
      nomeCol: route.params.nomeCol
    });
  };

  const onPlayPress = () => {
    console.log("A reproduzir audio");
  };


  return (
    <View style={styles.container}>
      <Header name={"Gravações"} type="music" />

      <CustomButton
        text={
          route.params.nomeCol.nomeColmeia +
          " - " +
          route.params.nomeCol.localizacao
        }
        type="COLMEIAS"
      />

      <View style={styles.buttons}>
        <CustomButton
          text="Eliminar Colmeia"
          type="SECONDARY"
          onPress={deleteColmeia}
        />

        <CustomButton
          text="Alterar apiário"
          type="SECONDARY"
          onPress={alterarApi}
        />
      </View>


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
            <CustomButton text={item} type="COLMEIA" onPress={onPlayPress} />
          </TouchableOpacity>
        )}
      />

      <CustomButton
        text={"Nova gravação"}
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
  buttons: {
    flexDirection: "row",
    alignSelf: "center",
  },
});
