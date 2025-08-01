import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView, 
  Animated,
  Image,
  Dimensions,
  FlatList,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const SPACING = width * 0.05;

export default function PrepositionsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [currentSection, setCurrentSection] = useState(0);
  const [buttonScale] = useState(new Animated.Value(1));
  const [showPractice, setShowPractice] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Preposition categories with examples and images
  const sections = [
    {
      id: 1,
      title: 'Prepositions of Place',
      description: 'These words show where something is, its position or location',
      examples: [
        { 
          preposition: 'in', 
          example: 'The book is in the bag.', 
          image: require('../../../../assets/items/booki.png'),
          explanation: 'Use "in" when something is inside an enclosed space'
        },
        { 
          preposition: 'on', 
          example: 'The cup is on the table.', 
          image: require('../../../../assets/items/cupo.png'),
          explanation: 'Use "on" when something is on a surface or touching something'
        },
        { 
          preposition: 'under', 
          example: 'The cat is under the chair.', 
          image: require('../../../../assets/items/cat1.png'),
          explanation: 'Use "under" when something is below or beneath something else'
        },
        { 
          preposition: 'behind', 
          example: 'The tree is behind the house.', 
          image: require('../../../../assets/items/houseB.png'),
          explanation: 'Use "behind" when something is at the back of something else'
        }
      ]
    },
    {
      id: 2,
      title: 'Prepositions of Time',
      description: 'These prepositions show when something happens',
      examples: [
        { 
          preposition: 'at', 
          example: 'The meeting starts at 3 PM.', 
          image: require('../../../../assets/items/meeting.png'),
          explanation: 'Use \'at\' for specific times'
        },
        { 
          preposition: 'in', 
          example: 'I was born in May.', 
          image: require('../../../../assets/items/may.png'),
          explanation: 'Use \'in\' for months, years, seasons, and longer periods'
        },
        { 
          preposition: 'on', 
          example: 'We have class on Monday.', 
          image: require('../../../../assets/items/monday.png'),
          explanation: 'Use \'on\' for days and dates'
        },
        { 
          preposition: 'during', 
          example: 'I read a book during my break.', 
          image: require('../../../../assets/items/Rbook.png'),
          explanation: 'Use "during" for events or periods of time'
        }
      ]
    },
    {
      id: 3,
      title: 'Prepositions of Movement',
      description: 'These prepositions show how something moves or where it goes',
      examples: [
        { 
          preposition: 'to', 
          example: "I'm going to the store.", 
          image: require('../../../../assets/items/Store.png'),
          explanation: 'Use "to" when going toward a place'
        },
        { 
          preposition: 'through', 
          example: 'We walked through the park.', 
          image: require('../../../../assets/items/park.png'),
          explanation: 'Use "through" for movement from one side to another'
        },
        { 
          preposition: 'across', 
          example: 'She ran across the street.', 
          image: require('../../../../assets/items/cross.png'),
          explanation: 'Use "across" for movement from one side to the other side'
        },
        { 
          preposition: 'around', 
          example: 'The dog ran around the yard.', 
          image: require('../../../../assets/items/dogR.png'),
          explanation: 'Use "around" for circular or curved movement'
        }
      ]
    }
  ];

  // Practice questions for each section
  const practiceQuestions = [
    [
      {
        question: "The keys are _____ the drawer.",
        options: ["on", "in", "at"],
        answer: "in"
      },
      {
        question: "The cat is sleeping _____ the sofa.",
        options: ["under", "on", "behind"],
        answer: "on"
      },
      {
        question: "There is a ball _____ the table.",
        options: ["on", "in", "under"],
        answer: "under"
      }
    ],
    [
      {
        question: "My birthday is _____ June.",
        options: ["at", "on", "in"],
        answer: "in"
      },
      {
        question: "The meeting starts _____ 9 AM.",
        options: ["in", "on", "at"],
        answer: "at"
      },
      {
        question: "We have a test _____ Friday.",
        options: ["at", "on", "in"],
        answer: "on"
      }
    ],
    [
      {
        question: "I'm walking _____ the park.",
        options: ["to", "on", "at"],
        answer: "to"
      },
      {
        question: "The bird flew _____ the window.",
        options: ["through", "on", "at"],
        answer: "through"
      },
      {
        question: "She walked _____ the bridge to get to the other side.",
        options: ["around", "across", "in"],
        answer: "across"
      }
    ]
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
  }, []);

  const handleNextSection = () => {
    if (currentSection < sections.length - 1) {
      // Button animation
      Animated.sequence([
        Animated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        })
      ]).start(() => {
        setCurrentSection(currentSection + 1);
        setShowPractice(false);
      });
    } else {
      // Navigate back to the topic selection
      navigation.goBack();
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
    const correct = answer === practiceQuestions[currentSection][currentQuestion].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    // Delay before showing next question
    setTimeout(() => {
      if (currentQuestion < practiceQuestions[currentSection].length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      } else {
        // Practice completed
        setPracticeCompleted(true);
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

  const renderExampleCard = ({ item, index }) => {
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
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.preposition}>{item.preposition}</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.exampleImage} />
          </View>

          <View style={styles.exampleContainer}>
            <Text style={styles.exampleTitle}>Example:</Text>
            <Text style={styles.exampleText}>{item.example}</Text>
          </View>

          <View style={styles.explanationContainer}>
            <Text style={styles.explanationTitle}>Usage:</Text>
            <Text style={styles.explanationText}>{item.explanation}</Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderPracticeSection = () => {
    if (practiceCompleted) {
      return (
        <View style={styles.practiceContainer}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Practice Complete!</Text>
            <Text style={styles.scoreText}>
              Your Score: {score}/{practiceQuestions[currentSection].length}
            </Text>
            <Text style={styles.resultsDescription}>
              {score === practiceQuestions[currentSection].length
                ? 'Fantastic work! You got all correct! (3 Correct)'
                : score >= 2
                ? 'Almost there! Keep practicing and you\'ll get it! (2 Corrects)'
                : score === 1
                ? 'Well tried! Don\'t give up! (1 Correct)'
                : 'It\'s okay! You\'ll get better with practice! (0 Correct)'
              }
            </Text>
            <TouchableOpacity
              style={styles.tryAgainButton}
              onPress={handleTryAgain}
            >
              <Text style={styles.tryAgainText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const currentQuestionData = practiceQuestions[currentSection][currentQuestion];

    return (
      <View style={styles.practiceContainer}>
        <View style={styles.questionCard}>
          <Text style={styles.questionNumber}>
            Question {currentQuestion + 1}/{practiceQuestions[currentSection].length}
          </Text>
          <Text style={styles.questionText}>{currentQuestionData.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestionData.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && 
                    (isCorrect ? styles.correctOption : styles.incorrectOption)
                ]}
                onPress={() => selectedAnswer === null && handleAnswerSelect(option)}
                disabled={selectedAnswer !== null}
              >
                <Text 
                  style={[
                    styles.optionText,
                    selectedAnswer === option && 
                      (isCorrect ? styles.correctOptionText : styles.incorrectOptionText)
                  ]}
                >
                  {option}
                </Text>
                {selectedAnswer === option && isCorrect && (
                  <MaterialIcons name="check-circle" size={24} color="#4CAF50" style={styles.resultIcon} />
                )}
                {selectedAnswer === option && !isCorrect && (
                  <MaterialIcons name="cancel" size={24} color="#F44336" style={styles.resultIcon} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Prepositions</Text>
        
        <View style={styles.headerRight}>
          <Text style={styles.progressText}>
            {currentSection + 1}/{sections.length}
          </Text>
        </View>
      </View>

      {!showPractice ? (
        <View style={styles.learningContainer}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }}
            >
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{sections[currentSection].title}</Text>
                <Text style={styles.sectionDescription}>{sections[currentSection].description}</Text>
                
                <View style={styles.examplesContainer}>
                  <FlatList
                    ref={flatListRef}
                    data={sections[currentSection].examples}
                    keyExtractor={(item, index) => `example-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToInterval={CARD_WIDTH + SPACING}
                    decelerationRate="fast"
                    contentContainerStyle={styles.flatListContent}
                    onScroll={Animated.event(
                      [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                      { useNativeDriver: false }
                    )}
                    renderItem={renderExampleCard}
                  />
                </View>
              </View>
            </Animated.View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.practiceButton}
              onPress={handleStartPractice}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.practiceButtonText}>Practice</Text>
                <FontAwesome5 name="pencil-alt" size={16} color="#0072ff" style={styles.buttonIcon} />
              </View>
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: buttonScale }], width: '48%' }}>
              <TouchableOpacity 
                style={styles.nextButton}
                onPress={handleNextSection}
                activeOpacity={0.8}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.nextButtonText}>
                    {currentSection < sections.length - 1 ? 'Next' : 'Finish'}
                  </Text>
                  <FontAwesome5 
                    name={currentSection < sections.length - 1 ? "arrow-right" : "check"} 
                    size={16} 
                    color="#0072ff" 
                    style={styles.buttonIcon} 
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      ) : (
        renderPracticeSection()
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  learningContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    opacity: 0.9,
  },
  examplesContainer: {
    marginTop: 10,
  },
  flatListContent: {
    paddingHorizontal: SPACING / 2,
    paddingBottom: 10,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginHorizontal: SPACING / 2,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 15,
    padding: 16,
    height: 400,
    backgroundColor: '#fff',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  preposition: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0072ff',
  },
  imageContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(240, 248, 255, 0.5)',
    borderRadius: 10,
  },
  exampleImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  exampleContainer: {
    marginBottom: 15,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  exampleText: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: '500',
  },
  explanationContainer: {
    marginTop: 5,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  explanationText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
  },
  practiceButton: {
    width: '48%',
    borderRadius: 28,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonContent: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  nextButton: {
    borderRadius: 28,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  nextButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  // Practice section styles
  practiceContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  questionNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4CAF50',
  },
  incorrectOption: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    borderColor: '#F44336',
  },
  optionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: '700',
  },
  incorrectOptionText: {
    color: '#F44336',
    fontWeight: '700',
  },
  resultIcon: {
    marginLeft: 10,
  },
  scoreCard: {
    borderRadius: 15,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 15,
  },
  scoreText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 25,
  },
  tryAgainButton: {
    backgroundColor: '#fff',
    borderRadius: 28,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#0072ff',
  },
  tryAgainText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultsDescription: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  }
});