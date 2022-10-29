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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';

export default function SignUp() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    async function onRegisterPressed () {
        console.warn('Register');
        //REGISTO
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('criado com sucesso' +userCredential.user.uid)
                const user = userCredential.user;
                navigation.navigate('Sign In', {
                    username: username
                })
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorCode === 'auth/email-already-in-use')
                    alert('Este mail já está ser usado!')
                if (errorCode === 'auth/invalid-email')
                    alert('Email inválido!')
                if (errorCode === 'auth/Operation-not-allowed')
                    alert('Operação inválida!')
                if (errorCode === 'auth/weak-password')
                    alert('Password fraca! Password deve conter pelo menos 6 caracteres.')
            });        
    }

    const onSignInPressed = () => {
        console.warn('On sign in');
        navigation.navigate('Sign In')
    }

    const onTermsOfUsePress = () => {
        console.warn('Terms of use');
        //go to terms of use page
    }
    return (
        <ScrollView>
            <View style={styles.root}>
                <Text style={styles.title}>Create an account</Text>
                <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
                <CustomInput placeholder='Email' value={email} setValue={setEmail} />
                <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry />
                <CustomButton text="Register" onPress={onRegisterPressed} />
                <Text style={styles.text}>By registering, you confirm that you accept our <Text style={styles.link} onPress={onTermsOfUsePress}>Terms of Use</Text> and <Text style={styles.link} onPress={onTermsOfUsePress}>Privacy Policy</Text></Text>


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
    text: {
        color: 'gray',
        marginVertical: 10
    },
    link: {
        color: '#FDB075'
    }
})