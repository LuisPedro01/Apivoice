import React, { useState, useEffect } from "react";
import {StyleSheet,Text,View,StatusBar,TouchableOpacity,Switch,Platform} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { firebase } from "../services/firebase";
import { getStorage, ref, uploadBytes,} from "firebase/storage";
import { Audio } from "expo-av";
import * as Speech from "expo-speech";
import axios from "axios";
import stringSimilarity from "string-similarity";

const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({ name, type, onPress, route, item, showIcon }) {
  const navigation = useNavigation();
  const [isEnable, setIsEnable] = useState(false);
  const [recording, setRecording] = useState();
  const [recording1, setRecording1] = useState();
  const ApiRef = firebase.firestore().collection("apiarios");
  const storage1 = firebase.storage();
  let RouteApi;
  let nomeApi;
  let NomeCol = "";
  let NomeAudio = "";
  let uri;
  const [nomeA, setNomeA] = useState("");
  const [nomeC, setNomeC] = useState("");
  let comando = "";
  var isRecroding = false;
  let recordingInstance;
  let recordingg = new Audio.Recording();
  let NomeApiario = ''

  const keyExtractor = (item) => item.id;

  const toggleSwitch = async (value) => {
    if (isEnable) {
      Speech.speak("Comandos desligados", {
        language: "pt-PT",
      });
      stopRecording();
    } else {
      Speech.speak("A ouvir comandos", {
        language: "pt-PT",
      });
    }
    setIsEnable((previousState) => !previousState);
  };

  //+++++++++++++++
  //Começar a gravar
  //++++++++++++++++
  async function startRecording1() {
    if (Platform.OS == "ios") {
      try {
        console.log("Requesting permissions..");
        await Audio.requestPermissionsAsync();
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        console.log("Starting recording..");
        await recordingg.prepareToRecordAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        await recordingg.startAsync()
        //setRecording1(recording);
        console.log("Recording started");
      } catch (err) {
        console.error("Failed to start recording", err);
      }
    } else {
      const { recording } = await Audio.Recording.createAsync( Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording1(recording);
      console.log("Recording started");
    }
  }

  //+++++++++++++++
  //Parar de gravar
  //+++++++++++++++
  async function stopRecording1() {
    if(Platform.OS=="ios"){
      console.log("Stopping recording..");
      //setRecording1(undefined);
      //console.log('recording->', recording1)
      await recordingg.stopAndUnloadAsync();
      const uri = recordingg.getURI();
      console.log("Recording stopped and stored at", uri);
      const response = await fetch(uri);
      const file = await response.blob();
  
      try {
        //Create the file reference
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `apiario ${NomeApiario}/colmeia ${NomeCol}/audio ${NomeAudio}.mp3`
        );
  
        // Upload Blob file to Firebase
        const snapshot = await uploadBytes(storageRef, file);
        console.log("Gravação criada com sucesso!");
      } catch (error) {
        console.log(error);
      }
    }else{
      console.log("Stopping recording..");
      //setRecording1(undefined);
      //console.log('recording->', recording1)
      await recordingg.stopAndUnloadAsync();
      const uri = recordingg.getURI();
      console.log("Recording stopped and stored at", uri);
      const response = await fetch(uri);
      const file = await response.blob();
  
      try {
        //Create the file reference
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `apiario ${NomeApiario}/colmeia ${NomeCol}/audio ${NomeAudio}.mp3`
        );
  
        // Upload Blob file to Firebase
        const snapshot = await uploadBytes(storageRef, file);
        console.log("Gravação criada com sucesso!");
      } catch (error) {
        console.log(error);
      }
    }
  }

  //++++++++++++++++
  //Reproduzir audio
  //++++++++++++++++a
  const onPlayPress = (nomeAudio) => {
    storage1
      .ref(`apiario ${NomeApiario}/colmeia ${NomeCol}/audio ${nomeAudio}.mp3`)
      .getDownloadURL()
      .then(async (url) => {
        console.log(`url de ${nomeAudio}->`, url);
        try {
          const { sound } = await Audio.Sound.createAsync({ uri: url });
          await sound.replayAsync();
        } catch (error) {
          console.log("Erro ao reproduzir o audio: ", error);
        }
      });
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
  const paginaInicialKeywords = ["página inicial", "inicial"];
  const pararKeywords = ["parar", "parar comandos", "desligar comandos"];
  const voltarKeywords = ["voltar", "página anterior"];
  const selecionarApiarioKeywords = [
    "selecionar apiário",
    "selecionar a diário",
    "selecionar Aviário",
  ];
  const selecionarColmeiaKeywords = ["selecionar"];
  const NovaGravaçãoKeywords = [
    "nova gravação",
    "novo áudio",
    "nossa gravação",
  ];
  const NomeAudioKeywords = [
    "número áudio",
    "número gravação",
    "nome gravação",
    "nome áudio",
    "no áudio",
    "nome audio",
    "no audio",
  ];
  const ComeçarGravarKeywords = ["começar gravação", "começar a gravar"];
  const ReproduzirAudioKeywords = ["reproduzir áudio"];
  let timeout;

  function convertNumberToWord(number) {
    const numberWords = [
      "zero",
      "um",
      "dois",
      "três",
      "quatro",
      "cinco",
      "seis",
      "sete",
      "oito",
      "nove",
      // Adicione mais palavras se necessário
    ];
  
    if (typeof number === "number" && number >= 0 && number < numberWords.length) {
      return numberWords[number];
    }
  
    return number;
  }


  const startRecording = async () => {
    try {
      const recordingOptions = {
        android: {
          extension: ".m4a",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: ".caf",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      isRecroding = true;
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
      console.log("Recording started");

      timeout = setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        console.log("Recording stopped", uri);
        sendAudioToServer(uri);
        startRecording();
      }, 8000);
      //pagina incial
      if (checkCommandSimilarity(comando, paginaInicialKeywords)) {
        Speech.speak("A dirécionar para página inicial", {
          language: "pt-PT",
        });
        navigation.navigate("Página Inicial");
        comando = "";
        setIsEnable(true);
      }
      //parar
      if (checkCommandSimilarity(comando, pararKeywords)) {
        Speech.speak("Comandos desligados", {
          language: "pt-PT",
        });
        clearTimeout(timeout);
        //stopRecording();
        setIsEnable(false);
        comando = "";
        return;
      }
      //voltar
      if (checkCommandSimilarity(comando, voltarKeywords)) {
        Speech.speak("A navegar para página anterior", {
          language: "pt-PT",
        });
        navigation.goBack();
        comando = "";
      }
      //selecionar apiário
      if (checkCommandSimilarity(comando, selecionarApiarioKeywords)) {
        const nome = comando
          .split("apiário ")
          [null || 1 || 2 || 3 || 4 || 5].split(" ")[0];
        ApiRef.where("nome", "==", nome)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              keyExtractor(doc);
              const nomeApi1 ={
                id:doc.id,
                nome:doc.data().nome,
                userId:doc.data().userId
              }
              navigation.navigate("Colmeia", {
                nomeApi1: doc.data().nome,
                nomeApi: nomeApi1,
                id:doc.id
              });
              Speech.speak(`A navegar para apiário ${nome}`, {
                language: "pt-PT",
              });
              RouteApi = doc.id;
              nomeApi = doc.data();
              NomeApiario = doc.data().nome
            });
          });
        comando = "";
        setIsEnable(true);
      }
      // Função para extrair o nome da colmeia do comando
      const extractColmeiaName = (command) => {
        const regex = /selecionar\s(.+)/i;
        const match = command.match(regex);
        return match ? match[1] : null;
      };
      //selecionar colmeia
      if (checkCommandSimilarity(comando, selecionarColmeiaKeywords)) {
        const nome = extractColmeiaName(comando)?.toLowerCase();
        const convertedNome = convertNumberToWord(nome);

        console.log(convertedNome);
        console.log("RouteApi2", RouteApi);

        let ColRef = firebase
          .firestore()
          .collection("apiarios")
          .doc(RouteApi)
          .collection("colmeia");
        ColRef.where("nomeColmeia", "==", nome)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              keyExtractor(doc);
              NomeCol = doc.data().nomeColmeia;
              console.log("nome apiario->", nomeApi);
              navigation.navigate("Gravações", {
                nomeCol: NomeCol,
                nomeApi: nomeApi,
              });
              Speech.speak(`A navegar para colmeia ${nome}`, {
                language: "pt-PT",
              });
            });
          })
          .catch((error) => console.log(error));
        comando = "";
      }
      //gravar
      //navegação
      if (checkCommandSimilarity(comando, NovaGravaçãoKeywords)) {
        navigation.navigate("Audio Recorder", {
          nomeCol: NomeCol,
        });
        Speech.speak(`A navegar para nova gravação`, {
          language: "pt-PT",
        });
        comando = "";
      }
      //nome audio
      if (comando.startsWith("áudio")) {
        NomeAudio = comando
          .split("áudio ")
          [null || 1 || 2 || 3 || 4 || 5].split(" ")[0];
        //NomeAudio = comando.split("gravação ")[null || 1 || 2 || 3 || 4 || 5].split(" ")[0]
        console.log(NomeAudio);
        navigation.navigate("Audio Recorder", {
          NomeAudio: NomeAudio,
          nomeCol: NomeCol,
        });
        Speech.speak(`nome audio ${NomeAudio}`, {
          language: "pt-PT",
        });
        setNomeA(NomeAudio);
        setNomeC(NomeCol);
        comando = "";
      }
      //começar a gravar
      if (checkCommandSimilarity(comando, ComeçarGravarKeywords)) {
        Speech.speak(`a preparar nova gravação`, {
          language: "pt-PT",
        });
        clearTimeout(timeout);
        setIsEnable(false);
        await stopRecording()
        // Aguardar 5,5 segundos
        await new Promise((resolve) => setTimeout(resolve, 5500))
        
        clearTimeout(timeout);
        setIsEnable(false);
        
        Speech.speak(`a gravar nova gravação`, {
          language: "pt-PT",
        });
        startRecording1();
        comando = "";
        // Aguardar 30 segundos
        await new Promise((resolve) => setTimeout(resolve, 30000));
        console.log("Stopping recording..");
        stopRecording1();
        Speech.speak(`áudio guardado na base de dados`, {
          language: "pt-PT",
        });
        await new Promise((resolve) => setTimeout(resolve, 10000));
        startRecording();
        navigation.navigate("Página Inicial")
        Speech.speak(`A ouvir comandos`, {
          language: "pt-PT",
        });
      }
      //reproduzir audio
      if (checkCommandSimilarity(comando, ReproduzirAudioKeywords)) {
        const nomeAudio = comando
          .split("áudio ")
          [null || 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9 || 10].split(
            " "
          )[0];
        onPlayPress(nomeAudio);
        console.log("Nome Audio->", nomeAudio);
        comando = "";
      }

      return () => {
        clearTimeout(timeout);
      };
    } catch (error) {
      console.log("Failed to start recording", error);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped", uri);
      await sendAudioToServer(uri);
    } catch (error) {
      console.log("Failed to stop recording", error);
    }
  };

  const sendAudioToServer = async (uri) => {
    const fileType = Platform.select({
      android: { type: "audio/m4a", extension: ".m4a" },
      ios: { type: "audio/x-caf", extension: ".caf" },
    });

    const formData = new FormData();
    formData.append("audio", {
      uri,
      type: fileType.type,
      name: `recording${fileType.extension}`,
    });

    try {
      const response = await axios.post(
        "https://luis21121.pythonanywhere.com/rota-de-receber-audio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data.text);
      comando = response.data.text;
    } catch (error) {
      console.log("Failed to send audio to server", error);
    }
    isRecroding = false;
  };

  const getAudioPermission = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (status === "granted") {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }
  };

  useEffect(() => {
    getAudioPermission();
  }, []);

  useEffect(() => {
    if (isEnable) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isEnable]);

  return (
    <LinearGradient colors={["#FFDAAE", "white"]}>
      <View style={styles.container}>
        <View style={styles.content}>
          {showIcon && (
            <Feather
              name={"chevron-left"}
              size={27}
              color="black"
              onPress={() => navigation.goBack()}
            />
          )}
          <Text style={styles.username}>{name || "Bem vindo!"}</Text>
          <TouchableOpacity style={styles.buttonUser}>
            <Feather
              name={`${type}`}
              size={27}
              color="black"
              onPress={onPress}
            />
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
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBarHeight,
    flexDirection: "row",
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  username: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
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
  buttonUser: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 44 / 2,
  },
});
