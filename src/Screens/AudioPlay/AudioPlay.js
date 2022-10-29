import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native'

const AudioPlay = () => {
 return (
    <View style={styles.container}>
        <Text>AudioPlay</Text>
    </View>
   
 );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black'
    }
})

export default AudioPlay;