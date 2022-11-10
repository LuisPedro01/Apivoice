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
    
 return (
   <TouchableOpacity style={styles.container} >
    <Text style={styles.data}>{data.date}</Text>
    <View style={styles.content}>
        <Text style={styles.label}>{data.label}</Text>        
    </View>
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