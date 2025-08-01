# Instructions for Fixing WordsStartingWith Screens

This guide provides comprehensive fixes for the issue where clicking sound buttons in WordsStartingWith screens causes an empty blue screen.

## Root Cause of the Issue

The issue occurs because:
1. Navigation events fire unexpectedly during audio playback
2. Multiple speech events can conflict with each other
3. The state management for audio playback isn't robust enough
4. Screen transitions while audio is playing cause state conflicts

## Fix Part 1: Update SpeechHelper.js

First, enhance the SpeechHelper.js file with improved state tracking and event handling:

```javascript
import * as Speech from 'expo-speech';

/**
 * Centralized speech functionality for the entire app
 */
export const SpeechHelper = {
  // Track if speech is currently playing
  isPlaying: false,
  
  // Store current utterance ID to track active speech
  currentUtteranceId: null,
  
  /**
   * Speak text with standard options
   * @param {string} text - The text to speak
   * @param {Object} options - Optional speech configuration options
   * @returns {Promise<void>}
   */
  speak: async (text, options = {}) => {
    try {
      // Stop any ongoing speech first
      await SpeechHelper.stop();
      
      // Set playing state to true
      SpeechHelper.isPlaying = true;
      
      // Default speech options
      const defaultOptions = {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      };
      
      // Extract callback handlers
      const { onStart, onDone, onStopped, onError } = options;
      
      // Create a unique ID for this utterance
      const utteranceId = Date.now().toString();
      SpeechHelper.currentUtteranceId = utteranceId;
      
      // Merge default options with provided options (excluding callbacks)
      const speechOptions = {
        ...defaultOptions,
        ...options,
        onStart: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          if (onStart) onStart();
        },
        onDone: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onDone) onDone();
        },
        onStopped: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onStopped) onStopped();
        },
        onError: (error) => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          console.error('Speech error:', error);
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onError) onError(error);
        }
      };
      
      // Speak the text
      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('Speech error:', error);
      SpeechHelper.isPlaying = false;
      SpeechHelper.currentUtteranceId = null;
      if (options.onError) options.onError(error);
      throw error;
    }
  },
  
  /**
   * Stop any ongoing speech
   * @returns {Promise<void>}
   */
  stop: async () => {
    try {
      if (SpeechHelper.isPlaying) {
        await Speech.stop();
        SpeechHelper.isPlaying = false;
        SpeechHelper.currentUtteranceId = null;
      }
    } catch (error) {
      console.error('Stop speech error:', error);
      SpeechHelper.isPlaying = false;
      SpeechHelper.currentUtteranceId = null;
    }
  },
  
  // ... keep the rest of the methods unchanged
};

export default SpeechHelper;
```

## Fix Part 2: Update Each WordsStartingWith Screen

For each `WordsStartingWith[Letter]Screen.js` file, make the following changes:

1. **Add additional imports**:
   ```javascript
   import { 
     // ... existing imports
     BackHandler,
     ToastAndroid
   } from "react-native";
   import { useNavigation, useIsFocused } from "@react-navigation/native";
   ```

2. **Add isFocused and create navigation handler**:
   ```javascript
   const navigation = useNavigation();
   const isFocused = useIsFocused();
   
   // Handler for navigation
   const handleNavigation = (screenName, params = {}) => {
     if (isPlayingAudio) {
       if (Platform.OS === 'android') {
         ToastAndroid.show('Please wait until audio finishes playing', ToastAndroid.SHORT);
       }
       return;
     }
     navigation.navigate(screenName, params);
   };
   ```

3. **Update useEffect with better cleanup and back button handling**:
   ```javascript
   useEffect(() => {
     // Start animations when screen is focused
     if (isFocused) {
       Animated.parallel([
         // ... existing animation code
       ]).start();
     }
     
     // Handle back button press - prevent navigation during audio playback
     const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
       if (isPlayingAudio) {
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
     };
   }, [isFocused, isPlayingAudio]);
   ```

4. **Enhance playAudio function**:
   ```javascript
   const playAudio = async (word) => {
     // Prevent function execution if audio is already playing
     if (isPlayingAudio) return;
     
     try {
       // Set states before starting audio
       setIsPlayingAudio(true);
       setSelectedWord(word);
       
       // Use SpeechHelper to speak the word with slightly enhanced settings for clarity
       await SpeechHelper.speakWord(word, {
         rate: 0.7,  // Slightly slower for clearer word pronunciation
         pitch: 1.0,
         onStart: () => {
           // Ensure states are set correctly when audio starts
           setIsPlayingAudio(true);
           setSelectedWord(word);
         },
         onDone: () => {
           // After speaking is done, reset the states with a slight delay for better UX
           setTimeout(() => {
             setIsPlayingAudio(false);
             setSelectedWord(null);
           }, 300);
         },
         onStopped: () => {
           // Handle the case when speech is stopped manually
           setIsPlayingAudio(false);
           setSelectedWord(null);
         },
         onError: () => {
           // Handle errors by resetting state
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
       setIsPlayingAudio(false);
       setSelectedWord(null);
     }
   };
   ```

5. **Create a separate render function for sound buttons**:
   ```javascript
   const renderSoundButton = (item) => {
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
   };
   ```

6. **Use the renderSoundButton in your JSX**:
   ```javascript
   <View style={styles.wordDetails}>
     <Text style={styles.wordText}>{item.word}</Text>
     {renderSoundButton(item)}
   </View>
   ```

7. **Use handleNavigation instead of direct navigation calls**:
   ```javascript
   // For back button
   <TouchableOpacity 
     style={styles.backButton}
     onPress={() => handleNavigation('AlphabetScreen')}
     activeOpacity={0.7}
     disabled={isPlayingAudio}
   >
   
   // For profile button
   <TouchableOpacity 
     style={styles.profileButton} 
     activeOpacity={0.7}
     onPress={() => handleNavigation("Profile")}
     disabled={isPlayingAudio}
   >
   
   // For continue button
   <TouchableOpacity 
     style={[
       styles.continueButton,
       isPlayingAudio && styles.disabledButton
     ]}
     onPress={() => handleNavigation('WordPuzzleScreen[Letter]1', {
       word: words[0].word.toUpperCase(),
       image: words[0].image,
     })}
     activeOpacity={0.7}
     disabled={isPlayingAudio}
   >
   ```

8. **Add disabledButton style**:
   ```javascript
   disabledButton: {
     opacity: 0.6,
   },
   ```

## Why This Enhanced Fix Works

1. **Robust Speech Handling**: The enhanced SpeechHelper properly tracks state with unique IDs for each speech request
2. **Navigation Protection**: The handleNavigation function prevents any navigation during audio playback
3. **Hardware Back Button Handling**: The BackHandler listener prevents back navigation during audio playback
4. **Complete State Management**: Multiple layers of state tracking ensure consistent UI behavior
5. **Better User Feedback**: Toast messages (on Android) inform users when they need to wait
6. **Improved Cleanup**: The enhanced cleanup in useEffect ensures no stray audio continues playing
7. **Focus Management**: Using isFocused ensures proper state management when screens gain/lose focus 