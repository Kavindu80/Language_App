import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  ScrollView, 
  Image,
  Dimensions,
  Easing
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export default function AdvancedGrammarConceptsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedTense, setSelectedTense] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [showPracticeModal, setShowPracticeModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showOverviewModal, setShowOverviewModal] = useState(false);
  const [currentTenseForModal, setCurrentTenseForModal] = useState(null);
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState('');
  
  // Practice state
  const [practiceAnswers, setPracticeAnswers] = useState({});
  const [practiceSubmitted, setPracticeSubmitted] = useState(false);

  const tenses = [
    {
      id: 1,
      title: 'Continuous tense',
      description: 'The Continuous Tense is used to describe actions that are in progress now or around the present time. It focuses on the ongoing nature and duration of the action.',
      examples: [
        '• Present Continuous: I am reading a book right now.',
        '• Past Continuous: She was studying when I called her yesterday.',
        '• Future Continuous: They will be travelling to Paris next week.'
      ],
      formula: 'Subject + be (am/is/are/was/were) + verb-ing',
      tips: 'Continuous Tenses always use a form of "be" followed by the -ing form of the main verb.',
      icon: 'clock-outline'
    },
    {
      id: 2,
      title: 'Perfect Tense',
      description: 'Used to show a connection between past actions and the present moment, or to indicate that one action happened before another.',
      examples: [
        'I have finished my homework already.',
        'She had left before I arrived at the party.',
        'They will have completed the project by next Friday.'
      ],
      formula: 'Subject + have/has/had + past participle',
      tips: 'The Perfect Tense often uses words like "already", "yet", "just", "ever", "never", "before" and "by".',
      icon: 'check-circle-outline'
    },
    {
      id: 3,
      title: 'Perfect Continuous Tense',
      description: 'Used to emphasize the duration of an action that started in the past and continues to the present or up to a specific time.',
      examples: [
        'I have been waiting for an hour.',
        'She had been working all day when I called.',
        'They will have been studying for six hours by 8pm.'
      ],
      formula: 'Subject + have/has/had + been + verb-ing',
      tips: 'Perfect Continuous Tenses often highlight the duration of an action. They commonly use "for" (a period of time) or "since" (a specific point in time).',
      icon: 'progress-clock'
    }
  ];

  useEffect(() => {
    // Animation when screen loads
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
      }),
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )
    ]).start();
  }, []);

  useEffect(() => {
    // Update progress when a tense is selected
    const newProgress = selectedTense ? (1 / tenses.length) : 0;
    setProgress(newProgress);
    
    Animated.timing(progressAnim, {
      toValue: newProgress,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [selectedTense]);

  // Reset quiz state when modal is opened or closed
  useEffect(() => {
    if (showQuizModal) {
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizScore(0);
      setQuizFeedback('');
    }
  }, [showQuizModal]);
  
  // Reset practice state when modal is opened or closed
  useEffect(() => {
    if (showPracticeModal) {
      setPracticeAnswers({});
      setPracticeSubmitted(false);
    }
  }, [showPracticeModal]);

  const handleTenseSelect = (tense) => {
    // Provide haptic feedback
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
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
    ]).start();
    
    setSelectedTense(tense.id === selectedTense ? null : tense.id);
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const renderProgressBar = () => {
    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {selectedTense ? '1 of 3 concepts explored' : 'Select a concept to begin'}
        </Text>
      </View>
    );
  };

  const handlePracticePress = (tense) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    setCurrentTenseForModal(tense);
    setShowPracticeModal(true);
    
    // Here you would navigate to a practice screen or show a modal
    console.log(`Practice ${tense.title}`);
  };

  const handleQuizPress = (tense) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    setCurrentTenseForModal(tense);
    setShowQuizModal(true);
    
    // Here you would navigate to a quiz screen or show a modal
    console.log(`Quiz on ${tense.title}`);
  };

  const handleOverviewPress = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    setShowOverviewModal(true);
    
    // Here you would show a comprehensive overview of all tenses
    console.log('Show all tenses overview');
  };
  
  const handleQuizOptionSelect = (questionId, option) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };
  
  const handlePracticeOptionSelect = (questionId, option) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    setPracticeAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };
  
  const submitQuiz = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    // Get quiz questions for current tense
    const quizQuestions = getQuizQuestions(currentTenseForModal);
    
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = quizQuestions ? quizQuestions.length : 0;
    
    // Safely check answers with null checks
    if (quizQuestions && quizQuestions.length > 0) {
      quizQuestions.forEach(question => {
        if (question && question.id && question.correctAnswer && 
            quizAnswers && quizAnswers[question.id] === question.correctAnswer) {
          correctAnswers++;
        }
      });
    }
    
    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    setQuizScore(score);
    
    // Set feedback based on score and tense type
    let feedback = '';
    
    if (currentTenseForModal && currentTenseForModal.title === 'Perfect Continuous Tense') {
      // Perfect Continuous Tense feedback messages
      if (score === 100) {
        feedback = 'Outstanding! All answers are correct. You\'re on fire!';
      } else if (score === 80) {
        feedback = 'So close! Just one step away from full marks. Try again!';
      } else if (score === 60) {
        feedback = 'Well done! You\'re improving. Give it another go for a perfect score!';
      } else if (score === 40) {
        feedback = 'Keep it up! A bit more effort and you\'ll get there!';
      } else if (score === 20) {
        feedback = 'Not bad! You\'re learning. Try again and reach higher!';
      } else {
        feedback = 'It\'s okay! Each try helps you grow. Keep practicing and don\'t stop!';
      }
    } else if (currentTenseForModal && currentTenseForModal.title === 'Perfect Tense') {
      // Perfect Tense feedback messages
      if (score === 100) {
        feedback = 'Excellent! You nailed all the answers! Keep it going!';
      } else if (score === 80) {
        feedback = 'Great job! You\'re nearly perfect! One more try for full marks!';
      } else if (score === 60) {
        feedback = 'Nice work! You\'re making progress. Practice again for a perfect score!';
      } else if (score === 40) {
        feedback = 'You\'re getting there! A little more practice and you\'ll do even better!';
      } else if (score === 20) {
        feedback = 'Good try! Keep going. You\'re on your way to full marks!';
      } else {
        feedback = 'Don\'t give up! Every step is progress. Practice again and aim for a perfect score!';
      }
    } else {
      // Continuous Tense and other tenses feedback messages
      if (score === 100) {
        feedback = 'Wow! All correct! Keep it up! (5 Corrects)';
      } else if (score === 80) {
        feedback = 'Great job! You\'re almost perfect. One more try for full marks! (4 Corrects)';
      } else if (score === 60) {
        feedback = 'Good effort! You\'re improving. Practice again and try once more for full marks! (3 Corrects)';
      } else if (score === 40) {
        feedback = 'Not bad! Keep practicing and try once more for full marks! (2 Corrects)';
      } else if (score === 20) {
        feedback = 'Getting better! Keep practicing and try again for full marks! (1 Corrects)';
      } else {
        feedback = 'Don\'t worry! Every attempt helps you grow. Keep practicing! (0 Corrects)';
      }
    }
    setQuizFeedback(feedback);
    
    setQuizSubmitted(true);
  };
  
  const submitPractice = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Success);
    } catch (error) {
      console.log('Haptics not supported');
    }
    
    // Add safety checks
    if (!practiceAnswers || Object.keys(practiceAnswers).length === 0) {
      console.log('No practice answers to submit');
      return;
    }
    
    setPracticeSubmitted(true);
  };
  
  const getQuizQuestions = (tense) => {
    if (!tense) return [];
    
    // Common questions for all tenses
    const commonQuestions = [
      {
        id: 'common1',
        question: 'Which form of the verb is used in Perfect Continuous Tenses?',
        options: ['Base form', '-ing form', 'Past participle'],
        correctAnswer: '-ing form'
      },
      {
        id: 'common2',
        question: 'Which auxiliary verb is used in Perfect Continuous Tenses?',
        options: ['have/has', 'be (am/is/are)', 'do/does'],
        correctAnswer: 'have/has'
      }
    ];
    
    // Tense-specific questions
    const tenseQuestions = {
      'Continuous tense': [
        {
          id: 'cont1',
          question: 'Which form of the verb is used in Continuous Tenses?',
          options: [
            'Base form',
            '-ing form',
            'Past participle'
          ],
          correctAnswer: '-ing form'
        },
        {
          id: 'cont2',
          question: 'Which auxiliary verb is used in Continuous Tenses?',
          options: [
            'have / has',
            'be ( am / is / are )',
            'do / does'
          ],
          correctAnswer: 'be ( am / is / are )'
        },
        {
          id: 'cont3',
          question: 'Which sentence uses the Continuous Tense correctly?',
          options: [
            'I reading a book now.',
            'She read a book yesterday.',
            'They are watching TV right now.'
          ],
          correctAnswer: 'They are watching TV right now.'
        },
        {
          id: 'cont4',
          question: 'What does the Continuous Tense emphasize?',
          options: [
            'Completion of an action.',
            'The process and duration of an action.',
            'Future plans.'
          ],
          correctAnswer: 'The process and duration of an action.'
        },
        {
          id: 'cont5',
          question: 'Which time expression is commonly used with Continuous Tense?',
          options: [
            'Yesterday.',
            'Right now.',
            'Last week.'
          ],
          correctAnswer: 'Right now.'
        }
      ],
      'Perfect Tense': [
        {
          id: 'perf1',
          question: 'Which form of the verb is used in the Perfect Tense?',
          options: [
            'Base form',
            '-ing form',
            'Past participle'
          ],
          correctAnswer: 'Past participle'
        },
        {
          id: 'perf2',
          question: 'Which auxiliary verb is used in the Perfect Tense?',
          options: [
            'have / has',
            'be (am / is / are)',
            'do / does'
          ],
          correctAnswer: 'have / has'
        },
        {
          id: 'perf3',
          question: 'Which sentence uses the Perfect Tense correctly?',
          options: [
            'I have finish my homework.',
            'She has left before I arrived.',
            'They competing the project by next week.'
          ],
          correctAnswer: 'She has left before I arrived.'
        },
        {
          id: 'perf4',
          question: 'What form of the main verb is used in Perfect Tense?',
          options: [
            'Base form',
            '-ing form',
            'Past participle'
          ],
          correctAnswer: 'Past participle'
        },
        {
          id: 'perf5',
          question: 'Which helping verb is common in all Perfect Tenses?',
          options: [
            'have / has',
            'be (am / is / are)',
            'do / does'
          ],
          correctAnswer: 'have / has'
        }
      ],
      'Perfect Continuous Tense': [
        {
          id: 'perfcont1',
          question: 'Which sentence uses the Perfect Continuous Tense correctly?',
          options: [
            'I have been waiting for an hour.',
            'She been working all day.',
            'They will working for six hours.'
          ],
          correctAnswer: 'I have been waiting for an hour.'
        },
        {
          id: 'perfcont2',
          question: 'What does Perfect Continuous Tense emphasize?',
          options: [
            'Completion of an action',
            'Duration of an action that started in the past',
            'Future plans'
          ],
          correctAnswer: 'Duration of an action that started in the past'
        },
        {
          id: 'perfcont3',
          question: 'Which time expression is commonly used with the Perfect Continuous Tense?',
          options: [
            'Yesterday',
            'For (duration)',
            'Next week'
          ],
          correctAnswer: 'For (duration)'
        }
      ]
    };
    
    // Get questions specific to this tense
    const specificQuestions = tenseQuestions[tense.title] || [];
    
    // Return a mix of common and specific questions
    return [...commonQuestions, ...specificQuestions];
  };
  
  const getPracticeQuestions = (tense) => {
    if (!tense) return [];
    
    // Tense-specific practice questions
    const practiceQuestions = {
      'Continuous tense': [
        {
          id: 'pract_cont1',
          question: 'She _____ (read) a book when I called her.',
          options: ['was reading', 'is reading', 'reads'],
          correctAnswer: 'was reading'
        },
        {
          id: 'pract_cont2',
          question: 'They _____ (travel) to Paris next week.',
          options: ['are travel', 'will be traveling', 'travels'],
          correctAnswer: 'will be traveling'
        },
        {
          id: 'pract_cont3',
          question: 'I _____ (wait) for the bus right now.',
          options: ['wait', 'am waiting', 'have waited'],
          correctAnswer: 'am waiting'
        },
        {
          id: 'pract_cont4',
          question: 'What _____ you _____ (do) tomorrow at this time?',
          options: ['are ... doing', 'will ... do', 'will be ... doing'],
          correctAnswer: 'will be ... doing'
        },
        {
          id: 'pract_cont5',
          question: 'She _____ (cook) dinner when the power went out.',
          options: ['is cooking', 'was cooking', 'cooked'],
          correctAnswer: 'was cooking'
        }
      ],
      'Perfect Tense': [
        {
          id: 'pract_perf1',
          question: 'I _____ (finish) my homework already.',
          options: ['finish', 'have finished', 'am finishing'],
          correctAnswer: 'have finished'
        },
        {
          id: 'pract_perf2',
          question: 'She _____ (live) in Paris for five years.',
          options: ['live', 'has lived', 'is living'],
          correctAnswer: 'has lived'
        },
        {
          id: 'pract_perf3',
          question: 'They _____ (complete) the project by next Friday.',
          options: ['will complete', 'will have completed', 'are completing'],
          correctAnswer: 'will have completed'
        },
        {
          id: 'pract_perf4',
          question: 'He _____ (not see) that movie yet.',
          options: ['has not seen', 'is not seeing', 'does not see'],
          correctAnswer: 'has not seen'
        },
        {
          id: 'pract_perf5',
          question: 'We _____ (never visit) that museum before.',
          options: ['never visited', 'have never visited', 'are never visiting'],
          correctAnswer: 'have never visited'
        }
      ],
      'Perfect Continuous Tense': [
        {
          id: 'pract_perfcont1',
          question: 'I _____ (work) on this project for three hours now.',
          options: ['am working', 'worked', 'have been working'],
          correctAnswer: 'have been working'
        },
        {
          id: 'pract_perfcont2',
          question: 'She _____ (study) all day when I called.',
          options: ['has studied', 'had been studying', 'was studying'],
          correctAnswer: 'had been studying'
        },
        {
          id: 'pract_perfcont3',
          question: 'They _____ (wait) for the bus for 30 minutes when it finally arrived.',
          options: ['waited', 'had been waiting', 'have waited'],
          correctAnswer: 'had been waiting'
        },
        {
          id: 'pract_perfcont4',
          question: 'By next month, I _____ (learn) English for two years.',
          options: ['will learn', 'will have learned', 'will have been learning'],
          correctAnswer: 'will have been learning'
        },
        {
          id: 'pract_perfcont5',
          question: 'He _____ (exercise) regularly for the past few months.',
          options: ['is exercising', 'has been exercising', 'exercised'],
          correctAnswer: 'has been exercising'
        }
      ]
    };
    
    return practiceQuestions[tense.title] || [];
  };

  const renderPracticeModal = () => {
    if (!showPracticeModal || !currentTenseForModal) return null;
    
    const practiceQuestions = getPracticeQuestions(currentTenseForModal);
    
    // Safety check
    if (!practiceQuestions || practiceQuestions.length === 0) {
      return (
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Practice: {currentTenseForModal.title}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowPracticeModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={[styles.modalContent, styles.errorContainer]}>
              <Ionicons name="alert-circle" size={48} color="#f44336" />
              <Text style={styles.errorText}>Sorry, no practice exercises are available for this topic.</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowPracticeModal(false)}
              >
                <LinearGradient
                  colors={['#0044ff', '#0072ff']}
                  style={styles.gradientModalButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonText}>Go Back</Text>
                  <FontAwesome5 name="arrow-left" size={16} color="white" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      );
    }
    
    return (
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Practice: {currentTenseForModal.title}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowPracticeModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.modalSubtitle}>Complete the sentences using the correct form:</Text>
            
            {practiceQuestions.map((item) => {
              if (!item || !item.id || !item.question || !item.options || !item.correctAnswer) {
                return null; // Skip rendering this question if any required properties are missing
              }
              return (
                <View key={item.id} style={styles.practiceItem}>
                  <Text style={styles.practiceQuestion}>{item.question}</Text>
                  <View style={styles.practiceOptions}>
                    {item.options.map((option) => (
                      <TouchableOpacity 
                        key={option}
                        style={[
                          styles.practiceOption,
                          practiceAnswers && practiceAnswers[item.id] === option && styles.practiceOptionSelected,
                          practiceSubmitted && option === item.correctAnswer && styles.practiceOptionCorrect,
                          practiceSubmitted && practiceAnswers && practiceAnswers[item.id] === option && 
                            option !== item.correctAnswer && styles.practiceOptionIncorrect
                        ]}
                        onPress={() => !practiceSubmitted && handlePracticeOptionSelect(item.id, option)}
                        disabled={practiceSubmitted}
                      >
                        <Text style={[
                          styles.practiceOptionText,
                          practiceSubmitted && option === item.correctAnswer && styles.practiceOptionTextCorrect
                        ]}>{option}</Text>
                        
                        {practiceSubmitted && option === item.correctAnswer && (
                          <Ionicons name="checkmark-circle" size={20} color="#4caf50" style={styles.practiceOptionIcon} />
                        )}
                        
                        {practiceSubmitted && practiceAnswers && practiceAnswers[item.id] === option && 
                          option !== item.correctAnswer && (
                          <Ionicons name="close-circle" size={20} color="#f44336" style={styles.practiceOptionIcon} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
            
            {!practiceSubmitted ? (
              <TouchableOpacity 
                style={[
                  styles.modalButton,
                  Object.keys(practiceAnswers || {}).length < practiceQuestions.length && styles.modalButtonDisabled
                ]}
                onPress={submitPractice}
                disabled={Object.keys(practiceAnswers || {}).length < practiceQuestions.length}
              >
                  <Text style={styles.modalButtonText}>Check Answers</Text>
                <FontAwesome5 name="check" size={16} color="#0072ff" style={styles.buttonIcon} />
              </TouchableOpacity>
            ) : (
              <View>
                <View style={styles.resultContainer}>
                  <Text style={styles.resultText}>
                    You got {practiceAnswers && practiceQuestions ? Object.keys(practiceAnswers).filter(id => {
                      const question = practiceQuestions.find(q => q && q.id === id);
                      return question && practiceAnswers[id] === question.correctAnswer;
                    }).length : 0} out of {practiceQuestions ? practiceQuestions.length : 0} correct!
                  </Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setShowPracticeModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Continue Learning</Text>
                  <FontAwesome5 name="book" size={16} color="#0072ff" style={styles.buttonIcon} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  const renderQuizModal = () => {
    if (!showQuizModal || !currentTenseForModal) return null;
    
    const quizQuestions = getQuizQuestions(currentTenseForModal);
    
    // Safety check
    if (!quizQuestions || quizQuestions.length === 0) {
      return (
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { opacity: fadeAnim }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quiz: {currentTenseForModal.title}</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowQuizModal(false)}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <View style={[styles.modalContent, styles.errorContainer]}>
              <Ionicons name="alert-circle" size={48} color="#f44336" />
              <Text style={styles.errorText}>Sorry, no quiz questions are available for this topic.</Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowQuizModal(false)}
              >
                <LinearGradient
                  colors={['#7e57c2', '#5e35b1']}
                  style={styles.gradientModalButton}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.modalButtonText}>Go Back</Text>
                  <FontAwesome5 name="arrow-left" size={16} color="white" style={styles.buttonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      );
    }
    
    return (
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quiz: {currentTenseForModal.title}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowQuizModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.modalSubtitle}>Test your knowledge:</Text>
            
            {quizQuestions.map((item, index) => {
              if (!item || !item.id || !item.question || !item.options || !item.correctAnswer) {
                return null; // Skip rendering this question if any required properties are missing
              }
              return (
                <View key={item.id} style={styles.quizItem}>
                  <Text style={styles.quizQuestion}>{index + 1}. {item.question}</Text>
                  <View style={styles.quizOptions}>
                    {item.options.map((option) => (
                      <TouchableOpacity 
                        key={option}
                        style={[
                          styles.quizOption,
                          quizAnswers && quizAnswers[item.id] === option && styles.quizOptionSelected,
                          quizSubmitted && option === item.correctAnswer && styles.quizOptionCorrect,
                          quizSubmitted && quizAnswers && quizAnswers[item.id] === option && 
                            option !== item.correctAnswer && styles.quizOptionIncorrect
                        ]}
                        onPress={() => !quizSubmitted && handleQuizOptionSelect(item.id, option)}
                        disabled={quizSubmitted}
                      >
                        <Text style={[
                          styles.quizOptionText,
                          quizSubmitted && option === item.correctAnswer && styles.quizOptionTextCorrect
                        ]}>{option}</Text>
                        
                        {quizAnswers && quizAnswers[item.id] === option && !quizSubmitted && (
                          <View style={styles.quizOptionCheck}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        )}
                        
                        {quizSubmitted && option === item.correctAnswer && (
                          <View style={styles.quizOptionCheckCorrect}>
                            <Ionicons name="checkmark" size={16} color="#fff" />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
            
            {!quizSubmitted ? (
              <TouchableOpacity 
                style={[
                  styles.modalButton,
                  Object.keys(quizAnswers).length < quizQuestions.length && styles.modalButtonDisabled
                ]}
                onPress={submitQuiz}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                >
                  <Text style={styles.modalButtonText}>Complete Quiz</Text>
                <FontAwesome5 name="check" size={16} color="#0072ff" style={styles.buttonIcon} />
              </TouchableOpacity>
            ) : (
              <View>
                <View style={[
                  styles.resultContainer,
                  quizScore >= 70 ? styles.resultContainerGood : styles.resultContainerNeedsWork
                ]}>
                  <Text style={styles.resultScore}>{quizScore}%</Text>
                  <Text style={styles.resultText}>{quizFeedback}</Text>
                </View>
                
                <TouchableOpacity 
                  style={styles.modalButton}
                  onPress={() => setShowQuizModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Continue Learning</Text>
                  <FontAwesome5 name="book" size={16} color="#0072ff" style={styles.buttonIcon} />
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  const renderOverviewModal = () => {
    if (!showOverviewModal) return null;
    
    return (
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tenses Overview</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowOverviewModal(false)}
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <Text style={styles.modalSubtitle}>Compare different tenses:</Text>
            
            <View style={styles.comparisonTable}>
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonHeaderText}>Tense</Text>
                <Text style={styles.comparisonHeaderText}>Structure</Text>
                <Text style={styles.comparisonHeaderText}>Usage</Text>
              </View>
              
              {tenses.map((tense) => (
                <View key={tense.id} style={styles.comparisonRow}>
                  <View style={styles.comparisonCell}>
                    <MaterialCommunityIcons name={tense.icon} size={18} color="#0072ff" style={styles.comparisonIcon} />
                    <Text style={styles.comparisonTitle}>{tense.title}</Text>
                  </View>
                  <Text style={styles.comparisonText}>{tense.formula}</Text>
                  <Text style={styles.comparisonText}>{tense.description.split('.')[0] + '.'}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.overviewSection}>
              <Text style={styles.overviewSectionTitle}>When to use each tense:</Text>
              <View style={styles.overviewList}>
                <View style={styles.overviewItem}>
                  <View style={styles.overviewBullet}>
                    <MaterialCommunityIcons name="clock-outline" size={18} color="#fff" />
                  </View>
                  <Text style={styles.overviewItemText}>Use <Text style={styles.overviewEmphasis}>Continuous tense</Text> for actions in progress at a specific time</Text>
                </View>
                <View style={styles.overviewItem}>
                  <View style={styles.overviewBullet}>
                    <MaterialCommunityIcons name="check-circle-outline" size={18} color="#fff" />
                  </View>
                  <Text style={styles.overviewItemText}>Use <Text style={styles.overviewEmphasis}>Perfect tense</Text> for completed actions with relevance to another time</Text>
                </View>
                <View style={styles.overviewItem}>
                  <View style={styles.overviewBullet}>
                    <MaterialCommunityIcons name="progress-clock" size={18} color="#fff" />
                  </View>
                  <Text style={styles.overviewItemText}>Use <Text style={styles.overviewEmphasis}>Perfect Continuous Tense</Text> for ongoing actions that started in the past</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowOverviewModal(false)}
              >
                <Text style={styles.modalButtonText}>Continue Learning</Text>
              <FontAwesome5 name="book" size={16} color="#0072ff" style={styles.buttonIcon} />
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    );
  };

  // Main component return
  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* Header with animated background elements */}
      <View style={styles.header}>
        <Animated.View style={[styles.backgroundCircle, { transform: [{ rotate: spin }] }]} />
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Grammar Tenses</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {renderProgressBar()}

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
          <View style={styles.tensesContainer}>
            {tenses.map((tense, index) => (
              <Animated.View
                key={tense.id}
                style={{
                  opacity: fadeAnim,
                  transform: [{ 
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50 + (index * 20), 0]
                    })
                  }]
                }}
              >
                <TouchableOpacity 
                  style={[
                    styles.tenseButton,
                    selectedTense === tense.id && styles.selectedTenseButton
                  ]}
                  onPress={() => handleTenseSelect(tense)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      selectedTense === tense.id ? 
                      ['#bbdefb', '#90caf9'] : 
                      ['#f5f9ff', '#e3f2fd']
                    }
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.tenseContent}>
                      <MaterialCommunityIcons 
                        name={tense.icon} 
                        size={24} 
                        color={selectedTense === tense.id ? "#0051cb" : "#0072ff"} 
                        style={styles.tenseIcon}
                      />
                      <Text 
                        style={[
                          styles.tenseText,
                          selectedTense === tense.id && styles.selectedTenseText
                        ]}
                      >
                        {tense.title}
                      </Text>
                      <View style={styles.chevronContainer}>
                        <Ionicons 
                          name={selectedTense === tense.id ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={selectedTense === tense.id ? "#0051cb" : "#0072ff"} 
                        />
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {selectedTense === tense.id && (
                  <Animated.View 
                    style={[
                      styles.tenseDetailsContainer,
                      {opacity: fadeAnim}
                    ]}
                  >
                    <View style={styles.tenseDetails}>
                      <Text style={styles.tenseDescription}>{tense.description}</Text>
                      
                      <View style={styles.formulaContainer}>
                        <View style={styles.formulaHeader}>
                          <Ionicons name="construct-outline" size={18} color="#0072ff" />
                          <Text style={styles.formulaLabel}>Formula:</Text>
                        </View>
                        <Text style={styles.formula}>{tense.formula}</Text>
                      </View>
                      
                      <View style={styles.examplesContainer}>
                        <View style={styles.examplesHeader}>
                          <Ionicons name="list-outline" size={18} color="#0072ff" />
                          <Text style={styles.examplesLabel}>Examples:</Text>
                        </View>
                        {tense.examples.map((example, idx) => (
                          <View key={idx} style={styles.exampleItem}>
                            <View style={styles.bulletPoint} />
                            <Text style={styles.exampleText}>{example}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.tipsContainer}>
                        <View style={styles.tipsHeader}>
                          <Ionicons name="bulb-outline" size={18} color="#0072ff" />
                          <Text style={styles.tipsLabel}>Pro Tip:</Text>
                        </View>
                        <Text style={styles.tipsText}>{tense.tips}</Text>
                      </View>

                      <View style={styles.buttonsRow}>
                        <TouchableOpacity 
                          style={[styles.actionButton, styles.practiceButton]}
                          onPress={() => handlePracticePress(tense)}
                        >
                          <LinearGradient
                            colors={['#0044ff', '#0072ff']}
                            style={styles.gradientActionButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Text style={styles.actionButtonText}>Practice</Text>
                            <FontAwesome5 name="pencil-alt" size={14} color="white" style={styles.buttonIcon} />
                          </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.actionButton, styles.quizButton]}
                          onPress={() => handleQuizPress(tense)}
                        >
                          <LinearGradient
                            colors={['#7e57c2', '#5e35b1']}
                            style={styles.gradientActionButton}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                          >
                            <Text style={styles.actionButtonText}>Quiz</Text>
                            <Ionicons name="help-circle-outline" size={16} color="white" style={styles.buttonIcon} />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Animated.View>
                )}
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleOverviewPress}
        >
          <LinearGradient
            colors={['#00c6ff', '#0072ff']}
            style={styles.gradientFloatingButton}
          >
            <MaterialCommunityIcons name="book-open-variant" size={24} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {renderPracticeModal()}
      {renderQuizModal()}
      {renderOverviewModal()}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -150,
    right: -100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    overflow: 'hidden',
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
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#fff",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  progressBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 80,
  },
  tensesContainer: {
    marginBottom: 20,
  },
  tenseButton: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedTenseButton: {
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
    marginBottom: 8,
  },
  gradientCard: {
    borderRadius: 15,
    padding: 2,
  },
  tenseContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 13,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tenseIcon: {
    marginRight: 12,
  },
  tenseText: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: '600',
    flex: 1,
  },
  selectedTenseText: {
    color: '#0051cb',
    fontWeight: '700',
  },
  chevronContainer: {
    padding: 4,
  },
  tenseDetailsContainer: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  tenseDetails: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e3e3e3',
  },
  tenseDescription: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  formulaContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  formulaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  formulaLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0072ff',
    marginLeft: 6,
  },
  formula: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    paddingLeft: 24,
  },
  examplesContainer: {
    marginBottom: 16,
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  examplesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0072ff',
    marginLeft: 6,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 24,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0072ff',
    marginTop: 8,
    marginRight: 10,
  },
  exampleText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  tipsContainer: {
    backgroundColor: '#fff9c4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#ffd600',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tipsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0072ff',
    marginLeft: 6,
  },
  tipsText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    paddingLeft: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  practiceButton: {
    marginRight: 8,
  },
  quizButton: {
    marginLeft: 8,
  },
  gradientActionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientFloatingButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f5f9ff',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
    paddingBottom: 30,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  modalButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginTop: 20,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalButtonDisabled: {
    opacity: 0.7,
  },
  modalButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
  practiceItem: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  practiceQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  practiceOptions: {
    marginLeft: 10,
  },
  practiceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  practiceOptionSelected: {
    borderColor: '#0072ff',
    backgroundColor: '#e3f2fd',
  },
  practiceOptionCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#f1f8e9',
  },
  practiceOptionIncorrect: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  practiceOptionText: {
    fontSize: 15,
    color: '#444',
  },
  practiceOptionTextCorrect: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  practiceOptionIcon: {
    marginLeft: 10,
  },
  quizItem: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#7e57c2',
  },
  quizQuestion: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  quizOptions: {
    marginLeft: 10,
  },
  quizOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  quizOptionSelected: {
    borderColor: '#7e57c2',
    backgroundColor: '#f3e5f5',
  },
  quizOptionCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#f1f8e9',
  },
  quizOptionIncorrect: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  quizOptionText: {
    fontSize: 15,
    color: '#444',
  },
  quizOptionTextCorrect: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  quizOptionCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7e57c2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizOptionCheckCorrect: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4caf50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultContainer: {
    padding: 16,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  resultContainerGood: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#a5d6a7',
  },
  resultContainerNeedsWork: {
    backgroundColor: '#fff8e1',
    borderWidth: 1,
    borderColor: '#ffe082',
  },
  resultScore: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  comparisonTable: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  comparisonHeader: {
    flexDirection: 'row',
    backgroundColor: '#0072ff',
    padding: 10,
  },
  comparisonHeaderText: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  comparisonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  comparisonCell: {
    flex: 1,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  comparisonIcon: {
    marginRight: 5,
  },
  comparisonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0072ff',
  },
  comparisonText: {
    flex: 1,
    padding: 10,
    fontSize: 13,
    color: '#444',
  },
  overviewSection: {
    marginBottom: 20,
  },
  overviewSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  overviewList: {
    backgroundColor: '#f5f9ff',
    borderRadius: 10,
    padding: 12,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  overviewBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0072ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  overviewItemText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
  overviewEmphasis: {
    fontWeight: 'bold',
    color: '#0072ff',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
});