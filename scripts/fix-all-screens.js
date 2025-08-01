// Automated script to fix all remaining letter screens
// This script will fix screen refresh issues and navigation problems
// for all remaining letter screens (D-F, H-M, O-Z)

const fs = require('fs');
const path = require('path');

// Letters that need to be fixed
const lettersToFix = [
  'D', 'E', 'F', 'H', 'I', 'J', 'K', 'L', 'M',
  'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Base directory for the screens
const baseDir = path.join(__dirname, '../app/screens/beginner');

// Log the process
console.log('Starting to fix remaining letter screens...');

// Track results
const results = {
  processed: [],
  skipped: [],
  errors: []
};

// Manually extract words array items from file content using a regex approach
function extractWordsArray(fileContent, letterLower) {
  try {
    // Match for each word item in the array, pattern like: { word: "Word", image: require(...) }
    const wordItemsPattern = /{\s*word:\s*["']([^"']+)["'],\s*image:\s*require\(["']([^"']+)["']\)\s*}/g;
    const matches = [...fileContent.matchAll(wordItemsPattern)];
    
    if (matches.length === 0) {
      return null;
    }
    
    // Convert matches to a proper array of objects
    const wordsArray = matches.map(match => {
      return {
        word: match[1],
        image: `require("${match[2]}")`
      };
    });
    
    return wordsArray;
  } catch (error) {
    console.error(`Error extracting words array for ${letterLower}:`, error);
    return null;
  }
}

// Function to generate the fixed code for a letter
function generateFixedCode(letter, words) {
  // Create the words array string representation
  const wordsArrayString = words.map(item => {
    return `  {
    word: "${item.word}",
    image: ${item.image}
  }`;
  }).join(',\n');

  const finalWordsArray = `[\n${wordsArrayString}\n]`;

  // Return the fixed code template
  return `import React, { useEffect, useState, useRef, useCallback } from "react";
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
import SpeechHelper from '../../../helpers/SpeechHelper';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isLargeDevice = width > 414;

// Words starting with ${letter} - defined outside component to prevent re-creation
const ${letter.toLowerCase()}Words = ${finalWordsArray};

export default function WordsStartingWith${letter}${letter === 'D' || letter === 'F' ? 'Screen' : 'Screen'}() {
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
            source={require("../../../../assets/items/profile.jpg")} 
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
        Words Starting With ${letter}
      </Animated.Text>
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.wordList}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.wordListContent}
        scrollEnabled={!isPlayingAudio}
        removeClippedSubviews={true}
      >
        {${letter.toLowerCase()}Words.map(renderWordItem)}
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
          onPress={() => handleNavigation('WordPuzzleScreen${letter}1', {
            word: ${letter.toLowerCase()}Words[0].word.toUpperCase(),
            image: ${letter.toLowerCase()}Words[0].image,
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
});`;
}

// Process each letter
lettersToFix.forEach(letter => {
  try {
    // Try to find the appropriate directory for the letter
    const letterDir = path.join(baseDir, letter);
    const directoryExists = fs.existsSync(letterDir);
    
    // Define potential file paths based on different naming patterns
    let filePath;
    let originalFile;
    let fileNamePattern;
    
    if (directoryExists) {
      // Check for different naming patterns
      const possibleFiles = [
        `WordsStartingWith${letter}.js`,
        `WordsStartingWith${letter}Screen.js`
      ];
      
      for (const file of possibleFiles) {
        const potentialPath = path.join(letterDir, file);
        if (fs.existsSync(potentialPath)) {
          filePath = potentialPath;
          originalFile = file;
          fileNamePattern = file;
          break;
        }
      }
    } else {
      // Try the root beginner directory
      const possibleFiles = [
        `WordsStartingWith${letter}.js`,
        `WordsStartingWith${letter}Screen.js`
      ];
      
      for (const file of possibleFiles) {
        const potentialPath = path.join(baseDir, file);
        if (fs.existsSync(potentialPath)) {
          filePath = potentialPath;
          originalFile = file;
          fileNamePattern = file;
          break;
        }
      }
    }
    
    // If no file found, skip
    if (!filePath) {
      console.log(`Could not find screen file for letter ${letter}. Skipping.`);
      results.skipped.push(letter);
      return;
    }
    
    // Read the original file to extract the words array
    const originalCode = fs.readFileSync(filePath, 'utf8');
    
    // Extract words array using our custom function
    const wordsArray = extractWordsArray(originalCode, letter.toLowerCase());
    
    // If we can't find the words array, skip
    if (!wordsArray || wordsArray.length === 0) {
      console.log(`Could not extract words array for letter ${letter}. Skipping.`);
      results.skipped.push(letter);
      return;
    }
    
    // Generate the fixed code
    const fixedCode = generateFixedCode(letter, wordsArray);
    
    // Create backup of original file
    const backupPath = `${filePath}.backup`;
    fs.writeFileSync(backupPath, originalCode);
    
    // Write the fixed code
    fs.writeFileSync(filePath, fixedCode);
    
    console.log(`✅ Fixed screen for letter ${letter}: ${filePath}`);
    results.processed.push({letter, path: filePath});
    
  } catch (error) {
    console.error(`Error processing letter ${letter}:`, error);
    results.errors.push({letter, error: error.message});
  }
});

// Print summary
console.log('\n===== Fix Summary =====');
console.log(`Total letters to fix: ${lettersToFix.length}`);
console.log(`Successfully fixed: ${results.processed.length}`);
console.log(`Skipped: ${results.skipped.length}`);
console.log(`Errors: ${results.errors.length}`);

if (results.processed.length > 0) {
  console.log('\nSuccessfully fixed screens:');
  results.processed.forEach(({letter, path}) => {
    console.log(`- ${letter}: ${path}`);
  });
}

if (results.skipped.length > 0) {
  console.log('\nSkipped screens:');
  results.skipped.forEach(letter => {
    console.log(`- ${letter}`);
  });
}

if (results.errors.length > 0) {
  console.log('\nErrors:');
  results.errors.forEach(({letter, error}) => {
    console.log(`- ${letter}: ${error}`);
  });
}

console.log('\nPlease verify each fixed file to ensure proper functionality.');
console.log('Important checks:');
console.log('1. Screen doesn\'t refresh when clicking sound buttons');
console.log('2. Audio plays correctly with visual feedback');
console.log('3. Navigation is blocked during audio playback');
console.log('4. Back button is handled properly');
console.log('5. Continue button is disabled during audio playback');

console.log('\nBackups of original files were created with .backup extension.'); 