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

export default function SignIn() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { height } = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () => {
        console.warn('Sign In');
        //validate user

        navigation.navigate('Home',{
            username: username
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
                <CustomInput placeholder='Username' value={username} setValue={setUsername} />
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