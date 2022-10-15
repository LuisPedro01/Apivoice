import React, {useState, UseState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    useWindowDimensions,
    onPress
} from 'react-native';
import Logo from '../../assets/images/logo.png'
import CustomInput from '../components/CustomInput'
import CustomButton from '../components/CustomButton'

export default function Screens() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();

    const onSignInPressed = () => {
        console.warn('Sign In');
    }

 return (
   <View style={styles.root}>
       <Image source={Logo} style={[styles.logo, {height: height * 0.3}]} resizeMode="contain"/>
       <Text style={styles.name}>Speek2Bees</Text>
       <CustomInput placeholder='Username' value={username} setValue={setUsername}/>
       <CustomInput placeholder='Password' value={password} setValue={setPassword} secureTextEntry/>

        <CustomButton text="Sign In" onPress={onSignInPressed}/>
   </View>
  );
}

const styles = StyleSheet.create({
    root:{
        alignItems: 'center',
        padding: 20,   
    },
    logo:{
        width:'40%',
        maxHeight: 200,
        maxWidth: 300,
        marginTop: 20
    },
    name:{
        color:'rgb(179, 122, 0)',
        fontWeight: 'bold', 
        fontSize: 24,
        paddingBottom: 16
    }
})