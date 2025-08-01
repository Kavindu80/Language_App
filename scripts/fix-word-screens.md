# Guide: How to Fix All WordsStartingWith Screens

This guide provides detailed instructions on how to fix the screen refresh issue and empty blue screen problem in all WordsStartingWith screens from B to Z.

## Overview of the Fixes

The fix addresses several issues:

1. Screen refresh when clicking sound buttons
2. Navigation to empty blue screens when clicking buttons during audio playback
3. Missing speech functionality in some screens

## Required Changes for Each Screen

For each `WordsStartingWith[Letter]Screen.js` file, you need to:

1. Import additional modules and hooks:
   ```javascript
   import { 
     // ... existing imports
     BackHandler,
     ToastAndroid
   } from "react-native";
   import { useNavigation, useIsFocused } from "@react-navigation/native";
   import SpeechHelper from '../../../helpers/SpeechHelper'; // Adjust path as needed
   ```

2. Move word definitions outside the component:
   ```javascript
   // Words starting with [Letter] - defined outside component to prevent re-creation
   const letterWords = [
     // ... existing word definitions
   ];
   ```

3. Use refs for animations and state tracking:
   ```javascript
   const isFocused = useIsFocused();
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const slideAnim = useRef(new Animated.Value(width)).current;
   const [selectedWord, setSelectedWord] = useState(null);
   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
   
   // Use refs to prevent unnecessary re-renders
   const isPlayingRef = useRef(false);
   const selectedWordRef = useRef(null);
   const scrollViewRef = useRef(null);
   ```

4. Add memoized animation function:
   ```javascript
   // Animation function memoized to prevent recreation on re-renders
   const startAnimations = useCallback(() => {
     Animated.parallel([
       // ... existing animation code
     ]).start();
   }, [fadeAnim, slideAnim]);
   ```

5. Update useEffect with better cleanup and back button handling:
   ```javascript
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
   ```

6. Implement memoized play audio function:
   ```javascript
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
   ```

7. Add memoized render functions:
   ```javascript
   // Render function for the sound button
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

   // Handler for navigation
   const handleNavigation = useCallback((screenName, params = {}) => {
     if (isPlayingRef.current) {
       if (Platform.OS === 'android') {
         ToastAndroid.show('Please wait until audio finishes playing', ToastAndroid.SHORT);
       }
       return;
     }
     navigation.navigate(screenName, params);
   }, [navigation]);

   // Memoized render for word items
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
   ```

8. Update JSX with optimized components:
   ```jsx
   // For back button
   <TouchableOpacity 
     style={styles.backButton}
     onPress={() => handleNavigation('AlphabetScreen')}
     activeOpacity={0.7}
     disabled={isPlayingAudio}
   >
     <Ionicons name="arrow-back" size={isSmallDevice ? 24 : 30} color="#fff" />
   </TouchableOpacity>
   
   // For profile button
   <TouchableOpacity 
     style={styles.profileButton} 
     activeOpacity={0.7}
     onPress={() => handleNavigation("Profile")}
     disabled={isPlayingAudio}
   >
     <Image source={require("../../../../assets/items/profile.jpg")} style={styles.profileImage} />
   </TouchableOpacity>

   // For ScrollView
   <ScrollView 
     ref={scrollViewRef}
     style={styles.wordList}
     showsVerticalScrollIndicator={false}
     contentContainerStyle={styles.wordListContent}
     scrollEnabled={!isPlayingAudio}
     removeClippedSubviews={true}
   >
     {letterWords.map(renderWordItem)}
   </ScrollView>
   
   // For continue button
   <TouchableOpacity 
     style={[
       styles.continueButton,
       isPlayingAudio && styles.disabledButton
     ]}
     onPress={() => handleNavigation('WordPuzzleScreen[Letter]1', {
       word: letterWords[0].word.toUpperCase(),
       image: letterWords[0].image,
     })}
     activeOpacity={0.7}
     disabled={isPlayingAudio}
   >
     <LinearGradient>
       {/* existing content */}
     </LinearGradient>
   </TouchableOpacity>
   ```

9. Add disabled button style:
   ```javascript
   disabledButton: {
     opacity: 0.6,
   },
   ```

10. Move styles outside component:
    ```javascript
    // Move styles outside component to prevent recreation on re-renders
    const styles = StyleSheet.create({
      // ... existing styles
    });
    ```

## Step-by-Step Implementation

1. First, make sure SpeechHelper.js has the latest optimized version
2. For each letter from B to Z, locate the corresponding WordsStartingWith[Letter]Screen.js file
3. Apply the changes as outlined above, adjusting for any letter-specific differences
4. Test each screen after modification to ensure:
   - Sound buttons work without screen refresh
   - Audio plays correctly
   - Navigation is prevented during audio playback
   - Back button is handled properly

## Important Tips

1. Paths may differ slightly based on folder structure for each letter
2. Some screens might already have parts of the implementation (like SpeechHelper)
3. The key improvements that prevent screen refresh are:
   - Using useRef for animation values
   - Adding refs to track audio playback state
   - Using useCallback for all functions
   - Moving word arrays outside component
   - Creating memoized render functions
   - Adding removeClippedSubviews={true} to ScrollView

## Testing After Implementation

After implementing the fixes, test:

1. Rapid tapping on sound buttons (should not cause screen refresh)
2. Playing audio and trying to navigate (should be prevented)
3. Back button during audio playback (should be blocked)
4. Screen transitions after audio completes (should work normally)

These improvements significantly enhance performance and prevent the empty blue screen issue by properly managing state and navigation during audio playback. 