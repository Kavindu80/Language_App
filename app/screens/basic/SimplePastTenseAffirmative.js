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
  Alert,
  StatusBar,
  Platform
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function SimplePastTenseAffirmative() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedPronoun, setSelectedPronoun] = useState(null);
  const [animation] = useState(new Animated.Value(0));

  // Animation references
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef({
    singular: new Animated.Value(1),
    plural: new Animated.Value(1),
  }).current;
  
  // Start floating animation for character
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

  // Bounce animation for rules
  const animateBounce = (type) => {
    Animated.sequence([
      Animated.timing(scaleAnims[type], {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnims[type], {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    // Animate in the elements when component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Start floating animation for character
    startFloatingAnimation();
  }, []);

  // Subject pronouns
  const subjectPronouns = {
    plural: ["I", "We", "You", "They"],
    singular: ["He", "She", "It"]
  };

  const handlePronounSelection = (pronoun, type) => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Animate rule
    animateBounce(type);
    
    // Update selected pronoun
    setSelectedPronoun(pronoun);
  };

  // Example sentences for each pronoun with past tense
  const examples = {
    "I": "I played soccer last weekend.",
    "We": "We studied English yesterday.",
    "You": "You drank water after exercise.",
    "They": "They visited their grandparents last week.",
    "He": "He watched TV last evening.",
    "She": "She taught math at school.",
    "It": "It rained a lot last spring."
  };

  const handleContinue = () => {
    // Provide haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Navigate to the first puzzle screen
    navigation.navigate('SimplePastPuzzle1');
  };

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Back Button and Title */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Simple Past Tense</Text>
          
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require("../../../assets/items/profile.jpg")} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>

        {/* Affirmative Title */}
        <Animated.View 
          style={[
            styles.affirmativeContainer,
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
          <View style={styles.affirmativeButton}>
            <Text style={styles.affirmativeText}>Affirmative (+)</Text>
          </View>
        </Animated.View>

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* First Rule - Plural Pronouns */}
          <Animated.View 
            style={[
              styles.ruleSection,
              {
                opacity: animation,
                transform: [
                  { 
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0]
                    })
                  },
                  { scale: scaleAnims.plural }
                ]
              }
            ]}
          >
            <View style={styles.pronounsContainer}>
              {subjectPronouns.plural.map((pronoun, index) => (
                <TouchableOpacity
                  key={pronoun}
                  style={[
                    styles.pronounButton,
                    selectedPronoun === pronoun && styles.selectedPronoun
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handlePronounSelection(pronoun, 'plural')}
                >
                  <Text style={[
                    styles.pronounText,
                    selectedPronoun === pronoun && styles.selectedPronounText
                  ]}>
                    {pronoun}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.arrowContainer}>
              {subjectPronouns.plural.map((pronoun, index) => (
                <View key={`arrow-${pronoun}`} style={styles.arrow}>
                  <View style={styles.arrowLine} />
                  <View style={styles.arrowHead} />
                </View>
              ))}
            </View>

            <View style={styles.formulaContainer}>
              <View style={styles.formulaCard}>
                <Text style={styles.formulaText}>+ Verb (ed/irregular) + O</Text>
              </View>
            </View>
          </Animated.View>

          {/* Second Rule - Singular Pronouns */}
          <Animated.View 
            style={[
              styles.ruleSection,
              {
                opacity: animation,
                transform: [
                  { 
                    translateY: animation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })
                  },
                  { scale: scaleAnims.singular }
                ]
              }
            ]}
          >
            <View style={styles.pronounsContainer}>
              {subjectPronouns.singular.map((pronoun, index) => (
                <TouchableOpacity
                  key={pronoun}
                  style={[
                    styles.pronounButton,
                    selectedPronoun === pronoun && styles.selectedPronoun,
                    pronoun === "It" && styles.highlightedPronoun
                  ]}
                  activeOpacity={0.7}
                  onPress={() => handlePronounSelection(pronoun, 'singular')}
                >
                  <Text style={[
                    styles.pronounText,
                    selectedPronoun === pronoun && styles.selectedPronounText,
                    pronoun === "It" && styles.highlightedPronounText
                  ]}>
                    {pronoun}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.arrowContainer}>
              {subjectPronouns.singular.map((pronoun, index) => (
                <View key={`arrow-${pronoun}`} style={styles.arrow}>
                  <View style={styles.arrowLine} />
                  <View style={styles.arrowHead} />
                </View>
              ))}
            </View>

            <View style={styles.formulaContainer}>
              <View style={styles.formulaCard}>
                <Text style={styles.formulaText}>+ Verb (ed/irregular) + O</Text>
              </View>
            </View>
          </Animated.View>

          {/* Example Section */}
          {selectedPronoun && (
            <Animated.View 
              style={[
                styles.exampleContainer,
                {
                  opacity: animation,
                  transform: [
                    { 
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              <View style={styles.exampleCard}>
                <Text style={styles.exampleTitle}>Example:</Text>
                <Text style={styles.exampleText}>{examples[selectedPronoun]}</Text>
                <Image 
                  source={require("../../../assets/items/panda.png")} 
                  style={styles.exampleImage} 
                  resizeMode="contain"
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <View style={styles.continueButtonContent}>
              <Text style={styles.continueButtonText}>Continue</Text>
            </View>
          </TouchableOpacity>
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
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  affirmativeContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  affirmativeButton: {
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  affirmativeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072ff",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  ruleSection: {
    marginBottom: 24,
  },
  pronounsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  pronounButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: width * 0.18,
    alignItems: "center",
  },
  selectedPronoun: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#0072ff",
    shadowColor: "#0072ff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  highlightedPronoun: {
    backgroundColor: "#ff1493",
  },
  pronounText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  selectedPronounText: {
    color: "#0072ff",
  },
  highlightedPronounText: {
    color: "#fff",
  },
  arrowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 8,
  },
  arrow: {
    alignItems: "center",
    width: width * 0.18,
  },
  arrowLine: {
    height: 20,
    width: 2,
    backgroundColor: "#fff",
  },
  arrowHead: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#fff",
    transform: [{ rotate: "180deg" }],
  },
  formulaContainer: {
    alignItems: "center",
  },
  formulaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formulaText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0072ff",
  },
  exampleContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  exampleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0072ff",
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 16,
    color: "#333",
    fontStyle: "italic",
    paddingRight: 80,
  },
  exampleImage: {
    position: "absolute",
    right: 10,
    bottom: 10,
    width: 70,
    height: 70,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  continueButtonText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: 18,
  },
}); 