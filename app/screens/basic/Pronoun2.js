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
  Easing
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { Path, Defs, RadialGradient, Stop } from "react-native-svg";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function Pronoun2() {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(0));
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [selectedPronoun, setSelectedPronoun] = useState(null);

  useEffect(() => {
    // Animate in the elements when component mounts
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Start floating animation
    startFloatingAnimation();
    
    // Start rotation animation for the center circle
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 15000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Start floating animation
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

  // Function to position elements in a circular pattern
  const getCircularPosition = (index, total, radius) => {
    const angle = (index / total) * 2 * Math.PI;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  };

  // Object Pronouns Data
  const pronouns = [
    { text: 'Me' },
    { text: 'Us' },
    { text: 'You' },
    { text: 'Them' },
    { text: 'Him' },
    { text: 'Her' },
    { text: 'It' }
  ];

  // Enhanced Cloud SVG component
  const CloudShape = () => (
    <Svg height="100%" width="100%" viewBox="0 0 100 70">
      <Defs>
        <RadialGradient
          id="grad"
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <Stop offset="0%" stopColor="#8fe0ff" stopOpacity="1" />
          <Stop offset="100%" stopColor="#30d4ff" stopOpacity="1" />
        </RadialGradient>
      </Defs>
      <Path
        d="M85,40c0,13.8-11.2,25-25,25H25C11.2,65,0,53.8,0,40c0-13.8,11.2-20,25-20c1.7,0,3.4,0.2,5,0.5C34.1,10.5,43.7,5,55,5c16.6,0,30,12.5,30,27.5C85,35.2,85,37.6,85,40z"
        fill="url(#grad)"
        stroke="rgba(255, 255, 255, 0.8)"
        strokeWidth="1"
      />
    </Svg>
  );

  const handlePronounPress = (pronoun) => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedPronoun(pronoun.text);
  };

  // Rotation interpolation
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      {/* Header */}
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back-circle" size={38} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pronouns</Text>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={require("../../../assets/items/profile.jpg")} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        {/* Info Card - Shows selected pronoun or instruction */}
        <Animated.View
          style={[
            styles.infoCard,
            {
              opacity: animation,
              transform: [{ 
                translateY: animation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }]
            }
          ]}
        >
          <LinearGradient
            colors={['#50c2ff', '#4095ff']}
            style={styles.cardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
          <Text style={styles.infoTitle}>
            {selectedPronoun ? `Selected: ${selectedPronoun}` : "Object Pronouns"}
          </Text>
          <Text style={styles.infoText}>
            {selectedPronoun 
              ? `"${selectedPronoun}" is an object pronoun used after verbs or prepositions. → I called ${selectedPronoun.toLowerCase()} yesterday.` 
              : "Object pronouns come after verbs or prepositions. They tell who receives the action. Tap a pronoun to learn more."}
          </Text>
          </LinearGradient>
        </Animated.View>

        {/* Pronouns Section */}
        <View style={styles.pronounsContainer}>
          {/* Center object circle with animation */}
          <Animated.View 
            style={[
              styles.objectCircle,
              {
                opacity: animation,
                transform: [
                  { scale: animation.interpolate({ 
                      inputRange: [0, 1], 
                      outputRange: [0.5, 1] 
                    }) 
                  },
                  { rotate: spin }
                ]
              }
            ]}
          >
            <LinearGradient 
              colors={['#FFB347', '#FF8C42']} 
              style={styles.objectGradient}
            >
              <Text style={styles.objectText}>Object</Text>
            </LinearGradient>
          </Animated.View>

          {/* Pronouns Clouds in Circular Layout */}
          {pronouns.map((pronoun, index) => {
            const position = getCircularPosition(index, pronouns.length, Math.min(width, height) * 0.36);
            
            // Individual float animation offset
            const individualFloat = floatAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, index % 2 === 0 ? -8 : -12]
            });

            return (
              <Animated.View
                key={pronoun.text}
                style={[
                  styles.cloudContainer,
                  {
                    left: '50%',
                    top: '50%',
                    marginLeft: position.x - 55,
                    marginTop: position.y - 40,
                    opacity: animation,
                    transform: [
                      { scale: animation },
                      { translateY: individualFloat }
                    ]
                  }
                ]}
              >
                <TouchableOpacity 
                  style={[
                    styles.cloudButton,
                    selectedPronoun === pronoun.text && styles.selectedCloud
                  ]}
                  onPress={() => handlePronounPress(pronoun)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cloudContent}>
                    <CloudShape />
                    <Text style={[
                      styles.pronounText,
                      selectedPronoun === pronoun.text && styles.selectedPronounText
                    ]}>
                      {pronoun.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        {/* Continue Button */}
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
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.navigate("TensesScreen");
            }}
          >
            <View style={styles.continueButtonContent}>
              <Text style={styles.continueText}>Continue</Text>
              <MaterialIcons name="navigate-next" size={24} color="#0072ff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  infoCard: {
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 18,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  infoText: {
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  pronounsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  objectCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
    zIndex: 2,
  },
  objectGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  objectText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cloudContainer: {
    position: 'absolute',
    width: 110,
    height: 80,
    zIndex: 1,
  },
  cloudButton: {
    width: '100%',
    height: '100%',
  },
  cloudContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pronounText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    position: 'absolute',
    zIndex: 3,
  },
  selectedCloud: {
    transform: [{scale: 1.1}],
  },
  selectedPronounText: {
    color: '#0024cb',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  continueButton: {
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    overflow: "hidden",
    marginTop: 15,
    backgroundColor: "#fff",
  },
  continueButtonContent: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },
  continueText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 0.5,
    marginRight: 5,
  },
});

