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
import SocialSignInButtons from '../components/SocialSignInButtons'

export default function SignUp() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const { height } = useWindowDimensions();
    const onRegisterPressed = () => {
        console.warn('Register');
    }

    const onSignInPressed = () => {
        console.warn('On sign in');
    }

    const onTermsOfUsePress = () => {
        console.warn('Terms of use');
    }
    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Create an account</Text>
                <CustomInput placeholder='Username' value={username} setValue={setUsername} />
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry />
                <CustomInput placeholder='Confirm Password' value={passwordRepeat} setValue={setPasswordRepeat} secureTextEntry />
                <CustomButton text="Register" onPress={onRegisterPressed} />
                <Text style={styles.text}>By registering, you confirm that you accept our <Text style={styles.link} onPress={onTermsOfUsePress}>Terms of Use</Text> and <Text style={styles.link} onPress={onTermsOfUsePress}>Privacy Policy</Text></Text>

                <SocialSignInButtons/>

                <CustomButton text="Have an acoount? Sign in" onPress={onSignInPressed} type='TERTIARY' />
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