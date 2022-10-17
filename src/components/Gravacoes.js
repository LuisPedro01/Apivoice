import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default function Gravacoes({data}) {

    const onGravacoesPress = () => {
        //play gravaçao
        console.warn('Gravaçao');
    }



 return (
   <TouchableOpacity style={styles.container} onPress={onGravacoesPress}>
    <Text style={styles.data}>{data.date}</Text>
    <View style={styles.content}>
        <Text style={styles.label}>{data.label}</Text>        
    </View>
   </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        marginBottom: 24,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DADADA'
    },
    content:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        marginBottom: 8,
    },
    date: {
        color:'#DADADA',
        fontWeight: 'bold'
    },
    label:{
        fontWeight: 'bold',
        fontSize: 16
    },
})