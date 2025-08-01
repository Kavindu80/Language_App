import React from "react";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

const styles = StyleSheet.create({
  profileButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    zIndex: 1
  }
});

export default function StartScreen({ navigation }) {
  return (
    <Background>
      {/* Profile Settings Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("ProfileSettingsScreen")}
      >
        <MaterialIcons name="person" size={26} color="#000" />
      </TouchableOpacity>
      
      <Logo />
      <Header>Welcome to Exlogrn</Header>
      <Paragraph>
        A starter app template for React Native Expo, featuring a ready-to-use
        login screen.
      </Paragraph>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("LoginScreen")}
      >
        Log in
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        Create an account
      </Button>
    </Background>
  );
}
