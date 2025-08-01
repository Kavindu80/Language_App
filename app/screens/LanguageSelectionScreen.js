import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Animated, 
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get('window');

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [imageAnim] = useState(new Animated.Value(0));

  // Animation when screen loads
  useEffect(() => {
    Animated.sequence([
      // First animate the image
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Then animate the rest of the content
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
      ])
    ]).start();
  }, []);

  const languages = [
    { id: 1, label: "English" },
    { id: 2, label: "Sinhala" },
    { id: 3, label: "Tamil" },
    { id: 4, label: "Japanese" },
    { id: 5, label: "Korean" },
    { id: 6, label: "Russian" },
  ];

  const handleContinue = () => {
    if (selectedLanguage) {
      navigation.navigate("StartScreenL");
    } else {
      alert("Please select a language.");
    }
  };

  // Button animation
  const buttonScale = new Animated.Value(1);
  
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor="#00c6ff" />
      <LinearGradient
        colors={["#00c6ff", "#0072ff"]}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        {/* Header Image */}
        <Animated.View 
          style={[
            styles.imageContainer,
            { 
              opacity: imageAnim,
              transform: [
                { scale: imageAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1]
                  })
                }
              ]
            }
          ]}
        >
          <Image 
            source={require("../../assets/6.png")}
            style={styles.headerImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.title}>Language App</Text>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View 
          style={[
            styles.progressBarContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.progressBar} />
        </Animated.View>

        {/* Chat Section */}
        <Animated.View 
          style={[
            styles.chatContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.chatText}>What would you like to learn?</Text>
        </Animated.View>

        {/* Language Selection */}
        <ScrollView 
          contentContainerStyle={styles.languageList}
          showsVerticalScrollIndicator={false}
        >
          {languages.map((language, index) => (
            <Animated.View
              key={language.id}
              style={[
                styles.languageItem,
                selectedLanguage === language.id && styles.languageItemSelected,
                { 
                  opacity: fadeAnim,
                  transform: [
                    { scale: selectedLanguage === language.id ? 1.03 : 1 },
                    { translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30 + (index * 10), 0]
                      })
                    }
                  ] 
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => setSelectedLanguage(language.id)}
                style={styles.languageItemTouchable}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.languageText,
                  selectedLanguage === language.id && styles.selectedLanguageText
                ]}>
                  {language.label}
                </Text>
                {selectedLanguage === language.id && (
                  <View style={styles.checkmarkContainer}>
                    <Ionicons name="checkmark-circle" size={24} color="#4776E6" />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          ))}
          
          {/* Extra space to prevent button overlap */}
          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <Animated.View 
            style={{
              width: '100%',
              opacity: fadeAnim,
              transform: [
                { scale: buttonScale },
                { translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }
              ]
            }}
          >
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedLanguage && styles.disabledButton
              ]}
              onPress={handleContinue}
              onPressIn={selectedLanguage ? handlePressIn : null}
              onPressOut={selectedLanguage ? handlePressOut : null}
              activeOpacity={0.8}
              disabled={!selectedLanguage}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 40 : 20,
    marginBottom: 10,
    height: height * 0.15,
  },
  headerImage: {
    width: width * 0.5,
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  progressBarContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 10,
    width: width * 0.4,
  },
  chatContainer: {
    alignItems: "center",
    marginVertical: 15,
  },
  chatText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  languageList: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  languageItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  languageItemSelected: {
    backgroundColor: "#e8f0fe",
    borderColor: "#4776E6",
    shadowColor: "#4776E6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  languageItemTouchable: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    width: '100%',
    justifyContent: 'center',
  },
  languageText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  selectedLanguageText: {
    color: '#0D47A1',
    fontWeight: 'bold',
  },
  checkmarkContainer: {
    position: 'absolute',
    right: 18,
  },
  bottomSpace: {
    height: 80, // Extra space to prevent button overlap
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: 20,
    right: 20,
  },
  continueButton: {
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
  },
  continueButtonText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});

export default LanguageSelectionScreen;
