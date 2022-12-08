import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

export default function CustomButton({onPress, text, type='PRIMARY', bgColor, fgColor}) {
    return (
        <Pressable 
            onPress={onPress} 
            style={[
                styles.container, 
                styles[`container_${type}`],
                bgColor ? {backgroundColor:bgColor} : {},
            ]}>
            <Text 
                style={[styles.text, 
                styles[`text_${type}`],
                fgColor ? {color:fgColor} : {},
            ]}>
            {text}
            </Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '90%',
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 14,
        marginLeft: 14,
    },
    container_PRIMARY:{
        backgroundColor: '#3B71F3',
    },
    container_SECONDARY:{
        width: '45%',
        padding: 10,
        borderColor: '#3B71F3',
        borderWidth: 2,
        alignSelf: 'center'
    },
    container_TERTIARY:{
        width: '45%',
        backgroundColor: '#F5F9FE',
        margin: 15,
        marginTop: 40,
        marginBottom: 30,
    },
    container_COLMEIAS:{
        width: '95%',
        padding: 15,
        marginLeft: 10,        
        borderRadius: 10,
        backgroundColor: '#F5F9FE', 
    },
    container_COLMEIA:{
        width: '95%',
        padding: 15,
        marginLeft: 10,        
        borderRadius: 10,
        backgroundColor: '#F5F9FE',
        alignItems: 'baseline'
    },
    container_NOVACOLMEIA:{
        width: '90%',
        padding: 15,
        marginLeft: 20,        
        borderRadius:15,
        backgroundColor: '#3B71F3',
        marginBottom: 40
    },
    container_AUDIO:{
        width: '90%',
        padding: 15,
        marginLeft: 20,        
        borderRadius:15,
        backgroundColor: '#3B71F3',
        marginTop:100
    },
    container_HOME:{
        width: '50%',
        backgroundColor: '#3B71F3',
        marginLeft: '25%',
        marginBottom: '10%'
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    },
    text_TERTIARY:{
        color:'gray'
    },
    text_SECONDARY:{
        color:'#3B71F3',
    },
    text_AUDIO:{
        color: 'white'
    },
    text_COLMEIAS:{
        color:'#4F4F4F'
    },
    text_COLMEIA:{
        color:'#939393',
        marginLeft: 5,
    }
})