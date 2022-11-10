import React from 'react'
import { 
  StyleSheet, 
  Text, 
  View,
  StatusBar,
  TouchableOpacity
} from "react-native";

import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient';

const StatusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

export default function Header({name}) {
  return (
    <LinearGradient colors={['#FFDAAE', 'white']}>
      <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.username}>{name}</Text>
        <TouchableOpacity style={styles.buttonUser}>
          <Feather name="user" size={27} color="black"/>
        </TouchableOpacity>

      </View>
    </View>
    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  container: {
    paddingTop: StatusBarHeight,
    flexDirection: 'row',
    paddingStart: 16,
    paddingEnd: 16,
    paddingBottom: 44,
    marginTop: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username:{
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonUser: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 44/2,   
  },
})
