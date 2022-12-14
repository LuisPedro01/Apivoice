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
import { useNavigation } from "@react-navigation/native";
import CustomButton from './CustomButton';

export default function Colmeias({data}) {

    const navigation = useNavigation();
    const onColmeiaPress = () => {
        navigation.navigate("Colmeia")
      };
    
 return (
   <TouchableOpacity style={styles.container} >
        <CustomButton text={data.label} type='COLMEIA' onPress={onColmeiaPress}/>
   </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
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