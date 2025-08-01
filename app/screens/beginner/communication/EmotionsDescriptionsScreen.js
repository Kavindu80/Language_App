import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  Image,
  FlatList,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.075;

// Create a constant viewability config outside the component
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 100
};

export default function EmotionsDescriptionsScreen() {
  const navigation = useNavigation();
  const [sound, setSound] = useState();
  const [showPractice, setShowPractice] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);

  // Emotions and descriptions data
  const emotions = [
    // Feelings
    { 
      id: 1, 
      emotion: 'Happy', 
      usage: 'Feeling good and smiling.', 
      example: 'She is happy because it\'s her birthday.',
      color: '#D7F0FF' 
    },
    { 
      id: 2, 
      emotion: 'Sad', 
      usage: 'Feeling not good or upset.', 
      example: 'He is sad because he lost his toy.',
      color: '#D0E8FF' 
    },
    { 
      id: 3, 
      emotion: 'Angry', 
      usage: 'Feeling mad or upset.', 
      example: 'She is angry when someone takes her things.',
      color: '#C4E0FF' 
    },
    { 
      id: 4, 
      emotion: 'Scared', 
      usage: 'Feeling afraid or in fear.', 
      example: 'He is scared of the dark.',
      color: '#B8D8FF' 
    },
    { 
      id: 5, 
      emotion: 'Excited', 
      usage: 'Feeling very happy and full of energy.', 
      example: 'They are excited to go on a trip.',
      color: '#ACD0FF' 
    },
    { 
      id: 6, 
      emotion: 'Tired', 
      usage: 'Feeling no energy or sleepy.', 
      example: 'I feel tired after playing all day.',
      color: '#A0C8FF' 
    },
    // Appearance
    { 
      id: 7, 
      emotion: 'Tall', 
      usage: 'Having a lot of height.', 
      example: 'He is very tall for his age.',
      color: '#94C0FF' 
    },
    { 
      id: 8, 
      emotion: 'Short', 
      usage: 'Not tall in height.', 
      example: 'She is shorter than her brother.',
      color: '#88B8FF' 
    },
    { 
      id: 9, 
      emotion: 'Thin', 
      usage: 'Not fat; having a small body.', 
      example: 'The cat is thin because it doesn\'t eat much.',
      color: '#7CB0FF' 
    },
    { 
      id: 10, 
      emotion: 'Fat', 
      usage: 'Having a big or round body.', 
      example: 'The dog looks fat because it eats a lot.',
      color: '#70A8FF' 
    },
    { 
      id: 11, 
      emotion: 'Old', 
      usage: 'Not young; having many years.', 
      example: 'My grandfather is very old.',
      color: '#64A0FF' 
    },
    { 
      id: 12, 
      emotion: 'Young', 
      usage: 'Not old; small in age.', 
      example: 'She is a young girl in school.',
      color: '#5898FF' 
    },
  ];

  // Practice questions
  const practiceQuestions = [
    { 
      id: 1, 
      question: "How do you feel when you're pleased?", 
      options: ["Angry", "Happy", "Sad"], 
      answer: "Happy", 
      description: "Identify emotions based on their definitions"
    },
    { 
      id: 2, 
      question: "How do you feel when you're afraid?", 
      options: ["Excited", "Confused", "Scared"], 
      answer: "Scared", 
      description: "Match feelings with their corresponding emotions"
    },
    { 
      id: 3, 
      question: "A woman with white hair and many years of age.", 
      options: ["Young", "Tall", "Old"], 
      answer: "Old", 
      description: "Apply emotions to real-life situations"
    },
  ];

  useEffect(() => {
    // Animate entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Listen to scroll position to update activeIndex
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / (CARD_WIDTH + SPACING));
      if (activeIndex !== index) {
        setActiveIndex(index);
      }
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, [activeIndex, scrollX]);

  // Add a function to handle centering of the cards
  const centerActiveCard = useCallback(() => {
    if (flatListRef.current && activeIndex >= 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5
      });
    }
  }, [activeIndex]);

  // Ensure cards are properly centered when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      centerActiveCard();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [centerActiveCard]);
  
  const playEmotionSound = async (emotion) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      // Play sound logic would go here
      console.log(`Playing sound for "${emotion}"`);
    } catch (error) {
      console.error("Error playing sound", error);
    }
  };

  const handleStartPractice = () => {
    setShowPractice(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPracticeCompleted(false);
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    const correct = answer === practiceQuestions[currentQuestion].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    // Delay before showing next question
    setTimeout(() => {
      if (currentQuestion < practiceQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Practice completed
        setPracticeCompleted(true);
        setPracticeScore(score + (correct ? 1 : 0));
      }
    }, 1500);
  };

  const handleTryAgain = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setPracticeCompleted(false);
  };

  // Memoize the renderEmotionCard function to prevent unnecessary re-renders
  const renderEmotionCard = useCallback(({ item, index }) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <LinearGradient
          colors={['#ffffff', '#f0f8ff']}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>{item.id}</Text>
            <Text style={styles.cardTitle}>{item.emotion}</Text>
          </View>

          <LinearGradient
            colors={[item.color, '#f0f8ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.emotionDisplay
            ]} 
          >
            <View style={styles.emotionTextContainer}>
              <Text style={styles.emotionText}>{item.emotion}</Text>
            </View>
          </LinearGradient>

          <View style={styles.usageContainer}>
            <Text style={styles.usageTitle}>Meaning:</Text>
            <Text style={styles.usageText}>{item.usage}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => playEmotionSound(item.emotion)}
            >
              <View style={styles.audioGradient}>
                <FontAwesome5 name="volume-up" size={20} color="#0072ff" />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example:</Text>
            <Text style={styles.exampleText}>"{item.example}"</Text>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }, [scrollX]);

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Feelings & Appearance</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image 
            source={require("../../../../assets/items/profile.jpg")} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {!showPractice ? (
          <View style={styles.mainContent}>
            <View style={styles.carouselContainer}>
              <FlatList
                ref={flatListRef}
                data={emotions}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderEmotionCard}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + SPACING}
                snapToAlignment="center"
                decelerationRate="fast"
                contentContainerStyle={{
                  paddingHorizontal: SPACING / 2,
                  paddingVertical: 10
                }}
                viewabilityConfig={VIEWABILITY_CONFIG}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                  { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
              />
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.dotsContainer}>
                {emotions.map((_, index) => {
                  const inputRange = [
                    (index - 1) * (CARD_WIDTH + SPACING),
                    index * (CARD_WIDTH + SPACING),
                    (index + 1) * (CARD_WIDTH + SPACING),
                  ];
                  
                  const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                  });
                  
                  const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });
                  
                  return (
                    <Animated.View
                      key={index}
                      style={[
                        styles.dot,
                        {
                          width: dotWidth,
                          opacity,
                        },
                      ]}
                    />
                  );
                })}
              </View>
            </View>

            <TouchableOpacity
              style={styles.practiceButton}
              onPress={handleStartPractice}
            >
              <View style={styles.practiceGradient}>
                <Text style={styles.practiceButtonText}>Practice</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.practiceContainer}>
            {!practiceCompleted ? (
              <>
                <Text style={styles.questionCounter}>
                  Question {currentQuestion + 1} of {practiceQuestions.length}
                </Text>
                
                <View style={styles.questionCard}>
                  <Text style={styles.questionText}>{practiceQuestions[currentQuestion].question}</Text>
                  
                  <View style={styles.optionsContainer}>
                    {practiceQuestions[currentQuestion].options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.optionButton,
                          selectedAnswer === option && 
                            (isCorrect !== null 
                              ? isCorrect 
                                ? styles.correctOption 
                                : styles.incorrectOption 
                              : styles.selectedOption)
                        ]}
                        onPress={() => handleAnswerSelect(option)}
                        disabled={selectedAnswer !== null}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      {width: `${((currentQuestion) / practiceQuestions.length) * 100}%`}
                    ]} 
                  />
                </View>
              </>
            ) : (
              <View style={styles.resultsContainer}>
                <View style={styles.resultsCard}>
                  <View style={styles.scoreCircle}>
                <Text style={styles.scoreText}>
                      {practiceScore}/{practiceQuestions.length}
                    </Text>
                  </View>
                  
                  <Text style={styles.resultsTitle}>
                    {practiceScore === practiceQuestions.length
                      ? 'Perfect Score!'
                      : practiceScore >= practiceQuestions.length / 2
                      ? 'Good Job!'
                      : 'Keep Practicing!'
                    }
                  </Text>
                  
                  <Text style={styles.resultsDescription}>
                    {practiceScore === practiceQuestions.length
                      ? 'Awesome! Perfect score!'
                      : practiceScore === 2
                      ? 'So close! Practice again and you\'ll do better!'
                      : practiceScore === 1
                      ? 'Not bad! You\'ll do better next time!'
                      : 'It\'s okay! Try again and don\'t give up!'
                    }
                  </Text>
                
                  <View style={styles.resultButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.resultsButton}
                    onPress={handleTryAgain}
                    >
                      <View style={styles.resultsGradient}>
                      <Text style={styles.resultsButtonText}>Try Again</Text>
                      </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.resultsButton}
                    onPress={() => setShowPractice(false)}
                  >
                      <View style={styles.resultsGradient}>
                      <Text style={styles.resultsButtonText}>Back to Emotions</Text>
                      </View>
                  </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    maxWidth: '60%',
    textAlign: 'center',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "#fff",
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  carouselContainer: {
    height: 380,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  card: {
    width: '100%',
    height: 360,
    borderRadius: 20,
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    backgroundColor: '#E0F4FF',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  emotionDisplay: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    marginBottom: 15,
  },
  emotionTextContainer: {
    padding: 10,
  },
  emotionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  usageContainer: {
    marginBottom: 5,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  usageText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  audioButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  audioGradient: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
  },
  exampleContainer: {
    marginBottom: 5,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 15,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  practiceButton: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 20,
  },
  practiceGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
  },
  practiceButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  practiceContainer: {
    flex: 1,
    padding: 20,
  },
  questionCounter: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  questionText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderColor: '#fff',
    borderWidth: 2,
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    borderColor: '#F44336',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  progressBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00c6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  resultsDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  resultsButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  resultsGradient: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#FFFFFF",
  },
  resultsButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});