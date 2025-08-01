import React from "react";
import { TouchableOpacity, StyleSheet, View, StatusBar, Platform, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 60,
  },
  profileButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  }
});

export default function StartScreen({ navigation }) {
  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#00c6ff" />
      
      {/* Profile Settings Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("ProfileSettingsScreen")}
      >
        <MaterialIcons name="person" size={26} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.content}>
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
      </View>
    </LinearGradient>
  );
}
