import Navigation from "./src/navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  NativeModules,
  Alert,
  LogBox,
} from "react-native";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { db, firebase } from "./src/services/firebase";

export default function App() {
  //const [data, setData] = useState([{}]);
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  LogBox.ignoreLogs(["new NativeEventEmitter"]);
  LogBox.ignoreLogs(["Non-serializable values"]);
 

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

  useEffect(() => {
    getDadosApi();
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
