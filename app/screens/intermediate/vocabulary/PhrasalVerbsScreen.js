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
  TextInput,
  Modal
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign, MaterialCommunityIcons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PhrasalVerbsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('common');
  
  // New state variables for practice and quiz features
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('learn');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);

  // Enhanced phrasal verbs data with more examples and detailed meanings
  const phrasalVerbsData = {
    common: [
      { 
        verb: 'break down', 
        meaning: 'to stop functioning or working properly', 
        example: 'My car broke down on the highway.',
        usage: 'Used for vehicles, machines, or systems that stop working',
        level: 'beginner'
      },
      { 
        verb: 'bring up', 
        meaning: 'to mention something or start discussing a topic', 
        example: 'She brought up an interesting point during the meeting.',
        usage: 'Used in conversations when introducing new topics',
        level: 'beginner'
      },
      { 
        verb: 'call off', 
        meaning: 'to cancel or abandon a planned event or activity', 
        example: 'The game was called off due to bad weather.',
        usage: 'Used when plans are canceled, often due to external factors',
        level: 'beginner'
      },
      { 
        verb: 'carry on', 
        meaning: 'to continue doing something despite difficulties', 
        example: 'Despite the difficulties, they carried on with their work.',
        usage: 'Used to describe persistence in the face of challenges',
        level: 'beginner'
      },
      { 
        verb: 'come across', 
        meaning: 'to find something by chance or to give a certain impression', 
        example: 'I came across an old photo while cleaning my desk.',
        usage: 'Used when discovering something unexpectedly or describing how someone appears to others',
        level: 'intermediate'
      },
      { 
        verb: 'figure out', 
        meaning: 'to understand or solve a problem after thinking about it', 
        example: 'It took me a while to figure out the puzzle.',
        usage: 'Used when solving problems or understanding complex situations',
        level: 'beginner'
      },
      { 
        verb: 'give up', 
        meaning: 'to stop trying or to surrender', 
        example: 'Don\'t give up on your dreams.',
        usage: 'Used to describe abandoning an effort or surrendering',
        level: 'beginner'
      },
      { 
        verb: 'look after', 
        meaning: 'to take care of or be responsible for someone or something', 
        example: 'Can you look after my dog while I\'m away?',
        usage: 'Used when discussing care responsibilities',
        level: 'beginner'
      },
      { 
        verb: 'put off', 
        meaning: 'to postpone or delay doing something', 
        example: 'I\'ve been putting off going to the dentist for months.',
        usage: 'Used when delaying tasks, often due to reluctance',
        level: 'intermediate'
      },
      { 
        verb: 'run into', 
        meaning: 'to meet someone by chance or to encounter a problem', 
        example: 'I ran into my old teacher at the supermarket yesterday.',
        usage: 'Used for unexpected encounters with people or problems',
        level: 'intermediate'
      },
      { 
        verb: 'turn down', 
        meaning: 'to reject or refuse an offer or request', 
        example: 'She turned down the job offer because the salary was too low.',
        usage: 'Used when rejecting offers, proposals, or requests',
        level: 'intermediate'
      },
      { 
        verb: 'set up', 
        meaning: 'to establish, arrange, or prepare something', 
        example: 'We need to set up a meeting to discuss the project.',
        usage: 'Used when establishing organizations or arranging events',
        level: 'intermediate'
      },
      { 
        verb: 'look into', 
        meaning: 'to investigate or examine something', 
        example: 'The police are looking into the cause of the accident.',
        usage: 'Used when investigating problems, situations, or opportunities',
        level: 'beginner'
      },
      { 
        verb: 'get along with', 
        meaning: 'to have a good relationship with someone', 
        example: 'I get along with most of my colleagues at work.',
        usage: 'Used when describing relationships between people',
        level: 'beginner'
      },
      { 
        verb: 'keep up with', 
        meaning: 'to stay at the same level or rate as someone or something', 
        example: 'It\'s hard to keep up with all the new technology.',
        usage: 'Used when discussing maintaining pace with changes or developments',
        level: 'intermediate'
      },
      { 
        verb: 'run out of', 
        meaning: 'to use all of something and have none left', 
        example: 'We\'ve run out of milk, so I need to go to the store.',
        usage: 'Used when supplies or resources are depleted',
        level: 'beginner'
      },
      { 
        verb: 'point out', 
        meaning: 'to draw attention to something or someone', 
        example: 'My teacher pointed out several mistakes in my essay.',
        usage: 'Used when highlighting or indicating something that might not be obvious',
        level: 'beginner'
      },
      { 
        verb: 'go through', 
        meaning: 'to experience or endure something difficult', 
        example: 'She\'s going through a difficult time after losing her job.',
        usage: 'Used when describing experiences, especially challenging ones',
        level: 'intermediate'
      },
      { 
        verb: 'catch up on', 
        meaning: 'to do something you did not have time to do earlier', 
        example: 'I need to catch up on my homework this weekend.',
        usage: 'Used when completing delayed tasks or getting updated information',
        level: 'intermediate'
      },
      { 
        verb: 'deal with', 
        meaning: 'to handle a problem, situation, or person', 
        example: 'The manager will deal with the customer complaint.',
        usage: 'Used when handling or resolving issues or interacting with people',
        level: 'beginner'
      }
    ],
    byParticle: {
      'up': [
        { 
          verb: 'give up', 
          meaning: 'to stop trying or to surrender', 
          example: 'Don\'t give up on your dreams.',
          usage: 'Used to describe abandoning an effort or surrendering',
          level: 'beginner'
        },
        { 
          verb: 'look up', 
          meaning: 'to search for information or to improve', 
          example: 'I need to look up this word in the dictionary.',
          usage: 'Used when searching for information in reference materials',
          level: 'beginner'
        },
        { 
          verb: 'make up', 
          meaning: 'to invent a story or to reconcile after an argument', 
          example: 'He made up an excuse for being late.',
          usage: 'Used for creating stories or resolving conflicts',
          level: 'intermediate'
        },
        { 
          verb: 'set up', 
          meaning: 'to establish, arrange, or prepare something', 
          example: 'We need to set up a meeting to discuss the project.',
          usage: 'Used when establishing organizations or arranging events',
          level: 'intermediate'
        },
        { 
          verb: 'bring up', 
          meaning: 'to mention something or to raise children', 
          example: 'She brought up an interesting point during the meeting.',
          usage: 'Used in conversations when introducing topics or discussing child-rearing',
          level: 'beginner'
        },
        { 
          verb: 'catch up on', 
          meaning: 'to do something you did not have time to do earlier', 
          example: 'I need to catch up on my homework this weekend.',
          usage: 'Used when completing delayed tasks or getting updated information',
          level: 'intermediate'
        },
        { 
          verb: 'keep up with', 
          meaning: 'to stay at the same level or rate as someone or something', 
          example: 'It\'s hard to keep up with all the new technology.',
          usage: 'Used when discussing maintaining pace with changes or developments',
          level: 'intermediate'
        }
      ],
      'out': [
        { 
          verb: 'figure out', 
          meaning: 'to understand or solve a problem after thinking about it', 
          example: 'It took me a while to figure out the puzzle.',
          usage: 'Used when solving problems or understanding complex situations',
          level: 'beginner'
        },
        { 
          verb: 'find out', 
          meaning: 'to discover or learn something', 
          example: 'I need to find out what time the meeting starts.',
          usage: 'Used when discovering information that was previously unknown',
          level: 'beginner'
        },
        { 
          verb: 'work out', 
          meaning: 'to exercise or to solve a problem successfully', 
          example: 'I work out at the gym three times a week.',
          usage: 'Used for physical exercise or resolving issues',
          level: 'intermediate'
        },
        { 
          verb: 'run out', 
          meaning: 'to use up all of something or have no more left', 
          example: 'We\'ve run out of milk, so I need to go to the store.',
          usage: 'Used when supplies are depleted',
          level: 'beginner'
        },
        { 
          verb: 'check out', 
          meaning: 'to look at something closely or to leave a hotel', 
          example: 'You should check out that new restaurant downtown.',
          usage: 'Used for examining things or departing from accommodations',
          level: 'intermediate'
        },
        { 
          verb: 'point out', 
          meaning: 'to draw attention to something or someone', 
          example: 'My teacher pointed out several mistakes in my essay.',
          usage: 'Used when highlighting or indicating something that might not be obvious',
          level: 'beginner'
        }
      ],
      'on': [
        { 
          verb: 'carry on', 
          meaning: 'to continue doing something despite difficulties', 
          example: 'Despite the difficulties, they carried on with their work.',
          usage: 'Used to describe persistence in the face of challenges',
          level: 'beginner'
        },
        { 
          verb: 'get on', 
          meaning: 'to have a good relationship or to board transportation', 
          example: 'How do you get on with your new colleagues?',
          usage: 'Used for relationships or entering vehicles',
          level: 'intermediate'
        },
        { 
          verb: 'try on', 
          meaning: 'to test clothes by wearing them', 
          example: 'She tried on several dresses before choosing one.',
          usage: 'Used specifically for testing clothing items by wearing them',
          level: 'beginner'
        },
        { 
          verb: 'hold on', 
          meaning: 'to wait or to grip something tightly', 
          example: 'Hold on a moment while I check the schedule.',
          usage: 'Used when asking someone to wait or when gripping firmly',
          level: 'beginner'
        },
        { 
          verb: 'take on', 
          meaning: 'to accept a challenge or responsibility', 
          example: 'She took on the role of project manager.',
          usage: 'Used when accepting new responsibilities or challenges',
          level: 'intermediate'
        },
      ],
      'off': [
        { 
          verb: 'take off', 
          meaning: 'to remove something or for a plane to leave the ground', 
          example: 'Please take off your shoes before entering.',
          usage: 'Used for removing items or aircraft departing',
          level: 'beginner'
        },
        { 
          verb: 'call off', 
          meaning: 'to cancel or abandon a planned event or activity', 
          example: 'The game was called off due to bad weather.',
          usage: 'Used when plans are canceled, often due to external factors',
          level: 'beginner'
        },
        { 
          verb: 'put off', 
          meaning: 'to postpone or delay doing something', 
          example: 'I\'ve been putting off going to the dentist for months.',
          usage: 'Used when delaying tasks, often due to reluctance',
          level: 'intermediate'
        },
        { 
          verb: 'show off', 
          meaning: 'to display abilities or possessions in a proud way', 
          example: 'He was showing off his new car to everyone.',
          usage: 'Used to describe boastful behavior',
          level: 'beginner'
        },
        { 
          verb: 'drop off', 
          meaning: 'to deliver someone or something', 
          example: 'I\'ll drop off the package at your office tomorrow.',
          usage: 'Used when delivering people or items to a location',
          level: 'intermediate'
        },
      ],
      'with': [
        { 
          verb: 'get along with', 
          meaning: 'to have a good relationship with someone', 
          example: 'I get along with most of my colleagues at work.',
          usage: 'Used when describing relationships between people',
          level: 'beginner'
        },
        { 
          verb: 'deal with', 
          meaning: 'to handle a problem, situation, or person', 
          example: 'The manager will deal with the customer complaint.',
          usage: 'Used when handling or resolving issues or interacting with people',
          level: 'beginner'
        }
      ],
      'into': [
        { 
          verb: 'look into', 
          meaning: 'to investigate or examine something', 
          example: 'The police are looking into the cause of the accident.',
          usage: 'Used when investigating problems, situations, or opportunities',
          level: 'beginner'
        }
      ],
      'through': [
        { 
          verb: 'go through', 
          meaning: 'to experience or endure something difficult', 
          example: 'She\'s going through a difficult time after losing her job.',
          usage: 'Used when describing experiences, especially challenging ones',
          level: 'intermediate'
        }
      ]
    }
  };

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

  // Handle verb press to show modal with practice and quiz options
  const handleVerbPress = (verb) => {
    setSelectedVerb(verb);
    setModalVisible(true);
    setActiveModalTab('learn');
    setQuizCompleted(false);
    setPracticeCompleted(false);
    
    // Generate quiz questions for this verb
    generateQuizQuestions(verb);
  };
  
  // Generate quiz questions for the selected phrasal verb
  const generateQuizQuestions = (verb) => {
    // Get all verbs from common list for options
    const allVerbs = phrasalVerbsData.common.filter(v => v.verb !== verb.verb);
    
    // Create 5 quiz questions
    const questions = [
      // Question 1: Select the correct meaning
      {
        type: 'meaning',
        question: `What is the meaning of "${verb.verb}"?`,
        correctAnswer: verb.meaning,
        options: [
          verb.meaning,
          ...getRandomItems(allVerbs, 3).map(v => v.meaning)
        ].sort(() => Math.random() - 0.5)
      },
      // Question 2: Fill in the blank with correct phrasal verb
      {
        type: 'fillBlank',
        question: `Fill in the blank: ${verb.example.replace(verb.verb, '_____')}`,
        correctAnswer: verb.verb,
        options: [
          verb.verb,
          ...getRandomItems(allVerbs, 3).map(v => v.verb)
        ].sort(() => Math.random() - 0.5)
      },
      // Question 3: Select the correct usage
      {
        type: 'usage',
        question: `How is "${verb.verb}" typically used?`,
        correctAnswer: verb.usage,
        options: [
          verb.usage,
          ...getRandomItems(allVerbs, 3).map(v => v.usage)
        ].sort(() => Math.random() - 0.5)
      },
      // Question 4: Select the correct example
      {
        type: 'example',
        question: `Which sentence correctly uses "${verb.verb}"?`,
        correctAnswer: verb.example,
        options: [
          verb.example,
          ...getRandomItems(allVerbs, 3).map(v => v.example)
        ].sort(() => Math.random() - 0.5)
      },
      // Question 5: Match the verb with its particle
      {
        type: 'particle',
        question: `Which particle completes this phrasal verb: "${verb.verb.split(' ')[0]} _____"?`,
        correctAnswer: verb.verb.split(' ')[1],
        options: [
          verb.verb.split(' ')[1],
          ...['up', 'down', 'in', 'out', 'off', 'on', 'away', 'over']
            .filter(p => p !== verb.verb.split(' ')[1])
            .slice(0, 3)
        ].sort(() => Math.random() - 0.5)
      }
    ];
    
    setQuizQuestions(questions);
    setCurrentQuizQuestion(0);
    setQuizScore(0);
  };
  
  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Handle quiz answer selection
  const handleAnswerSelect = (answer, correctAnswer) => {
    if (answer === correctAnswer) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Restart quiz
  const restartQuiz = () => {
    if (selectedVerb) {
      generateQuizQuestions(selectedVerb);
      setQuizCompleted(false);
    }
  };

  // Filter phrasal verbs based on search query
  const filteredVerbs = () => {
    if (activeTab === 'common') {
      return phrasalVerbsData.common.filter(item => 
        item.verb.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else {
      // For "By Particle" tab, we'll just return all grouped verbs
      return phrasalVerbsData.byParticle;
    }
  };

  const renderPhrasalVerb = (item, index) => (
    <Animated.View
      key={`verb-${index}`}
      style={{
        opacity: fadeAnim,
        transform: [{ 
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [30 + (index * 10), 0]
          })
        }]
      }}
    >
      <View style={styles.verbCard}>
        <View style={styles.verbHeader}>
          <Text style={styles.verbText}>{item.verb}</Text>
          <View style={[
            styles.levelBadge, 
            {backgroundColor: item.level === 'beginner' ? '#4CAF50' : '#FF9800'}
          ]}>
            <Text style={styles.levelText}>{item.level}</Text>
          </View>
        </View>
        <Text style={styles.meaningText}>{item.meaning}</Text>
        
        <View style={styles.exampleContainer}>
          <Text style={styles.exampleLabel}>Example:</Text>
          <Text style={styles.exampleText}>{item.example}</Text>
        </View>
        
        {item.usage && (
          <View style={styles.usageContainer}>
            <Text style={styles.usageLabel}>Usage:</Text>
            <Text style={styles.usageText}>{item.usage}</Text>
          </View>
        )}
        
        <TouchableOpacity 
          style={styles.practiceButton}
          onPress={() => handleVerbPress(item)}
        >
          <Text style={styles.practiceButtonText}>Practice</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

  const renderByParticleContent = () => {
    return Object.keys(phrasalVerbsData.byParticle).map((particle, particleIndex) => (
      <View key={`particle-${particleIndex}`} style={styles.particleSection}>
        <View style={styles.particleHeader}>
          <View style={styles.particleBadge}>
            <Text style={styles.particleText}>{particle}</Text>
          </View>
        </View>
        
        {phrasalVerbsData.byParticle[particle]
          .filter(item => 
            searchQuery === '' || 
            item.verb.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((item, index) => renderPhrasalVerb(item, index))}
      </View>
    ));
  };

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
        
        <Text style={styles.headerTitle}>Phrasal Verbs</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Subtitle */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingHorizontal: 16,
            paddingTop: 16,
            alignItems: 'center'
          }}
        >
          <Text style={{
            fontSize: 16,
            color: '#666',
            marginBottom: 16,
            textAlign: 'center',
          }}>
            Common Phrasal Verbs for Everyday English
          </Text>
        </Animated.View>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search phrasal verbs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8e8e93"
          />
          {searchQuery !== '' && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <AntDesign name="close" size={16} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'common' && styles.activeTab]}
            onPress={() => setActiveTab('common')}
          >
            <Text style={[styles.tabText, activeTab === 'common' && styles.activeTabText]}>
              Common Phrasal Verbs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'byParticle' && styles.activeTab]}
            onPress={() => setActiveTab('byParticle')}
          >
            <Text style={[styles.tabText, activeTab === 'byParticle' && styles.activeTabText]}>
              By Particle
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {activeTab === 'common' ? (
            filteredVerbs().map((item, index) => renderPhrasalVerb(item, index))
          ) : (
            renderByParticleContent()
          )}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Search')}
      >
        <AntDesign name="search1" size={24} color="#fff" />
      </TouchableOpacity>
      
      {/* Verb Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedVerb && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <AntDesign name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{selectedVerb.verb}</Text>
                  <View style={[
                    styles.levelBadgeModal, 
                    {backgroundColor: selectedVerb.level === 'beginner' ? '#4CAF50' : '#FF9800'}
                  ]}>
                    <Text style={styles.levelTextModal}>{selectedVerb.level}</Text>
                  </View>
                </View>

                <View style={styles.modalTabsContainer}>
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'learn' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('learn')}
                  >
                    <FontAwesome5 name="book" size={16} color={activeModalTab === 'learn' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'learn' && styles.activeModalTabText]}>Learn</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'practice' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('practice')}
                  >
                    <FontAwesome5 name="tasks" size={16} color={activeModalTab === 'practice' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'practice' && styles.activeModalTabText]}>Practice</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'quiz' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('quiz')}
                  >
                    <FontAwesome5 name="question-circle" size={16} color={activeModalTab === 'quiz' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'quiz' && styles.activeModalTabText]}>Quiz</Text>
                  </TouchableOpacity>
                </View>
                
                {activeModalTab === 'learn' && (
                  <ScrollView style={styles.learnContainer}>
                    <View style={styles.definitionCard}>
                      <Text style={styles.definitionTitle}>Meaning</Text>
                      <Text style={styles.definitionText}>{selectedVerb.meaning}</Text>
                    </View>
                    
                    <View style={styles.definitionCard}>
                      <Text style={styles.definitionTitle}>Example</Text>
                      <Text style={styles.definitionText}>{selectedVerb.example}</Text>
                    </View>
                    
                    <View style={styles.definitionCard}>
                      <Text style={styles.definitionTitle}>Usage</Text>
                      <Text style={styles.definitionText}>{selectedVerb.usage}</Text>
                    </View>
                    
                    <View style={styles.tipsCard}>
                      <Text style={styles.tipsTitle}>Learning Tips</Text>
                      <View style={styles.tipItem}>
                        <FontAwesome5 name="lightbulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          Practice using this phrasal verb in your own sentences.
                        </Text>
                      </View>
                      <View style={styles.tipItem}>
                        <FontAwesome5 name="lightbulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          Pay attention to whether this phrasal verb is separable or inseparable.
                        </Text>
                      </View>
                      <View style={styles.tipItem}>
                        <FontAwesome5 name="lightbulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          Try to use this phrasal verb in conversation today.
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                )}
                
                {activeModalTab === 'quiz' && !quizCompleted && (
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
                      <Text style={styles.questionText}>
                        {quizQuestions[currentQuizQuestion].question}
                      </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                      {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                        <TouchableOpacity
                          key={`option-${index}`}
                          style={styles.optionButton}
                          onPress={() => handleAnswerSelect(option, quizQuestions[currentQuizQuestion].correctAnswer)}
                        >
                          <View style={styles.optionContent}>
                            <View style={styles.optionBullet}>
                              <Text style={styles.optionBulletText}>{String.fromCharCode(65 + index)}</Text>
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                
                {activeModalTab === 'quiz' && quizCompleted && (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Quiz Complete!</Text>
                    
                    <View style={styles.quizResultCard}>
                      <View style={styles.scoreHeaderContainer}>
                        <Text style={styles.scoreHeaderText}>Your Score</Text>
                        <Text style={styles.scorePercentage}>
                          {Math.round((quizScore / quizQuestions.length) * 100)}%
                        </Text>
                      </View>
                      
                      <View style={styles.scoreCircleContainer}>
                        <View style={[
                          styles.scoreCircleOuter,
                          { 
                            borderColor: quizScore >= quizQuestions.length * 0.7 ? '#4CAF50' : '#FF9800',
                          }
                        ]}>
                          <Text style={styles.scoreValue}>{quizScore}</Text>
                          <Text style={styles.scoreTotal}>/{quizQuestions.length}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.resultFeedback}>
                        {quizScore === quizQuestions.length ? 
                          'Perfect! You\'ve mastered this phrasal verb!' : 
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
                        <LinearGradient
                          colors={['#29B6F6', '#0288D1']}
                          style={styles.buttonGradient}
                        >
                          <FontAwesome5 name="redo-alt" size={18} color="#fff" />
                          <Text style={styles.resultButtonText}>Try Again</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.doneButton}
                        onPress={() => setActiveModalTab('learn')}
                      >
                        <LinearGradient
                          colors={['#66BB6A', '#388E3C']}
                          style={styles.buttonGradient}
                        >
                          <AntDesign name="checkcircle" size={18} color="#fff" />
                          <Text style={styles.resultButtonText}>Done</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                {activeModalTab === 'practice' && (
                  <View style={styles.practiceContainer}>
                    <Text style={styles.practiceTitle}>Practice "{selectedVerb.verb}"</Text>
                    
                    <View style={styles.practiceCard}>
                      <Text style={styles.practiceInstruction}>
                        Complete the sentence using the phrasal verb:
                      </Text>
                      <Text style={styles.practiceSentence}>
                        {selectedVerb.example.replace(selectedVerb.verb, '______')}
                      </Text>
                      
                      <TouchableOpacity 
                        style={styles.showAnswerButton}
                        onPress={() => setPracticeCompleted(true)}
                      >
                        <Text style={styles.showAnswerText}>Show Answer</Text>
                      </TouchableOpacity>
                      
                      {practiceCompleted && (
                        <View style={styles.answerContainer}>
                          <Text style={styles.answerLabel}>Answer:</Text>
                          <Text style={styles.answerText}>{selectedVerb.verb}</Text>
                          <Text style={styles.fullSentence}>{selectedVerb.example}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.practiceCard}>
                      <Text style={styles.practiceInstruction}>
                        Try to create your own sentence using "{selectedVerb.verb}":
                      </Text>
                      <TextInput
                        style={styles.practiceInput}
                        placeholder="Write your sentence here..."
                        multiline={true}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.resetPracticeButton}
                      onPress={() => setPracticeCompleted(false)}
                    >
                      <Text style={styles.resetPracticeText}>Reset Practice</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 6,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0072ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8e8e93',
  },
  activeTabText: {
    color: '#0072ff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  verbCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verbHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verbText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0072ff',
    flex: 1,
    marginRight: 10,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  meaningText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 22,
  },
  exampleContainer: {
    backgroundColor: '#f5f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  exampleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
  usageContainer: {
    backgroundColor: '#f5f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  usageText: {
    fontSize: 14,
    color: '#333',
  },
  practiceButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  practiceButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  particleSection: {
    marginBottom: 24,
  },
  particleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  particleBadge: {
    backgroundColor: '#0072ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  particleText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
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
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  modalTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeModalTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0072ff',
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeModalTabText: {
    color: '#0072ff',
    fontWeight: '600',
  },
  levelBadgeModal: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelTextModal: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0072ff',
    borderRadius: 20,
    padding: 12,
  },
  learnContainer: {
    padding: 16,
  },
  definitionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  definitionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 4,
  },
  definitionText: {
    fontSize: 14,
    color: '#333',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 4,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tipIcon: {
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
  },
  quizContainer: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0072ff',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'right',
  },
  questionCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
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
    padding: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizResultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  scoreHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  scoreHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  scoreCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  scoreCircleOuter: {
    width: 90,
    height: 90,
    borderWidth: 4,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreTotal: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 4,
  },
  resultFeedback: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  doneButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  practiceContainer: {
    padding: 16,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 12,
  },
  practiceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  practiceInstruction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  practiceSentence: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  showAnswerButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  showAnswerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  answerContainer: {
    backgroundColor: '#f5f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  fullSentence: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  resetPracticeButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  resetPracticeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  practiceInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});