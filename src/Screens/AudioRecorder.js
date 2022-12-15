import React, { Component, useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Audio } from "expo-av";
import {
  requestPermissionsAsync,
  setAudioModeAsync,
} from "expo-av/build/Audio";
import Header from "../components/Header";
import CustomButton from "../components/CustomButton";
import {firebase} from '../services/firebase'


const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [message, setMessage] = useState("");
  

  async function startRecording1() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
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

    firebase.storage()
    .ref(`audios/${recording.nome}`)
    .put(recording)
    .then(()=>{
      console.log("upload feito com sucesso!")
    })
    .catch((error) => console.log(error))
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
            Recording {index + 1} - {recordingLine.duration}
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

  // ********************************
  //teste
  // ********************************

  const [audio, setAudio] = useState(null);

  const startRecording = async () => {
    try{
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        playThroughEarpieceAndroid: true,
        shouldDuckAndroid: true
      });
    }catch(error){
      console.error("Failed to start recording", err);
    }
    setRecording(true);

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync();
    await recording.startAsync();

    setAudio(recording);
  }

  const stopRecording = async () => {
    setRecording(false);

    await audio.stopAndUnloadAsync();

    firebase.storage()
    .ref(`audios/${audio.nome}`)
    .put(audio)
    .then(()=>{
      console.log("upload feito com sucesso!")
    })
    .catch((error) => console.log(error))
  }
  


  return (
    <View style={styles.container}>
      <Header name="Nova Gravação" type="upload" />

      <CustomButton text="Colmeia X" type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: "#939393",
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10,
        }}
      />

      <View style={{marginBottom:330}}>
        {getRecordingLines()}
      </View>
      <CustomButton
        type="AUDIO"
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
});

export default AudioRecorder;
