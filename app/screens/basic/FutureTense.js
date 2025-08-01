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

export default function FutureTense() {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(0));
  
  // Animation references
  const floatAnim = useRef(new Animated.Value(0)).current;
  const wiggleAnim = useRef(new Animated.Value(0)).current;
  
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

  // Start wiggle animation for character
  const startWiggleAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(wiggleAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(wiggleAnim, {
          toValue: -1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true
        }),
        Animated.timing(wiggleAnim, {
          toValue: 0,
          duration: 800,
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
    
    // Start floating and wiggle animations
    startFloatingAnimation();
    startWiggleAnimation();
  }, []);

  // Formula cards data - simplified for children
  const formulaCards = [
    {
      type: "1. Positive Sentence",
      formula: "Will + verb",
      example: "I will play tomorrow.",
      color: "#83CAFF",
      textColor: "#333",
      icon: "sunny-outline"
    },
    {
      type: "2. Question Sentence",
      formula: "Will + subject + verb?",
      example: "Will you visit next week?",
      color: "#FFD966",
      textColor: "#333",
      icon: "help-circle-outline"
    },
    {
      type: "3. Negative Sentence",
      formula: "Will not (won't) + verb",
      example: "They won't go to the park.",
      color: "#FFB570",
      textColor: "#333",
      icon: "close-circle-outline"
    },
    {
      type: "Using \"Going to\"",
      formula: "Am / is / are + going to + verb",
      example: "We are going to travel.",
      color: "#B4F8C8",
      textColor: "#333",
      icon: "airplane-outline"
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
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.goBack();
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Future Tense</Text>
          
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <View style={styles.profileCircle}>
              <Image 
                source={require("../../../assets/items/profile.jpg")} 
                style={styles.profileImage} 
              />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Main Content - Wrapped in ScrollView */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Content wrapper with proper spacing */}
          <View style={styles.contentWrapper}>
            {/* Character and Explanation Card - Owl on RIGHT, Explanation on LEFT */}
            <View style={styles.characterExplanationContainer}>
              {/* Explanation Bubble on LEFT */}
              <Animated.View 
                style={[
                  styles.explanationCardContainer,
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
                <View style={styles.explanationBubble}>
                  <Text style={styles.explanationTitle}>Future Tense</Text>
                  <Text style={styles.explanationText}>
                    The <Text style={styles.highlightText}>future tense</Text> is used for things that 
                    <Text style={styles.highlightText}> will happen later</Text>.
                  </Text>
                  <Text style={styles.explanationExamples}>
                    We use <Text style={styles.highlightText}>"will"</Text> or <Text style={styles.highlightText}>"going to"</Text> with a verb.
                  </Text>
                </View>
                
                {/* Pointer pointing RIGHT toward the owl */}
                <View style={styles.bubblePointer} />
              </Animated.View>
              
              {/* Character positioned on the RIGHT */}
              <Animated.View 
                style={[
                  styles.characterContainer,
                  {
                    opacity: animation,
                    transform: [
                      { 
                        translateY: floatAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10]
                        })
                      },
                      {
                        rotate: wiggleAnim.interpolate({
                          inputRange: [-1, 0, 1],
                          outputRange: ['-5deg', '0deg', '5deg']
                        })
                      }
                    ]
                  }
                ]}
              >
                <Image 
                  source={require("../../../assets/items/owl.png")} 
                  style={styles.characterImage} 
                  resizeMode="contain"
                />
              </Animated.View>
            </View>
            
            {/* Formula Cards Section */}
            <View style={styles.formulaCardsSection}>
              <Text style={styles.sectionTitle}>Formulas</Text>
              
              <View style={styles.cardsContainer}>
                {formulaCards.map((card, index) => (
                  <Animated.View
                    key={card.type}
                    style={[
                      styles.formulaCardWrapper,
                      {
                        opacity: animation,
                        transform: [
                          { 
                            translateY: animation.interpolate({
                              inputRange: [0, 1],
                              outputRange: [30 * (index + 1), 0]
                            })
                          }
                        ]
                      }
                    ]}
                  >
                    <View style={styles.formulaCard}>
                      <View style={styles.cardHeader}>
                        <Ionicons name={card.icon} size={20} color="#0072ff" style={styles.cardIcon} />
                        <Text style={styles.cardType}>{card.type}</Text>
                      </View>
                      
                      <View style={styles.cardContent}>
                        <Text style={styles.formulaText}>{card.formula}</Text>
                        <Text style={styles.exampleText}>{card.example}</Text>
                      </View>
                    </View>
                  </Animated.View>
                ))}
              </View>
            </View>
            
            {/* Examples Section */}
            <View style={styles.examplesSection}>
              <Text style={styles.sectionTitle}>Remember</Text>
              
              <View style={styles.examplesCard}>
                <View style={styles.exampleItem}>
                  <Text style={styles.exampleSentence}>
                    Use <Text style={styles.boldText}>"will"</Text> for promises, predictions, and decisions made now.
                  </Text>
                  <Text style={styles.exampleText}>
                    Example: I think it will rain.
                  </Text>
                </View>
                
                <View style={styles.exampleDivider} />
                
                <View style={styles.exampleItem}>
                  <Text style={styles.exampleSentence}>
                    Use <Text style={styles.boldText}>"going to"</Text> for plans and things already decided.
                  </Text>
                  <Text style={styles.exampleText}>
                    Example: I am going to study tonight.
                  </Text>
                </View>
              </View>
            </View>
            
            {/* Practice Button Section */}
            <View style={styles.practiceSection}>
              <Animated.View
                style={{
                  opacity: animation,
                  transform: [
                    { 
                      translateY: animation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0]
                      })
                    }
                  ]
                }}
              >
                <TouchableOpacity 
                  style={styles.practiceButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    navigation.navigate("FutureTensePuzzleScreen1");
                  }}
                >
                  <View style={styles.practiceButtonContent}>
                    <Text style={styles.practiceButtonText}>Practice Now</Text>
                    <Ionicons name="arrow-forward-circle" size={24} color="#0072ff" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            </View>
            
            {/* Bottom spacing */}
            <View style={{ height: 20 }} />
          </View>
        </ScrollView>
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
    flexGrow: 1,
  },
  contentWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  characterExplanationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  explanationCardContainer: {
    width: "65%",
    position: "relative",
  },
  explanationBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bubblePointer: {
    position: "absolute",
    right: -10,
    top: "50%",
    marginTop: -10,
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderTopColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "rgba(255, 255, 255, 0.95)",
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072ff",
    marginBottom: 8,
  },
  explanationText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
  explanationExamples: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
  highlightText: {
    fontWeight: "bold",
    color: "#0072ff",
  },
  characterContainer: {
    width: "30%",
    alignItems: "center",
  },
  characterImage: {
    width: 100,
    height: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  formulaCardsSection: {
    marginBottom: 30,
  },
  cardsContainer: {
    flexDirection: "column",
    justifyContent: "center",
  },
  formulaCardWrapper: {
    marginBottom: 12,
  },
  formulaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardIcon: {
    marginRight: 8,
  },
  cardType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0072ff",
  },
  cardContent: {
    paddingLeft: 28,
  },
  formulaText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  exampleSentence: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 4,
  },
  examplesSection: {
    marginBottom: 30,
  },
  examplesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  exampleItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  boldText: {
    fontWeight: "bold",
    color: "#0072ff",
  },
  exampleDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  practiceSection: {
    alignItems: "center",
    marginTop: 10,
  },
  practiceButton: {
    width: width * 0.8,
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
  practiceButtonContent: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  practiceButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0072ff",
    marginRight: 8,
  },
});