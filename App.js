import Home from "./src/Screens/Home";
import NavBar from "./src/components/Header";
import Footer from "./src/components/Footer";
import SignIn from './src/Screens/SignIn'

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

export default function App () {
  return(
    <SafeAreaView style={styles.root}>
      <SignIn/>     
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  root:{
      flex:1,
      backgroundColor: '#F9FBFC'
  }
})