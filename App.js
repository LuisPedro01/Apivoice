import Navigation from "./src/navigation";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView, 
  NativeModules
} from 'react-native';

export default function App () {

  const PythonBridge = NativeModules;

  PythonBridge("./src/python/comandos.py", (error, result) => {
    if(error){
      console.error(error);
    }
    else{
      console.log(result)
    }
  });

  return(
    <SafeAreaView style={styles.root}>
      <Navigation/>     
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  root:{
      flex:1,
      backgroundColor: '#F9FBFC'
  }
})