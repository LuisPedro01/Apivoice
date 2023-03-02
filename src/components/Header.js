import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Switch, 
  Alert
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';

const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({ name, type, onPress }) {
  const navigation = useNavigation();
  const [isEnable, setIsEnable] = useState(false);

  const toggleSwitch = () => {
    if (isEnable) {
      //parar o fetch
      console.log('comandos a desligados')
    }
    else {
      //fazer o fetch
      console.log('comandos a ligados')      
    }
    setIsEnable(previousState => !previousState)
  }
  
  useEffect(()=>{
    if(isEnable){
      const intervalID = setInterval(() => {
        console.log('A ouvir o comando')
        fetch("http://192.168.1.72:3000", {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.text())
          .then((data1) => {
            console.log("data", data1);
            Alert.alert("Voce disse", `${data1}`)
            if (data1 == 'parar') {
              clearInterval(intervalID);
              Alert.alert('Comandos parados!', "Para voltar a ativar os comandos, reinicie a App.")
              console.log('Comandos parados!')
              setIsEnable(previousState => !previousState)
            } 
          })
          .catch((error) => console.log("error", error));
        }, 5000); 
    }
  })

  return (
    <LinearGradient colors={['#FFDAAE', 'white']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Feather name={"chevron-left"} size={27} color="black" onPress={() => navigation.goBack()} />
          <Text style={styles.username}>{name}</Text>
          <TouchableOpacity style={styles.buttonUser}>
            <Feather name={`${type}`} size={27} color="black" onPress={onPress} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.comandos2}>
        <Text style={styles.comandos}>Comandos por voz</Text>
        <View>
          <Switch
          style={styles.switch}
            trackColor={{ false: 'grey', true: '#FFDAAE' }}
            thumbColor={isEnable ? '#FFDAAE' : 'white'}
            ios_background='grey'
            onValueChange={toggleSwitch}
            value={isEnable}
          />
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBarHeight,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  comandos: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
  comandos2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonUser: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44 / 2,
  },
})
