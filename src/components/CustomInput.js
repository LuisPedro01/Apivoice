import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function CustomInput({ value, setValue, placeholder, secureTextEntry }) {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5F9FE',
        width: '100%',
        height: 60,
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 15,
        marginVertical: 10,
    },
    input: {
        
    }
})