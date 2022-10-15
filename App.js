import Home from "./src/Screens/Home";
import NavBar from "./src/components/Header";
import Footer from "./src/components/Footer";
import SignIn from './src/Screens/SignIn'
import SignUp from './src/Screens/SignUp'
import ConfirmEmail from "./src/Screens/ConfirmEmail";
import ForgotPassword from "./src/Screens/ForgotPassword";
import NewPassword from "./src/Screens/NewPassword";

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
      <NewPassword/>     
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  root:{
      flex:1,
      backgroundColor: '#F9FBFC'
  }
})