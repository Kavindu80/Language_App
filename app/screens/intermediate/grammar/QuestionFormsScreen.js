import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  ScrollView, 
  Image,
  FlatList,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuestionFormsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedQuestionType, setSelectedQuestionType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [practiceModalVisible, setPracticeModalVisible] = useState(false);
  const [currentPracticeQuestion, setCurrentPracticeQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const navigateToProfileSettings = () => navigation.navigate('ProfileSettingsScreen');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  const questionTypes = [
    {
      id: 0,
      type: 'Yes/No Questions',
      icon: 'help-circle',
      color: '#4CAF50',
      whatAreThey: 'What is it?',
      examples: ['Do you speak English?','Is she coming to the party?','Have they finished the project?','Can you swim?','Will they attend the meeting?'],
      explanation: 'These are questions that can be answered with a simple "yes" or "no." They usually begin with an auxiliary verb.',
      structure: 'Auxiliary verb + Subject + Main verb + Remainder of sentence?',
      formationRules: [
        'Present Simple: do / does + subject + base verb',
        'Past Simple: did + subject + base verb',
        'Present Continuous: is / am / are + subject + verb-ing',
        'Past Continuous: Was/Were + subject + verb-ing',
        'Present Perfect: Have/Has + subject + past participle',
        'Modal Verbs: modal + subject + base verb'
      ],
      practiceQuestions: [
        {
          question: 'Rearrange the words:\nspeak / English / you / do',
          options: ['You do speak English?','Do you English speak?','Do you speak English?','Speak you do English?'],
          correctAnswer: 2,
          explanation: 'Correct order: Do you speak English?'
        },
        {
          question: 'Which is the correct Yes/No question?',
          options: ['She is going to the store?','Is she going to the store?','Going she is to the store?','Is going she to the store?'],
          correctAnswer: 1,
          explanation: 'Correct: Is she going to the store?'
        }
      ]
    },
    {
      id: 1,
      type: 'Wh- Questions',
      icon: 'help',
      color: '#2196F3',
      whatAreThey: 'What is it?',
      examples: ['What is your name?','Where do you live?','When does the movie start?','Who is coming?','Why are you late?','How did you solve it?'],
      explanation: 'Begin with question words like what, where, when, who, why, how – asking for specific info.',
      structure: 'Question word + Auxiliary verb + Subject + Main verb + …?',
      formationRules: [
        'What – asks about things/actions',
        'Where – asks about places',
        'When – asks about time',
        'Who – asks about people',
        'Why – asks about reasons',
        'How – asks about manner/method'
      ],
      practiceQuestions: [
        {
          question: 'Choose the correct Wh- question:',
          options: ['What time you will arrive?','What time you arrive will?','What time will you arrive?','What will time you arrive?'],
          correctAnswer: 2,
          explanation: 'Correct: What time will you arrive?'
        },
        {
          question: 'Which word asks for a reason?',
          options: ['What','Where','When','Why'],
          correctAnswer: 3,
          explanation: '"Why" asks for reasons.'
        }
      ]
    },
    {
      id: 2,
      type: 'Tag Questions',
      icon: 'help-buoy',
      color: '#FF9800',
      whatAreThey: 'What is it?',
      examples: ['You\'re coming, aren\'t you?','She doesn\'t like coffee, does she?','They\'ve been here, haven\'t they?'],
      explanation: 'Short questions added to the end of statements to confirm or seek agreement.',
      structure: 'statement + , + auxiliary verb (opposite form) + subject pronoun +?',
      formationRules: [
        'Positive statement → negative tag',
        'Negative statement → positive tag',
        'Use same auxiliary as statement',
        'No auxiliary? use do/does/did',
        'Keep same tense'
      ],
      practiceQuestions: [
        {
          question: 'Complete: "You like chocolate, ___"',
          options: ['do you','don\'t you','aren\'t you','isn\'t you'],
          correctAnswer: 1,
          explanation: 'Positive → negative tag: don\'t you'
        },
        {
          question: 'Complete: "She hasn\'t finished, ___"',
          options: ['hasn\'t she','has she','isn\'t she','doesn\'t she'],
          correctAnswer: 1,
          explanation: 'Negative → positive tag: has she'
        }
      ]
    },
    {
      id: 3,
      type: 'Indirect Questions',
      icon: 'chatbubble-ellipses',
      color: '#9C27B0',
      whatAreThey: 'What is it?',
      examples: ['Could you tell me where the station is?','Do you know what time it starts?'],
      explanation: 'Polite embedded questions starting with phrases like "Could you tell me …".',
      structure: 'Introductory phrase + if/question word + subject + verb …?',
      formationRules: [
        'Use polite phrase (Could you tell me, etc.)',
        'Yes/no → use "if/whether"',
        'Keep question word for info',
        'Use statement word order',
        'No extra auxiliaries inside'
      ],
      practiceQuestions: [
        {
          question: 'Indirect form of "Where is the bank?"',
          options: ['Could you tell me where is the bank?','Could you tell me where the bank is?','I wonder where is the bank?','Do you know where is the bank?'],
          correctAnswer: 1,
          explanation: 'Statement order: where the bank is'
        },
        {
          question: 'Indirect form of "Do they sell tickets online?"',
          options: ['Do you know do they sell tickets online?','I wonder do they sell tickets online?','Could you tell me do they sell tickets online?','Do you know if they sell tickets online?'],
          correctAnswer: 3,
          explanation: 'Use "if" + statement order'
        }
      ]
    },
    {
      id: 4,
      type: 'Subject vs. Object Questions',
      icon: 'swap-horizontal',
      color: '#E91E63',
      whatAreThey: 'What is it?',
      examples: ['Who called you? (Subject)','Who did you call? (Object)'],
      explanation: 'Subject questions ask about the doer; Object questions ask about the receiver.',
      structure: 'Subject Q: Question word + Verb …?\nObject Q: Question word + Auxiliary + Subject + Verb …?',
      formationRules: [
        'Subject Q → no do/does/did',
        'Object Q → needs auxiliary',
        'Subject Q keeps verb form',
        'Object Q uses base verb after auxiliary'
      ],
      practiceQuestions: [
        {
          question: 'Identify: "Who wrote this book?"',
          options: ['Subject question','Object question','Tag question','Indirect question'],
          correctAnswer: 0,
          explanation: 'No auxiliary → subject question'
        },
        {
          question: 'Identify: "Who did she invite?"',
          options: ['Subject question','Object question','Tag question','Indirect question'],
          correctAnswer: 1,
          explanation: 'Uses auxiliary → object question'
        }
      ]
    }
  ];

  const quizQuestions = [
    { question: "Which type starts with auxiliaries like 'do', 'is', or 'can'?", options: ["Wh-","Yes/No","Tag","Indirect"], correctAnswer: 1 },
    { question: "'Who wrote this book?' is a …", options: ["Object","Tag","Subject","Indirect"], correctAnswer: 2 },
    { question: "Tag for 'You are coming':", options: ["aren't you?","are you?","don't you?","you are?"], correctAnswer: 0 },
    { question: "Structure of indirect question:", options: ["Q-word+aux+sub+verb","Aux+sub+verb","Intro+if/Q+sub+verb","Stmt+aux+sub"], correctAnswer: 2 },
    { question: "Correct Wh- question:", options: ["Where you are going?","Where are you going?","Where going are you?","Where you going are?"], correctAnswer: 1 }
  ];

  // Use all question types in Summary
  const summaryTypes = questionTypes;

  const practiceQuestions = selectedQuestionType?.practiceQuestions || [];

  const openQuestionTypeDetails = (item) => {
    setSelectedQuestionType(item);
    setModalVisible(true);
  };
  const closeModal = () => { setModalVisible(false); setSelectedQuestionType(null); };

  const startPractice = () => {
    setModalVisible(false);
    setCurrentPracticeQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setPracticeModalVisible(true);
  };

  const handleAnswerSelection = (index) => { setSelectedAnswer(index); setShowAnswer(true); };
  const nextQuestion = () => {
    if (currentPracticeQuestion < practiceQuestions.length - 1) {
      setCurrentPracticeQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else setPracticeModalVisible(false);
  };

  const startQuiz = () => {
    setCurrentQuizQuestion(0); setQuizScore(0); setSelectedAnswer(null); setShowAnswer(false); setQuizCompleted(false); setQuizModalVisible(true);
  };
  const handleQuizAnswerSelection = (index) => {
    setSelectedAnswer(index); setShowAnswer(true);
    if (index === quizQuestions[currentQuizQuestion].correctAnswer) setQuizScore(s => s + 1);
  };
  const nextQuizQuestion = () => {
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(c => c + 1); setSelectedAnswer(null); setShowAnswer(false);
    } else setQuizCompleted(true);
  };
  const resetQuiz = () => { setQuizModalVisible(false); setQuizCompleted(false); };
  const toggleSummaryModal = () => setSummaryModalVisible(v => !v);

  const renderQuestionTypeItem = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({inputRange:[0,1],outputRange:[50,0]}) }] }}>
      <TouchableOpacity style={styles.questionTypeCard} onPress={() => openQuestionTypeDetails(item)} activeOpacity={0.7}>
        <LinearGradient colors={['#ffffff', '#f5f9ff']} style={styles.gradientCard}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <Ionicons name={item.icon} size={24} color="#fff" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.questionTypeTitle}>{item.type}</Text>
            <Text style={styles.questionTypeDescription} numberOfLines={2}>{item.explanation || ''}</Text>
            {item.examples && (
              <View style={styles.examplePreview}>
                <Text style={styles.exampleText} numberOfLines={1}>{item.examples[0]}</Text>
              </View>
            )}
            <View style={styles.viewMoreContainer}>
              <Text style={styles.viewMoreText}>View Details</Text>
              <MaterialIcons name="arrow-forward" size={16} color="#0072ff" />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={28} color="#fff" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Question Forms</Text>
        <TouchableOpacity style={styles.profileButton} onPress={navigateToProfileSettings}><Image source={require('../../../../assets/items/profile.jpg')} style={styles.profileImage} /></TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.subtitle}>Question types with examples and structures</Text>
          <Text style={styles.introText}>Master different question types to communicate more effectively.</Text>
        </Animated.View>

        <FlatList data={questionTypes} renderItem={renderQuestionTypeItem} keyExtractor={(item) => item.id.toString()} showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent} />

        <View style={styles.floatingButtonsContainer}>
          <TouchableOpacity style={[styles.floatingButton, { backgroundColor: '#9C27B0' }]} onPress={startQuiz}><MaterialCommunityIcons name="comment-question" size={24} color="#fff" /><Text style={styles.floatingButtonText}>Quiz</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.floatingButton, { backgroundColor: '#FF9800' }]} onPress={toggleSummaryModal}><MaterialIcons name="summarize" size={24} color="#fff" /><Text style={styles.floatingButtonText}>Summary</Text></TouchableOpacity>
        </View>
      </View>

      {/* Details Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>{selectedQuestionType?.type}</Text><TouchableOpacity onPress={closeModal}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity></View>
            <ScrollView style={styles.modalScrollView}>
              {selectedQuestionType?.whatAreThey && <View style={styles.modalSection}><Text style={styles.sectionTitle}>What is it?</Text><Text style={styles.sectionText}>{selectedQuestionType.explanation}</Text></View>}
              {selectedQuestionType?.structure && <View style={styles.modalSection}><Text style={styles.sectionTitle}>Structure</Text><View style={styles.structureContainer}><Text style={styles.structureText}>{selectedQuestionType.structure}</Text></View></View>}
              {selectedQuestionType?.formationRules && <View style={styles.modalSection}><Text style={styles.sectionTitle}>Formation Rules</Text>{selectedQuestionType.formationRules.map((r,i)=>(<View key={i} style={styles.ruleItem}><View style={styles.bulletPoint} /><Text style={styles.ruleText}>{r}</Text></View>))}</View>}
              {selectedQuestionType?.examples && <View style={styles.modalSection}><Text style={styles.sectionTitle}>Examples</Text>{selectedQuestionType.examples.map((e,i)=>(<View key={i} style={styles.exampleItem}><View style={styles.exampleBullet}><Text style={styles.exampleBulletText}>{i+1}</Text></View><Text style={styles.exampleItemText}>{e}</Text></View>))}</View>}
            </ScrollView>
            {selectedQuestionType?.practiceQuestions && <TouchableOpacity style={styles.practiceButton} onPress={startPractice}><Text style={styles.practiceButtonText}>Practice Now</Text><FontAwesome5 name="pencil-alt" size={16} color="#0072ff" style={styles.practiceIcon} /></TouchableOpacity>}
          </View>
        </View>
      </Modal>

      {/* Practice Modal */}
      <Modal visible={practiceModalVisible} transparent animationType="slide" onRequestClose={()=>setPracticeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.practiceModalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Practice</Text><TouchableOpacity onPress={()=>setPracticeModalVisible(false)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity></View>
            {practiceQuestions.length>0 && <View style={styles.practiceContainer}>
              <Text style={styles.questionCounter}>Question {currentPracticeQuestion+1} of {practiceQuestions.length}</Text>
              <Text style={styles.practiceQuestion}>{practiceQuestions[currentPracticeQuestion]?.question}</Text>
              <View style={styles.optionsContainer}>{practiceQuestions[currentPracticeQuestion]?.options.map((opt,i)=>(
                <TouchableOpacity key={i} style={[styles.optionButton, selectedAnswer===i&&styles.selectedOption, showAnswer&&i===practiceQuestions[currentPracticeQuestion]?.correctAnswer&&styles.correctOption, showAnswer&&selectedAnswer===i&&i!==practiceQuestions[currentPracticeQuestion]?.correctAnswer&&styles.incorrectOption]} onPress={()=>handleAnswerSelection(i)} disabled={showAnswer}>
                  <Text style={[styles.optionText,showAnswer&&i===practiceQuestions[currentPracticeQuestion]?.correctAnswer&&styles.correctOptionText,showAnswer&&selectedAnswer===i&&i!==practiceQuestions[currentPracticeQuestion]?.correctAnswer&&styles.incorrectOptionText]}>{opt}</Text>
                  {showAnswer && i===practiceQuestions[currentPracticeQuestion]?.correctAnswer && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.answerIcon} />}
                  {showAnswer && selectedAnswer===i && i!==practiceQuestions[currentPracticeQuestion]?.correctAnswer && <Ionicons name="close-circle" size={20} color="#F44336" style={styles.answerIcon} />}
                </TouchableOpacity>
              ))}</View>
              {showAnswer && <>
                {practiceQuestions[currentPracticeQuestion]?.explanation && <View style={styles.explanationContainer}><Text style={styles.explanationText}>{practiceQuestions[currentPracticeQuestion].explanation}</Text></View>}
                <TouchableOpacity style={styles.nextButton} onPress={nextQuestion}>
                  <LinearGradient colors={['#0072ff','#00c6ff']} style={styles.nextButtonGradient}>
                    <Text style={styles.nextButtonText}>{currentPracticeQuestion<practiceQuestions.length-1?'Next Question':'Finish Practice'}</Text><Ionicons name="arrow-forward" size={18} color="#fff" style={styles.nextIcon} />
                  </LinearGradient>
                </TouchableOpacity>
              </>}
            </View>}
          </View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal visible={quizModalVisible} transparent animationType="slide" onRequestClose={()=>setQuizModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.practiceModalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Question Forms Quiz</Text><TouchableOpacity onPress={()=>setQuizModalVisible(false)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity></View>
            {!quizCompleted ? (
              <View style={styles.practiceContainer}>
                <Text style={styles.questionCounter}>Question {currentQuizQuestion+1} of {quizQuestions.length}</Text>
                <Text style={styles.practiceQuestion}>{quizQuestions[currentQuizQuestion]?.question}</Text>
                <View style={styles.optionsContainer}>{quizQuestions[currentQuizQuestion]?.options.map((opt,i)=>(
                  <TouchableOpacity key={i} style={[styles.optionButton,selectedAnswer===i&&styles.selectedOption,showAnswer&&i===quizQuestions[currentQuizQuestion]?.correctAnswer&&styles.correctOption,showAnswer&&selectedAnswer===i&&i!==quizQuestions[currentQuizQuestion]?.correctAnswer&&styles.incorrectOption]} onPress={()=>handleQuizAnswerSelection(i)} disabled={showAnswer}>
                    <Text style={[styles.optionText,showAnswer&&i===quizQuestions[currentQuizQuestion]?.correctAnswer&&styles.correctOptionText,showAnswer&&selectedAnswer===i&&i!==quizQuestions[currentQuizQuestion]?.correctAnswer&&styles.incorrectOptionText]}>{opt}</Text>
                    {showAnswer && i===quizQuestions[currentQuizQuestion]?.correctAnswer && <Ionicons name="checkmark-circle" size={20} color="#4CAF50" style={styles.answerIcon} />}
                    {showAnswer && selectedAnswer===i && i!==quizQuestions[currentQuizQuestion]?.correctAnswer && <Ionicons name="close-circle" size={20} color="#F44336" style={styles.answerIcon} />}
                  </TouchableOpacity>
                ))}</View>
                {showAnswer && <TouchableOpacity style={styles.nextButton} onPress={nextQuizQuestion}>
                  <LinearGradient colors={['#0072ff','#00c6ff']} style={styles.nextButtonGradient}>
                    <Text style={styles.nextButtonText}>{currentQuizQuestion<quizQuestions.length-1?'Next Question':'See Results'}</Text><Ionicons name="arrow-forward" size={18} color="#fff" style={styles.nextIcon} />
                  </LinearGradient>
                </TouchableOpacity>}
              </View>
            ) : (
              <View style={styles.quizResultsContainer}>
                <Animated.View style={styles.scoreCircle}><Text style={styles.scoreText}>{quizScore}/{quizQuestions.length}</Text><Text style={styles.scoreLabel}>Score</Text></Animated.View>
                <Text style={styles.resultMessage}>
                  {quizScore===5?"(5/5 score) Bravo! You answered all of them correctly!":quizScore===4?"(4/5 score) Great job! Just one more to get them all! Try again!":quizScore===3?"(3/5 score) Good effort! You're improving every time! Keep practicing and try again!":quizScore===2?"(2/5 score) Stay focused! One more try could get you a perfect score!":quizScore===1?"(1/5 score) Every step count. Don't stop now! Keep practicing and try again!":"(0/5 score) Keep trying! Practice makes progress. You can do this!"}
                </Text>
                <TouchableOpacity style={styles.resetButton} onPress={resetQuiz}><LinearGradient colors={['#0072ff','#00c6ff']} style={styles.resetButtonGradient}><Text style={styles.resetButtonText}>Return to Lesson</Text></LinearGradient></TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Summary Modal */}
      <Modal visible={summaryModalVisible} transparent animationType="slide" onRequestClose={()=>setSummaryModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}><Text style={styles.modalTitle}>Question Forms Summary</Text><TouchableOpacity onPress={()=>setSummaryModalVisible(false)}><Ionicons name="close" size={24} color="#333" /></TouchableOpacity></View>
            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
              {summaryTypes.map((type,i)=>(
                <View key={i} style={styles.summaryItem}>
                  <View style={[styles.summaryIconContainer,{backgroundColor:type.color}]}><Ionicons name={type.icon} size={20} color="#fff" /></View>
                  <View style={styles.summaryContent}>
                    <Text style={styles.summaryTitle}>• {type.type}</Text>
                    <Text style={styles.summaryStructure}>{type.structure}</Text>
                    <Text style={styles.summaryExample}>Example: {type.examples?.[0]}</Text>
                  </View>
                </View>
              ))}
              <View style={styles.summaryTipsContainer}>
                <Text style={styles.summaryTipsTitle}>Quick Tips:</Text>
                {['Use auxiliary verbs (do, is, have) for yes/no questions','In Wh- questions, question word comes first','Tag questions use opposite forms (positive → negative)','Indirect questions make language polite'].map(tip=>(
                  <View key={tip} style={styles.summaryTipItem}><View style={styles.summaryTipBullet} /><Text style={styles.summaryTipText}>{tip}</Text></View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 24,
  },
  listContent: {
    paddingBottom: 30,
  },
  questionTypeCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: 16,
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  questionTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  questionTypeDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  examplePreview: {
    backgroundColor: 'rgba(0,114,255,0.05)',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
    color: '#0072ff',
    fontStyle: 'italic',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreText: {
    fontSize: 14,
    color: '#0072ff',
    fontWeight: '500',
    marginRight: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 0,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalScrollView: {
    maxHeight: '75%',
  },
  modalScrollContent: {
    paddingBottom: 10,
  },
  modalSection: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  structureContainer: {
    backgroundColor: '#f5f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#0072ff',
  },
  structureText: {
    fontSize: 16,
    color: '#0072ff',
    fontWeight: '500',
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0072ff',
    marginTop: 8,
    marginRight: 8,
  },
  ruleText: {
    fontSize: 15,
    color: '#444',
    flex: 1,
    lineHeight: 22,
  },
  exampleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  exampleBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  exampleBulletText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  exampleItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    lineHeight: 24,
  },
  practiceButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  practiceButtonText: {
    color: '#0072ff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  practiceIcon: {
    marginLeft: 5,
  },
  practiceModalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '85%',
  },
  practiceContainer: {
    paddingVertical: 16,
  },
  questionCounter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  practiceQuestion: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: '#f5f9ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e3f2fd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    borderColor: '#0072ff',
    backgroundColor: '#e3f2fd',
  },
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  incorrectOption: {
    borderColor: '#F44336',
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  correctOptionText: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  incorrectOptionText: {
    color: '#F44336',
    fontWeight: '500',
  },
  answerIcon: {
    marginLeft: 8,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 8,
  },
  nextIcon: {
    marginLeft: 8,
  },
  explanationContainer: {
    backgroundColor: 'rgba(0, 114, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginTop: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#0072ff',
    fontWeight: '500',
    textAlign: 'center',
  },
  floatingButtonsContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  floatingButton: {
    width: 110,
    height: 45,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    flexDirection: 'row',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  quizResultsContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 4,
    borderColor: '#0072ff',
  },
  scoreText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  resultMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 26,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '80%',
  },
  resetButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  summaryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  summaryContent: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  summaryStructure: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
    fontStyle: 'italic',
  },
  summaryExample: {
    fontSize: 13,
    color: '#0072ff',
  },
  summaryTipsContainer: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
  },
  summaryTipsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  summaryTipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  summaryTipBullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0072ff',
    marginTop: 6,
    marginRight: 6,
  },
  summaryTipText: {
    fontSize: 13,
    color: '#444',
    flex: 1,
    lineHeight: 17,
  }
});