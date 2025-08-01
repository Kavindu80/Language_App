import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Animated,
  StatusBar,
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons, AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ThematicVocabularyScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [practiceModalVisible, setPracticeModalVisible] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [tipVisible, setTipVisible] = useState(false);
  const tipTimeout = useRef(null);
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentPracticeIndex, setCurrentPracticeIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [knownWords, setKnownWords] = useState([]);
  const [reviewWords, setReviewWords] = useState([]);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardRotateAnim] = useState(new Animated.Value(0));
  const [practiceMode, setPracticeMode] = useState('flashcards'); // 'flashcards', 'matching', 'typing'
  const windowWidth = Dimensions.get('window').width;

  const thematicUnits = [
    {
      id: 1,
      title: 'Travel',
      icon: 'flight',
      description: 'Essential Vocabulary for Airports, Hotels, and Transportation',
      color: '#4CAF50',
      vocabulary: [
        { word: 'Itinerary', meaning: 'A detailed plan for a trip', example: 'Our itinerary includes three days in Paris.' },
        { word: 'Accommodation', meaning: 'A place to stay while traveling', example: 'We booked our accommodation in advance.' },
        { word: 'Departure', meaning: 'The act of leaving, especially for a journey', example: 'Our departure time is 10:00 AM.' },
        { word: 'Destination', meaning: 'The place you are traveling to', example: 'Japan is a popular travel destination.' },
        { word: 'Luggage', meaning: 'Bags or suitcases used for travel', example: 'Please place your luggage on the scale.' },
        { word: 'Passport', meaning: 'An official document for international travel', example: 'Make sure your passport is up to date.' },
        { word: 'Visa', meaning: 'A stamp or document that allows entry into a country', example: 'You\'ll need a visa to visit that country.' },
        { word: 'Boarding Pass', meaning: 'A document that lets you board a plane', example: 'Show your boarding pass at the gate.' },
        { word: 'Layover', meaning: 'A stop between flights', example: 'We had a two-hour layover in Dubai.' },
        { word: 'Customs', meaning: 'An area at airports where luggage is checked upon arrival', example: 'We had to declare items at customs.' },
        { word: 'Currency', meaning: 'The type of money used in a country', example: 'Exchange your currency before leaving the airport.' },
        { word: 'Reservation', meaning: 'An arrangement to hold something like a room or seat', example: 'I made a dinner reservation for 7 PM.' },
        { word: 'Check-in', meaning: 'Registering when arriving at a hotel or airport', example: 'Check-in starts at 3 PM.' },
        { word: 'Check-out', meaning: 'Leaving a hotel after your stay', example: 'Check-out is before 11 AM.' },
        { word: 'Sightseeing', meaning: 'Visiting famous or interesting places', example: 'We went sightseeing around the city.' },
        { word: 'Tour Guide', meaning: 'A person who shows you around tourist spots', example: 'The tour guide told us interesting facts.' },
        { word: 'Souvenir', meaning: 'Something you buy to remember a place', example: 'I bought a magnet as a souvenir.' },
        { word: 'Jet Lag', meaning: 'Tiredness after a long flight across time zones', example: 'I had jet lag for two days.' },
        { word: 'Excursion', meaning: 'A short trip, often for fun or learning', example: 'We went on a boat excursion.' },
        { word: 'Tourist', meaning: 'A person who travels for fun', example: 'Many tourists visit this island in summer.' }
      ],
      quiz: [
        {
          question: 'What do you call a detailed plan for your journey?',
          options: ['Schedule', 'Itinerary', 'Calendar', 'Agenda'],
          correctAnswer: 1
        },
        {
          question: 'What is another word for "a place to stay"?',
          options: ['Accommodation', 'Restaurant', 'Destination', 'Attraction'],
          correctAnswer: 0
        },
        {
          question: 'The bags and suitcases you take on your journey are called:',
          options: ['Backpacks', 'Carriers', 'Containers', 'Luggage'],
          correctAnswer: 3
        }
      ]
    },
    {
      id: 2,
      title: 'Shopping',
      icon: 'shopping-bag',
      description: 'Common words for products and shopping experiences',
      color: '#FF9800',
      vocabulary: [
        { word: 'Discount', meaning: 'A price reduction', example: 'The store is offering a 20% discount on all items.' },
        { word: 'Bargain', meaning: 'A good deal or something bought at a lower price', example: 'I got a real bargain during the sale.' },
        { word: 'Receipt', meaning: 'Proof of purchase', example: 'Keep your receipt in case you want to return the item.' },
        { word: 'Browse', meaning: 'To look around casually without a plan to buy', example: 'I like to browse through the bookstore on weekends.' },
        { word: 'Refund', meaning: 'Money given back after returning an item', example: 'You can get a refund within 30 days of purchase.' },
        { word: 'Sale', meaning: 'A time when items are sold at lower prices', example: 'The summer sale starts next week.' },
        { word: 'Cashier', meaning: 'A person who takes payment in a store', example: 'The cashier gave me the wrong change.' },
        { word: 'Shopping cart', meaning: 'A wheeled basket for carrying items while shopping', example: 'My shopping cart was full of groceries.' },
        { word: 'Aisle', meaning: 'A walkway between shelves in a store', example: 'You\'ll find cereal in aisle 5.' },
        { word: 'Price tag', meaning: 'A label showing an item\'s price', example: 'The price tag says $19.99.' },
        { word: 'Checkout', meaning: 'The place where you pay for your items', example: 'There was a long line at the checkout.' },
        { word: 'Window shopping', meaning: 'Looking at store displays without buying', example: 'We spent the afternoon window shopping at the mall.' },
        { word: 'Fitting room', meaning: 'A small room where you try on clothes', example: 'The fitting rooms are at the back of the store.' },
        { word: 'Size', meaning: 'How large or small something is', example: 'Do you have this shirt in a larger size?' },
        { word: 'Brand', meaning: 'A specific company or product line', example: 'This brand is known for its quality.' },
        { word: 'Customer service', meaning: 'Help and support given to customers', example: 'I called customer service to check my delivery.' },
        { word: 'Warranty', meaning: 'A written guarantee for a product', example: 'This phone has a one-year warranty.' },
        { word: 'Retailer', meaning: 'A company or person who sells products directly to buyers', example: 'The retailer specializes in sportswear.' },
        { word: 'Boutique', meaning: 'A small, stylish shop for clothes or accessories', example: 'She owns a fashion boutique in the city center.' },
        { word: 'Merchandise', meaning: 'Products or goods available for sale', example: 'The store offers a wide range of merchandise.' }
      ],
      quiz: [
        {
          question: 'What do you call a reduction in price?',
          options: ['Sale', 'Discount', 'Offer', 'Deal'],
          correctAnswer: 1
        },
        {
          question: 'What is the document that shows proof of purchase?',
          options: ['Receipt', 'Bill', 'Invoice', 'Ticket'],
          correctAnswer: 0
        },
        {
          question: 'When you look at items casually, you:',
          options: ['Search', 'Hunt', 'Browse', 'Scan'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 3,
      title: 'Dining',
      icon: 'restaurant',
      description: 'Useful words for restaurants and dining situations',
      color: '#F44336',
      vocabulary: [
        { word: 'Reservation', meaning: 'An arrangement to reserve a table at a restaurant', example: 'I made a reservation for 7:00 PM.' },
        { word: 'Menu', meaning: 'A list of food and drinks available', example: 'The waiter brought us the menu.' },
        { word: 'Bill', meaning: 'A document showing how much you need to pay', example: 'Could we have the bill, please?' },
        { word: 'Appetizer', meaning: 'A small dish served before the main course', example: 'We ordered some appetizers to share.' },
        { word: 'Main Course', meaning: 'The primary dish of a meal', example: 'I\'ll have the steak for my main course.' },
        { word: 'Dessert', meaning: 'A sweet dish served after the main course', example: 'I always save room for dessert.' },
        { word: 'Waiter / Waitress', meaning: 'A person who serves food in a restaurant', example: 'The waitress recommended the fish.' },
        { word: 'Chef', meaning: 'A professional cook', example: 'The chef specializes in Thai cuisine.' },
        { word: 'Cuisine', meaning: 'A particular style of cooking', example: 'I love Italian cuisine.' },
        { word: 'Beverage', meaning: 'A drink', example: 'Would you like a beverage with your meal?' },
        { word: 'Cutlery', meaning: 'Knives, forks, and spoons', example: 'The cutlery is placed beside your plate.' },
        { word: 'Napkin', meaning: 'A cloth or paper used while eating', example: 'He wiped his hands with a napkin.' },
        { word: 'Portion', meaning: 'The amount of food served', example: 'The portions here are very generous.' },
        { word: 'Ingredient', meaning: 'A component of a dish', example: 'Tomatoes are the main ingredient in this sauce.' },
        { word: 'Specials', meaning: 'Dishes not on the regular menu', example: 'The server mentioned today\'s specials.' },
        { word: 'Complimentary', meaning: 'Given free of charge', example: 'Bread and butter are complimentary.' },
        { word: 'Tip', meaning: 'Extra money given for good service', example: 'We left a 10% tip.' },
        { word: 'Vegan', meaning: 'Someone who doesn\'t eat any animal products', example: 'She follows a vegan diet.' },
        { word: 'Vegetarian', meaning: 'Someone who doesn\'t eat meat', example: 'He is a vegetarian, so he ordered a veggie burger.' },
        { word: 'Allergy', meaning: 'A bad reaction to certain foods', example: 'I have a peanut allergy.' }
      ],
      quiz: [
        {
          question: 'What do you call an arrangement to have a table at a restaurant?',
          options: ['Booking', 'Reservation', 'Appointment', 'Schedule'],
          correctAnswer: 1
        },
        {
          question: 'A small dish served before the main course is called:',
          options: ['Appetizer', 'Dessert', 'Side dish', 'Snack'],
          correctAnswer: 0
        },
        {
          question: 'What do you ask for when you want to pay at a restaurant?',
          options: ['Receipt', 'Check', 'Bill', 'Payment'],
          correctAnswer: 2
        }
      ]
    },
    {
      id: 4,
      title: 'Health',
      icon: 'favorite',
      description: 'Words used in hospitals, clinics, and pharmacies',
      color: '#2196F3',
      vocabulary: [
        { word: 'Appointment', meaning: 'A scheduled meeting with a doctor', example: 'I have a dentist appointment at 4 PM.' },
        { word: 'Checkup', meaning: 'A routine medical examination', example: 'She goes for a checkup every year.' },
        { word: 'Examination', meaning: 'A detailed medical check', example: 'The doctor performed a full examination.' },
        { word: 'Prescription', meaning: 'A written order for medicine', example: 'The doctor gave me a prescription for antibiotics.' },
        { word: 'Medication', meaning: 'Medicine used to treat illness', example: 'Take this medication after meals.' },
        { word: 'Pharmacy', meaning: 'A place where medicines are sold', example: 'I picked up my prescription at the pharmacy.' },
        { word: 'Patient', meaning: 'A person receiving treatment', example: 'The clinic was full of patients.' },
        { word: 'Specialist', meaning: 'A doctor for a specific condition', example: 'He saw a heart specialist.' },
        { word: 'Therapy', meaning: 'Treatment intended to relieve or heal a disorder', example: 'She attends physical therapy twice a week to recover from her injury.' },
        { word: 'Symptoms', meaning: 'Physical or mental features indicating a medical condition', example: 'Her symptoms include cough and fever.' },
        { word: 'Diagnosis', meaning: 'The identification of a disease', example: 'The doctor gave a quick diagnosis.' },
        { word: 'Infection', meaning: 'A disease caused by bacteria or viruses', example: 'He is recovering from a chest infection.' },
        { word: 'Allergy', meaning: 'A reaction to a substance', example: 'I have an allergy to nuts.' },
        { word: 'Chronic', meaning: 'Long-lasting or recurring', example: 'She has chronic back pain.' },
        { word: 'Treatment', meaning: 'Medical care given to a patient', example: 'He is receiving treatment for diabetes.' },
        { word: 'Surgery', meaning: 'An operation to treat a condition', example: 'She had surgery on her leg.' },
        { word: 'Recovery', meaning: 'The process of getting better', example: 'Her recovery took two weeks.' },
        { word: 'Emergency', meaning: 'A serious, urgent medical situation', example: 'Call 1990 in a medical emergency.' },
        { word: 'Vaccine', meaning: 'A substance used to prevent disease', example: 'Did you get your flu vaccine?' },
        { word: 'Wellness', meaning: 'A general state of good health', example: 'She focuses on wellness through exercise and diet.' }
      ],
      quiz: [
        {
          question: 'What is a written order for medicine called?',
          options: ['Recipe', 'Prescription', 'Note', 'Order'],
          correctAnswer: 1
        },
        {
          question: 'Physical or mental signs of illness are called:',
          options: ['Symptoms', 'Signs', 'Indicators', 'Markers'],
          correctAnswer: 0
        },
        {
          question: 'What is the term for identifying an illness or condition?',
          options: ['Analysis', 'Assessment', 'Evaluation', 'Diagnosis'],
          correctAnswer: 3
        }
      ]
    },
    {
      id: 5,
      title: 'Technology',
      icon: 'devices',
      description: 'Technical and Digital Terms for Everyday Use',
      color: '#9C27B0',
      vocabulary: [
        { word: 'Download', meaning: 'To transfer data or files from the internet to your device', example: 'I need to download the latest version of the app.' },
        { word: 'Upload', meaning: 'To transfer data from your device to internet', example: 'Please upload your assignment to the website.' },
        { word: 'Browser', meaning: 'A program used to access the internet', example: 'Chrome is my favorite browser for searching online.' },
        { word: 'App', meaning: 'A software program for phones or computers', example: 'I use the MATE app to track my language progress and skills.' },
        { word: 'Username', meaning: 'Name used to identify someone online', example: 'Enter your username and password to log in.' },
        { word: 'Password', meaning: 'A secret code used to access accounts', example: 'Remember to use a strong password.' },
        { word: 'Wi-Fi', meaning: 'A wireless internet connection', example: 'The café offers free Wi-Fi to customers.' },
        { word: 'Bluetooth', meaning: 'Wireless technology for connecting devices', example: 'I use Bluetooth to connect my phone to the speaker.' },
        { word: 'Wireless', meaning: 'Technology that works without cables', example: 'Most modern devices support wireless charging.' },
        { word: 'Network', meaning: 'A group of connected computers or devices', example: 'Our office computers are connected to the same network.' },
        { word: 'Software', meaning: 'Programs that run on a computer or device', example: 'This software helps me edit videos easily.' },
        { word: 'Hardware', meaning: 'The physical parts of a computer or device', example: 'The technician repaired the hardware inside my laptop.' },
        { word: 'Cloud', meaning: 'Online storage for data', example: 'I save all my photos to the cloud for backup.' },
        { word: 'Backup', meaning: 'A copy of data stored for safety', example: 'Always make a backup before updating your phone.' },
        { word: 'Virus', meaning: 'Harmful software that damages devices', example: 'My computer slowed down because of a virus.' },
        { word: 'Update', meaning: 'A new version of software or an app', example: 'Don\'t forget to update your system regularly.' },
        { word: 'Firewall', meaning: 'A system that protects against online threats', example: 'The firewall blocked the suspicious website.' },
        { word: 'Database', meaning: 'A structured collection of information', example: 'The customer records are stored in a secure database.' },
        { word: 'Encryption', meaning: 'A method to secure data using a code', example: 'The message was secured using encryption.' },
        { word: 'Subscription', meaning: 'An arrangement to receive something regularly, usually by paying', example: 'I have an annual subscription to the MATE language learning app.' }
      ],
      quiz: [
        {
          question: 'Transferring data from the internet to your device is called:',
          options: ['Upload', 'Download', 'Transfer', 'Copy'],
          correctAnswer: 1
        },
        {
          question: 'What is a program used to access websites?',
          options: ['Browser', 'Viewer', 'Explorer', 'Searcher'],
          correctAnswer: 0
        },
        {
          question: 'Technology that works without cables is called:',
          options: ['Cordless', 'Wireless', 'Cable-free', 'Remote'],
          correctAnswer: 1
        }
      ]
    },
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

    // Show tip after 2 seconds
    tipTimeout.current = setTimeout(() => {
      setTipVisible(true);
      // Hide tip after 5 seconds
      setTimeout(() => {
        setTipVisible(false);
      }, 5000);
    }, 2000);

    return () => {
      clearTimeout(tipTimeout.current);
    };
  }, []);

  const handleUnitPress = (unit) => {
    setSelectedUnit(unit);
    setModalVisible(true);
  };

  const startQuiz = () => {
    setModalVisible(false);
    setCurrentQuizQuestion(0);
    setScore(0);
    setShowResult(false);
    setQuizModalVisible(true);
  };

  const startPractice = () => {
    setModalVisible(false);
    // Shuffle the vocabulary words for practice
    const shuffled = [...selectedUnit.vocabulary].sort(() => 0.5 - Math.random());
    setPracticeWords(shuffled);
    setCurrentPracticeIndex(0);
    setShowMeaning(false);
    setPracticeCompleted(false);
    setKnownWords([]);
    setReviewWords([]);
    setPracticeModalVisible(true);
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
      setShowMeaning(false);
    } else {
      setPracticeCompleted(true);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const currentQuiz = selectedUnit.quiz[currentQuizQuestion];
    
    if (answerIndex === currentQuiz.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuizQuestion < selectedUnit.quiz.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const renderVocabularyItem = ({ item }) => (
    <View style={styles.vocabularyItem}>
      <View style={styles.wordContainer}>
        <Text style={styles.word}>{item.word}</Text>
        <Text style={styles.meaning}>{item.meaning}</Text>
      </View>
      <View style={styles.exampleContainer}>
        <Text style={styles.exampleLabel}>Example:</Text>
        <Text style={styles.example}>{item.example}</Text>
      </View>
    </View>
  );

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

  const changePracticeMode = (mode) => {
    setPracticeMode(mode);
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
        
        <Text style={styles.headerTitle}>Thematic Vocabulary</Text>
        
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
            Essential Vocabulary for travel, shopping, dining, health, and technology
          </Text>

          {thematicUnits.map((unit, index) => (
            <Animated.View
              key={unit.id}
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
                style={styles.unitCard}
                onPress={() => handleUnitPress(unit)}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['#ffffff', '#f7f9fc']}
                  style={styles.gradientCard}
                >
                  <View style={[styles.iconContainer, { backgroundColor: unit.color }]}>
                    <MaterialIcons name={unit.icon} size={28} color="#fff" />
                  </View>
                  <View style={styles.unitContent}>
                    <Text style={styles.unitTitle}>{unit.title}</Text>
                    <Text style={styles.unitDescription}>{unit.description}</Text>
                    <View style={styles.badgeContainer}>
                      <View style={styles.badge}>
                        <FontAwesome5 name="book" size={10} color="#0072ff" />
                        <Text style={styles.badgeText}>{unit.vocabulary.length} words</Text>
                      </View>
                      <View style={styles.badge}>
                        <FontAwesome5 name="question" size={10} color="#0072ff" />
                        <Text style={styles.badgeText}>{unit.quiz.length} quiz questions</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.arrowContainer}>
                    <Ionicons name="chevron-forward" size={24} color="#0072ff" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Vocabulary Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
              {selectedUnit && (
                <View style={[styles.modalIconContainer, { backgroundColor: selectedUnit.color }]}>
                  <MaterialIcons name={selectedUnit.icon} size={32} color="#fff" />
                </View>
              )}
              <Text style={styles.modalTitle}>{selectedUnit?.title} Vocabulary</Text>
            </View>

            <FlatList
              data={selectedUnit?.vocabulary}
              renderItem={renderVocabularyItem}
              keyExtractor={(item, index) => `vocab-${index}`}
              contentContainerStyle={styles.vocabularyList}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{ height: 100 }} />}
            />

            <View style={styles.fixedButtonContainer}>
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  flex: 1,
                  marginHorizontal: 8,
                  backgroundColor: '#2196F3',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
                onPress={startPractice}
              >
                <FontAwesome5 name="book-reader" size={16} color="#fff" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#fff',
                  marginLeft: 8,
                }}>Practice</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  flex: 1,
                  marginHorizontal: 8,
                  backgroundColor: '#FF9800',
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                }}
                onPress={startQuiz}
              >
                <FontAwesome5 name="question-circle" size={16} color="#fff" />
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#fff',
                  marginLeft: 8,
                }}>Take Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Quiz Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={quizModalVisible}
        onRequestClose={() => setQuizModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setQuizModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {showResult ? 'Quiz Results' : `${selectedUnit?.title} Quiz`}
              </Text>
            </View>

            {!showResult ? (
              <View style={styles.quizContainer}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${((currentQuizQuestion + 1) / selectedUnit?.quiz.length) * 100}%` }
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    Question {currentQuizQuestion + 1} of {selectedUnit?.quiz.length}
                  </Text>
                </View>

                <Text style={styles.questionText}>
                  {selectedUnit?.quiz[currentQuizQuestion].question}
                </Text>

                <View style={styles.optionsContainer}>
                  {selectedUnit?.quiz[currentQuizQuestion].options.map((option, index) => (
                    <TouchableOpacity
                      key={`option-${index}`}
                      style={styles.optionButton}
                      onPress={() => handleAnswerSelect(index)}
                    >
                      <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.resultContainer}>
                <View style={styles.scoreContainer}>
                  <Text style={styles.scoreText}>Your Score</Text>
                  <Text style={styles.scoreValue}>{score}/{selectedUnit?.quiz.length}</Text>
                  <View style={styles.scoreCircle}>
                    <Text style={styles.scorePercentage}>
                      {Math.round((score / selectedUnit?.quiz.length) * 100)}%
                    </Text>
                    <View style={[
                      styles.scoreProgressCircle, 
                      { 
                        borderColor: score / selectedUnit?.quiz.length >= 0.7 ? '#4CAF50' : 
                                    score / selectedUnit?.quiz.length >= 0.4 ? '#FF9800' : '#F44336'
                      }
                    ]} />
                  </View>
                </View>

                <View style={styles.resultButtonsContainer}>
                  <TouchableOpacity 
                    style={styles.tryAgainButton}
                    onPress={() => {
                      setCurrentQuizQuestion(0);
                      setScore(0);
                      setShowResult(false);
                    }}
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
                    style={styles.doneButtonNew}
                    onPress={() => setQuizModalVisible(false)}
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
          </View>
        </View>
      </Modal>

      {/* Practice Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={practiceModalVisible}
        onRequestClose={() => setPracticeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPracticeModalVisible(false)}
              >
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {practiceCompleted ? 'Practice Results' : `${selectedUnit?.title} Practice`}
              </Text>
            </View>

            {!practiceCompleted ? (
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

                <View style={styles.practiceModesContainer}>
                  <TouchableOpacity 
                    style={[
                      styles.practiceModeButton, 
                      practiceMode === 'flashcards' && styles.activePracticeModeButton
                    ]}
                    onPress={() => changePracticeMode('flashcards')}
                  >
                    <FontAwesome5 name="clone" size={16} color={practiceMode === 'flashcards' ? "#fff" : "#666"} />
                    <Text style={[
                      styles.practiceModeText,
                      practiceMode === 'flashcards' && styles.activePracticeModeText
                    ]}>Flashcards</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.practiceModeButton, 
                      practiceMode === 'matching' && styles.activePracticeModeButton
                    ]}
                    onPress={() => changePracticeMode('matching')}
                  >
                    <FontAwesome5 name="object-group" size={16} color={practiceMode === 'matching' ? "#fff" : "#666"} />
                    <Text style={[
                      styles.practiceModeText,
                      practiceMode === 'matching' && styles.activePracticeModeText
                    ]}>Matching</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[
                      styles.practiceModeButton, 
                      practiceMode === 'typing' && styles.activePracticeModeButton
                    ]}
                    onPress={() => changePracticeMode('typing')}
                  >
                    <FontAwesome5 name="keyboard" size={16} color={practiceMode === 'typing' ? "#fff" : "#666"} />
                    <Text style={[
                      styles.practiceModeText,
                      practiceMode === 'typing' && styles.activePracticeModeText
                    ]}>Typing</Text>
                  </TouchableOpacity>
                </View>

                {practiceWords.length > 0 && practiceMode === 'flashcards' && (
                  <View style={styles.flashcardContainer}>
                    <TouchableOpacity 
                      activeOpacity={0.9}
                      onPress={flipCard} 
                      style={styles.flipCardContainer}
                    >
                      <Animated.View style={[styles.flashcard, styles.flashcardFront, frontAnimatedStyle]}>
                        <View style={styles.flashcardContent}>
                          <Text style={styles.flashcardWord}>
                            {practiceWords[currentPracticeIndex].word}
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

                    <View style={styles.practiceButtons}>
                      <TouchableOpacity 
                        style={[styles.practiceButton, styles.reviewButton]}
                        onPress={() => {
                          handleWordStatus(false);
                          setCardFlipped(false);
                          cardRotateAnim.setValue(0);
                        }}
                      >
                        <Ionicons name="refresh" size={20} color="#fff" />
                        <Text style={styles.practiceButtonText}>Review Later</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={[styles.practiceButton, styles.knownButton]}
                        onPress={() => {
                          handleWordStatus(true);
                          setCardFlipped(false);
                          cardRotateAnim.setValue(0);
                        }}
                      >
                        <AntDesign name="check" size={20} color="#fff" />
                        <Text style={styles.practiceButtonText}>I Know This</Text>
                      </TouchableOpacity>
                    </View>
                    
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
                          }
                        }}
                        disabled={currentPracticeIndex === practiceWords.length - 1}
                      >
                        <Ionicons name="chevron-forward" size={24} color={currentPracticeIndex === practiceWords.length - 1 ? "#ccc" : "#0072ff"} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {practiceMode === 'matching' && (
                  <View style={styles.matchingContainer}>
                    <Text style={styles.matchingInstructions}>
                      Coming soon! Match words with their meanings.
                    </Text>
                    <TouchableOpacity 
                      style={styles.switchModeButton}
                      onPress={() => changePracticeMode('flashcards')}
                    >
                      <Text style={styles.switchModeText}>Return to Flashcards</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {practiceMode === 'typing' && (
                  <View style={styles.typingContainer}>
                    <Text style={styles.typingInstructions}>
                      Coming soon! Type the words you've learned.
                    </Text>
                    <TouchableOpacity 
                      style={styles.switchModeButton}
                      onPress={() => changePracticeMode('flashcards')}
                    >
                      <Text style={styles.switchModeText}>Return to Flashcards</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
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
                          <Text style={styles.reviewWordText}>{word.word}</Text>
                          <Text style={styles.reviewWordMeaning}>{word.meaning}</Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                )}

                <View style={styles.practiceResultButtons}>
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
                      } else {
                        // Otherwise restart with all words
                        startPractice();
                      }
                    }}
                  >
                    <LinearGradient
                      colors={['#29B6F6', '#0288D1']}
                      style={styles.buttonGradient}
                    >
                      <FontAwesome5 name="redo-alt" size={18} color="#fff" />
                      <Text style={styles.resultButtonText}>
                        {reviewWords.length > 0 ? 'Practice Review Words' : 'Practice Again'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.doneButtonNew}
                    onPress={() => setPracticeModalVisible(false)}
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
          </View>
        </View>
      </Modal>

      {/* Floating Tip */}
      {tipVisible && (
        <Animated.View 
          style={[
            styles.tipContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0]
              })}]
            }
          ]}
        >
          <View style={styles.tipBubble}>
            <Ionicons name="bulb" size={20} color="#FFD700" />
            <Text style={styles.tipText}>Tap on a category to explore vocabulary and take quizzes!</Text>
          </View>
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
  unitCard: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  gradientCard: {
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  unitContent: {
    flex: 1,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  unitDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 12,
    color: '#0072ff',
    marginLeft: 4,
  },
  arrowContainer: {
    padding: 8,
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
    maxHeight: '80%',
    position: 'relative',
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
  vocabularyList: {
    padding: 16,
  },
  vocabularyItem: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  wordContainer: {
    marginBottom: 8,
  },
  word: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  meaning: {
    fontSize: 14,
    color: '#666',
  },
  exampleContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
  },
  exampleLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0072ff',
    marginBottom: 4,
  },
  example: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#333',
  },
  fixedButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  fixedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  practiceButtonFixed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 8,
    minWidth: 120,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: '#2196F3',
  },
  practiceButton: {
    backgroundColor: '#2196F3',
  },
  quizButton: {
    backgroundColor: '#FF9800',
  },
  retryButton: {
    backgroundColor: '#2196F3',
  },
  doneButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
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
  questionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  resultContainer: {
    padding: 24,
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreCircle: {
    position: 'relative',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  scoreProgressCircle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    borderWidth: 5,
    borderColor: '#4CAF50',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  scorePercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  doneButtonNew: {
    flex: 1,
    marginLeft: 8,
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
    paddingHorizontal: 16,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  tipContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  tipBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '90%',
  },
  tipText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  practiceContainer: {
    padding: 16,
  },
  flashcardContainer: {
    marginBottom: 24,
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
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
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
    marginBottom: 24,
  },
  reviewWordsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reviewWordsList: {
    padding: 16,
  },
  reviewWordItem: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewWordText: {
    fontSize: 16,
    color: '#333',
  },
  reviewWordMeaning: {
    fontSize: 14,
    color: '#666',
  },
  practiceResultButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
  practiceModesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 8,
  },
  practiceModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  activePracticeModeButton: {
    backgroundColor: '#0072ff',
  },
  practiceModeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  activePracticeModeText: {
    color: '#fff',
  },
  matchingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    height: 200,
  },
  matchingInstructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  switchModeButton: {
    backgroundColor: '#0072ff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  switchModeText: {
    color: '#fff',
    fontWeight: '500',
  },
  typingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    height: 200,
  },
  typingInstructions: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
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
});
