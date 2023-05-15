import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  useWindowDimensions,
  ScrollView,
  Alert,
} from "react-native";
import Logo from "../../assets/images/logo.png";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { height } = useWindowDimensions();
  const navigation = useNavigation();

  const onSignInPressed = () => {
    //LOGIN
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // const email = userCredential.email;
        // const password = userCredential.password;
        try {
          await AsyncStorage.setItem('email', email);
          await AsyncStorage.setItem('password', password);
          const email1 = await AsyncStorage.getItem('email');
          const password1 = await AsyncStorage.getItem('password');
              
          // compare user authentication information with current user
          if (email === email1 && password === password1) {
            navigation.navigate("Apiario");
          } else {
            console.log('hehehe')
          }
          // navigate to the main app screen
        } catch (e) {
          console.log('Error storing user authentication information:', e);
        }
        navigation.navigate("Apiario");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        if (errorCode === "auth/email-already-in-use")
          Alert.alert("Erro!", "Este mail já está ser usado!");
        if (errorCode === "auth/invalid-email")
          Alert.alert("Erro!", "Email inválido!");
        if (errorCode === "auth/Operation-not-allowed")
          Alert.alert("Erro!", "Operação inválida!");
        if (errorCode === "auth/weak-password")
          Alert.alert("Erro!", "Password fraca!");
        if (errorCode === "auth/user-not-found")
          Alert.alert("Erro!", "Voce não possui uma conta, faça o registo");
        if (errorCode === "auth/wrong-password")
          Alert.alert("Erro!", "Password incorreta!");
      });
  };

  const onSignUpPressed = () => {
    navigation.navigate("Sign Up");
  };

  const onSignInFacebook = () => {
    console.warn("Facebook");
  };

  const onSignInGoogle = () => {
    console.warn("Google");
  };
  return (
    <ScrollView>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <Text style={styles.name}>Speek2Bees</Text>
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomButton text="Log In" onPress={onSignInPressed} />
        <Text style={styles.text}>
          Não possui conta?{" "}
          <Text style={styles.link} onPress={onSignUpPressed}>
            Crie uma!
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "50%",
    maxHeight: 200,
    maxWidth: 300,
    marginTop: 20,
  },
  name: {
    color: "rgb(179, 122, 0)",
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 50,
    marginTop: 30,

  },
  text: {
    color: "gray",
    marginVertical: 10
  },
  link: {
    color: "#FDB075",
  },
});
