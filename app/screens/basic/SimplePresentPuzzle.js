import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, SafeAreaView, Platform, StatusBar
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

// Get screen dimensions
const { width, height } = Dimensions.get('window');
const TILE_SIZE = Math.min(width / 8, 45);

export default function SimplePresentPuzzle({ navigation, route }) {
  // Define all puzzles
  const puzzles = [
    {
      id: 1,
      words: ["reads", "She", "books"],
      correctSentence: "She reads books",
      image: require("../../../assets/items/book.png")
    },
    {
      id: 2,
      words: ["doesn't", "soccer", "play", "He"],
      correctSentence: "He doesn't play soccer",
      image: require("../../../assets/items/ball.png")
    },
    {
      id: 3,
      words: ["Do", "pizza", "like", "you"],
      correctSentence: "Do you like pizza",
      image: require("../../../assets/items/pizza.png")
    },
    {
      id: 4,
      words: ["don't", "I", "watch", "TV"],
      correctSentence: "I don't watch TV",
      image: require("../../../assets/items/tv.png")
    },
    {
      id: 5,
      words: ["Does", "she", "speak", "English"],
      correctSentence: "Does she speak English",
      image: require("../../../assets/items/girl-reading.png")
    }
  ];
  
  // Current puzzle index
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const currentPuzzle = puzzles[currentPuzzleIndex];
  
  // Split correct sentence into individual words
  const correctWords = currentPuzzle.correctSentence.split(' ');
  
  // State management
  const [placedWords, setPlacedWords] = useState(Array(correctWords.length).fill(null));
  const [isCorrect, setIsCorrect] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Create puzzle words
  const createPuzzleWords = () => {
    return currentPuzzle.words.map(word => ({ 
      word, 
      id: Math.random().toString(),
      isPlaced: false
    })).sort(() => Math.random() - 0.5);
  };
  
  const [allWords, setAllWords] = useState(createPuzzleWords());
  const availableWords = allWords.filter(word => !word.isPlaced);
  
  // Reset when puzzle changes
  useEffect(() => {
    resetPuzzle();
  }, [currentPuzzleIndex]);
  
  // Place a word in an empty slot
  const placeWord = (wordObj, index) => {
    if (placedWords[index] !== null) return;

    const newPlacedWords = [...placedWords];
    newPlacedWords[index] = wordObj;
    setPlacedWords(newPlacedWords);
    
    setAllWords(prev => 
      prev.map(w => w.id === wordObj.id ? { ...w, isPlaced: true } : w)
    );
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Remove a placed word
  const removePlacedWord = (index) => {
    if (!placedWords[index]) return;
    
    const wordToRemove = placedWords[index];
    const newPlacedWords = [...placedWords];
    newPlacedWords[index] = null;
    setPlacedWords(newPlacedWords);
    
    setAllWords(prev => 
      prev.map(w => w.id === wordToRemove.id ? { ...w, isPlaced: false } : w)
    );
    
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  
  // Check if the answer is correct
  const checkAnswer = () => {
    const allSlotsFilled = !placedWords.includes(null);
    if (!allSlotsFilled) return;
    
    const submittedSentence = placedWords
      .map(wordObj => wordObj.word)
      .join(' ');
    
    const result = submittedSentence === currentPuzzle.correctSentence;
    setIsCorrect(result);
    setShowFeedback(true);
    
    // Provide haptic feedback
    if (result) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };
  
  // Reset the puzzle
  const resetPuzzle = () => {
    setAllWords(createPuzzleWords());
    setPlacedWords(Array(correctWords.length).fill(null));
    setShowFeedback(false);
    setIsCorrect(null);
  };
  
  // Move to next puzzle
  const moveToNextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    } else {
      // If this is the last puzzle, navigate back to the main screen
      navigation.navigate("SimplePresent");
    }
  };
  
  // Calculate adaptive sizes
  const screenHeight = height - 230;
  const availableContentHeight = showFeedback ? screenHeight * 0.7 : screenHeight * 0.85;
  const maxImageSize = Math.min(width * 0.5, availableContentHeight * 0.3, 200);
  const imageSize = maxImageSize;
  
  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content" />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-circle" size={38} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Sentence Puzzle</Text>
            <TouchableOpacity style={styles.profileButton}>
              <Image
                source={require("../../../assets/items/profile.jpg")}
                style={styles.profileImage}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.mainContent}>
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                Puzzle {currentPuzzleIndex + 1} of {puzzles.length}
              </Text>
            </View>
            
            {/* Image Container */}
            <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
              <Image 
                source={currentPuzzle.image} 
                style={[styles.image, { width: imageSize * 0.9, height: imageSize * 0.9 }]} 
              />
            </View>
            
            {/* Word Placement Area */}
            <View style={styles.placementAreaContainer}>
              <View style={styles.placementBackground} />
              <View style={styles.placementArea}>
                {placedWords.map((wordObj, index) => (
                  <TouchableOpacity 
                    key={`drop-${index}`}
                    style={styles.dropZone}
                    onPress={() => removePlacedWord(index)}
                  >
                    {wordObj && (
                      <View style={styles.placedWord}>
                        <Text style={styles.wordText}>{wordObj.word}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Help text */}
            <Text style={styles.helpText}>
              {placedWords.includes(null) ? 
                "Tap a word to place it" : 
                "Tap a placed word to remove it"
              }
            </Text>
            
            {/* Word Tiles to Select */}
            <View style={styles.wordsContainer}>
              {availableWords.map((wordObj) => (
                <TouchableOpacity
                  key={wordObj.id}
                  style={styles.wordTile}
                  onPress={() => {
                    const emptyIndex = placedWords.findIndex(w => w === null);
                    if (emptyIndex !== -1) placeWord(wordObj, emptyIndex);
                  }}
                >
                  <Text style={styles.wordText}>{wordObj.word}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Check Button */}
            <TouchableOpacity 
              style={[
                styles.checkButton,
                !placedWords.includes(null) ? styles.checkButtonActive : styles.checkButtonDisabled
              ]} 
              onPress={checkAnswer} 
              activeOpacity={0.7}
              disabled={placedWords.includes(null)}
            >
              <FontAwesome5 name="check-circle" size={22} color="white" style={styles.buttonIcon} />
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>
            
          {/* Feedback and Navigation */}
          {showFeedback && (
            <View style={styles.feedbackContainer}>
              <View style={[styles.feedbackBox, isCorrect ? styles.correctFeedback : styles.wrongFeedback]}>
                <FontAwesome5 
                  name={isCorrect ? "smile-beam" : "sad-tear"} 
                  size={24} 
                  color={isCorrect ? "#006400" : "#8B0000"} 
                  style={styles.feedbackIcon}
                />
                <Text style={[styles.feedbackText, { color: isCorrect ? "#006400" : "#8B0000" }]}>
                  {isCorrect ? "Great Job!" : "Try Again!"}
                  {!isCorrect && (
                    <Text style={[styles.correctSentenceText, { color: "#8B0000" }]}>
                      {"\nCorrect Sentence: " + currentPuzzle.correctSentence}
                    </Text>
                  )}
                </Text>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                {/* Next Button */}
                <TouchableOpacity 
                  style={[styles.actionButton, styles.nextButton]}
                  onPress={moveToNextPuzzle}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 
                    name="arrow-circle-right" 
                    size={22} 
                    color="white" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={styles.actionButtonText}>
                    {currentPuzzleIndex < puzzles.length - 1 ? "Next Puzzle" : "Finish"}
                  </Text>
                </TouchableOpacity>
                
                {/* Try Again Button - Only shows when answer is incorrect */}
                {!isCorrect && (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.retryButton]}
                    onPress={resetPuzzle}
                    activeOpacity={0.7}
                  >
                    <FontAwesome5 
                      name="redo-alt" 
                      size={22} 
                      color="white" 
                      style={styles.buttonIcon} 
                    />
                    <Text style={styles.actionButtonText}>Try Again</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    width: '100%', 
    height: '100%',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    height: 50,
    position: 'relative',
  },
  backButton: { position: 'absolute', left: 20, zIndex: 10 },
  profileButton: { 
    position: 'absolute', 
    right: 20, 
    zIndex: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  progressContainer: {
    marginBottom: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  progressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imageContainer: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#fff',
  },
  image: { 
    resizeMode: 'contain' 
  },
  placementAreaContainer: {
    position: 'relative',
    width: '100%',
    minHeight: 80,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placementBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
    borderStyle: 'dashed',
  },
  placementArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    padding: 15,
  },
  dropZone: {
    minWidth: 80,
    height: 45,
    margin: 6,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 10,
    fontStyle: 'italic',
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  wordTile: {
    minWidth: 80,
    height: 45,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    margin: 8,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  placedWord: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00c6ff',
    paddingHorizontal: 10,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  checkButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 10,
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  checkButtonActive: {
    backgroundColor: '#00E676',
  },
  checkButtonDisabled: {
    backgroundColor: 'rgba(0, 230, 118, 0.5)',
  },
  buttonIcon: { marginRight: 8 },
  checkButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  
  // Feedback container
  feedbackContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 10,
    alignItems: 'center',
  },
  feedbackBox: {
    width: '90%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
    marginBottom: 15,
  },
  correctFeedback: {
    backgroundColor: '#CEFFCE',
    borderWidth: 2,
    borderColor: '#00C853',
  },
  wrongFeedback: {
    backgroundColor: '#FFECEC',
    borderWidth: 2,
    borderColor: '#FF5252',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 10,
  },
  correctSentenceText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackIcon: { marginRight: 5 },
  
  // Container for action buttons with row layout
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    flex: 1,
    maxWidth: '45%',
    marginHorizontal: 5,
  },
  nextButton: { backgroundColor: '#0072ff' },
  retryButton: { backgroundColor: '#FF9800' },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
}); 