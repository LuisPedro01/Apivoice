import React, { useState, UseState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useWindowDimensions
} from 'react-native';
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

export default function NewPassword() {

    const [code, setCode] = useState('');
    const [password, setPassword] = useState('')

    const onSubmitPressed = () => {
        console.warn('Submit');
    }

    const onSignInPressed = () => {
        console.warn('On sign in');
    }

    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Reset your password</Text>
                <CustomInput placeholder='Code' value={code} setValue={setCode} />
                <CustomInput placeholder='New password' value={password} setValue={setPassword} />

                <CustomButton text="Submit" onPress={onSubmitPressed}/>

                <CustomButton text="Back to Sign in" onPress={onSignInPressed} type='TERTIARY' />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#051C60',
        margin: 10,
    },
    text:{
        color: 'gray',
        marginVertical: 10
    },
    link:{
       color: '#FDB075' 
    }
})