import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  StatusBar,
  SafeAreaView,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechHelper from '../../../helpers/SpeechHelper';

// Constants for AsyncStorage keys
const DAILY_PRACTICE_KEY = 'daily_practice_completion';
const DAILY_STREAK_KEY = 'daily_practice_streak';

export default function DailyPracticeScreen() {
  const navigation = useNavigation();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null); // 'correct' or 'incorrect'
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [dailyStreak, setDailyStreak] = useState(0);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);
  const [todayCompleted, setTodayCompleted] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Daily practice data - mixed from different categories
  const dailyPracticeItems = [
    { 
      type: 'vowel',
      word: 'seat',
      correct: 'long',
      audio: 'seat.mp3',
      options: ['Long Vowel', 'Short Vowel'],
      answerValues: ['long', 'short'],

    },
    { 
      type: 'consonant',
      word: 'spring',
      correct: 'spr',
      audio: 'spring.mp3',
      options: ['SPR', 'STR', 'SPL'],
      answerValues: ['spr', 'str', 'spl'],

    },
    { 
      type: 'stress',
      word: 'CONduct (noun)',
      correct: 'first',
      audio: 'conduct-n.mp3',
      options: ['First Syllable', 'Second Syllable'],
      answerValues: ['first', 'second'],

    },
    { 
      type: 'intonation',
      sentence: 'Are you coming?',
      correct: 'rising',
      audio: 'question1.mp3',
      options: ['Rising Intonation', 'Falling Intonation'],
      answerValues: ['rising', 'falling'],

    },
    { 
      type: 'rhythm',
      sentence: 'I NEED to GO to the STORE.',
      correct: 'content-words',
      audio: 'sentence-stress1.mp3',
      options: ['Content Words', 'Function Words'],
      answerValues: ['content-words', 'function-words'],

    }
  ];

  useEffect(() => {
    // Load daily streak data
    loadDailyStreak();
    
    // Initialize progress animation
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    
    // Clean up audio when component unmounts
    return () => {
      SpeechHelper.stop();
    };
  }, []);

  // Function to load daily streak data
  const loadDailyStreak = async () => {
    try {
      const streakData = await AsyncStorage.getItem(DAILY_STREAK_KEY);
      const completionData = await AsyncStorage.getItem(DAILY_PRACTICE_KEY);
      
      if (streakData) {
        const { streak } = JSON.parse(streakData);
        setDailyStreak(streak);
      }
      
      if (completionData) {
        const { lastCompletionDate } = JSON.parse(completionData);
        setLastCompletionDate(lastCompletionDate);
        
        // Check if completed today
        const today = new Date().toDateString();
        if (lastCompletionDate === today) {
          setTodayCompleted(true);
        }
      }
    } catch (error) {
      console.error('Error loading daily streak data:', error);
    }
  };

  // Function to update daily streak
  const updateDailyStreak = async () => {
    try {
      const today = new Date().toDateString();
      let streak = dailyStreak;
      
      if (lastCompletionDate) {
        const lastDate = new Date(lastCompletionDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          // Completed yesterday, increment streak
          streak += 1;
        } else if (lastDate.toDateString() !== today) {
          // Not completed yesterday or today, reset streak
          streak = 1;
        }
      } else {
        // First time completing, start streak
        streak = 1;
      }
      
      // Save updated streak and completion date
      await AsyncStorage.setItem(DAILY_STREAK_KEY, JSON.stringify({ streak }));
      await AsyncStorage.setItem(DAILY_PRACTICE_KEY, JSON.stringify({ lastCompletionDate: today }));
      
      setDailyStreak(streak);
      setLastCompletionDate(today);
      setTodayCompleted(true);
      
      return streak;
    } catch (error) {
      console.error('Error updating daily streak:', error);
      return dailyStreak;
    }
  };

  // Function to play audio
  const playAudio = async () => {
    try {
      setIsPlaying(true);
      
      const currentItem = dailyPracticeItems[currentStep];
      let textToSpeak = '';
      
      if (currentItem.word) {
        textToSpeak = currentItem.word;
        
        // Remove annotations in parentheses if present
        if (textToSpeak.includes('(')) {
          textToSpeak = textToSpeak.split('(')[0].trim();
        }
      } else if (currentItem.sentence) {
        textToSpeak = currentItem.sentence;
      }
      
      // Configure speech options
      const speechOptions = {
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      };
      
      // Adjust speech parameters based on exercise type
      if (currentItem.type === 'intonation') {
        if (textToSpeak.endsWith('?')) {
          speechOptions.pitch = 1.2; // Higher pitch for questions
        }
      } else if (currentItem.type === 'rhythm') {
        speechOptions.rate = 0.7; // Slower for rhythm exercises
      }
      
      // Use the appropriate SpeechHelper method based on content type
      if (currentItem.sentence) {
        await SpeechHelper.speakSentence(textToSpeak, speechOptions);
      } else {
        await SpeechHelper.speakWord(textToSpeak, speechOptions);
      }
    } catch (error) {
      console.error('Failed to play audio:', error);
      setIsPlaying(false);
    }
  };

  // Function to handle user's answer
  const handleAnswer = (answer) => {
    const currentItem = dailyPracticeItems[currentStep];
    const isCorrect = currentItem.correct === answer;
    
    // Update score and show feedback
    if (isCorrect) {
      setScore(score + 1);
      setFeedbackType('correct');
    } else {
      setFeedbackType('incorrect');
    }
    
    setShowFeedback(true);
    
    // Animate feedback
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
    
    // After a delay, move to the next item
    setTimeout(() => {
      setShowFeedback(false);
      if (currentStep < (dailyPracticeItems.length - 1)) {
        setCurrentStep(currentStep + 1);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (currentStep + 1) / dailyPracticeItems.length * 100,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Practice completed
        updateDailyStreak().then(updatedStreak => {
          setShowCompletionModal(true);
        });
      }
    }, 1500);
  };

  // Function to start recording for pronunciation practice
  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, you would stop recording and process the audio
      // For this example, we'll simulate a correct answer after a delay
      setTimeout(() => {
        handleAnswer(dailyPracticeItems[currentStep].correct);
      }, 1000);
    } else {
      setIsRecording(true);
      // In a real app, you would start recording here
    }
  };

  // Function to restart the practice
  const restartPractice = () => {
    setCurrentStep(0);
    setScore(0);
    setShowCompletionModal(false);
    
    // Reset progress animation
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Get the current practice item
  const currentItem = dailyPracticeItems[currentStep];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#2200CC', '#3311DD', '#4422EE']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Daily 5-Min Practice</Text>
            <View style={styles.headerSubtitleContainer}>
              <FontAwesome5 name="fire" size={14} color="#FFD700" style={styles.streakIcon} />
              <Text style={styles.headerSubtitle}>Streak: {dailyStreak} days</Text>
            </View>
          </View>
          
          <View style={styles.placeholderButton} />
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View 
            style={[
              styles.progressBar,
              { width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%']
              }) }
            ]} 
          />
          <Text style={styles.progressText}>
            {currentStep + 1}/{dailyPracticeItems.length}
          </Text>
        </View>
        
        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Practice Item */}
          <Animated.View 
            style={[
              styles.practiceItemContainer,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim
              }
            ]}
          >
            {/* Display word or sentence based on what's available in the current item */}
            <View style={styles.wordContainer}>
              {currentItem.word ? (
                <Text style={styles.wordText}>{currentItem.word}</Text>
              ) : currentItem.sentence ? (
                <Text style={styles.sentenceText}>{currentItem.sentence}</Text>
              ) : (
                <Text style={styles.wordText}>Item not found</Text>
              )}
              <TouchableOpacity 
                style={[
                  styles.playButton,
                  isPlaying && styles.playButtonActive
                ]}
                onPress={playAudio}
                disabled={isPlaying}
              >
                <Ionicons 
                  name={isPlaying ? "pause-circle" : "play-circle"} 
                  size={36} 
                  color="#fff" 
                />
              </TouchableOpacity>
            </View>
            
            {/* Answer Options */}
            <View style={styles.answerOptionsContainer}>
              {currentItem.options.map((option, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.answerButton}
                  onPress={() => handleAnswer(currentItem.answerValues[index])}
                >
                  <Text style={styles.answerButtonText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {/* Feedback */}
            {showFeedback && (
              <View style={[
                styles.feedbackContainer,
                feedbackType === 'correct' ? styles.correctFeedback : styles.incorrectFeedback
              ]}>
                <Ionicons 
                  name={feedbackType === 'correct' ? "checkmark-circle" : "close-circle"} 
                  size={32} 
                  color={feedbackType === 'correct' ? '#4CAF50' : '#F44336'} 
                />
                <Text style={styles.feedbackText}>
                  {feedbackType === 'correct' ? 'Correct!' : 'Try Again!'}
                </Text>
              </View>
            )}
          </Animated.View>
          

          
          {/* Daily Challenge Info */}
          <View style={styles.challengeInfoContainer}>
            <View style={styles.challengeHeaderRow}>
              <FontAwesome5 name="calendar-check" size={18} color="#2200CC" />
              <Text style={styles.challengeTitle}>Daily Challenge</Text>
            </View>
            <Text style={styles.challengeDescription}>
              Complete this 5-minute practice every day to build your pronunciation skills and maintain your streak!
            </Text>
          </View>
        </ScrollView>
        
        {/* Completion Modal */}
        <Modal
          visible={showCompletionModal}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <LinearGradient
                colors={['#2200CC', '#4422EE']}
                style={styles.modalHeader}
              >
                <FontAwesome5 name="calendar-check" size={64} color="#FFD700" />
                <Text style={styles.modalTitle}>Daily Practice Complete!</Text>
              </LinearGradient>
              
              <View style={styles.modalBody}>
                <Text style={styles.scoreText}>Your Score</Text>
                <Text style={styles.scoreValue}>{score}/{dailyPracticeItems.length}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    <Text style={styles.statValue}>{score}</Text>
                    <Text style={styles.statLabel}>Correct</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <FontAwesome5 name="fire" size={24} color="#FF9800" />
                    <Text style={styles.statValue}>{dailyStreak}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={24} color="#2196F3" />
                    <Text style={styles.statValue}>5 min</Text>
                    <Text style={styles.statLabel}>Time</Text>
                  </View>
                </View>
                
                <View style={styles.streakMessageContainer}>
                  <Text style={styles.streakMessage}>
                    {dailyStreak > 1 
                      ? `Great job! You've practiced for ${dailyStreak} days in a row!` 
                      : "Great start! Come back tomorrow to build your streak!"}
                  </Text>
                </View>
                
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.restartButton]}
                    onPress={restartPractice}
                  >
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Practice Again</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.nextButton]}
                    onPress={() => {
                      setShowCompletionModal(false);
                      navigation.goBack();
                    }}
                  >
                    <Text style={styles.modalButtonText}>Continue</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  placeholderButton: {
    width: 40,
    height: 40,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  streakIcon: {
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginHorizontal: 16,
    marginBottom: 8,
    position: 'relative',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
  },
  progressText: {
    position: 'absolute',
    right: 0,
    top: 12,
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: 16,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  practiceItemContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  wordText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  sentenceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    flexWrap: 'wrap',
  },
  playButton: {
    padding: 8,
    backgroundColor: '#2200CC',
    borderRadius: 30,
  },
  playButtonActive: {
    opacity: 0.7,
  },
  answerOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    width: '100%',
    marginVertical: 10,
  },
  answerButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    marginVertical: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  answerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2200CC',
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
  },
  correctFeedback: {
    backgroundColor: '#E8F5E9',
  },
  incorrectFeedback: {
    backgroundColor: '#FFEBEE',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },

  challengeInfoContainer: {
    padding: 16,
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2200CC',
  },
  challengeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  modalHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    textAlign: 'center',
  },
  modalBody: {
    padding: 24,
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  streakMessageContainer: {
    backgroundColor: '#F5F9FF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  streakMessage: {
    fontSize: 16,
    color: '#2200CC',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  restartButton: {
    backgroundColor: '#9E9E9E',
  },
  nextButton: {
    backgroundColor: '#2200CC',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 4,
  },
}); 