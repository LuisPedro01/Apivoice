import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../Screens/SignIn'
import SignUp from '../Screens/SignUp'
import NewPassword from "../Screens/NewPassword";
import Home from "../Screens/Home";
import AudioPlay from '../Screens/AudioPlay/AudioPlay';
import AudioRecorder from '../Screens/AudioRecorder/AudioRecorder';
import NovaColmeia from '../Screens/NovaColmeia';

const Stack = createNativeStackNavigator();

export default function Navigation() {
 return (
    <NavigationContainer>
       <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="Sign In" component={SignIn} />
            <Stack.Screen name="Sign Up" component={SignUp} />
            <Stack.Screen name="New Password" component={NewPassword} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Audio Play" component={AudioPlay} />
            <Stack.Screen name="Audio Recorder" component={AudioRecorder} />
            <Stack.Screen name="Nova Colmeia" component={NovaColmeia} />
            
        </Stack.Navigator> 
    </NavigationContainer>
  );
}