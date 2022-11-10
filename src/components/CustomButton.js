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
        width: '100%',
        padding: 15,
        marginVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    container_PRIMARY:{
        backgroundColor: '#3B71F3',
    },
    container_SECONDARY:{
        borderColor: '#3B71F3',
        borderWidth: 2
    },
    container_TERTIARY:{
        width: '45%',
        backgroundColor: '#F5F9FE',
        margin: 15,
        marginTop: 40,
        marginBottom: 30,
    },
    container_AUDIO:{
        width: '50%',
        backgroundColor: '#3B71F3',
        marginLeft: '25%',
        marginTop: '15%'
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
    }
})