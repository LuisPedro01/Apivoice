import Navigation from "./src/navigation";
import {
  StyleSheet,
  SafeAreaView,
  LogBox,
} from "react-native";
import { useEffect, useState } from "react";
import { db, firebase } from "./src/services/firebase";

export default function App() {
  //const [data, setData] = useState([{}]);
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");
  LogBox.ignoreLogs(["new NativeEventEmitter"]);
  LogBox.ignoreLogs(["Non-serializable values"]);
  LogBox.ignoreAllLogs()
 

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
      <Navigation/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
