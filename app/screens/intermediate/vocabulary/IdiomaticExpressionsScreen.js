import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Animated,
  StatusBar,
  FlatList,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IdiomaticExpressionsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [knownWords, setKnownWords] = useState([]);
  const [reviewWords, setReviewWords] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardRotateAnim] = useState(new Animated.Value(0));

  // Sample idiomatic expressions categorized by themes
  const idiomaticCategories = [
    {
      id: 1,
      title: 'Business & Work',
      icon: 'briefcase',
      color: '#3F51B5',
      expressions: [
        { 
          expression: 'Break the ice', 
          meaning: 'To initiate conversation or ease tension in a social situation',
          example: 'The team-building activity helped break the ice among the new employees.',
          usage: 'Used when someone makes the first move to start a conversation in an awkward situation.'
        },
        { 
          expression: 'Think outside the box', 
          meaning: 'To think creatively and unconventionally',
          example: 'We need to think outside the box to solve this complex problem.',
          usage: 'Used to encourage innovative thinking beyond conventional approaches.'
        },
        { 
          expression: 'Back to square one', 
          meaning: 'To start over from the beginning',
          example: 'Our proposal was rejected, so we\'re back to square one.',
          usage: 'Used when progress is lost and you need to restart a process.'
        },
        { 
          expression: 'Cut corners', 
          meaning: 'To do something in the easiest or cheapest way, often sacrificing quality',
          example: 'The contractor cut corners when building the office, and now we\'re having problems.',
          usage: 'Used to describe taking shortcuts that may lead to problems later.'
        },
        { 
          expression: 'Get the ball rolling', 
          meaning: 'To start a process or project',
          example: 'Let\'s get the ball rolling on the new marketing campaign.',
          usage: 'Used when initiating action on something that needs to be done.'
        },
        { 
          expression: 'Raise the bar', 
          meaning: 'To set a higher standard',
          example: 'Their presentation really raised the bar for future projects.',
          usage: 'Used when someone sets a new, higher standard of quality or performance.'
        },
        { 
          expression: 'Call it a day', 
          meaning: 'To stop working on something',
          example: 'We\'ve made good progress, so let\'s call it a day and continue tomorrow.',
          usage: 'Used to suggest ending work for the day.'
        }
      ]
    },
    {
      id: 2,
      title: 'Everyday Life',
      icon: 'home-variant',
      color: '#009688',
      expressions: [
        { 
          expression: 'Hit the hay', 
          meaning: 'To go to bed or go to sleep',
          example: 'It\'s getting late, I think I\'ll hit the hay.',
          usage: 'Used informally when someone is going to sleep.'
        },
        { 
          expression: 'Under the weather', 
          meaning: 'Feeling ill or sick',
          example: 'I can\'t come to the party tonight, I\'m feeling under the weather.',
          usage: 'Used as a mild way to say someone is sick.'
        },
        { 
          expression: 'Cost an arm and a leg', 
          meaning: 'To be very expensive',
          example: 'That new smartphone costs an arm and a leg!',
          usage: 'Used to emphasize that something is extremely expensive.'
        },
        { 
          expression: 'A piece of cake', 
          meaning: 'Something that is very easy to do',
          example: 'The exam was a piece of cake; I finished it in half the time.',
          usage: 'Used to describe tasks that are very simple or easy to accomplish.'
        },
        { 
          expression: 'Bite the bullet', 
          meaning: 'To face a difficult situation bravely',
          example: 'I don\'t want to go to the dentist, but I\'ll have to bite the bullet eventually.',
          usage: 'Used when someone forces themselves to do something unpleasant but necessary.'
        },
        { 
          expression: 'It\'s raining cats and dogs', 
          meaning: 'It\'s raining heavily',
          example: 'Don\'t forget your umbrella; it\'s raining cats and dogs out there.',
          usage: 'Used to describe very heavy rainfall.'
        },
        { 
          expression: 'Speak of the devil', 
          meaning: 'Said when someone appears just when you\'ve been talking about them',
          example: 'Speak of the devil! We were just talking about you.',
          usage: 'Used when someone appears right after being mentioned in conversation.'
        }
      ]
    },
    {
      id: 3,
      title: 'Emotions & Feelings',
      icon: 'emoticon-outline',
      color: '#E91E63',
      expressions: [
        { 
          expression: 'Have butterflies in your stomach', 
          meaning: 'To feel nervous or anxious',
          example: 'I had butterflies in my stomach before my job interview.',
          usage: 'Used to describe nervous anticipation or anxiety.'
        },
        { 
          expression: 'Down in the dumps',
          meaning: 'To feel sad or depressed',
          example: 'She\'s been down in the dumps since she lost her job.',
          usage: 'Used to describe someone who is feeling sad or depressed.'
        },
        { 
          expression: 'On cloud nine', 
          meaning: 'To be extremely happy',
          example: 'Ever since she got engaged, she\'s been on cloud nine.',
          usage: 'Used to describe someone who is extremely happy or elated.'
        },
        { 
          expression: 'Lose your cool', 
          meaning: 'To become angry or upset',
          example: 'The manager lost his cool when he heard about the mistake.',
          usage: 'Used when someone becomes angry and loses self-control.'
        },
        { 
          expression: 'Green with envy', 
          meaning: 'Very jealous',
          example: 'When I showed her my new car, she was green with envy.',
          usage: 'Used to describe extreme jealousy.'
        },
        { 
          expression: 'Wear your heart on your sleeve', 
          meaning: 'To openly show your emotions',
          example: 'He always wears his heart on his sleeve, so everyone knows how he feels.',
          usage: 'Used to describe someone who doesn\'t hide their emotions.'
        },
        { 
          expression: 'Jump for joy', 
          meaning: 'To be extremely happy about something',
          example: 'The children were jumping for joy when they heard we were going to the amusement park.',
          usage: 'Used to describe extreme happiness or excitement.'
        }
      ]
    },
    {
      id: 4,
      title: 'Time & Situations',
      icon: 'clock-outline',
      color: '#FF9800',
      expressions: [
        { 
          expression: 'Once in a blue moon', 
          meaning: 'Very rarely',
          example: 'I only see my cousins from abroad once in a blue moon.',
          usage: 'Used to describe something that happens very infrequently.'
        },
        { 
          expression: 'Beat around the bush', 
          meaning: 'To avoid getting to the point',
          example: 'Stop beating around the bush and tell me what happened.',
          usage: 'Used when someone is avoiding the main point of a discussion.'
        },
        { 
          expression: 'In the nick of time', 
          meaning: 'Just before it\'s too late',
          example: 'The firefighters arrived in the nick of time to save the building.',
          usage: 'Used to describe something that happens at the last possible moment.'
        },
        { 
          expression: 'When pigs fly', 
          meaning: 'Something that will never happen',
          example: 'He\'ll apologize when pigs fly.',
          usage: 'Used to express the impossibility of something happening.'
        },
        { 
          expression: 'Kill two birds with one stone', 
          meaning: 'To accomplish two things with a single action',
          example: 'By taking my laptop to the cafe, I killed two birds with one stone: I got work done and enjoyed my favorite coffee.',
          usage: 'Used when someone efficiently achieves two objectives with one action.'
        },
        { 
          expression: 'The last straw', 
          meaning: 'The final problem in a series that causes someone to finally lose patience',
          example: 'When he arrived late for the third time this week, it was the last straw, and his boss fired him.',
          usage: 'Used to describe the final incident that makes a situation unbearable.'
        },
        { 
          expression: 'Cut to the chase', 
          meaning: 'Get to the point without wasting time',
          example: 'Let\'s cut to the chase—are you interested in the offer or not?',
          usage: 'Used when someone wants to get directly to the main point.'
        }
      ]
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
      })
    ]).start();
  }, []);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    setModalVisible(true);
    setShowQuiz(false);
    setShowPractice(false);
    setQuizCompleted(false);
    setPracticeCompleted(false);
    
    // Generate quiz questions based on the selected category
    if (category && category.expressions) {
      // Shuffle the expressions
      const shuffled = [...category.expressions].sort(() => 0.5 - Math.random());
      
      // Take first 5 expressions for quiz questions (increased from 3 to 5)
      const selectedExpressions = shuffled.slice(0, 5);
      
      // Create quiz questions
      const questions = selectedExpressions.map(expression => {
        // Get 3 random incorrect meanings from other expressions
        const otherExpressions = category.expressions
          .filter(e => e.expression !== expression.expression)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        
        const options = [
          { text: expression.meaning, correct: true },
          ...otherExpressions.map(e => ({ text: e.meaning, correct: false }))
        ].sort(() => 0.5 - Math.random());
        
        return {
          expression: expression.expression,
          options: options
        };
      });
      
      setQuizQuestions(questions);
      setCurrentQuizQuestion(0);
      setQuizScore(0);
      
      // Set up practice session
      const shuffledForPractice = [...category.expressions].sort(() => 0.5 - Math.random());
      setPracticeWords(shuffledForPractice);
      setCurrentPracticeIndex(0);
      setShowMeaning(false);
      setKnownWords([]);
      setReviewWords([]);
    }
  };

  const handleAnswerSelect = (isCorrect) => {
    if (isCorrect) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setQuizCompleted(false);
    setCurrentQuizQuestion(0);
    setQuizScore(0);
    
    // Reshuffle questions
    if (selectedCategory && selectedCategory.expressions) {
      handleCategoryPress(selectedCategory);
    }
  };

  const flipCard = () => {
    setCardFlipped(!cardFlipped);
    Animated.spring(cardRotateAnim, {
      toValue: cardFlipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    
    if (!cardFlipped) {
      setShowMeaning(true);
    }
  };

  const frontInterpolate = cardRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = cardRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }]
  };
  
  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }]
  };

  const handleWordStatus = (known) => {
    const currentWord = practiceWords[currentPracticeIndex];
    
    if (known) {
      setKnownWords([...knownWords, currentWord]);
    } else {
      setReviewWords([...reviewWords, currentWord]);
    }

    // Move to next word or end practice
    if (currentPracticeIndex < practiceWords.length - 1) {
      setCurrentPracticeIndex(currentPracticeIndex + 1);
      setCardFlipped(false);
      cardRotateAnim.setValue(0);
      setShowMeaning(false);
    } else {
      setPracticeCompleted(true);
    }
  };

  const renderExpressionItem = ({ item }) => (
    <View style={styles.expressionItem}>
      <Text style={styles.expressionText}>{item.expression}</Text>
      <Text style={styles.meaningText}>{item.meaning}</Text>
    </View>
  );

  const renderCategory = ({ item, index }) => (
    <Animated.View
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
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryHeader}>
          <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
            <MaterialCommunityIcons name={item.icon} size={24} color="#fff" />
          </View>
          <Text style={styles.categoryTitle}>{item.title}</Text>
        </View>
        
        <FlatList
          data={item.expressions.slice(0, 3)} // Show only first 3 expressions
          renderItem={renderExpressionItem}
          keyExtractor={(expression, index) => `${item.id}-expression-${index}`}
          scrollEnabled={false}
          contentContainerStyle={styles.expressionsList}
        />
        
        <View style={styles.cardFooter}>
          <View style={styles.expressionCount}>
            <FontAwesome5 name="book-reader" size={12} color="#0072ff" />
            <Text style={styles.countText}>{item.expressions.length} expressions</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.viewMoreButton}
            onPress={() => handleCategoryPress(item)}
          >
            <Text style={styles.viewMoreText}>View more</Text>
            <Ionicons name="chevron-forward" size={16} color="#0072ff" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
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
        
        <Text style={styles.headerTitle}>Idiomatic Expressions</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

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
          <Text style={styles.subtitle}>
            Common Idiomatic Expressions for Everyday Conversations
          </Text>
        </Animated.View>

        <FlatList
          data={idiomaticCategories}
          renderItem={renderCategory}
          keyExtractor={item => `category-${item.id}`}
          scrollEnabled={false}
        />
      </ScrollView>

      {/* Category Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <AntDesign name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  <View style={[styles.modalIconContainer, { backgroundColor: selectedCategory.color }]}>
                    <MaterialCommunityIcons name={selectedCategory.icon} size={28} color="#fff" />
                  </View>
                  <Text style={styles.modalTitle}>{selectedCategory.title} Expressions</Text>
                </View>

                <View style={styles.modalTabsContainer}>
                  <TouchableOpacity 
                    style={[styles.modalTab, !showQuiz && !showPractice && styles.activeTab]}
                    onPress={() => {
                      setShowQuiz(false);
                      setShowPractice(false);
                    }}
                  >
                    <FontAwesome5 name="book" size={16} color={!showQuiz && !showPractice ? selectedCategory.color : '#666'} />
                    <Text style={[styles.tabText, !showQuiz && !showPractice && styles.activeTabText]}>Learn</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, showPractice && styles.activeTab]}
                    onPress={() => {
                      setShowQuiz(false);
                      setShowPractice(true);
                    }}
                  >
                    <FontAwesome5 name="tasks" size={16} color={showPractice ? selectedCategory.color : '#666'} />
                    <Text style={[styles.tabText, showPractice && styles.activeTabText]}>Practice</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, showQuiz && styles.activeTab]}
                    onPress={() => {
                      setShowQuiz(true);
                      setShowPractice(false);
                    }}
                  >
                    <FontAwesome5 name="question-circle" size={16} color={showQuiz ? selectedCategory.color : '#666'} />
                    <Text style={[styles.tabText, showQuiz && styles.activeTabText]}>Quiz</Text>
                  </TouchableOpacity>
                </View>

                {!showQuiz && !showPractice && (
                  <FlatList
                    data={selectedCategory.expressions}
                    renderItem={({ item }) => (
                      <View style={styles.detailExpressionItem}>
                        <Text style={styles.detailExpressionText}>{item.expression}</Text>
                        <Text style={styles.detailMeaningText}>{item.meaning}</Text>
                        
                        <View style={styles.exampleContainer}>
                          <Text style={styles.exampleLabel}>Example:</Text>
                          <Text style={styles.exampleText}>{item.example}</Text>
                        </View>
                        
                        <View style={styles.usageContainer}>
                          <Text style={styles.usageLabel}>Usage:</Text>
                          <Text style={styles.usageText}>{item.usage}</Text>
                        </View>
                      </View>
                    )}
                    keyExtractor={(item, index) => `detail-expression-${index}`}
                    contentContainerStyle={styles.detailExpressionsList}
                    showsVerticalScrollIndicator={false}
                  />
                )}

                {showPractice && !practiceCompleted && practiceWords.length > 0 && (
                  <View style={styles.practiceContainer}>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${((currentPracticeIndex + 1) / practiceWords.length) * 100}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        Word {currentPracticeIndex + 1} of {practiceWords.length}
                      </Text>
                    </View>

                    <TouchableOpacity 
                      activeOpacity={0.9}
                      onPress={flipCard} 
                      style={styles.flipCardContainer}
                    >
                      <Animated.View style={[styles.flashcard, styles.flashcardFront, frontAnimatedStyle]}>
                        <View style={styles.flashcardContent}>
                          <Text style={styles.flashcardWord}>
                            {practiceWords[currentPracticeIndex].expression}
                          </Text>
                          <Text style={styles.tapToFlip}>Tap to flip</Text>
                        </View>
                      </Animated.View>
                      
                      <Animated.View style={[styles.flashcard, styles.flashcardBack, backAnimatedStyle]}>
                        <View style={styles.flashcardContent}>
                          <Text style={styles.flashcardMeaning}>
                            {practiceWords[currentPracticeIndex].meaning}
                          </Text>
                          <Text style={styles.flashcardExample}>
                            Example: {practiceWords[currentPracticeIndex].example}
                          </Text>
                        </View>
                      </Animated.View>
                    </TouchableOpacity>

                    {showMeaning && (
                      <View style={styles.practiceButtons}>
                        <TouchableOpacity 
                          style={[styles.practiceButton, styles.reviewButton]}
                          onPress={() => handleWordStatus(false)}
                        >
                          <Ionicons name="refresh" size={20} color="#fff" />
                          <Text style={styles.practiceButtonText}>Review Later</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[styles.practiceButton, styles.knownButton]}
                          onPress={() => handleWordStatus(true)}
                        >
                          <AntDesign name="check" size={20} color="#fff" />
                          <Text style={styles.practiceButtonText}>I Know This</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    
                    <View style={styles.navigationButtons}>
                      <TouchableOpacity 
                        style={[
                          styles.navButton, 
                          currentPracticeIndex === 0 && styles.disabledNavButton
                        ]}
                        onPress={() => {
                          if (currentPracticeIndex > 0) {
                            setCurrentPracticeIndex(currentPracticeIndex - 1);
                            setCardFlipped(false);
                            cardRotateAnim.setValue(0);
                            setShowMeaning(false);
                          }
                        }}
                        disabled={currentPracticeIndex === 0}
                      >
                        <Ionicons name="chevron-back" size={24} color={currentPracticeIndex === 0 ? "#ccc" : "#0072ff"} />
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[
                          styles.navButton, 
                          currentPracticeIndex === practiceWords.length - 1 && styles.disabledNavButton
                        ]}
                        onPress={() => {
                          if (currentPracticeIndex < practiceWords.length - 1) {
                            setCurrentPracticeIndex(currentPracticeIndex + 1);
                            setCardFlipped(false);
                            cardRotateAnim.setValue(0);
                            setShowMeaning(false);
                          }
                        }}
                        disabled={currentPracticeIndex === practiceWords.length - 1}
                      >
                        <Ionicons name="chevron-forward" size={24} color={currentPracticeIndex === practiceWords.length - 1 ? "#ccc" : "#0072ff"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {showPractice && practiceCompleted && (
                  <View style={styles.practiceResultContainer}>
                    <Text style={styles.practiceResultTitle}>Practice Summary</Text>
                    
                    <View style={styles.practiceStatsContainer}>
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{knownWords.length}</Text>
                        <Text style={styles.statLabel}>Words You Know</Text>
                      </View>
                      
                      <View style={styles.statCard}>
                        <Text style={styles.statValue}>{reviewWords.length}</Text>
                        <Text style={styles.statLabel}>Words to Review</Text>
                      </View>
                    </View>

                    {reviewWords.length > 0 && (
                      <View style={styles.reviewWordsContainer}>
                        <Text style={styles.reviewWordsTitle}>Words to Review:</Text>
                        <ScrollView style={styles.reviewWordsList}>
                          {reviewWords.map((word, index) => (
                            <View key={`review-${index}`} style={styles.reviewWordItem}>
                              <Text style={styles.reviewWordText}>{word.expression}</Text>
                              <Text style={styles.reviewWordMeaning}>{word.meaning}</Text>
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}

                    <View style={styles.resultButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.tryAgainButton}
                        onPress={() => {
                          // Restart practice with review words if there are any
                          if (reviewWords.length > 0) {
                            setPracticeWords(reviewWords);
                            setCurrentPracticeIndex(0);
                            setShowMeaning(false);
                            setPracticeCompleted(false);
                            setKnownWords([]);
                            setReviewWords([]);
                            setCardFlipped(false);
                            cardRotateAnim.setValue(0);
                          } else {
                            // Otherwise restart with all words
                            setPracticeWords([...selectedCategory.expressions].sort(() => 0.5 - Math.random()));
                            setCurrentPracticeIndex(0);
                            setShowMeaning(false);
                            setPracticeCompleted(false);
                            setKnownWords([]);
                            setReviewWords([]);
                            setCardFlipped(false);
                            cardRotateAnim.setValue(0);
                          }
                        }}
                      >
                        <FontAwesome5 name="redo-alt" size={18} color="#0072ff" />
                          <Text style={styles.resultButtonText}>
                            {reviewWords.length > 0 ? 'Practice Review Words' : 'Practice Again'}
                          </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.doneButtonNew}
                        onPress={() => {
                          setShowPractice(false);
                          setPracticeCompleted(false);
                        }}
                      >
                        <AntDesign name="checkcircle" size={18} color="#0072ff" />
                          <Text style={styles.resultButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {showPractice && practiceWords.length === 0 && (
                  <View style={styles.placeholderContainer}>
                    <FontAwesome5 name="tasks" size={40} color={selectedCategory.color} />
                    <Text style={styles.placeholderTitle}>No Practice Available</Text>
                    <Text style={styles.placeholderText}>
                      We couldn't set up practice for this category. Please try another category.
                    </Text>
                  </View>
                )}

                {showQuiz && !quizCompleted && quizQuestions.length > 0 && (
                  <View style={styles.quizContainer}>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        Question {currentQuizQuestion + 1} of {quizQuestions.length}
                      </Text>
                    </View>

                    <View style={styles.questionCard}>
                      <Text style={styles.questionTitle}>What does this expression mean?</Text>
                      <Text style={styles.questionExpression}>
                        "{quizQuestions[currentQuizQuestion].expression}"
                      </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                      {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                        <TouchableOpacity
                          key={`option-${index}`}
                          style={styles.optionButton}
                          onPress={() => handleAnswerSelect(option.correct)}
                          activeOpacity={0.7}
                        >
                          <View style={styles.optionContent}>
                            <View style={styles.optionBullet}>
                              <Text style={styles.optionBulletText}>{String.fromCharCode(65 + index)}</Text>
                            </View>
                            <Text style={styles.optionText}>{option.text}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}

                {showQuiz && quizCompleted && (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Quiz Complete!</Text>
                    
                    <View style={styles.scoreContainer}>
                      <Text style={styles.scoreText}>Your Score</Text>
                      
                      <View style={styles.scoreDisplayContainer}>
                        <View style={[
                          styles.scoreCircleOuter,
                          { 
                            borderColor: quizScore >= quizQuestions.length * 0.7 ? '#4CAF50' : '#FF9800',
                          }
                        ]}>
                          <View style={styles.scoreCircleInner}>
                            <Text style={styles.scoreValue}>{quizScore}</Text>
                            <Text style={styles.scoreTotal}>/{quizQuestions.length}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <Text style={[
                        styles.scorePercentage,
                        { color: quizScore >= quizQuestions.length * 0.7 ? '#4CAF50' : '#FF9800' }
                      ]}>
                        {Math.round((quizScore / quizQuestions.length) * 100)}%
                      </Text>
                      
                      <Text style={styles.resultFeedback}>
                        {quizScore === quizQuestions.length ? 
                          'Perfect! You mastered these expressions!' : 
                          quizScore >= quizQuestions.length * 0.7 ? 
                          'Great job! You\'re doing well!' : 
                          'Keep practicing to improve your knowledge!'}
                      </Text>
                    </View>

                    <View style={styles.resultButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.tryAgainButton}
                        onPress={restartQuiz}
                      >
                        <FontAwesome5 name="redo-alt" size={18} color="#0072ff" />
                          <Text style={styles.resultButtonText}>Try Again</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.doneButtonNew}
                        onPress={() => {
                          setShowQuiz(false);
                          setQuizCompleted(false);
                        }}
                      >
                        <AntDesign name="checkcircle" size={18} color="#0072ff" />
                          <Text style={styles.resultButtonText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {showQuiz && quizQuestions.length === 0 && (
                  <View style={styles.placeholderContainer}>
                    <FontAwesome5 name="question-circle" size={40} color={selectedCategory.color} />
                    <Text style={styles.placeholderTitle}>No Quiz Available</Text>
                    <Text style={styles.placeholderText}>
                      We couldn't set up a quiz for this category. Please try another category.
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Search')}
      >
        <AntDesign name="search1" size={24} color="#fff" />
      </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 10,
    marginBottom: 30,
    opacity: 0.9,
    textAlign: 'center',
  },
  categoryCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  expressionsList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  expressionItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  expressionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  expressionCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
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
    paddingBottom: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  modalTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    flex: 1,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#333',
    fontWeight: '600',
  },
  detailExpressionsList: {
    padding: 16,
  },
  detailExpressionItem: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  detailExpressionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailMeaningText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  exampleContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0072ff',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
  usageContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
  },
  usageLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 14,
    color: '#333',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0072ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  quizContainer: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  questionCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0072ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 12,
  },
  questionExpression: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionBulletText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0072ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  resultContainer: {
    padding: 24,
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 24,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  scoreDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    width: '100%',
  },
  scoreCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  scoreCircleInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreValue: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreTotal: {
    fontSize: 22,
    color: '#666',
    marginTop: 6,
    marginLeft: 2,
  },
  scorePercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  resultFeedback: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  tryAgainButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginRight: 10,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  doneButtonNew: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  resultButtonText: {
    color: '#0072ff',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 6,
  },
  practiceContainer: {
    padding: 16,
  },
  flipCardContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    perspective: 1000,
  },
  flashcard: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backfaceVisibility: 'hidden',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  flashcardFront: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashcardBack: {
    backgroundColor: '#f0f8ff',
    borderWidth: 1,
    borderColor: '#0072ff',
    transform: [{ rotateY: '180deg' }],
  },
  flashcardContent: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  flashcardWord: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  flashcardMeaning: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  flashcardExample: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'center',
    backgroundColor: 'rgba(0,114,255,0.1)',
    padding: 12,
    borderRadius: 8,
    width: '100%',
  },
  tapToFlip: {
    marginTop: 20,
    color: '#0072ff',
    fontSize: 14,
    fontStyle: 'italic',
  },
  practiceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  practiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8,
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  reviewButton: {
    backgroundColor: '#2196F3',
  },
  knownButton: {
    backgroundColor: '#4CAF50',
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledNavButton: {
    backgroundColor: '#f9f9f9',
  },
  practiceResultContainer: {
    padding: 24,
    alignItems: 'center',
  },
  practiceResultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
  },
  practiceStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  reviewWordsContainer: {
    width: '100%',
    marginBottom: 24,
  },
  reviewWordsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  reviewWordsList: {
    maxHeight: 200,
  },
  reviewWordItem: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewWordText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  reviewWordMeaning: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
  },
});