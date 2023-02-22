import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, FlatList, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
import {
  requestPermissionsAsync,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import Header from "../components/Header";
import CustomButton from "../components/CustomButton";
import { firebase } from "../services/firebase";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import CustomInput from "../components/CustomInput";
import { useNavigation } from "@react-navigation/native";

const AudioRecorder = ({route}) => {
  const navigation = useNavigation();
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [song, setSong] = useState();
  const [nome, setNome] = useState("");

  async function startRecording1() {
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
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording1() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
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
      type: "audio/mpeg",
    });

    try {
      //Create the file reference
      const storage = getStorage();
      const storageRef = ref(storage, `audio ${route.params.nomeCol.nomeColmeia}/${nome}`);

      // Upload Blob file to Firebase
      const snapshot = await uploadBytes(storageRef, file, "blob")
      .then((snapshot) => {
        console.log("Uploaded a song to firebase storage!");
        Alert.alert("Gravação criada!", "Gravação gravada com sucesso!")
      });

      setSong(sound);
    } catch (error) {
      console.log(error);
    }
  }

  function getDurationFormated(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  function getRecordingLines() {
    return recordings.map((recordingLine, index) => {
      return (
        <View key={index} style={styles.row}>
          <Text style={styles.fill}>
            {nome} - {recordingLine.duration}
          </Text>
          <Button
            style={styles.button}
            onPress={() => recordingLine.sound.replayAsync()}
            title="Play"
          />
        </View>
      );
    });
  } 

  return (
    <View style={styles.container}>
      <Header name="Nova Gravação" type="upload" />

      <CustomButton text={route.params.nomeCol.nomeColmeia} type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />

      <View style={styles.list}>
        <CustomInput placeholder="Nome" value={nome} setValue={setNome} />
      </View>

      <View style={styles.list}>{getRecordingLines()}</View> 

      <CustomButton
        type="NOVACOLMEIA"
        text={recording ? "Parar de gravar" : "Começar a gravar"}
        onPress={recording ? stopRecording1 : startRecording1}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fill: {
    flex: 1,
    margin: 16,
  },
  button: {
    margin: 160,
  },
  list: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20,
  },
});

export default AudioRecorder;
