import React,  { useState }  from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import Header from "../components/Header";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";


export default function NovaColmeia() {
  const route = useRoute();
  const navigation = useNavigation();
  const [nome, setNome] = useState('');
  const [localizaçao, setLocalizaçao] = useState('');

  const onNovaColmeiaPress = () => {
    //Codigo firebase


    console.warn('Nova colmeia')
  }

  return (
    <View style={styles.container}>
      <Header name={"Nova Colmeia"} type="plus-circle"/>

      <View style={{marginBottom:330}}>  
        <CustomInput placeholder='Nome' value={nome} setValue={setNome} />
        <CustomInput placeholder="Localização" value={localizaçao} setValue={setLocalizaçao}/> 
      </View>
      <CustomButton text="Adicionar" type="NOVACOLMEIA" onPress={onNovaColmeiaPress}/>
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
