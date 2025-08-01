import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Animated, Dimensions, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Make sure to install expo-linear-gradient
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // Make sure to install @expo/vector-icons

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Animation values
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(30));
  const [buttonAnim] = React.useState(new Animated.Value(0));

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First animate the content
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then animate the button
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container} // Applying gradient background
    >
      <StatusBar barStyle="light-content" backgroundColor="#00c6ff" />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>
      
      {/* Profile Settings Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("ProfileSettingsScreen")}
      >
        <MaterialIcons name="person" size={26} color="#fff" />
      </TouchableOpacity>

      {/* Character Image */}
      <Animated.View 
        style={[
          styles.characterContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }
            ]
          }
        ]}
      >
        <Image
          source={require("../../assets/2.png")}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text Content */}
      <Animated.View 
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.title}>Welcome Mate</Text>
        <Text style={styles.subtitle}>
          Enjoy, Learn and Grow
        </Text>
      </Animated.View>

      {/* Get Started Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnim,
            transform: [
              { translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={() => navigation.navigate("IntroductionScreen")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.loginButton}
        >
          <Text style={styles.loginText}>Already Have an Account?</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    width: width * 0.7,
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 24,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    width: width * 0.7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: "#0072ff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  loginButton: {
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 16,
    color: "#fff",
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
