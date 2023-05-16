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
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { Audio } from "expo-av";
import SpeechToText from './SpeechToText';

const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({ name, type, onPress, route, item, showIcon }) {
  const navigation = useNavigation();
  const [isEnable, setIsEnable] = useState(false);
  const [apiario, setApiario] = useState('')
  const [colmeia, setColmeia] = useState('')
  //const [nomeapi, SetNomeApi] = useState('')
  //const [localizaçãoApi, SetLocalizaçãoApi] = useState("")
  const [nomeCol, SetNomeCol] = useState('')
  const [localizaçãoCol, SetLocalizaçãoCol] = useState('')
  const [nomeAudio, SetNomeAudio] = useState('')
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [song, setSong] = useState();
  const [nome, setNome] = useState("");
  const ApiRef = firebase.firestore().collection("apiarios");
  const storage1 = firebase.storage()
  let RouteApi;
  let nomeApi;
  let NomeCol = '';
  let NomeAudio = ''
  let uri;
  let nomeApi1;
  let localapi1;
  let nomeCol1;
  let localCol1;
  const [nomeA, setNomeA] = useState('')
  const [nomeC, setNomeC] = useState('')

  const keyExtractor = (item) => item.id


  //++++++++++++++
  //Criar apiarios
  //++++++++++++++
  const CreateApi = () => {
    // Criar apiarios na base de dados
    const myCol = collection(db, "apiarios");
    const colData = {
      nome: nomeApi1,
      localizacao: localapi1,
      createdAt: Date()
    };

    addDoc(myCol, colData)
      .then(() => {
        console.log('apiario criado')
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        alert(error.message);
      });

  };

  //++++++++++++++
  //Criar colmeias
  //++++++++++++++
  const CreateCol = () => {
    const subCollection = firebase.firestore().collection('apiarios').doc(RouteApi).collection('colmeia')
    subCollection
      .add({
        nomeColmeia: nomeCol1,
        localizacao: localCol1,
        createdAt: Date()
      })
      .then(() => {
        console.log('Colmeia criada')
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  //+++++++++++++++
  //Começar a gravar
  //++++++++++++++++
  async function startRecording1(NomeAudio) {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
      return NomeAudio
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  //+++++++++++++++
  //Parar de gravar
  //+++++++++++++++
  function getDurationFormated(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }
  async function stopRecording1() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);

    let updatedRecordings = [...recordings];
    const { sound, status } = await recording.createNewLoadedSoundAsync();

    updatedRecordings.push({
      sound: sound,
      duration: getDurationFormated(status.durationMillis),
      file: recording.getURI(),
    });
    setRecordings(updatedRecordings);

    const response = await fetch(uri)
    const file = await response.blob([response.valueOf], {
      type: "audio/mp3",
    });

    try {
      //Create the file reference
      const storage = getStorage();
      const storageRef = ref(storage, `audio ${nomeC}/${nomeA}`);

      // Upload Blob file to Firebase
      const snapshot = await uploadBytes(storageRef, file, "blob")
        .then((snapshot) => {
          console.log("Gravação criada com sucesso!");
        });

      setSong(sound);
    } catch (error) {
      console.log(error);
    }
  }

  //++++++++++++++++
  //Reproduzir audio
  //++++++++++++++++
  const onPlayPress = (nomeAudio) => {
    storage1.ref(`audio ${NomeCol}/${nomeAudio}`).getDownloadURL()
      .then(async (url) => {
        console.log(`url de ${nomeAudio}->`, url)
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          await sound.replayAsync();
        } catch (error) {
          console.log('Erro ao reproduzir o audio: ', error);
        }
      })
  };

  useEffect(() => {
    if (isEnable) {
      const intervalID = setInterval(() => {
        console.log('A ouvir o comando')
        fetch("http://192.168.1.106:5000", {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain",
            "Content-Type": "application/json",
          },
        })
          .then((resp) => resp.text())
          .then((data1) => {
            console.log("Voce disse: ", data1);
            if (data1.includes('Página inicial') || data1.includes('página inicial')) {
              navigation.navigate('Apiario')
            }
            //++++++++++++++++
            // comando parar +
            //++++++++++++++++
            if (data1 === 'parar' || data1 === 'Parar' || data1.includes('STOP') || data1.includes('stop') || data1.includes('Stop')) {
              clearInterval(intervalID);
              console.log('Comandos parados!')
              Alert.alert('Comandos parados!', "Para voltar a ativar os comandos, ative-os no botão.")
              setIsEnable(false)
            }

            //++++++++++
            //+ Gravar +
            //++++++++++
            if (data1.includes('nova gravação') || data1.includes('novo áudio')) {
              navigation.navigate("Audio Recorder", {
                nomeCol: NomeCol
              })
            }
            if ((data1.includes('Nome áudio') || data1.includes('nome áudio'))) {
              NomeAudio = data1.split("áudio ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              //NomeAudio = nomeaudio
              navigation.navigate("Audio Recorder", { NomeAudio: NomeAudio, nomeCol: NomeCol })
              setNomeA(NomeAudio)
              setNomeC(NomeCol)
            }
            if (data1.includes('Começar a gravar') || data1.includes('começar a gravar')) {
              clearInterval(intervalID);
              startRecording1();
            }

            if (data1.includes('Parar gravação') || data1.includes('parar gravação')) {
              stopRecording1();
              navigation.navigate("Colmeia", { nomeCol: doc.data(), nomeApi: nomeApi })
            }

            //+++++++++++++++++
            // comando voltar +
            //+++++++++++++++++    
            if ((data1.includes('voltar') || data1.includes('Voltar'))) {
              navigation.goBack()
            }

            //++++++++++++++++++++++++++++++
            //+ comando selecionar apiario +
            //++++++++++++++++++++++++++++++
            if (data1.includes(`Selecionar apiário`) || data1.includes(`selecionar apiário`)) {
              const nome = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              ApiRef.where('nome', '==', nome).get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    keyExtractor(doc)
                    navigation.navigate("Home", { nomeApi1: doc.data().nome, nomeApi: doc })
                    RouteApi = doc.id
                    nomeApi = doc.data().nome
                  })
                })
            }

            //++++++++++++++++++++++++++++++
            //+ comando selecionar colmeia +
            //++++++++++++++++++++++++++++++
            if (data1.includes(`Selecionar colmeia`) || data1.includes(`selecionar colmeia`)) {
              const nome = data1.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              let ColRef = firebase.firestore().collection("apiarios").doc(RouteApi).collection("colmeia")
              ColRef.where('nomeColmeia', '==', nome)
                .get()
                .then((querySnapshot) => {
                  querySnapshot.forEach((doc) => {
                    keyExtractor(doc)
                    NomeCol = doc.data().nomeColmeia
                    navigation.navigate("Colmeia", { nomeCol: doc.data(), nomeApi: nomeApi })
                  })
                })
                .catch((error) => console.log(error));
            }

            //++++++++++++++++++++++++++++++
            //+ comando criar novo apiario +
            //++++++++++++++++++++++++++++++
            if (data1.includes('criar novo apiário') || data1.includes('Criar novo apiário') || data1.includes('novo apiário')) {
              navigation.navigate("Novo Apiario", { NomeApi: '', LocalApi: '' })
              console.log("criar novo apiário")
            }
            if ((data1.includes(`Nome apiário`) || data1.includes(`nome apiário`))) {
              const nomeapi = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              nomeApi1=nomeapi
              navigation.navigate("Novo Apiario", { NomeApi: nomeApi1, LocalApi: '' })
            }
            if ((data1.includes(`Localização apiário`) || data1.includes(`localização apiário`))) {
              const localapi = data1.split("apiário ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
              localapi1=localapi
              navigation.navigate("Novo Apiario", { NomeApi: nomeApi1, LocalApi: localapi1 })
            }
            if (data1.includes('Criar apiário') || data1.includes('criar apiário')) {
              CreateApi();
              navigation.navigate('Apiario')
            }

            //++++++++++++++++++++++++++++++
            //+ comando criar nova colmeia +
            //++++++++++++++++++++++++++++++
            if (data1.includes('criar nova colmeia') || data1.includes('Criar nova colmeia')) {
              navigation.navigate("Nova Colmeia", { NomeCol: '', LocalCol: '' })
              console.log("criar nova colmeia")
            }
            if ((data1.includes(`Nome colmeia`) || data1.includes(`nome colmeia`))) {
              const nomecol = data1.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
              nomeCol1=nomecol
              navigation.navigate("Nova Colmeia", { NomeCol: nomeCol1, LocalCol: '' })
            }
            if ((data1.includes(`Localização colmeia`) || data1.includes(`localização colmeia`))) {
              const localcol = data1.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
              localCol1=localcol
              navigation.navigate("Nova Colmeia", { NomeCol: nomeCol1, LocalCol: localCol1 })
            }
            if (data1.includes('Criar colmeia') || data1.includes('criar colmeia')) {
              CreateCol();
            }

            //++++++++++++++++++++++++
            //Comando reproduzir audio
            //++++++++++++++++++++++++
            if (data1.includes('Reproduzir gravação') || data1.includes('reproduzir gravação')) {
              const nomeAudio = data1.split("gravação ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
              onPlayPress(nomeAudio)
            }

          })
          .catch((error) => console.log("error", error));
      }, 10000);
      return () => {
        clearInterval(intervalID);
      };
    }
  })

  return (
    <LinearGradient colors={['#FFDAAE', 'white']}>
      <View style={styles.container}>
        <View style={styles.content}>
          {
            showIcon &&
            <Feather name={"chevron-left"} size={27} color="black" onPress={() => navigation.goBack()} />
          }
          <Text style={styles.username}>{name || "Bem vindo!"}</Text>
          <TouchableOpacity style={styles.buttonUser}>
            <Feather name={`${type}`} size={27} color="black" onPress={onPress} />
          </TouchableOpacity>
        </View>
      </View>
      <SpeechToText/>
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
