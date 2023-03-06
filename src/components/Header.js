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
import { Screen } from 'react-native-screens';
import { firebase } from "../services/firebase";

const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({ name, type, onPress, route, item }) {
  const navigation = useNavigation();
  const [isEnable, setIsEnable] = useState(false);
  const [apiario, setApiario] = useState('')
  const [colmeia, setColmeia] = useState('')
  const [nomeApi, SetNomeApi] = useState("")
  const [localizaçãoApi, SetLocalizaçãoApi] = useState("")
  const [nomeCol, SetNomeCol] = useState('')
  const [localizaçãoCol, SetLocalizaçãoCol] = useState('')
  const [userDoc, setUserDoc] = useState([]);
  const ApiRef = firebase.firestore().collection("apiarios");

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
  }

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

  useEffect(() => {
    getDadosApi();
    // console.log(userDoc)
  })

  useEffect(() => {
    if (isEnable) {
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
            console.log("Voce disse: ", data1);
            //++++++++++++++
            //comando parar
            //++++++++++++++
            if (data1.includes('parar') || data1.includes('Parar')) {
              clearInterval(intervalID);
              Alert.alert('Comandos parados!', "Para voltar a ativar os comandos, ative-os no botão.")
              console.log('Comandos parados!')
              setIsEnable(false)
            }

            //+++++++++++++++++++++++++++
            //comando selecionar apiario
            //+++++++++++++++++++++++++++
            if (data1.includes(`Selecionar apiário`) || data1.includes(`selecionar apiário`)) {
              const nome = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              .then((item) =>{
                item.forEach(doc => {
                  const selectedItem = doc.data()
                  navigation.navigate("Home", { nomeApi: selectedItem })
                })
              })

            }

            //+++++++++++++++++++++++++++
            //comando selecionar colmeia
            //+++++++++++++++++++++++++++
            if (data1.includes(`selecionar colmeia`) || data1.includes(`Selecionar colmeia`)) {
              const nome = data1.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              navigation.navigate("Colmeia", { nomeCol: colmeia })
              console.log("nome da colmeia:", nome)
              //setColmeia(nome)
            }

            //+++++++++++++++++++++++++++
            //comando criar novo apiario
            //+++++++++++++++++++++++++++
            if (data1.includes('criar novo apiário') || data1.includes('Criar novo apiário') || data1.includes('novo apiário')) {
              navigation.navigate("Novo Apiario", { NomeApi: '', LocalApi: '' })
              console.log("criar novo apiário")
            }
            if (data1.includes(`Nome apiário`) || data1.includes(`nome apiário`)) {
              const nomeapi = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              SetNomeApi(nomeapi)
              //console.log('Nome->', nomeapi)
              //navigation.navigate("Novo Apiario", { LocalApi: localizaçãoApi})
              //return nomeapi
            }
            if (data1.includes(`Localização apiário`) || data1.includes(`localização apiário`)) {
              const localapi = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
              //SetLocalizaçãoApi(localapi)
              console.log('localidade->', localapi)
              navigation.navigate("Novo Apiario", { LocalApi: localapi, NomeApi: nomeApi })
            }

            //++++++++++++++++++++++++++
            //comando criar nova colmeia
            //++++++++++++++++++++++++++
            if (data1.includes('criar nova colmeia') || data1.includes('Criar nova colmeia')) {
              navigation.navigate("Nova Colmeia")
              console.log("Criar nova colmeia")
            }
            if (data1.includes(`Nome colmeia`) || data1.includes(`nome colmeia`)) {
              const nomecol = data1.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              console.log('Nome->', nomecol)
              SetNomeCol(nomecol)
              navigation.navigate("Nova Colmeia", { NomeCol: nomeCol })
              //nomeApi=input nome
            }
            if (data1.includes(`Localização colmeia`) || data1.includes(`localização colmeia`)) {
              const localcol = data1.split("colmeia")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              console.log('localidade->', localcol)
              SetLocalizaçãoCol(localcol)
              navigation.navigate("Nova Colmeia", { LocalCol: localcol })
              //input localização == localApi
              //criar apiario(botão)
            }
            // else{
            //   console.log('Nao percebi o seu comando!')
            // }
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
