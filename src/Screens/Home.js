import React from "react";
import { StyleSheet, Text, View, FlatList, Button } from "react-native";
import Header from "../components/Header";
import ListaColmeias from "../components/ListasColmeias";
import Gravacoes from "../components/Gravacoes";
import { useRoute } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

const ListCol = [
  {
    id: 1,
    label: "Colmeia 1",
  },
  {
    id: 2,
    label: "Colmeia 2",
  },
];

export default function Home() {
  const route = useRoute();
  const navigation = useNavigation();

  const onUserPress = () => {
    navigation.navigate('Perfil')
    console.warn('Profile');
  }


  const onNovaColmeiaPress = () => {
    navigation.navigate("Nova Colmeia");
    console.warn('Nova colmeia')
  }

  const onColmeiaPress = () => {
    navigation.navigate("Colmeia");
  }

  return (
    <View style={styles.container}>
      <Header name={route.params.username} type="user" onPress={onUserPress}/>

      <CustomButton text="Colmeias" type="COLMEIAS" />

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
        data={ListCol}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <Gravacoes data={item}/>}
      />

      <CustomButton text="Adicionar nova colmeia" type="NOVACOLMEIA" onPress={onNovaColmeiaPress}/>
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
