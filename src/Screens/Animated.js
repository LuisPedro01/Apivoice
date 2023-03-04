import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';
import { useNavigation } from "@react-navigation/native";

export default function Animated() {
    const navigation = useNavigation();

  return (
    <View style={{flex:1, justifyContent:'center', alignItems: 'center'}}>
        <LottieView 
            source={require('../assets/splash.json')}
            autoPlay
            loop={false}
            onAnimationFinish={()=> navigation.navigate('Sign In')}
        />
    </View>
  )
}

const styles = StyleSheet.create({})