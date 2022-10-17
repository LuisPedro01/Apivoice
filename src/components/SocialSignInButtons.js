import React from 'react';
import { View } from 'react-native';
import CustomButton from '../components/CustomButton'

export default function SocialSignInButtons() {
    const onSignInGoogle = () => {

        //validate user in google
        console.warn('Sign IN with Google');
    }

    const onSignInApple = () => {

        //validate user in apple
        console.warn('Sign IN with Apple');
    }
    return (
        <>
            <CustomButton text="Sign In with Google" onPress={onSignInGoogle} bgColor='#FAE9EA' fgColor='#DD4D44' />
            <CustomButton text="Sign In with Apple" onPress={onSignInApple} bgColor='#e3e3e3' fgColor='#363636' />
        </>
    );
}