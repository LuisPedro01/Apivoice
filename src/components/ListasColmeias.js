import React from 'react';
import { 
    View,
    Text,
    StyleSheet,    
} from 'react-native';

export default function components({colmeia}) {
 return (
   <View style={styles.container}>
    <View style={styles.item}>
        <Text style={styles.itemTitle}>Colmeias: </Text>
        <View style={styles.content}>
            <Text style={styles.colmeias}>{colmeia}</Text>
        </View>
    </View>
   </View>
  );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        paddingStart: 18,
        paddingEnd: 18,
        marginTop: -24,
        marginStart: 14,
        marginEnd: 14,
        borderRadius: 4,
        paddingTop: 22,
        paddingBottom: 22,
        zIndex: 99,
    },
    item:{

    },
    itemTitle:{
        fontSize: 20,
        color: '#DADADA'
    },
    content:{
        flexDirection: 'row',
        alignItems: 'center',

    },
    colmeias: {
        paddingLeft: 12,
        paddingTop: 24,
    }
})