import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Dimensions, 
  StatusBar,
  Platform,
  Animated
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

const Home4 = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Animation effect when screen loads
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
    ]).start();
  }, []);

  const options = [
    { 
      id: 1,
      label: "News/article/blog", 
      icon: "newspaper-outline", 
      color: "#FF5722",
      iconType: "ionicon"
    },
    { 
      id: 2,
      label: "YouTube", 
      icon: "logo-youtube", 
      color: "#FF0000",
      iconType: "ionicon"
    },
    { 
      id: 3,
      label: "TV", 
      icon: "tv-outline", 
      color: "#607D8B",
      iconType: "ionicon"
    },
    { 
      id: 4,
      label: "Friends/family", 
      icon: "people-outline", 
      color: "#8BC34A",
      iconType: "ionicon"
    },
    { 
      id: 5,
      label: "TikTok", 
      icon: "logo-tiktok", 
      color: "#000000",
      iconType: "ionicon"
    },
    { 
      id: 6,
      label: "Google Search", 
      icon: "search-outline", 
      color: "#4285F4",
      iconType: "ionicon"
    },
    { 
      id: 7,
      label: "App store", 
      icon: "apps-outline", 
      color: "#2196F3",
      iconType: "ionicon"
    },
    { 
      id: 8,
      label: "Facebook/Instagram", 
      icon: "logo-facebook", 
      color: "#3b5998",
      iconType: "ionicon"
    },
    { 
      id: 9,
      label: "Other", 
      icon: "ellipsis-horizontal", 
      color: "#9E9E9E",
      iconType: "ionicon"
    },
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleContinue = () => {
    if (selectedOption) {
      console.log("Selected Option:", selectedOption);
      navigation.navigate("LanguageSelectionScreen");
    } else {
      // Using more subtle visual feedback instead of alert
      // Shake the continue button or highlight the options
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 5, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: -5, duration: 100, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
      ]).start();
    }
  };

  // Render each option with a nicer design
  const renderOption = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.optionContainer,
        selectedOption?.id === item.id && styles.selectedOption,
      ]}
      onPress={() => handleOptionSelect(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={selectedOption?.id === item.id ? 
          ['rgba(0, 123, 255, 0.1)', 'rgba(0, 123, 255, 0.2)'] : 
          ['#FFFFFF', '#F5F7FA']}
        style={styles.optionGradient}
      >
        <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
          <Ionicons name={item.icon} size={isSmallDevice ? 22 : 24} color={item.color} />
        </View>
        <Text style={styles.optionText}>{item.label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#4481EB", "#04BEFE"]}
        style={styles.container}
      >
        <Image 
          source={require("../../assets/8.png")} 
          style={styles.backgroundImage} 
          resizeMode="cover"
        />

        {/* Header with profile icon and back button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={isSmallDevice ? 24 : 28} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.profileContainer}>
            <Image 
              source={require("../../assets/items/profile.jpg")} 
              style={styles.profileImage} 
            />
          </View>
        </View>

        {/* Main content */}
        <Animated.View 
          style={[
            styles.contentContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.title}>How did you hear about us?</Text>
          
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.optionsList}
          >
            {options.map(renderOption)}
          </ScrollView>
          
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={handleContinue}
            activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
    opacity: 0.1, // Subtle background image
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    marginBottom: 20,
  },
  backButton: {
    padding: isSmallDevice ? 8 : 10,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileImage: {
    width: isSmallDevice ? 40 : 44,
    height: isSmallDevice ? 40 : 44,
    borderRadius: 22,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: isSmallDevice ? 15 : 20,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  optionsList: {
    flexGrow: 0,
    paddingBottom: 20,
  },
  optionContainer: {
    borderRadius: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
  },
  optionGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: isSmallDevice ? 12 : 16,
    borderRadius: 16,
  },
  selectedOption: {
    transform: [{ scale: 1.02 }],
    borderWidth: 1,
    borderColor: "rgba(0, 123, 255, 0.3)",
  },
  iconContainer: {
    width: isSmallDevice ? 42 : 48,
    height: isSmallDevice ? 42 : 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionText: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  continueButton: {
    width: "90%",
    height: isSmallDevice ? 50 : 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignSelf: 'center',
    marginTop: isSmallDevice ? 15 : 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  continueButtonText: {
    color: "#0072ff",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
    textAlign: "center",
  },
  continueIcon: {
    marginLeft: 8,
  }
});

export default Home4;
