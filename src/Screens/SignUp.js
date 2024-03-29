import React, { useState, UseState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";
import Logo from "../../assets/images/logo.png";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { set, ref } from "firebase/database";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { firebase } from "../services/firebase";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { height } = useWindowDimensions();

  async function onRegisterPressed() {
    //REGISTO
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const ref = doc(db, "Nomes",  userCredential.user.uid)
        const docRef = setDoc(ref, {username, email})
        .then((re) => {
          Alert.alert("User criado!","User criado com sucesso, proceda ao log in.")
          navigation.navigate("Sign In")
        })
        .catch((e) => {
          console.log(e.message)
        })
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use")
          alert("Este mail já está ser usado!");
        if (errorCode === "auth/invalid-email") 
          alert("Email inválido!");
        if (errorCode === "auth/Operation-not-allowed")
          alert("Operação inválida!");
        if (errorCode === "auth/weak-password")
          alert("Password fraca! Password deve conter pelo menos 6 caracteres.");
      });
  }

  const onSignInPressed = () => {
    navigation.navigate("Sign In");
  };

  const onTermsOfUsePress = () => {
    console.warn("Terms of use");
    //go to terms of use page
  };

  const onSignInFacebook = () => {
    console.warn("Facebook");
  };

  const onSignInGoogle = () => {
    console.warn("Google");
  };
  return (
    <KeyboardAwareScrollView extraHeight={180} enableOnAndroid={true}>
      <View style={styles.root}>
        <Image
          source={Logo}
          style={[styles.logo, { height: height * 0.3 }]}
          resizeMode="contain"
        />
        <Text style={styles.name}>Sign Up</Text>

        <CustomInput
          placeholder="Username"
          value={username}
          setValue={setUsername}
        />
        <CustomInput placeholder="Email" value={email} setValue={setEmail} />
        <CustomInput
          placeholder="Password"
          value={password}
          setValue={setPassword}
          secureTextEntry
        />
        <CustomButton text="Register" onPress={onRegisterPressed} />
        <Text style={styles.text}>
          Possui conta?{" "}
          <Text style={styles.link} onPress={onSignInPressed}>
            Log in
          </Text>
        </Text>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  name: {
    color: "rgb(179, 122, 0)",
    fontWeight: "bold",
    fontSize: 24,
  },
  logo: {
    width: "40%",
    maxHeight: 200,
    maxWidth: 300,
    marginTop: 20,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
});
