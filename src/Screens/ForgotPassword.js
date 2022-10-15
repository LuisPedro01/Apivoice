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
import { useNavigation } from '@react-navigation/native';

export default function ForgotPassword() {

    const [username, setUsername] = useState('');
 
    const navigation = useNavigation();

    const onSendPressed = () => {
        console.warn('Send');
        navigation.navigate('New Password')
    }

    const onSignInPressed = () => {
        console.warn('On sign in');
        navigation.navigate('Sign In')
    }

    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Reset your password</Text>
                <CustomInput placeholder='Username' value={username} setValue={setUsername} />

                <CustomButton text="Send" onPress={onSendPressed}/>

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