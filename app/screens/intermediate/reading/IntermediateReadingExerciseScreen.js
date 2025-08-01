import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  Modal,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function IntermediateReadingExerciseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { textId, textData } = route.params;
  
  const [currentText, setCurrentText] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState('reading'); // reading, quiz, results
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  const [selectedWords, setSelectedWords] = useState([]);
  const [vocabulary, setVocabulary] = useState([]);
  const [showDefinition, setShowDefinition] = useState(false);
  const [currentDefinition, setCurrentDefinition] = useState(null);

  useEffect(() => {
    // Load text data
    if (textData) {
      setCurrentText(textData);
      setLoading(false);
      
      // Initialize quiz answers
      if (textData.quizzes) {
        const initialAnswers = {};
        textData.quizzes.forEach((quiz, index) => {
          initialAnswers[index] = null;
        });
        setQuizAnswers(initialAnswers);
      }
      
      // Extract vocabulary words for practice
      if (textData.content) {
        const words = textData.content.split(' ')
          .filter(word => word.length > 5)
          .filter((word, index, self) => 
            self.indexOf(word.replace(/[.,!?;:()]/g, '').toLowerCase()) === 
            index.toString().replace(/[.,!?;:()]/g, '').toLowerCase()
          )
          .slice(0, 10)
          .map(word => ({
            word: word.replace(/[.,!?;:()]/g, ''),
            definition: "Tap to look up definition",
            example: `Example: "${word} appears in the text."`
          }));
        setVocabulary(words);
      }
    } else {
      // If textData is not passed directly, try to fetch from storage
      const fetchText = async () => {
        try {
          const savedTexts = await AsyncStorage.getItem('userReadingTexts');
          if (savedTexts) {
            const parsedTexts = JSON.parse(savedTexts);
            const foundText = parsedTexts.find(text => text.id === textId);
            if (foundText) {
              setCurrentText(foundText);
              
              // Initialize quiz answers
              if (foundText.quizzes) {
                const initialAnswers = {};
                foundText.quizzes.forEach((quiz, index) => {
                  initialAnswers[index] = null;
                });
                setQuizAnswers(initialAnswers);
              }
            }
          }
          setLoading(false);
        } catch (error) {
          console.log('Error fetching text:', error);
          setLoading(false);
        }
      };
      
      fetchText();
    }
  }, [textId, textData]);

  // Timer for reading time tracking
  useEffect(() => {
    let interval = null;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSelectAnswer = (questionIndex, answer) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answer
    });
  };

  const handleSubmitQuiz = () => {
    // Calculate results
    let correctCount = 0;
    let totalQuestions = currentText.quizzes.length;
    
    currentText.quizzes.forEach((quiz, index) => {
      if (quizAnswers[index] === quiz.correctAnswer) {
        correctCount++;
      }
    });
    
    const score = Math.round((correctCount / totalQuestions) * 100);
    
    setQuizResults({
      score,
      correctCount,
      totalQuestions,
      timeSpent: formatTime(timer)
    });
    
    setCurrentStep('results');
    setTimerActive(false);
    
    // Save progress
    saveProgress(score);
  };

  const saveProgress = async (score) => {
    try {
      // Get existing progress
      const progressString = await AsyncStorage.getItem('readingProgress');
      let progress = progressString ? JSON.parse(progressString) : {};
      
      // Update progress for this text
      progress[textId] = {
        completed: true,
        score,
        date: new Date().toISOString(),
        timeSpent: timer
      };
      
      // Save updated progress
      await AsyncStorage.setItem('readingProgress', JSON.stringify(progress));
    } catch (error) {
      console.log('Error saving progress:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleWordSelect = (word) => {
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter(w => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const lookupDefinition = async (word) => {
    setCurrentDefinition({
      word: word,
      loading: true,
      definition: null,
      error: null
    });
    setShowDefinition(true);
    
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      
      if (response.status === 200 && data && data.length > 0) {
        // Successfully got definition
        const definitions = [];
        
        // Extract all definitions
        data[0].meanings.forEach(meaning => {
          meaning.definitions.forEach(def => {
            definitions.push({
              partOfSpeech: meaning.partOfSpeech,
              definition: def.definition,
              example: def.example || null
            });
          });
        });
        
        setCurrentDefinition({
          word: word,
          loading: false,
          definition: {
            meanings: definitions,
            phonetic: data[0].phonetic || null,
            audio: data[0].phonetics && data[0].phonetics.length > 0 ? 
                  data[0].phonetics.find(p => p.audio) ? data[0].phonetics.find(p => p.audio).audio : null 
                  : null
          },
          error: null
        });
      } else {
        // No definition found
        setCurrentDefinition({
          word: word,
          loading: false,
          definition: null,
          error: "No definition found for this word."
        });
      }
    } catch (error) {
      setCurrentDefinition({
        word: word,
        loading: false,
        definition: null,
        error: "Error looking up definition. Please try again."
      });
    }
  };

  const renderReadingContent = () => {
    if (!currentText || !currentText.content) return null;
    
    // Split content into words for interactive selection
    const words = currentText.content.split(' ');
    
    return (
      <View style={styles.readingContainer}>
        <Text style={styles.readingTitle}>{currentText.title}</Text>
        <View style={styles.readingMetaContainer}>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{currentText.difficulty}</Text>
          </View>
          <Text style={styles.readingMeta}>
            {currentText.wordCount} words • Est. {currentText.estimatedTime}
          </Text>
        </View>
        
        <View style={styles.textContentContainer}>
          <Text style={styles.textContent}>
            {words.map((word, index) => {
              // Clean the word for selection (remove punctuation)
              const cleanWord = word.replace(/[.,!?;:()]/g, '');
              return (
                <Text 
                  key={index}
                  style={[
                    styles.textWord,
                    selectedWords.includes(cleanWord) && styles.selectedWord
                  ]}
                  onPress={() => handleWordSelect(cleanWord)}
                >
                  {word}{' '}
                </Text>
              );
            })}
          </Text>
        </View>
        
        {selectedWords.length > 0 && (
          <View style={styles.vocabularyContainer}>
            <Text style={styles.vocabularyTitle}>Selected Words</Text>
            {selectedWords.map((word, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.vocabularyItem}
                onPress={() => lookupDefinition(word)}
              >
                <Text style={styles.vocabularyWord}>{word}</Text>
                <Text style={styles.vocabularyDefinition}>
                  Tap to look up definition
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => setCurrentStep('quiz')}
        >
          <Text style={styles.continueButtonText}>Continue to Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuiz = () => {
    if (!currentText || !currentText.quizzes) return null;
    
    return (
      <View style={styles.quizContainer}>
        <Text style={styles.quizTitle}>Reading Comprehension Quiz</Text>
        <Text style={styles.quizSubtitle}>
          Answer the questions based on the text you just read
        </Text>
        
        {currentText.quizzes.map((quiz, questionIndex) => (
          <View key={questionIndex} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {questionIndex + 1}. {quiz.question}
            </Text>
            
            <View style={styles.optionsContainer}>
              {quiz.options.map((option, optionIndex) => (
                <TouchableOpacity 
                  key={optionIndex}
                  style={[
                    styles.optionButton,
                    quizAnswers[questionIndex] === option && styles.selectedOption
                  ]}
                  onPress={() => handleSelectAnswer(questionIndex, option)}
                >
                  <Text style={[
                    styles.optionText,
                    quizAnswers[questionIndex] === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
        
        <TouchableOpacity 
          style={[
            styles.submitButton,
            Object.values(quizAnswers).some(answer => answer === null) && styles.disabledButton
          ]}
          disabled={Object.values(quizAnswers).some(answer => answer === null)}
          onPress={handleSubmitQuiz}
        >
          <Text style={styles.submitButtonText}>Submit Answers</Text>
        </TouchableOpacity>
        

      </View>
    );
  };

  const renderResults = () => {
    if (!quizResults) return null;
    
    return (
      <View style={styles.resultsContainer}>
        <View style={styles.scoreCircle}>
          <Text style={styles.scoreText}>{quizResults.score}%</Text>
        </View>
        
        <Text style={styles.resultsTitle}>
          {quizResults.score >= 80 ? 'Great job!' : 
           quizResults.score >= 60 ? 'Good effort!' : 
           'Keep practicing!'}
        </Text>
        
        <View style={styles.resultsStats}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Correct Answers</Text>
            <Text style={styles.statValue}>
              {quizResults.correctCount}/{quizResults.totalQuestions}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Time Spent</Text>
            <Text style={styles.statValue}>{quizResults.timeSpent}</Text>
          </View>
        </View>
        
        <View style={styles.vocabularySection}>
          <Text style={styles.vocabularySectionTitle}>Vocabulary Practice</Text>
          <Text style={styles.vocabularyDescription}>
            Here are some key words from the text to practice:
          </Text>
          
          <ScrollView style={styles.vocabularyList}>
            {vocabulary.map((item, index) => (
              <View key={index} style={styles.vocabularyCard}>
                <Text style={styles.vocabularyCardWord}>{item.word}</Text>
                <Text style={styles.vocabularyCardDefinition}>{item.definition}</Text>
                <Text style={styles.vocabularyCardExample}>{item.example}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => {
              setCurrentStep('reading');
              setQuizAnswers({});
              setQuizResults(null);
              setTimer(0);
              setTimerActive(true);
            }}
          >
            <Text style={styles.retryButtonText}>Read Again</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.finishButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDefinitionModal = () => {
    if (!showDefinition) return null;
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDefinition}
        onRequestClose={() => setShowDefinition(false)}
      >
        <View style={styles.definitionModalContainer}>
          <View style={styles.definitionModalContent}>
            <View style={styles.definitionModalHeader}>
              <Text style={styles.definitionModalTitle}>
                {currentDefinition ? currentDefinition.word : ''}
              </Text>
              <TouchableOpacity onPress={() => setShowDefinition(false)}>
                <Ionicons name="close-circle" size={24} color="#0072ff" />
              </TouchableOpacity>
            </View>
            
            {currentDefinition && currentDefinition.loading && (
              <View style={styles.definitionLoading}>
                <ActivityIndicator size="large" color="#0072ff" />
                <Text style={styles.definitionLoadingText}>Looking up definition...</Text>
              </View>
            )}
            
            {currentDefinition && currentDefinition.error && (
              <View style={styles.definitionError}>
                <Ionicons name="alert-circle-outline" size={24} color="#F44336" />
                <Text style={styles.definitionErrorText}>{currentDefinition.error}</Text>
              </View>
            )}
            
            {currentDefinition && currentDefinition.definition && (
              <ScrollView style={styles.definitionScrollView}>
                {currentDefinition.definition.phonetic && (
                  <Text style={styles.definitionPhonetic}>
                    {currentDefinition.definition.phonetic}
                  </Text>
                )}
                
                {currentDefinition.definition.meanings.map((meaning, index) => (
                  <View key={index} style={styles.definitionMeaning}>
                    <Text style={styles.definitionPartOfSpeech}>
                      {meaning.partOfSpeech}
                    </Text>
                    <Text style={styles.definitionText}>
                      {meaning.definition}
                    </Text>
                    {meaning.example && (
                      <Text style={styles.definitionExample}>
                        "{meaning.example}"
                      </Text>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0072ff" />
        <Text style={styles.loadingText}>Loading reading exercise...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#00c6ff", "#0072ff"]}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={36} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          {currentStep === 'reading' ? 'Reading' : 
           currentStep === 'quiz' ? 'Quiz' : 'Results'}
        </Text>
        
        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#fff" />
          <Text style={styles.timerText}>{formatTime(timer)}</Text>
        </View>
      </LinearGradient>
      
      <ScrollView 
        style={styles.contentContainer}
        contentContainerStyle={styles.contentContainerStyle}
      >
        {currentStep === 'reading' && renderReadingContent()}
        {currentStep === 'quiz' && renderQuiz()}
        {currentStep === 'results' && renderResults()}
      </ScrollView>
      
      {renderDefinitionModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#0072ff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    position: 'relative',
    height: 100, // Fixed height for the header
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '70%',
  },
  timerContainer: {
    position: 'absolute',
    right: 15,
    top: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  timerText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -20,
  },
  contentContainerStyle: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // Reading styles
  readingContainer: {
    padding: 10,
  },
  readingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  readingMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  difficultyBadge: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0072ff',
  },
  readingMeta: {
    fontSize: 14,
    color: '#666',
  },
  textContentContainer: {
    backgroundColor: '#F5F9FF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0072ff',
  },
  textContent: {
    fontSize: 16,
    lineHeight: 26,
    color: '#333',
  },
  textWord: {
    color: '#333',
  },
  selectedWord: {
    backgroundColor: '#E8F4FF',
    color: '#0072ff',
    fontWeight: '500',
  },
  vocabularyContainer: {
    backgroundColor: '#F5F9FF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  vocabularyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 10,
  },
  vocabularyItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  vocabularyWord: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  vocabularyDefinition: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  continueButton: {
    backgroundColor: '#0072ff',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Quiz styles
  quizContainer: {
    padding: 10,
  },
  quizTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  quizSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#F5F9FF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  optionsContainer: {
    marginTop: 5,
  },
  optionButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#E8F4FF',
    borderColor: '#0072ff',
  },
  optionText: {
    fontSize: 15,
    color: '#333',
  },
  selectedOptionText: {
    color: '#0072ff',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2200CC',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#9999CC',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  
  // Results styles
  resultsContainer: {
    alignItems: 'center',
    padding: 10,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#0072ff',
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  vocabularySection: {
    width: '100%',
    marginBottom: 30,
  },
  vocabularySectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  vocabularyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  vocabularyList: {
    maxHeight: 200,
  },
  vocabularyCard: {
    backgroundColor: '#F5F9FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  vocabularyCardWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  vocabularyCardDefinition: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  vocabularyCardExample: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  retryButton: {
    backgroundColor: '#E8F4FF',
    borderWidth: 1,
    borderColor: '#0072ff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 10,
  },
  retryButtonText: {
    color: '#0072ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#0072ff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 10,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Definition modal styles
  definitionModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  definitionModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  definitionModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  definitionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  definitionLoading: {
    alignItems: 'center',
    padding: 20,
  },
  definitionLoadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  definitionError: {
    alignItems: 'center',
    padding: 20,
  },
  definitionErrorText: {
    marginTop: 10,
    color: '#F44336',
    fontSize: 16,
    textAlign: 'center',
  },
  definitionScrollView: {
    maxHeight: 400,
  },
  definitionPhonetic: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 15,
  },
  definitionMeaning: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F5F9FF',
    borderRadius: 10,
  },
  definitionPartOfSpeech: {
    fontSize: 14,
    color: '#0072ff',
    fontWeight: '600',
    marginBottom: 5,
  },
  definitionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  definitionExample: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
}); 