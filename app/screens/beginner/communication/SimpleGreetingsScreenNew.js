import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9; // Slightly larger card for better visibility

export default function SimpleGreetingsScreenNew() {
  const navigation = useNavigation();
  const [sound, setSound] = useState();
  const [showPractice, setShowPractice] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));
  // No category filtering needed - using greetings array directly

  // Simple greetings data
  const greetings = [
    { 
      id: 1, 
      category: 'Simple Greetings',
      greeting: 'Hello', 
      usage: 'A common way to greet someone.', 
      example: 'Hello! How are you today?',
      color: '#D7F0FF' 
    },
    { 
      id: 2, 
      category: 'Simple Greetings',
      greeting: 'Hi / Hey', 
      usage: 'A short and informal way to say hello.', 
      example: 'Hi! Nice to meet you. / Hey! How are you?',
      color: '#D0E8FF' 
    },
    { 
      id: 3, 
      category: 'Simple Greetings',
      greeting: 'Good morning', 
      usage: 'Greeting used in the morning.', 
      example: 'Good morning! Did you sleep well?',
      color: '#C4E0FF' 
    },
    { 
      id: 4, 
      category: 'Simple Greetings',
      greeting: 'Good afternoon', 
      usage: 'Greeting used after noon until evening.', 
      example: 'Good afternoon! How was your lunch?',
      color: '#B8D8FF' 
    },
    { 
      id: 5, 
      category: 'Simple Greetings',
      greeting: 'Good evening', 
      usage: 'Greeting used in the evening.', 
      example: 'Good evening! How was your day?',
      color: '#ACD0FF' 
    },
    { 
      id: 6, 
      category: 'Simple Greetings',
      greeting: 'How are you?', 
      usage: 'Asking someone about their feelings or health.', 
      example: 'Hi! How are you today?',
      color: '#A0C8FF' 
    },
    { 
      id: 7, 
      category: 'Simple Greetings',
      greeting: 'Nice to meet you', 
      usage: 'Saying when you meet someone for the first time.', 
      example: 'Hello! Nice to meet you.',
      color: '#94C0FF' 
    },
    { 
      id: 8, 
      category: 'Simple Greetings',
      greeting: 'Welcome', 
      usage: 'Greeting someone who has just arrived.', 
      example: 'Welcome to our home!',
      color: '#88B8FF' 
    },
    { 
      id: 9, 
      category: 'Simple Greetings',
      greeting: 'Goodbye', 
      usage: 'Saying when you leave or end a conversation.', 
      example: 'Goodbye! See you tomorrow.',
      color: '#7CB0FF' 
    },
    { 
      id: 10, 
      category: 'Simple Greetings',
      greeting: 'See you later', 
      usage: 'Informal way to say goodbye, meaning you will meet again soon.', 
      example: 'See you later! Have a nice day.',
      color: '#70A8FF' 
    },
    { 
      id: 11, 
      category: 'Simple Greetings',
      greeting: 'Thank you / Thanks', 
      usage: 'A polite way to show you are happy or grateful for something.', 
      example: 'Thank you for your help! / Thanks for the gift!',
      color: '#64A0FF' 
    },
    { 
      id: 12, 
      category: 'Simple Greetings',
      greeting: 'You\'re welcome', 
      usage: 'A polite reply when someone says, "Thank you."', 
      example: 'Thank you for your help! You\'re welcome!',
      color: '#5898FF' 
    },
  ];

  // Practice questions
  const practiceQuestions = [
    { 
      id: 1, 
      question: "What greeting is appropriate in the morning?", 
      options: ["Good evening", "Good morning", "Good afternoon"], 
      answer: "Good morning", 
      description: "Find the correct greeting for the time of day"
    },
    { 
      id: 2, 
      question: "What is the most formal way to greet someone?", 
      options: ["Hey", "Hello", "See you later"], 
      answer: "Hello", 
      description: "Know which greetings are formal, informal, and suitable"
    },
    { 
      id: 3, 
      question: "How do you greet someone for the first time?", 
      options: ["Goodbye", "Nice to meet you", "Thank you"], 
      answer: "Nice to meet you", 
      description: "Know the way to greet someone you meet"
    },
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceScore, setPracticeScore] = useState(0);
  
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

  // Handle orientation changes
  useEffect(() => {
    const dimensionsListener = Dimensions.addEventListener('change', () => {
      // Just re-render the component when orientation changes
    });
    
    return () => {
      dimensionsListener.remove();
    };
  }, []);
  
  // Optimize the playEmotionSound function with useCallback
  const playEmotionSound = useCallback(async (emotion) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      // Play sound logic would go here
      console.log(`Playing sound for "${emotion}"`);
    } catch (error) {
      console.error("Error playing sound", error);
    }
  }, [sound]);

  const handleNextCard = () => {
    if (activeIndex < greetings.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const handlePreviousCard = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
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

  // Create a memoized greeting card component
  const EmotionCard = memo(({ item, index }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>{index + 1}</Text>
          </View>

          <View style={styles.emotionDisplay}>
            <View style={styles.emotionTextContainer}>
              <Text style={[styles.emotionText, {color: '#0064FF'}]}>{item.greeting}</Text>
            </View>
            </View>

          <View style={styles.usageContainer}>
            <Text style={styles.usageTitle}>Meaning:</Text>
            <Text style={styles.usageText}>{item.usage}</Text>
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example:</Text>
            <Text style={styles.exampleText}>"{item.example}"</Text>
          </View>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => playEmotionSound(item.greeting)}
              activeOpacity={0.7}
            >
              <View style={styles.audioGradient}>
                <FontAwesome5 name="volume-up" size={20} color="#0072ff" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#00c6ff', '#0072ff']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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
          
          <Text style={styles.headerTitle}>Greetings</Text>
          
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
              {/* Static Card Display with Navigation Buttons */}
              <View style={styles.cardDisplayContainer}>
                {/* Category Filter and Search bar removed - not needed as we only have simple greetings */}

                {/* Current Card */}
                <EmotionCard item={greetings[activeIndex]} index={activeIndex} />
                
                {/* Navigation Controls */}
                <View style={styles.navigationControls}>
                  {/* Previous Button */}
                  <TouchableOpacity 
                    style={[styles.navButton, activeIndex === 0 && styles.navButtonDisabled]} 
                    onPress={handlePreviousCard}
                    disabled={activeIndex === 0}
                    activeOpacity={0.7}
                  >
                    <View style={styles.navButtonInner}>
                      <Ionicons name="chevron-back" size={24} color={activeIndex === 0 ? "#ccc" : "#0072ff"} />
                    </View>
                  </TouchableOpacity>
                  
                  {/* Card Counter */}
                  <View style={styles.cardCounter}>
                    <Text style={styles.cardCounterText}>
                      {`${activeIndex + 1} / ${greetings.length}`}
                    </Text>
                  </View>
                  
                  {/* Next Button */}
                  <TouchableOpacity 
                    style={[styles.navButton, activeIndex === greetings.length - 1 && styles.navButtonDisabled]} 
                    onPress={handleNextCard}
                    disabled={activeIndex === greetings.length - 1}
                    activeOpacity={0.7}
                  >
                    <View style={styles.navButtonInner}>
                      <Ionicons name="chevron-forward" size={24} color={activeIndex === greetings.length - 1 ? "#ccc" : "#0072ff"} />
                    </View>
                  </TouchableOpacity>
                </View>
                
                {/* Pagination dots */}
                <View style={styles.paginationContainer}>
                  {greetings.map((_, index) => (
                    <TouchableOpacity 
                      key={index}
                      onPress={() => setActiveIndex(index)}
                      style={[
                        styles.paginationDot,
                        index === activeIndex && styles.paginationDotActive
                      ]}
                    />
                  ))}
                </View>
              </View>

              {/* Practice Button */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.practiceButton}
                  onPress={handleStartPractice}
                  activeOpacity={0.85}
                >
                  <View style={styles.practiceGradient}>
                    <Text style={styles.practiceButtonText}>Practice Greetings</Text>
                    <FontAwesome5 name="pencil-alt" size={16} color="#0072ff" style={{marginLeft: 10}} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Animated.View 
              style={[
                styles.practiceContainer,
                { 
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              {!practiceCompleted ? (
                <>
                  <LinearGradient
                    colors={['#ffffff', '#f5f9ff']}
                    style={styles.questionCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <View style={styles.questionNumberBadge}>
                      <Text style={styles.questionNumberText}>
                        {currentQuestion + 1}/{practiceQuestions.length}
                      </Text>
                    </View>
                    
                    <Text style={styles.questionText}>
                      {practiceQuestions[currentQuestion].question}
                    </Text>
                    
                    <Text style={styles.questionDescription}>
                      {practiceQuestions[currentQuestion].description}
                    </Text>
                    
                    <View style={styles.optionsContainer}>
                      {practiceQuestions[currentQuestion].options.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.optionButton,
                            selectedAnswer === option && styles.selectedOptionButton,
                            selectedAnswer === option && isCorrect === true && styles.correctOptionButton,
                            selectedAnswer === option && isCorrect === false && styles.incorrectOptionButton,
                          ]}
                          onPress={() => handleAnswerSelect(option)}
                          disabled={selectedAnswer !== null}
                        >
                          <Text style={[
                            styles.optionText,
                            selectedAnswer === option && styles.selectedOptionText
                          ]}>
                            {option}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </LinearGradient>
                </>
              ) : (
                <View style={styles.resultsContainer}>
                  <LinearGradient
                    colors={['#ffffff', '#f5f9ff']}
                    style={styles.resultsCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  >
                    <View style={styles.scoreCircle}>
                      <Text style={styles.scoreText}>
                        {practiceScore}/{practiceQuestions.length}
                      </Text>
                    </View>
                    
                    <Text style={styles.resultsTitle}>
                      {practiceScore === practiceQuestions.length
                        ? 'Perfect score!'
                        : practiceScore >= practiceQuestions.length / 2
                        ? 'Good Job!'
                        : 'Keep practicing!'
                      }
                    </Text>
                    
                    <Text style={styles.resultsDescription}>
                      {practiceScore === practiceQuestions.length
                        ? 'Nice work! You did great with the greetings!'
                        : practiceScore === 2
                        ? 'Well done! You\'re almost there with these greetings. Keep practicing and try again!'
                        : practiceScore === 1
                        ? 'Good effort! Practice more and try again!'
                        : 'No worries! Practice more and try again!'
                      }
                    </Text>
                    
                    <View style={styles.resultButtonsContainer}>
                      <TouchableOpacity
                        style={styles.tryAgainButton}
                        onPress={handleTryAgain}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#64B5F6', '#2196F3']}
                          style={styles.tryAgainGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                        >
                          <FontAwesome5 name="redo" size={16} color="white" style={{marginRight: 5}} />
                          <Text style={styles.tryAgainText}>Try Again</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.continueButton}
                        onPress={() => setShowPractice(false)}
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={['#0044ff', '#0072ff']}
                          style={styles.continueGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 0, y: 1 }}
                        >
                          <Text style={styles.continueText}>Back to Cards</Text>
                          <FontAwesome5 name="arrow-right" size={16} color="white" style={{marginLeft: 5}} />
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </View>
              )}
            </Animated.View>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  // Category filter styles removed - not needed anymore

  noContentContainer: {
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    marginBottom: 15,
  },
  noContentText: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 10 : 50,
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
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 30,
  },
  cardDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  navigationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: 20,
  },
  cardCounter: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cardCounterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    shadowOpacity: 0.1,
    elevation: 2,
  },
  navButtonInner: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_WIDTH,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 7,
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    height: 380,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
    flexWrap: 'wrap',
  },
  categoryContainer: {
    backgroundColor: '#0072ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 8,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0064FF',
    backgroundColor: '#E6F2FF',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginLeft: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0072ff',
    textAlign: 'center',
    width: '100%',
  },
  emotionDisplay: {
    minHeight: 110,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 15,
    backgroundColor: '#E6F2FF',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingVertical: 10,
  },
  emotionTextContainer: {
    padding: 15,
  },
  emotionText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  usageContainer: {
    marginBottom: 12,
    flexShrink: 1,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 10,
    position: 'relative',
    zIndex: 1,
  },
  audioButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  audioGradient: {
    padding: 12,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
  },
  exampleContainer: {
    marginTop: 5,
    flexShrink: 1,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 15,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 20,
    flexWrap: 'wrap',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    margin: 5,
  },
  paginationDotActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  practiceButton: {
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    width: '90%',
  },
  practiceGradient: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
  },
  practiceButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  practiceIcon: {
    marginLeft: 10,
  },
  practiceContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
  },
  questionNumberBadge: {
    position: 'absolute',
    top: -15,
    right: 20,
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  questionNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  questionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#f5f9ff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  selectedOptionButton: {
    borderColor: '#2196F3',
    borderWidth: 2,
  },
  correctOptionButton: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4caf50',
  },
  incorrectOptionButton: {
    backgroundColor: '#ffebee',
    borderColor: '#f44336',
  },
  optionText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: 'bold',
    color: '#333',
  },
  resultsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCard: {
    borderRadius: 15,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    width: '100%',
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0072ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 25,
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  tryAgainGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 25,
    overflow: 'hidden',
  },
  continueGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});