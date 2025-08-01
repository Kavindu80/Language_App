import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SpeechHelper from '../../helpers/SpeechHelper';

export default function LetterDetailScreen() {
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioType, setAudioType] = useState(null);
  
  // Hardcoded to display only "Aa"
  const letter = "Aa";
  
  // Split the letter into uppercase and lowercase
  const uppercase = letter.charAt(0);
  const lowercase = letter.charAt(1);

  // Clean up any playing audio when component unmounts
  useEffect(() => {
    return () => {
      SpeechHelper.stop();
    };
  }, []);

  // Function to play audio for the letter
  const playAudio = async (letterType) => {
    try {
      setIsPlaying(true);
      setAudioType(letterType);
      
      // Get the letter to speak
      const letterToSpeak = letterType === "uppercase" ? uppercase : lowercase;
      
      // For uppercase, say "Capital A"
      const textToSpeak = letterType === "uppercase" 
        ? `Capital ${letterToSpeak}` 
        : `Letter ${letterToSpeak}`;
      
      // Use SpeechHelper with callbacks
      await SpeechHelper.speak(textToSpeak, {
        onDone: () => {
          setIsPlaying(false);
          setAudioType(null);
        },
        onError: () => {
          setIsPlaying(false);
          setAudioType(null);
        }
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
      setAudioType(null);
    }
  };

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      {/* Header with Back Button and Profile */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>English Alphabet</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image 
            source={require("../../../assets/items/profile.jpg")} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>
      
      {/* Letter Title */}
      <Text style={styles.letterTitle}>A</Text>
      
      {/* Capital Letter Section */}
      <View style={styles.letterSection}>
        <View style={styles.letterBox}>
          <Text style={styles.letterText}>{uppercase}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Capital "{uppercase}"</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={() => playAudio("uppercase")}
            disabled={isPlaying}
          >
            <Ionicons 
              name={isPlaying && audioType === "uppercase" ? "volume-mute" : "volume-high"} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Lowercase Letter Section */}
      <View style={styles.letterSection}>
        <View style={styles.letterBox}>
          <Text style={styles.letterText}>{lowercase}</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>Simple "{lowercase}"</Text>
          <TouchableOpacity 
            style={styles.audioButton}
            onPress={() => playAudio("lowercase")}
            disabled={isPlaying}
          >
            <Ionicons 
              name={isPlaying && audioType === "lowercase" ? "volume-mute" : "volume-high"} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Continue Button */}
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => {
          // Navigate to the Words Starting with A Screen
          navigation.navigate("WordsStartingWithAScreen_temp");
        }}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileButton: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  letterTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },
  letterSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  letterBox: {
    width: 120,
    height: 120,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  letterText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#333",
  },
  descriptionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
  },
  descriptionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 15,
  },
  audioButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  continueButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
    marginTop: 40,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  continueText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  }
});