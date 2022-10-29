import { requestPermissionsAsync } from 'expo-notifications';
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Button
} from 'react-native';
import { Audio } from 'expo-av';

export default function Gravacoes({data}) {

    const onGravacoesPress = () => {
        //play gravaçao
        console.warn('Gravaçao do dia ', data.date);
    }

    
    const startRecording = () => {
        try{
            const permission =  requestPermissionsAsync();

            if (permission.status === "garanted"){
                 Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playInSilentModeIOS: true
                });
                const {recording} =  Audio.Recording.createAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
                );

                setRecording(recording);
            }else{
                setMessage('Please grant permission to app to access microphone')
            }
        }catch(err) {
            console.error('Failedo to start recording', err)
        }
    }

    const stopRecording = () => {
        setRecording(undefined);
        recording.stopAndUnloadAsync();

        let updatedRecordings = [...recordings];
        const {sound, status } = recording.createNewLoadedAsync()
        updatedRecordings.push({
            sound: sound,
            duration: getDurationFormated(status.durationMillis),
            file: recording.getURI()
        });

        setRecordings(updatedRecordings);
    }

    const getDurationFormated = (millis) => {
        const minutes = millis / 1000 / 60;
        const minutesDisplay = Math.floor(minutes);
        const seconds = Math.round((minutes - minutesDisplay) * 60);
        const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
        return `${minutesDisplay}:${secondsDisplay}`;
    }

    const getRecordingLines = () => {
        return recordings.map((recordingLine, index) => {
            return(
                <View key={index} style={styles.row}>
                    <Text style={styles.fill}>Recording {index + 1} - {recordingLine.duration}</Text>
                    <Button style={styles.button} onPress={() => recordingLine.sound.replayAsync()} title="Play"></Button>
                </View>
            )
        })
    }

    const [recording, setRecording] = useState();
    const [recordings, setRecordings] = useState([]);
    const [message, setMessage] = useState("");


 return (
   <TouchableOpacity style={styles.container} >
    <Text>{message}</Text>
    <Text style={styles.data}>{data.date}</Text>
    <View style={styles.content}>
        <Text style={styles.label}>{data.label}</Text>        
    </View>
    <Button 
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
    />
    {getRecordingLines}
   </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginBottom: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DADADA'
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        marginBottom: 8,
    },
    date: {
        color:'#DADADA',
        fontWeight: 'bold'
    },
    label:{
        fontWeight: 'bold',
        fontSize: 16
    },
    row:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    fill: {
        flex: 1,
        margin: 16
    },
    button: {
        margin: 16,
        
    }
})