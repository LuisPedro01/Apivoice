import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  LogBox,
} from "react-native";
import Voice from "@react-native-voice/voice";
import CustomButton from "../components/CustomButton";
import * as Speech from "expo-speech";
import { useNavigation } from "@react-navigation/native";
import { firebase, storage } from "../services/firebase";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";
import { Audio } from "expo-av";


export default function SpeechToText() {
  const navigation = useNavigation();
  const [recording, setRecording] = useState();
  const [recordings, setRecordings] = useState([]);
  const [result, setResult] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isEnable, setIsEnable] = useState(false);
  const ApiRef = firebase.firestore().collection("apiarios");
  const keyExtractor = (item) => item.id
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
  let nomeApiario;
  let nomeCol;
  let lastFile;

  const getLastUploadedFile = async () => {
    try {
      const reference = firebase.storage().ref(`apiario ${nomeApiario}/colmeia ${nomeCol}`); // Referência para o diretório raiz do Firebase Storage
      const listResult = await reference.list(); // Recupera uma lista de todos os itens no diretório raiz
      
      console.log('Lista de arquivos no Firebase Storage:');
      
      for (const item of listResult.items) {
        console.log('Nome do arquivo:', item.name);
        lastFile = item.name
        console.log('Caminho do arquivo:', item.fullPath);
        console.log('----');
      }
    } catch (error) {
      console.error('Erro ao recuperar a lista de arquivos:', error);
    }
  };

  useEffect(() => {
    getLastUploadedFile();
  })


  const toggleSwitch = () => {
    if (isEnable) {
      //parar o fetch
      Speech.speak("Comandos desligados", {
        voice: "pt-pt-x-sfs-network",
      });
      stopRecording();
    } else {
      //fazer o fetch
      Speech.speak("A ouvir comandos", {
        voice: "pt-pt-x-sfs-network",
      });

    }
    setIsEnable((previousState) => !previousState);
  };

  const speechStartHandler = (e) => {
    console.log("speechStart successful", e);
  };

  const speechEndHandler = (e) => {
    setLoading(false);
    console.log("stop handler", e);
  };

  const speechResultsHandler = (e) => {
    const text = e.value[0];
    setResult(text);
  };

  useEffect(() => {
    //getLastFileUrl()

    if (isEnable) {
      const intervalID = setInterval(() => {
        startRecording()
      }, 8000);
      return () => clearInterval(intervalID);
    }
  });

  const startRecording = async () => {
    setLoading(true);
    try {
      Voice.start("pt-PT");
    } catch (error) {
      console.log("error", error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  const clear = () => {
    setResult("");
  };


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

  const storage1 = firebase.storage()
  const onPlayPress = (nomeAudio) => {
    storage1.ref(`apiario ${nomeApiario}/colmeia ${nomeCol}`).getDownloadURL()
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
    Voice.onSpeechStart = speechStartHandler;
    Voice.onSpeechEnd = speechEndHandler;
    Voice.onSpeechResults = speechResultsHandler;
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  // {"identifier": "pt-pt-x-jfb-network", "language": "pt-PT", "name": "pt-pt-x-jfb-network", "quality": "Enhanced"}
  // {"identifier": "pt-PT-language", "language": "pt-PT", "name": "pt-PT-language", "quality": "Enhanced"}
  // Feminino-> {"identifier": "pt-pt-x-jfb-local", "language": "pt-PT", "name": "pt-pt-x-jfb-local", "quality": "Enhanced"}
  // Feminino-> {"identifier": "pt-pt-x-sfs-network", "language": "pt-PT", "name": "pt-pt-x-sfs-network", "quality": "Enhanced"}
  // Masculino-> {"identifier": "pt-pt-x-pmj-local", "language": "pt-PT", "name": "pt-pt-x-pmj-local", "quality": "Enhanced"}
  // {"identifier": "pt-pt-x-sfs-local", "language": "pt-PT", "name": "pt-pt-x-sfs-local", "quality": "Enhanced"}

  // const GetVoices = async () => {
  //   let availableVoices;
  //   availableVoices = await Speech.getAvailableVoicesAsync();
  //   for (let x = 0; x <= availableVoices.length; x++) {
  //     if (availableVoices[x]) {
  //       console.log(x, " - ", availableVoices[x]);
  //     } else {
  //       break;
  //     }
  //   }
  // };

  const testevoz = () => {
    Speech.speak("teste", {
      voice: "pt-pt-x-sfs-network",
    });
  };

  if (isEnable) {
    if (result.includes("página inicial")) {
      Speech.speak("A dirécionar para a página inicial", {
        voice: "pt-pt-x-sfs-network",
      });
      navigation.navigate("Apiario");
      setResult("")
    }

    // comando selecionar apiario (tratar de quando for offline)
    if (
      result.includes(`selecionar apiário`) ||
      result.includes(`Selecionar apiário`) ||
      result.includes(`Selecionar diário`) ||
      result.includes(`Selecionar pior`) ||
      result.includes(`Selecionar piário`)
      ||
      result.includes(`selecionar diário`) ||
      result.includes(`selecionar pior`) ||
      result.includes(`selecionar piário`)
    ) {
      // const nome =
      //   result.split("diário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0] ||
      //   result.split("pior ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0] ||
      //   result.split("apiário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0] ||
      //   result.split("piário ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0];

      const palavras = result.split(" ");

      nomeApiario = palavras[palavras.length - 1];

      ApiRef.where("nome", "==", nomeApiario)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            keyExtractor(doc);
            navigation.navigate("Home", {
              nomeApi1: doc.data().nome,
              nomeApi: doc,
            });
            RouteApi = doc.id;
            nomeApi = doc.data().nome;
            Speech.speak(`Apiário ${nomeApiario} selecionado`, {
              voice: "pt-pt-x-sfs-network",
            });
          });
        });
    }

    // comando selecionar colmeia (tratar de quando for offline)
    if (
      result.includes(`Selecionar colmeia`) ||
      result.includes(`selecionar colmeia`)
    ) {
      nomeCol = result.split("colmeia ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0];

      let ColRef = firebase
        .firestore()
        .collection("apiarios")
        .doc(RouteApi)
        .collection("colmeia");
      ColRef.where("nomeColmeia", "==", nomeCol)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            keyExtractor(doc);
            NomeCol = doc.data().nomeColmeia;
            navigation.navigate("Colmeia", {
              nomeCol: doc.data(),
              nomeApi: nomeApi,
            });
            Speech.speak(`Colmeia ${nomeCol} selecionada`, {
              voice: "pt-pt-x-sfs-network",
            });
          });
        })
        .catch((error) => console.log(error));
    }

    // comando reproduzir ultima gravação
    if(result.includes('reproduzir última gravação')){
      Speech.speak(`A reproduzir ultima gravação`, {
        voice: "pt-pt-x-sfs-network",
      });
      onPlayPress(lastFile)
    }

    // comando gravar
    if (result.includes('nova gravação') || result.includes('novo áudio')) {
      navigation.navigate("Audio Recorder", {
        nomeCol: NomeCol
      })
    }
    if ((result.includes('Nome áudio') || result.includes('nome áudio'))) {
      NomeAudio = result.split("áudio ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
      //NomeAudio = nomeaudio
      navigation.navigate("Audio Recorder", { NomeAudio: NomeAudio, nomeCol: NomeCol })
      setNomeA(NomeAudio)
      setNomeC(NomeCol)
    }
    if (result.includes('Começar a gravar') || result.includes('começar a gravar')) {
      clearInterval(intervalID);
      startRecording1();
    }

    if (result.includes('Parar gravação') || result.includes('parar gravação')) {
      stopRecording1();
      navigation.navigate("Colmeia", { nomeCol: doc.data(), nomeApi: nomeApi })
    }

    // comando voltar
    if (result.includes("voltar") || result.includes("Voltar")) {
      navigation.goBack();
      Speech.speak("A voltar para página anterior", {
        voice: "pt-pt-x-sfs-network",
      });
      setResult("")
    }

    if (result.includes("parar") || result.includes("parar")) {
      setIsEnable(false);
      stopRecording();
      Speech.speak("Comandos desligados", {
        voice: "pt-pt-x-sfs-network",
      });
    }
  }

  return (
    <View>
      {/* <Text>
        {"  Resultado ->"} {result}
      </Text>
      <CustomButton text="Apagar" type="SECONDARY" onPress={clear} /> */}
      {/* <CustomButton text="Teste?" type="SECONDARY" onPress={testevoz} /> */}


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
    </View>
  );
}

const styles = StyleSheet.create({
  comandos: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
  comandos2: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
