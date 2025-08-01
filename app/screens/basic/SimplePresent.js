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
  StatusBar,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function SimplePresent() {
  const navigation = useNavigation();
  const route = useRoute();
  const [animation] = useState(new Animated.Value(0));
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

  // Rules for Simple Present Tense
  const simplePresentRules = [
    {
      rule: "S + V(s/es) + O.",
      example: "She reads books.",
      colors: ["#ffb6c1", "#ff69b4"]
    },
    {
      rule: "S + don't/doesn't + V (base form) + O.",
      example: "He doesn't play soccer.",
      colors: ["#b0e57c", "#56ab2f"]
    },
    {
      rule: "Do/does + S + V(base form) + O?",
      example: "Do you like pizza?",
      colors: ["#8fe0ff", "#38b6ff"]
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
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Simple Present Tense</Text>
          
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require("../../../assets/items/profile.jpg")} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
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
            <Text style={styles.explanationTitle}>
              The <Text style={styles.highlightText}>"simple present tense"</Text> is used for things that happen every day, are true, or do not change.
            </Text>
            <View style={styles.cardPandaContainer}>
              <Image 
                source={require("../../../assets/items/panda.png")} 
                style={styles.cardPandaImage} 
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          
          {/* Rules Section - Now Static */}
          <View style={styles.rulesSectionTitle}>
            <Text style={styles.rulesTitle}>Formulas</Text>
          </View>
          
          <View style={styles.rulesContainer}>
            {simplePresentRules.map((rule, index) => (
              <Animated.View 
                key={rule.rule}
                style={{
                  opacity: animation,
                  transform: [
                    { 
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30 * (index + 1), 0]
                      })
                    }
                  ]
                }}
              >
                <View style={styles.ruleCard}>
                  <View style={styles.ruleContent}>
                    {index === 0 && <Text style={styles.ruleTypeText}>1. Positive Sentence</Text>}
                    {index === 1 && <Text style={styles.ruleTypeText}>2. Negative Sentence</Text>}
                    {index === 2 && <Text style={styles.ruleTypeText}>3. Question Sentence</Text>}
                    <Text style={styles.ruleText}>{rule.rule}</Text>
                    <Text style={styles.exampleText}>Example: {rule.example}</Text>
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>
        </View>
        
        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <Animated.View 
            style={{
              opacity: animation,
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
                
                // Navigate to puzzle screen
                navigation.navigate("SimplePresentPuzzle");
              }}
            >
              <View style={styles.continueButtonContent}>
                <Text style={styles.continueText}>Continue</Text>
                <Ionicons name="arrow-forward" size={22} color="#0072ff" style={styles.continueIcon} />
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 10,
    paddingVertical: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileButton: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  explanationCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  explanationTitle: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
    paddingRight: 80,
  },
  highlightText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontStyle: "italic",
  },
  cardPandaContainer: {
    position: "absolute",
    right: 10,
    bottom: 0,
    width: 80,
    height: 80,
  },
  cardPandaImage: {
    width: "100%",
    height: "100%",
  },
  rulesSectionTitle: {
    marginBottom: 16,
  },
  rulesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  rulesContainer: {
    marginBottom: 20,
  },
  ruleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  ruleContent: {
    padding: 16,
  },
  ruleText: {
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
  ruleTypeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  buttonContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
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
    marginRight: 8,
  },
  continueIcon: {
    marginLeft: 5,
  },
});