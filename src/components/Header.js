import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';
import { firebase } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref, uploadBytes } from "firebase/storage";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from 'axios';
import stringSimilarity from 'string-similarity';


const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({ name, type, onPress, route, item, showIcon }) {
  const navigation = useNavigation();
  const [isEnable, setIsEnable] = useState(false);
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [song, setSong] = useState();
  const ApiRef = firebase.firestore().collection("apiarios");
  const storage1 = firebase.storage()
  let RouteApi;
  let nomeApi;
  let NomeCol = '';
  let NomeAudio = ''
  let uri;
  const [nomeA, setNomeA] = useState('')
  const [nomeC, setNomeC] = useState('')
  const [timerId, setTimerId] = useState(null);
  let comando = ""
  var isRecroding = false

  const keyExtractor = (item) => item.id

  const toggleSwitch = async (value) => {
    if (isEnable) {
      Speech.speak("Comandos desligados", {
        language: 'pt-PT'
      });
      stopRecording()
    } else {
      Speech.speak("A ouvir comandos", {
        language: 'pt-PT'
      });
    }
    setIsEnable((previousState) => !previousState);
  };

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

      // Aguardar 30 segundos
      await new Promise((resolve) => setTimeout(resolve, 30000));

      console.log("Stopping recording..");
      await stopRecording1();

      Speech.speak(`áudio guardado na base de dados`, {
        language: 'pt-PT'
      });

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
    storage1.ref(`apiario ${route.params.nomeApi}/colmeia ${route.params.nomeCol}/audio ${nomeAudio}.mp3`).getDownloadURL()
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

  const checkCommandSimilarity = (command, keywords) => {
    const match = keywords.find((keyword) => {
      const similarity = stringSimilarity.compareTwoStrings(command, keyword);
      const similarityPercentage = similarity * 100;
      return similarityPercentage >= 70;
    });

    return match !== undefined;
  };

  // Comandos Válidos
  const paginaInicialKeywords = ['página inicial', 'inicial'];
  const pararKeywords = ['parar', 'parar comandos', 'desligar comandos'];
  const voltarKeywords = ['voltar', 'página anterior'];
  const selecionarApiarioKeywords = ['selecionar apiário', 'apiário', 'selecionar diário', 'selecionar Aviário']
  const selecionarColmeiaKeywords = ['selecionar']
  const NovaGravaçãoKeywords = ['nova gravação', 'novo áudio', 'nossa gravação']
  const NomeAudioKeywords = ['número áudio', 'número gravação', 'nome gravação', 'nome áudio', 'no áudio', 'nome audio', 'no audio']
  const ComeçarGravarKeywords = ['começar gravação', 'começar a gravar']
  const PararGravarKeywords = ['parar gravação', 'parar de gravar', 'horário', 'arara']
  const ReproduzirAudioKeywords = ['reproduzir áudio']

  var timeout

  const startRecording = async () => {
    try {
      const recordingOptions = {
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      isRecroding = true
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log('Recording started');
      timeout = setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log('Recording stopped', uri);
        sendAudioToServer(uri);
        startRecording()

      }, 8000)
      //pagina incial
      if (checkCommandSimilarity(comando, paginaInicialKeywords)) {
        Speech.speak("A dirécionar para página inicial", {
          language: 'pt-PT'
        });
        navigation.navigate('Página Inicial')
        comando = ""
        setIsEnable(true)

      }

      //parar
      if (checkCommandSimilarity(comando, pararKeywords)) {
        Speech.speak("Comandos desligados", {
          language: 'pt-PT'
        });
        clearTimeout(timeout);
        setIsEnable(false)
        comando = ""
        return;
      }

      //voltar
      if (checkCommandSimilarity(comando, voltarKeywords)) {
        Speech.speak("A navegar para página anterior", {
          language: 'pt-PT'
        });
        navigation.goBack()
        comando = ""
      }

      //selecionar apiário
      if (checkCommandSimilarity(comando, selecionarApiarioKeywords)) {
        const nome = comando.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
        ApiRef.where('nome', '==', nome).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              keyExtractor(doc)
              navigation.navigate("Colmeia", { nomeApi1: doc.data().nome, nomeApi: doc })
              Speech.speak(`A navegar para apiário ${nome}`, {
                language: 'pt-PT'
              });
              RouteApi = doc.id
              nomeApi = doc.data().nome
            })
          })
        comando = ""
        setIsEnable(true)
      }

      // Função para extrair o nome da colmeia do comando
      const extractColmeiaName = (command) => {
        const regex = /selecionar (.+)/i;
        const match = command.match(regex);
        return match ? match[1] : null;
      };

      //selecionar colmeia
      if (checkCommandSimilarity(comando, selecionarColmeiaKeywords)) {
        console.log('chegou aqui')
        const nome = extractColmeiaName(comando)
        console.log(nome)
        let ColRef = firebase.firestore().collection("apiarios").doc(RouteApi).collection("colmeia")
        ColRef.where('nomeColmeia', '==', nome).get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              keyExtractor(doc)
              NomeCol = doc.data().nomeColmeia
              navigation.navigate("Gravações", { nomeCol: NomeCol, nomeApi: doc })
              Speech.speak(`A navegar para colmeia ${nome}`, {
                language: 'pt-PT'
              });
            })
          })
          .catch((error) => console.log(error));
        comando = ""
      }

      //gravar
      if (checkCommandSimilarity(comando, NovaGravaçãoKeywords)) {
        navigation.navigate("Audio Recorder", {
          nomeCol: NomeCol
        })
        Speech.speak(`A navegar para nova gravação`, {
          language: 'pt-PT'
        });
        comando = ""
      }
      if (checkCommandSimilarity(comando, NomeAudioKeywords)) {
        NomeAudio = comando.split("áudio ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
        //NomeAudio = comando.split("gravação ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
        console.log(NomeAudio)
        navigation.navigate("Audio Recorder", { NomeAudio: NomeAudio, nomeCol: NomeCol })
        Speech.speak(`nome audio ${NomeAudio}`, {
          language: 'pt-PT'
        });
        setNomeA(NomeAudio)
        setNomeC(NomeCol)
        comando = ""
      }
      if (checkCommandSimilarity(comando, ComeçarGravarKeywords)) {
        Speech.speak(`a gravar nova gravação`, {
          language: 'pt-PT'
        });
        clearTimeout(timeout)
        comando = ""
        // clearTimeout(timeout)
        // await stopRecording()
        // await startRecording1();
        // await new Promise((resolve) => setTimeout(resolve, 30000));
        // await stopRecording1();
        // startRecording()
        if (isRecroding === false) {
          startRecording1()
        }
        startRecording()
      }

      if (checkCommandSimilarity(comando, PararGravarKeywords)) {
        stopRecording1();
        navigation.navigate("Colmeia", { nomeCol: NomeCol, nomeApi: nomeApi })
        comando = ""
      }

      if (checkCommandSimilarity(comando, ReproduzirAudioKeywords)) {
        const nomeAudio = comando.split("gravação ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
        onPlayPress(nomeAudio)
      }
      return () => {
        clearInterval()
      }

    } catch (error) {
      console.log('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log('Recording stopped', uri);
      await sendAudioToServer(uri);
    } catch (error) {
      console.log('Failed to stop recording', error);
    }
  };

  const sendAudioToServer = async (uri) => {
    const fileType = Platform.select({
      android: { type: 'audio/m4a', extension: '.m4a' },
      ios: { type: 'audio/x-caf', extension: '.caf' },
    });

    const formData = new FormData();
    formData.append('audio', {
      uri,
      type: fileType.type,
      name: `recording${fileType.extension}`,
    });

    try {
      const response = await axios.post('https://luis21121.pythonanywhere.com/rota-de-receber-audio', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data.text);
      comando = response.data.text
    } catch (error) {
      console.log('Failed to send audio to server', error);
    }
    isRecroding = false
  };

  const getAudioPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === 'granted') {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })
    }
  };

  useEffect(() => {
    getAudioPermission();
  }, []);

  useEffect(() => {
    if (isEnable) {
      startRecording()

    } 
  }, [isEnable])


  //       //   //++++++++++
  //       //   //+ Gravar +
  //       //   //++++++++++
  //       //   if (data1.includes('nova gravação') || data1.includes('novo áudio')) {
  //       //     navigation.navigate("Audio Recorder", {
  //       //       nomeCol: NomeCol
  //       //     })
  //       //   }
  //       //   if ((data1.includes('Nome áudio') || data1.includes('nome áudio'))) {
  //       //     NomeAudio = data1.split("áudio ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
  //       //     //NomeAudio = nomeaudio
  //       //     navigation.navigate("Audio Recorder", { NomeAudio: NomeAudio, nomeCol: NomeCol })
  //       //     setNomeA(NomeAudio)
  //       //     setNomeC(NomeCol)
  //       //   }
  //       //   if (data1.includes('Começar a gravar') || data1.includes('começar a gravar')) {
  //       //     clearInterval(intervalID);
  //       //     startRecording1();
  //       //   }

  //       //   if (data1.includes('Parar gravação') || data1.includes('parar gravação')) {
  //       //     stopRecording1();
  //       //     navigation.navigate("Colmeia", { nomeCol: doc.data(), nomeApi: nomeApi })
  //       //   }
  //       //   //++++++++++++++++++++++++
  //       //   //Comando reproduzir audio
  //       //   //++++++++++++++++++++++++
  //       //   if (data1.includes('Reproduzir gravação') || data1.includes('reproduzir gravação')) {
  //       //     const nomeAudio = data1.split("gravação ")[null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(" ")[0]
  //       //     onPlayPress(nomeAudio)
  //       //   }


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

      <View style={styles.comandos2}>
        <Text style={styles.comandos}>Comandos por voz</Text>
        <View>
          <Switch
            style={styles.switch}
            trackColor={{ false: "grey", true: "#FFDAAE" }}
            thumbColor={isEnable ? "#FFDAAE" : "white"}
            ios_background="grey"
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
