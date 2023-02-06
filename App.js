import Navigation from "./src/navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  NativeModules
} from 'react-native';
import { useEffect, useState } from "react"
import axios from "axios";

export default function App() {
  const [data, setData] = useState([{}])

  useEffect(() => {
    // axios.get('http://127.0.0.1:5000/data')
    // .then(
    //   res => setData(res.data),
    //   console.log("valor",data)
    // )
    // .catch(error => console.log("error",error))

    fetch("http://192.168.1.72:3000/", {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }
    )
    .then(resp=>resp.json())
    .then(
      data => {
        setData(data)
        console.log("data",data)
      }
    ).catch(error => console.log("error", error))
  }, [])

  return (
    <SafeAreaView style={styles.root}>
      <Navigation />
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F9FBFC'
  }
})