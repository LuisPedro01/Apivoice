import React from 'react'
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import Header from '../components/Header'
import ListaColmeias from '../components/ListasColmeias'
import Gravacoes from '../components/Gravacoes'
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../components/CustomButton';

const ListGrav = [
  {
    id: 1,
    label: 'Gravação da colmeia 1',
    date: '13/10/2022',
  },
  {
    id: 2,
    label: 'Gravação da colmeia 2',
    date: '22/10/2022',
  },
]


export default function Home() {
  const route= useRoute();
  const navigation = useNavigation();

  const buttonPress = () => {
    navigation.navigate('Audio Recorder')
  }

  return (
     <View style={styles.container}>

      <Header name={route.params.username}/>

      

      <Text style={styles.grav}>Últimas gravações</Text>

      <FlatList
        style={styles.list}
        data={ListGrav}
        keyExtractor={ (item) => String(item.id)}
        showsVerticalScrollIndicator= {false}
        renderItem={( {item} ) => <Gravacoes data={item}/>}
      />

      <CustomButton text="Audio Recorder" onPress={buttonPress} type='HOME'/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fafafa',
  },
  grav:{
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 14,
    marginRight: 14,
    marginTop: 14
  },
  list:{
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20
  }
})

