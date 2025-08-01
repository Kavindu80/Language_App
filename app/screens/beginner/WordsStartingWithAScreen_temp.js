import React, { useEffect, useState, useRef, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  ScrollView,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  BackHandler,
  ToastAndroid
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import SpeechHelper from '../../helpers/SpeechHelper';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

export default function WordsStartingWithAScreen_temp() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(width)).current;
  const [selectedWord, setSelectedWord] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Use refs to prevent unnecessary re-renders
  const isPlayingRef = useRef(false);
  const selectedWordRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // Words starting with A - defined outside component body to prevent re-creation
  const aWords = [
    {
      word: "Apple",
      image: require("../../../assets/items/apple.png")
    },
    {
      word: "Ant",
      image: require("../../../assets/items/ant.png")
    },
    {
      word: "Axe",
      image: require("../../../assets/items/axe.png")
    },
    {
      word: "Arrow",
      image: require("../../../assets/items/arrow.png")
    },
    {
      word: "Airplane",
      image: require("../../../assets/items/airplane.png")
    }
  ];
  
  // Animation function memoized to prevent recreation on re-renders
  const startAnimations = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);
  
  useEffect(() => {
    // Start animations when screen is focused
    if (isFocused) {
      startAnimations();
    }
    
    // Handle back button press - prevent navigation during audio playback
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isPlayingRef.current) {
        if (Platform.OS === 'android') {
          ToastAndroid.show('Please wait until audio finishes playing', ToastAndroid.SHORT);
        }
        return true; // Prevent default behavior
      }
      return false; // Allow default back behavior
    });
    
    // Clean up resources when component unmounts or loses focus
    return () => {
      SpeechHelper.stop();
      backHandler.remove();
      setIsPlayingAudio(false);
      setSelectedWord(null);
      isPlayingRef.current = false;
      selectedWordRef.current = null;
    };
  }, [isFocused, startAnimations]);

  // Function to play audio for the word - memoized to prevent recreation on re-renders
  const playAudio = useCallback(async (word) => {
    // Prevent function execution if audio is already playing
    if (isPlayingRef.current) return;
    
    try {
      // Set states before starting audio
      isPlayingRef.current = true;
      selectedWordRef.current = word;
      setIsPlayingAudio(true);
      setSelectedWord(word);
      
      // Use SpeechHelper to speak the word with slightly enhanced settings for clarity
      await SpeechHelper.speakWord(word, {
        rate: 0.7,  // Slightly slower for clearer word pronunciation
        pitch: 1.0,
        onStart: () => {
          // Ensure states are set correctly when audio starts
          isPlayingRef.current = true;
          selectedWordRef.current = word;
        },
        onDone: () => {
          // After speaking is done, reset the states with a slight delay for better UX
          setTimeout(() => {
            isPlayingRef.current = false;
            selectedWordRef.current = null;
            setIsPlayingAudio(false);
            setSelectedWord(null);
          }, 300);
        },
        onStopped: () => {
          // Handle the case when speech is stopped manually
          isPlayingRef.current = false;
          selectedWordRef.current = null;
          setIsPlayingAudio(false);
          setSelectedWord(null);
        },
        onError: () => {
          // Handle errors by resetting state
          isPlayingRef.current = false;
          selectedWordRef.current = null;
          setIsPlayingAudio(false);
          setSelectedWord(null);
          if (Platform.OS === 'android') {
            ToastAndroid.show('Error playing audio', ToastAndroid.SHORT);
          }
        }
      });
    } catch (error) {
      console.error('Failed to play audio:', error);
      // Ensure states are reset in case of error
      isPlayingRef.current = false;
      selectedWordRef.current = null;
      setIsPlayingAudio(false);
      setSelectedWord(null);
    }
  }, []);

  // Render function for the sound button - memoized to prevent recreating on re-renders
  const renderSoundButton = useCallback((item) => {
    const isCurrentWordPlaying = selectedWord === item.word && isPlayingAudio;
    
    return (
      <TouchableOpacity 
        style={[
          styles.audioButton,
          isCurrentWordPlaying && styles.audioButtonActive
        ]}
        onPress={() => playAudio(item.word)}
        disabled={isPlayingAudio && !isCurrentWordPlaying}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isCurrentWordPlaying ? ['#0056b3', '#007AFF'] : ['#007AFF', '#0056b3']}
          style={styles.audioButtonGradient}
        >
          <Ionicons 
            name={isCurrentWordPlaying ? "volume-mute" : "volume-high"} 
            size={isSmallDevice ? 24 : 28} 
            color="#fff" 
          />
        </LinearGradient>
      </TouchableOpacity>
    );
  }, [selectedWord, isPlayingAudio, playAudio]);

  // Handler for navigation - memoized to prevent recreation on re-renders
  const handleNavigation = useCallback((screenName, params = {}) => {
    if (isPlayingRef.current) {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Please wait until audio finishes playing', ToastAndroid.SHORT);
      }
      return;
    }
    navigation.navigate(screenName, params);
  }, [navigation]);

  // Memoized render for word items to prevent re-rendering all items
  const renderWordItem = useCallback((item, index) => {
    return (
      <Animated.View 
        key={index} 
        style={[
          styles.wordItem,
          {
            opacity: fadeAnim,
            transform: [{ 
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width]
              })
            }]
          }
        ]}
      >
        <LinearGradient
          colors={['#FFFFFF', '#F0F8FF']}
          style={styles.imageContainer}
        >
          <Image source={item.image} style={styles.wordImage} />
        </LinearGradient>
        <View style={styles.wordDetails}>
          <Text style={styles.wordText}>{item.word}</Text>
          {renderSoundButton(item)}
        </View>
      </Animated.View>
    );
  }, [fadeAnim, slideAnim, renderSoundButton]);

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => handleNavigation('AlphabetScreen')}
          activeOpacity={0.7}
          disabled={isPlayingAudio}
        >
          <Ionicons name="arrow-back" size={isSmallDevice ? 24 : 30} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>English Alphabet</Text>
        
        <TouchableOpacity 
          style={styles.profileButton} 
          activeOpacity={0.7}
          onPress={() => handleNavigation("Profile")}
          disabled={isPlayingAudio}
        >
          <Image 
            source={require("../../../assets/items/profile.jpg")} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </Animated.View>
      
      <Animated.Text 
        style={[
          styles.sectionTitle,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0]
            })}]
          }
        ]}
      >
        Words Starting With A
      </Animated.Text>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.wordList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wordListContent}
        scrollEnabled={!isPlayingAudio}
        removeClippedSubviews={true}
      >
        {aWords.map(renderWordItem)}
      </ScrollView>
      
      <Animated.View
        style={[
          styles.continueButtonContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            })}]
          }
        ]}
      >
        <TouchableOpacity 
          style={[
            styles.continueButton,
            isPlayingAudio && styles.disabledButton
          ]}
          onPress={() => handleNavigation('WordPuzzleScreen', {
            word: aWords[0].word.toUpperCase(),
            image: aWords[0].image,
          })}
          activeOpacity={0.7}
          disabled={isPlayingAudio}
        >
          <LinearGradient
            colors={['#007AFF', '#0056b3']}
            style={styles.continueButtonGradient}
          >
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={isSmallDevice ? 20 : 24} color="#fff" style={styles.continueIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

// Move styles outside component to prevent recreation on re-renders
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: isSmallDevice ? 15 : 20,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 20 : 30,
    paddingTop: 10,
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
  headerTitle: {
    fontSize: isSmallDevice ? 22 : isLargeDevice ? 32 : 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  profileButton: {
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
  sectionTitle: {
    fontSize: isSmallDevice ? 20 : isLargeDevice ? 28 : 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: isSmallDevice ? 20 : 25,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  wordList: {
    flex: 1,
  },
  wordListContent: {
    paddingBottom: 20,
  },
  wordItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: isSmallDevice ? 12 : 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: isSmallDevice ? 12 : 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  imageContainer: {
    width: isSmallDevice ? 80 : 100,
    height: isSmallDevice ? 80 : 100,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: isSmallDevice ? 12 : 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  wordImage: {
    width: isSmallDevice ? 60 : 80,
    height: isSmallDevice ? 60 : 80,
    resizeMode: "contain",
  },
  wordDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
  wordText: {
    fontSize: isSmallDevice ? 18 : isLargeDevice ? 26 : 22,
    fontWeight: "bold",
    color: "#333",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  audioButton: {
    width: isSmallDevice ? 40 : 50,
    height: isSmallDevice ? 40 : 50,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  audioButtonActive: {
    transform: [{ scale: 1.1 }],
  },
  audioButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  continueButton: {
    width: isSmallDevice ? "70%" : "80%",
    height: isSmallDevice ? 50 : 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: isSmallDevice ? 16 : 18,
    textAlign: "center",
    marginRight: 10,
  },
  continueIcon: {
    marginLeft: 5,
  }
});