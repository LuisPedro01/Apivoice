import React,  { useState }  from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import ColmeiasGrav from "../components/ColmeiasGrav";

const ListGrav = [
    {
        id:1,
        nome: "Gravação 1",
        data: "15/11/2022"
    },
    {
        id:2,
        nome: "Gravação 2",
        data: "15/11/2022"
    },
    {
        id:3,
        nome: "Gravação 3",
        data: "15/11/2022"
    },
]


export default function NovaColmeia() {
  const route = useRoute();
  const navigation = useNavigation();

  const onAudioPress = () => {
    console.warn('Audio');
  }

  const NovaGravacaoPress = () => {
    navigation.navigate("Audio Recorder")
  }

  
  return (
    <View style={styles.container}>
      <Header name={"Gravações"} type="music"/>

      <CustomButton text="Colmeia X" type="COLMEIAS" />

      <View
        style={{
          borderBottomColor: '#939393',
          borderBottomWidth: 0.5,
          margin: 20,
          marginBottom: 0,
          marginTop: 10
        }}
      />

      <FlatList
        style={styles.list}
        data={ListGrav}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ColmeiasGrav data={item} />}
      />
      
      <CustomButton text={"Adicionar nova gravação"} type="NOVACOLMEIA" onPress={NovaGravacaoPress}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  grav: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 14,
    marginRight: 14,
    marginTop: 14,
  },
  list: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 20,
  },
});
