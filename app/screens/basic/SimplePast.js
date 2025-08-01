import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  Platform
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function SimpleTense() {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(0));
  
  // Animation references
  const floatAnim = useRef(new Animated.Value(0)).current;
  
  // Start floating animation for panda
  const startFloatingAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        })
      ])
    ).start();
  };

  useEffect(() => {
    // Animate in the elements when component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Start floating animation for panda
    startFloatingAnimation();
  }, []);

  // Formula cards data - simplified for children
  const formulaCards = [
    {
      type: "1. Positive Sentence",
      formula: "I/You/We/They + verb + ed",
      example: "I walked to school.",
      color: "#8fe0ff",
      textColor: "#333"
    },
    {
      type: "2. Question Sentence",
      formula: "Did + I/you/we/they + verb (base form)?",
      example: "Did you play yesterday?",
      color: "#FFD966",
      textColor: "#333"
    },
    {
      type: "3. Negative Sentence",
      formula: "I/You/We/They + didn't + verb (base form)",
      example: "They didn't go to the park.",
      color: "#FFB570",
      textColor: "#333"
    }
  ];

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back Button and Profile */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Simple Past Tense</Text>
          
          <TouchableOpacity style={styles.profileButton}>
            <View style={styles.profileCircle}>
              <Image 
                source={require("../../../assets/items/profile.jpg")} 
                style={styles.profileImage} 
              />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Main Content - Wrapped in ScrollView for small screens */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Content wrapper with proper spacing */}
          <View style={styles.contentWrapper}>
            {/* Explanation Card */}
            <Animated.View 
              style={[
                styles.explanationCard,
                {
                  opacity: animation,
                  transform: [
                    { scale: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={styles.speechBubble}>
                <Text style={styles.explanationText}>
                  The <Text style={styles.boldItalicText}>simple past tense</Text> is used for things that happened before now.
                </Text>
                <Text style={styles.explanationExample}>
                  walk → walked • play → played
                </Text>
              </View>
              
              <View style={styles.speechPointer} />
            </Animated.View>
            
            {/* Panda positioned properly relative to the speech bubble */}
            <Animated.View 
              style={[
                styles.pandaContainer,
                {
                  opacity: animation,
                  transform: [
                    {
                      translateY: floatAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8]
                      })
                    }
                  ]
                }
              ]}
            >
              <Image
                source={require("../../../assets/items/panda.png")}
                style={styles.pandaImage}
                resizeMode="contain"
              />
            </Animated.View>
            
            {/* Formula Cards with proper spacing */}
            <View style={styles.formulaContainer}>
              {formulaCards.map((card, index) => (
                <Animated.View 
                  key={card.type}
                  style={[
                    styles.formulaCardContainer,
                    {
                      opacity: animation,
                      transform: [
                        { 
                          translateY: animation.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20 * (index + 1), 0]
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <View style={styles.formulaCard}>
                    <View style={styles.formulaLabelContainer}>
                      <Text style={styles.formulaLabel}>{card.type}</Text>
                    </View>
                    <Text style={styles.formulaText}>{card.formula}</Text>
                    <Text style={styles.exampleText}>{card.example}</Text>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        </ScrollView>
        
        {/* Continue Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <Animated.View 
            style={{
              opacity: animation,
              width: '100%',
              transform: [{ 
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }]
            }}
          >
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {
                // Provide haptic feedback
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                
                // Navigate to SimplePastTenseAffirmative screen
                navigation.navigate("SimplePastTenseAffirmative");
              }}
            >
              <View style={styles.continueButtonContent}>
                <Text style={styles.continueText}>Continue</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileButton: {
    padding: 4,
  },
  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 80,
  },
  contentWrapper: {
    flex: 1,
  },
  explanationCard: {
    marginBottom: 20,
    alignItems: "center",
    position: "relative",
  },
  speechBubble: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  explanationText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  boldItalicText: {
    fontWeight: "bold",
    fontStyle: "italic",
    color: "#0072ff",
  },
  boldText: {
    fontWeight: "bold",
    color: "#0072ff",
  },
  explanationExample: {
    fontSize: 16,
    color: "#0072ff",
    textAlign: "center",
    fontWeight: "bold",
  },
  speechPointer: {
    position: "absolute",
    bottom: -10,
    width: 20,
    height: 20,
    backgroundColor: "#fff",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  pandaContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 30,
  },
  pandaImage: {
    width: 100,
    height: 100,
  },
  formulaContainer: {
    width: "100%",
    gap: 16,
  },
  formulaCardContainer: {
    marginBottom: 16,
  },
  formulaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formulaLabelContainer: {
    marginBottom: 8,
  },
  formulaLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072ff",
  },
  formulaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "rgba(0, 114, 255, 0.1)",
  },
  continueButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: "hidden",
  },
  continueButtonContent: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  continueText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: 18,
  },
});