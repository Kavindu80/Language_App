import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  Image,
  FlatList,
  Dimensions,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.05;

export default function DaysOfWeekScreen() {
  const navigation = useNavigation();
  const [selectedDay, setSelectedDay] = useState(null);
  const [sound, setSound] = useState();
  const [showPractice, setShowPractice] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(100));

  // Days of the week data
  const days = [
    { id: 1, day: 'Monday', abbreviation: 'Mon', position: 'First day of the week', color: '#E3F2FD' },
    { id: 2, day: 'Tuesday', abbreviation: 'Tue', position: 'Second day of the week', color: '#BBDEFB' },
    { id: 3, day: 'Wednesday', abbreviation: 'Wed', position: 'Third day of the week', color: '#90CAF9' },
    { id: 4, day: 'Thursday', abbreviation: 'Thu', position: 'Fourth day of the week', color: '#64B5F6' },
    { id: 5, day: 'Friday', abbreviation: 'Fri', position: 'Fifth day of the week', color: '#42A5F5' },
    { id: 6, day: 'Saturday', abbreviation: 'Sat', position: 'Sixth day of the week', color: '#2196F3' },
    { id: 7, day: 'Sunday', abbreviation: 'Sun', position: 'Seventh day of the week', color: '#1E88E5' },
  ];

  // Practice questions
  const practiceQuestions = [
    { 
      id: 1, 
      question: "What is the next day after Monday?", 
      options: ["Wednesday", "Tuesday", "Sunday"], 
      answer: "Tuesday", 
      description: "Select the days in order."
    },
    { 
      id: 2, 
      question: "What is day five?", 
      options: ["Monday", "Thursday", "Friday"], 
      answer: "Friday", 
      description: "Know the days in order."
    },
    { 
      id: 3, 
      question: "What comes before Sunday?", 
      options: ["Friday", "Monday", "Saturday"], 
      answer: "Saturday", 
      description: "Name the day before Sunday."
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

  // Listen to scroll position to update activeIndex
  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      const index = Math.round(value / (CARD_WIDTH + SPACING));
      setActiveIndex(index);
    });

    return () => {
      scrollX.removeListener(listener);
    };
  }, []);
  
  const playDaySound = async (day) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      // Play sound logic would go here
      console.log(`Playing sound for day ${day}`);
    } catch (error) {
      console.error("Error playing sound", error);
    }
  };

  const handleDaySelect = (item) => {
    setSelectedDay(item);
    playDaySound(item.day);
  };

  const handleNextCard = () => {
    if (activeIndex < days.length - 1) {
      flatListRef.current.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
    }
  };

  const handlePreviousCard = () => {
    if (activeIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
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

  const renderDayCard = ({ item, index }) => {
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
      outputRange: [0.6, 1, 0.6],
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
          colors={['#ffffff', '#f5f9ff']}
          style={styles.card}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardNumber}>{item.id}</Text>
            <Text style={styles.cardTitle}>{item.day}</Text>
          </View>

          <View 
            style={[
              styles.dayDisplay, 
              { backgroundColor: item.color }
            ]} 
          >
            <Text style={styles.dayAbbreviation}>{item.abbreviation}</Text>
          </View>

          <View style={styles.positionContainer}>
            <Text style={styles.positionText}>
              <Text style={styles.boldText}>{item.position}</Text>
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.audioButton}
              onPress={() => playDaySound(item.day)}
            >
              <LinearGradient
                colors={['#4facfe', '#00f2fe']}
                style={styles.audioGradient}
              >
                <FontAwesome5 name="volume-up" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  };

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
        
        <Text style={styles.headerTitle}>Days in a Week</Text>
        
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

      {!showPractice ? (
        <Animated.View 
          style={{ 
            flex: 1, 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }}
        >
          {/* Main learning area */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={days}
              renderItem={renderDayCard}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + SPACING}
              decelerationRate="fast"
              contentContainerStyle={styles.flatListContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            />
          </View>

          {/* Navigation Arrows */}
          <View style={styles.navigationArrows}>
            <TouchableOpacity 
              style={[
                styles.navArrow,
                activeIndex === 0 && styles.disabledArrow
              ]}
              onPress={handlePreviousCard}
              disabled={activeIndex === 0}
            >
              <Ionicons 
                name="chevron-back-circle" 
                size={36} 
                color={activeIndex === 0 ? "#88c0ff" : "#fff"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.navArrow,
                activeIndex === days.length - 1 && styles.disabledArrow
              ]}
              onPress={handleNextCard}
              disabled={activeIndex === days.length - 1}
            >
              <Ionicons 
                name="chevron-forward-circle" 
                size={36} 
                color={activeIndex === days.length - 1 ? "#88c0ff" : "#fff"} 
              />
            </TouchableOpacity>
          </View>

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {days.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === activeIndex && styles.activePaginationDot
                ]}
              />
            ))}
          </View>

          {/* Practice Button */}
          <View style={styles.practiceButtonContainer}>
            <TouchableOpacity 
              style={styles.practiceButton}
              onPress={handleStartPractice}
            >
              <View style={styles.practiceGradient}>
                <Text style={styles.practiceButtonText}>Practice Days</Text>
                <FontAwesome5 name="pencil-alt" size={16} color="#0072ff" style={styles.practiceIcon} />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
                    ? 'Perfect Score!'
                    : practiceScore >= practiceQuestions.length / 2
                    ? 'Good Job!'
                    : 'Keep Practicing!'
                  }
                </Text>
                
                <Text style={styles.resultsDescription}>
                  {practiceScore === practiceQuestions.length
                    ? 'Awesome! You know all the weekdays very well!'
                    : practiceScore >= practiceQuestions.length / 2
                    ? 'Good job! Practice more to know all the days!'
                    : practiceScore === 1
                    ? 'Not bad! Keep trying and practicing more!'
                    : 'It\'s okay! Practice more and try again!'
                  }
                </Text>
                
                <View style={styles.resultButtonsContainer}>
                  <TouchableOpacity
                    style={styles.tryAgainButton}
                    onPress={handleTryAgain}
                    activeOpacity={0.8}
                  >
                    <View style={styles.tryAgainGradient}>
                      <FontAwesome5 name="redo" size={16} color="#0072ff" style={{marginRight: 5}} />
                      <Text style={styles.tryAgainText}>Try Again</Text>
                    </View>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.continueButton}
                    onPress={() => setShowPractice(false)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.continueGradient}>
                      <Text style={styles.continueText}>Continue</Text>
                      <FontAwesome5 name="arrow-right" size={16} color="#0072ff" style={{marginLeft: 5}} />
                    </View>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </Animated.View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
  carouselContainer: {
    height: 440,
    marginTop: 20,
  },
  flatListContent: {
    paddingHorizontal: SPACING,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
  },
  card: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#0044ff',
    opacity: 0.5,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0044ff',
  },
  dayDisplay: {
    height: 140,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayAbbreviation: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  positionContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(230, 242, 255, 0.5)',
    borderRadius: 12,
    padding: 15,
  },
  positionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  boldText: {
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  audioButton: {
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  audioGradient: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationArrows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  navArrow: {
    padding: 5,
  },
  disabledArrow: {
    opacity: 0.5,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    margin: 4,
  },
  activePaginationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  practiceButtonContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  practiceButton: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '80%',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  practiceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  practiceButtonText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  practiceIcon: {
    marginLeft: 5,
  },
  practiceContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
  },
  questionNumberBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#0072ff',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  questionNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0044ff',
    marginVertical: 10,
    textAlign: 'center',
  },
  questionDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#f5f9ff',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedOptionButton: {
    borderColor: '#0072ff',
    backgroundColor: '#e6f2ff',
  },
  correctOptionButton: {
    borderColor: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  incorrectOptionButton: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedOptionText: {
    color: '#0044ff',
    fontWeight: '700',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 10,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#0072ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 5,
    borderColor: '#e6f2ff',
  },
  scoreText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0044ff',
    marginBottom: 10,
    textAlign: 'center',
  },
  resultsDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  tryAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  tryAgainText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  continueButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: "#FFFFFF",
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  continueText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 