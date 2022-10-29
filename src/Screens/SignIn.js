import React, { useState, UseState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    useWindowDimensions,
    ScrollView
} from 'react-native';
import Logo from '../../assets/images/logo.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../services/firebase'

export default function SignIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { height } = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () => {
        //LOGIN
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                navigation.navigate('Home', {
                    username: email
                });
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error)
                if (errorCode === 'auth/email-already-in-use')
                    alert('Este mail já está ser usado!')
                if (errorCode === 'auth/invalid-email')
                    alert('Email inválido!')
                if (errorCode === 'auth/Operation-not-allowed')
                    alert('Operação inválida!')
                if (errorCode === 'auth/weak-password')
                    alert('Password fraca!')
                if (errorCode === 'auth/user-not-found')
                    alert('Voce não possui uma conta')
            });

    }
    const onForgotPassword = () => {
        console.warn('Forgot Password');
        navigation.navigate('Forgot Password')
    }

    const onSignUpPressed = () => {
        console.warn('Create new account');
        navigation.navigate('Sign Up')
    }

    return (
        <ScrollView>
            <View style={styles.root}>
                <Image source={Logo} style={[styles.logo, { height: height * 0.3 }]} resizeMode="contain" />
                <Text style={styles.name}>Speek2Bees</Text>
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry />
                <CustomButton text="Sign In" onPress={onSignInPressed} />
                <CustomButton text="Forgot Password?" onPress={onForgotPassword} type='TERTIARY' />


                <CustomButton text="Don't have an account? Create one." onPress={onSignUpPressed} type='TERTIARY' />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
        width: '40%',
        maxHeight: 200,
        maxWidth: 300,
        marginTop: 20
    },
    name: {
        color: 'rgb(179, 122, 0)',
        fontWeight: 'bold',
        fontSize: 24,
        paddingBottom: 16
    }
})