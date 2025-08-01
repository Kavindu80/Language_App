import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  Modal
} from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechHelper from '../../../helpers/SpeechHelper';

// Constants for AsyncStorage keys
const PROGRESS_KEY = 'pronunciation_progress';
const COMPLETED_ACTIVITIES_KEY = 'pronunciation_completed_activities';

const { width } = Dimensions.get('window');

export default function PronunciationScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { showModal, selectedExerciseId, selectedActivityId } = route.params || {};
  
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userProgress, setUserProgress] = useState({
    vowelSounds: 30,
    consonantClusters: 15,
    wordStress: 0,
    intonation: 0
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  const exercises = [
    {
      id: 1,
      title: 'Vowels',
      description: 'Long and short vowel sounds',
      icon: 'waveform',
      color: '#4FC3F7',
      activities: [
        { 
          id: 101, 
          title: 'Long A vs Short A', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn to distinguish and pronounce long A (as in "cake") and short A (as in "cat") sounds.',
          practice: [
            { word: 'cat', correct: 'short', audio: 'cat.mp3' },
            { word: 'cake', correct: 'long', audio: 'cake.mp3' },
            { word: 'hat', correct: 'short', audio: 'hat.mp3' },
            { word: 'late', correct: 'long', audio: 'late.mp3' },
            { word: 'map', correct: 'short', audio: 'map.mp3' },
            { word: 'fade', correct: 'long', audio: 'fade.mp3' }
          ]
        },
        { 
          id: 102, 
          title: 'E Sound Variations', 
          level: 'Beginner', 
          time: '7 min',
          description: 'Practice the different E sounds in English, from short E (as in "bed") to long E (as in "feet").',
          practice: [
            { word: 'bed', correct: 'short', audio: 'bed.mp3' },
            { word: 'feet', correct: 'long', audio: 'feet.mp3' },
            { word: 'head', correct: 'short', audio: 'head.mp3' },
            { word: 'meet', correct: 'long', audio: 'meet.mp3' },
            { word: 'best', correct: 'short', audio: 'best.mp3' },
            { word: 'speed', correct: 'long', audio: 'speed.mp3' }
          ]
        },
        { 
          id: 103, 
          title: 'I Sound Practice', 
          level: 'Intermediate', 
          time: '8 min',
          description: 'Master the distinction between short I (as in "sit") and long I (as in "kite") sounds.',
          practice: [
            { word: 'sit', correct: 'short', audio: 'sit.mp3' },
            { word: 'kite', correct: 'long', audio: 'kite.mp3' },
            { word: 'bit', correct: 'short', audio: 'bit.mp3' },
            { word: 'time', correct: 'long', audio: 'time.mp3' },
            { word: 'fish', correct: 'short', audio: 'fish.mp3' },
            { word: 'mine', correct: 'long', audio: 'mine.mp3' }
          ]
        },
        { 
          id: 104, 
          title: 'O Sound Distinctions', 
          level: 'Intermediate', 
          time: '6 min',
          description: 'Learn to differentiate between short O (as in "hot") and long O (as in "boat") sounds.',
          practice: [
            { word: 'hot', correct: 'short', audio: 'hot.mp3' },
            { word: 'boat', correct: 'long', audio: 'boat.mp3' },
            { word: 'pot', correct: 'short', audio: 'pot.mp3' },
            { word: 'note', correct: 'long', audio: 'note.mp3' },
            { word: 'rock', correct: 'short', audio: 'rock.mp3' },
            { word: 'road', correct: 'long', audio: 'road.mp3' }
          ]
        },
        { 
          id: 105, 
          title: 'U Sound Mastery', 
          level: 'Advanced', 
          time: '10 min',
          description: 'Master the various U sounds in English, from short U to long U and special cases.',
          practice: [
            { word: 'cup', correct: 'short', audio: 'cup.mp3' },
            { word: 'cute', correct: 'long', audio: 'cute.mp3' },
            { word: 'put', correct: 'short-oo', audio: 'put.mp3' },
            { word: 'rule', correct: 'long-oo', audio: 'rule.mp3' },
            { word: 'turn', correct: 'er', audio: 'turn.mp3' },
            { word: 'pure', correct: 'y-sound', audio: 'pure.mp3' }
          ]
        }
      ],
      progress: 30,
      examples: ['cat/cake', 'bed/beat', 'sit/site', 'hot/hope', 'cup/cute']
    },
    {
      id: 2,
      title: 'Pronunciation Practice',
      description: 'Consonant combinations for clearer speech',
      icon: 'language-typescript',
      color: '#7986CB',
      activities: [
        { 
          id: 201, 
          title: 'ST, SP, SK Clusters', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Practice initial S clusters that are challenging for many language learners.',
          practice: [
            { word: 'stop', correct: 'st', audio: 'stop.mp3' },
            { word: 'speak', correct: 'sp', audio: 'speak.mp3' },
            { word: 'skill', correct: 'sk', audio: 'skill.mp3' },
            { word: 'stay', correct: 'st', audio: 'stay.mp3' },
            { word: 'sport', correct: 'sp', audio: 'sport.mp3' },
            { word: 'school', correct: 'sk', audio: 'school.mp3' }
          ]
        },
        { 
          id: 202, 
          title: 'BL, CL, FL Clusters', 
          level: 'Beginner', 
          time: '6 min',
          description: 'Learn to pronounce L-clusters at the beginning of words.',
          practice: [
            { word: 'blue', correct: 'bl', audio: 'blue.mp3' },
            { word: 'clean', correct: 'cl', audio: 'clean.mp3' },
            { word: 'fly', correct: 'fl', audio: 'fly.mp3' },
            { word: 'black', correct: 'bl', audio: 'black.mp3' },
            { word: 'clock', correct: 'cl', audio: 'clock.mp3' },
            { word: 'floor', correct: 'fl', audio: 'floor.mp3' }
          ]
        },
        { 
          id: 203, 
          title: 'Final Consonant Clusters', 
          level: 'Intermediate', 
          time: '10 min',
          description: 'Master the pronunciation of consonant clusters at the end of words.',
          practice: [
            { word: 'asked', correct: 'skt', audio: 'asked.mp3' },
            { word: 'desks', correct: 'sks', audio: 'desks.mp3' },
            { word: 'fifths', correct: 'fths', audio: 'fifths.mp3' },
            { word: 'months', correct: 'nths', audio: 'months.mp3' },
            { word: 'texts', correct: 'ksts', audio: 'texts.mp3' },
            { word: 'worlds', correct: 'rldz', audio: 'worlds.mp3' }
          ]
        },
        { 
          id: 204, 
          title: 'Three Consonant Clusters', 
          level: 'Advanced', 
          time: '12 min',
          description: 'Practice complex three-consonant clusters that occur in English.',
          practice: [
            { word: 'strength', correct: 'str', audio: 'strength.mp3' },
            { word: 'splendid', correct: 'spl', audio: 'splendid.mp3' },
            { word: 'scream', correct: 'scr', audio: 'scream.mp3' },
            { word: 'spring', correct: 'spr', audio: 'spring.mp3' },
            { word: 'square', correct: 'skw', audio: 'square.mp3' },
            { word: 'thrive', correct: 'thr', audio: 'thrive.mp3' }
          ]
        },
        { 
          id: 205, 
          title: 'Complex Clusters Challenge', 
          level: 'Advanced', 
          time: '15 min',
          description: 'Master the most challenging consonant combinations in English.',
          practice: [
            { word: 'strengths', correct: 'ngths', audio: 'strengths.mp3' },
            { word: 'sixths', correct: 'ksths', audio: 'sixths.mp3' },
            { word: 'glimpsed', correct: 'mpst', audio: 'glimpsed.mp3' },
            { word: 'twelfths', correct: 'lfths', audio: 'twelfths.mp3' },
            { word: 'prompted', correct: 'mpt', audio: 'prompted.mp3' },
            { word: 'scratched', correct: 'tcht', audio: 'scratched.mp3' }
          ]
        }
      ],
      progress: 15,
      examples: ['street', 'spring', 'strength', 'clothes', 'twelfth']
    },
    {
      id: 3,
      title: 'Accent in Words',
      description: 'Syllable emphasis in multi-syllable words',
      icon: 'music-note',
      color: '#9575CD',
      activities: [
        { 
          id: 301, 
          title: 'Two-Syllable Words', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn the stress patterns in common two-syllable words.',
          practice: [
            { word: 'PREsent (noun)', correct: 'first', audio: 'present-n.mp3' },
            { word: 'preSENT (verb)', correct: 'second', audio: 'present-v.mp3' },
            { word: 'OBject (noun)', correct: 'first', audio: 'object-n.mp3' },
            { word: 'obJECT (verb)', correct: 'second', audio: 'object-v.mp3' },
            { word: 'PERmit (noun)', correct: 'first', audio: 'permit-n.mp3' },
            { word: 'perMIT (verb)', correct: 'second', audio: 'permit-v.mp3' }
          ]
        },
        { 
          id: 302, 
          title: 'Three-Syllable Words', 
          level: 'Intermediate', 
          time: '8 min',
          description: 'Practice stress patterns in three-syllable words.',
          practice: [
            { word: 'POlitic', correct: 'first', audio: 'politic.mp3' },
            { word: 'deCIde', correct: 'second', audio: 'decide.mp3' },
            { word: 'ENergy', correct: 'first', audio: 'energy.mp3' },
            { word: 'imPORtant', correct: 'second', audio: 'important.mp3' },
            { word: 'POsitive', correct: 'first', audio: 'positive.mp3' },
            { word: 'comPUter', correct: 'second', audio: 'computer.mp3' }
          ]
        },
        { 
          id: 303, 
          title: 'Word Stress in Sentences', 
          level: 'Intermediate', 
          time: '10 min',
          description: 'Learn how word stress changes in the context of sentences.',
          practice: [
            { word: 'I need to preSENT my findings.', correct: 'verb', audio: 'present-sentence1.mp3' },
            { word: 'I bought a PREsent for her.', correct: 'noun', audio: 'present-sentence2.mp3' },
            { word: 'They will reCORD the meeting.', correct: 'verb', audio: 'record-sentence1.mp3' },
            { word: 'I listened to the REcord.', correct: 'noun', audio: 'record-sentence2.mp3' },
            { word: 'Please conDUCT the interview.', correct: 'verb', audio: 'conduct-sentence1.mp3' },
            { word: 'The CONduct was inappropriate.', correct: 'noun', audio: 'conduct-sentence2.mp3' }
          ]
        },
        { 
          id: 304, 
          title: 'Stress Shifts', 
          level: 'Advanced', 
          time: '12 min',
          description: 'Master how stress shifts when adding suffixes to words.',
          practice: [
            { word: 'PHOtograph → phoTOgraphy', correct: 'shift-right', audio: 'photo-photography.mp3' },
            { word: 'eCONomy → ecoNOmic', correct: 'shift-right', audio: 'economy-economic.mp3' },
            { word: 'DEMocrat → demoCRATic', correct: 'shift-right', audio: 'democrat-democratic.mp3' },
            { word: 'PHYsical → phySIcally', correct: 'no-change', audio: 'physical-physically.mp3' },
            { word: 'NAtion → NAtional', correct: 'no-change', audio: 'nation-national.mp3' },
            { word: 'hisTORical → hisTORically', correct: 'no-change', audio: 'historical-historically.mp3' }
          ]
        },
        { 
          id: 305, 
          title: 'Compound Word Stress', 
          level: 'Advanced', 
          time: '8 min',
          description: 'Learn the stress patterns in compound words and phrases.',
          practice: [
            { word: 'BLACKboard', correct: 'first', audio: 'blackboard.mp3' },
            { word: 'black BOARD', correct: 'second', audio: 'black-board.mp3' },
            { word: 'GREENhouse', correct: 'first', audio: 'greenhouse.mp3' },
            { word: 'green HOUSE', correct: 'second', audio: 'green-house.mp3' },
            { word: 'SOFTware', correct: 'first', audio: 'software.mp3' },
            { word: 'HOT dog', correct: 'first', audio: 'hotdog.mp3' }
          ]
        }
      ],
      progress: 0,
      examples: ['PREsent vs preSENT', 'REcord vs reCORD', 'CONduct vs conDUCT']
    },
    {
      id: 4,
      title: 'Tone in Conversations',
      description: 'Rising and falling tones for natural conversation',
      icon: 'chart-line-variant',
      color: '#4DB6AC',
      activities: [
        { 
          id: 401, 
          title: 'Questions vs Statements', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn the basic intonation patterns for questions and statements.',
          practice: [
            { sentence: 'You are coming.', correct: 'falling', audio: 'statement1.mp3' },
            { sentence: 'Are you coming?', correct: 'rising', audio: 'question1.mp3' },
            { sentence: 'He likes coffee.', correct: 'falling', audio: 'statement2.mp3' },
            { sentence: 'Does he like coffee?', correct: 'rising', audio: 'question2.mp3' },
            { sentence: 'They went home.', correct: 'falling', audio: 'statement3.mp3' },
            { sentence: 'Where did they go?', correct: 'falling', audio: 'wh-question1.mp3' }
          ]
        },
        { 
          id: 402, 
          title: 'Expressing Emotions', 
          level: 'Intermediate', 
          time: '8 min',
          description: 'Practice using intonation to convey different emotions.',
          practice: [
            { sentence: "That's great! (excited)", correct: 'high-falling', audio: 'excited1.mp3' },
            { sentence: "That's great. (uninterested)", correct: 'low-flat', audio: 'uninterested1.mp3' },
            { sentence: "Really? (surprised)", correct: 'high-rising', audio: 'surprised1.mp3' },
            { sentence: "Really. (doubtful)", correct: 'mid-falling', audio: 'doubtful1.mp3' },
            { sentence: "I'm so happy! (excited)", correct: 'high-falling', audio: 'excited2.mp3' },
            { sentence: "I'm so happy. (sarcastic)", correct: 'flat-low', audio: 'sarcastic1.mp3' }
          ]
        },
        { 
          id: 403, 
          title: 'Emphasis and Contrast', 
          level: 'Intermediate', 
          time: '7 min',
          description: 'Learn to use intonation to emphasize important words or create contrast.',
          practice: [
            { sentence: 'I wanted the RED one, not the blue one.', correct: 'emphasis-red', audio: 'emphasis1.mp3' },
            { sentence: 'I wanted the red one, not the BLUE one.', correct: 'emphasis-blue', audio: 'emphasis2.mp3' },
            { sentence: 'SHE told me, not him.', correct: 'emphasis-she', audio: 'emphasis3.mp3' },
            { sentence: 'She told ME, not you.', correct: 'emphasis-me', audio: 'emphasis4.mp3' },
            { sentence: "I'm going TODAY, not tomorrow.", correct: 'emphasis-today', audio: 'emphasis5.mp3' },
            { sentence: "I'm GOING today, not staying.", correct: 'emphasis-going', audio: 'emphasis6.mp3' }
          ]
        },
        { 
          id: 404, 
          title: 'Complex Intonation Patterns', 
          level: 'Advanced', 
          time: '15 min',
          description: 'Master complex intonation patterns used in longer sentences and conversations.',
          practice: [
            { sentence: "When you're ready, we can go.", correct: 'rise-fall', audio: 'complex1.mp3' },
            { sentence: "If you want my opinion, which I doubt you do, you should apologize.", correct: 'parenthetical', audio: 'complex2.mp3' },
            { sentence: 'Not only was he late, but he also forgot the documents.', correct: 'double-emphasis', audio: 'complex3.mp3' },
            { sentence: 'Could you pass the salt, please?', correct: 'polite-request', audio: 'complex4.mp3' },
            { sentence: "You know what? I don't even care anymore.", correct: 'dismissive', audio: 'complex5.mp3' },
            { sentence: "Well, if you really think so...", correct: 'doubtful-trailing', audio: 'complex6.mp3' }
          ]
        },
        { 
          id: 405, 
          title: 'Regional Intonation Variations', 
          level: 'Advanced', 
          time: '12 min',
          description: 'Explore how intonation patterns differ across various English-speaking regions.',
          practice: [
            { sentence: 'Good morning! (American)', correct: 'american', audio: 'american1.mp3' },
            { sentence: 'Good morning! (British)', correct: 'british', audio: 'british1.mp3' },
            { sentence: 'How are you? (American)', correct: 'american', audio: 'american2.mp3' },
            { sentence: 'How are you? (British)', correct: 'british', audio: 'british2.mp3' },
            { sentence: 'Excuse me. (Australian)', correct: 'australian', audio: 'australian1.mp3' },
            { sentence: 'Excuse me. (Canadian)', correct: 'canadian', audio: 'canadian1.mp3' }
          ]
        }
      ],
      progress: 0,
      examples: ['Are you coming? vs You are coming.', 'Really!? vs Really.']
    },
    {
      id: 5,
      title: 'Smooth Speaking Practice',
      description: 'Natural rhythm and connected speech',
      icon: 'metronome',
      color: '#FF7043',
      activities: [
        { 
          id: 501, 
          title: 'Sentence Stress', 
          level: 'Beginner', 
          time: '6 min',
          description: 'Learn which words to stress in sentences for natural rhythm.',
          practice: [
            { sentence: 'I WANT to GO to the STORE.', correct: 'content-words', audio: 'sentence-stress1.mp3' },
            { sentence: "She's WORKING on a NEW PROJECT.", correct: 'content-words', audio: 'sentence-stress2.mp3' },
            { sentence: 'WHAT are you DOING this WEEKEND?', correct: 'content-words', audio: 'sentence-stress3.mp3' },
            { sentence: "I've NEVER BEEN to JAPAN before.", correct: 'content-words', audio: 'sentence-stress4.mp3' },
            { sentence: 'COULD you HELP me with this PROBLEM?', correct: 'content-words', audio: 'sentence-stress5.mp3' },
            { sentence: 'We SHOULD LEAVE EARLY to AVOID TRAFFIC.', correct: 'content-words', audio: 'sentence-stress6.mp3' }
          ]
        },
        { 
          id: 502, 
          title: 'Linking Words', 
          level: 'Intermediate', 
          time: '8 min',
          description: 'Practice connecting words for smoother, more natural speech.',
          practice: [
            { sentence: 'Turn_it_off.', correct: 'consonant-vowel', audio: 'linking1.mp3' },
            { sentence: 'Look_at_this.', correct: 'consonant-vowel', audio: 'linking2.mp3' },
            { sentence: 'I need_to_ask you something.', correct: 'consonant-vowel', audio: 'linking3.mp3' },
            { sentence: "It's not_easy.", correct: 'consonant-vowel', audio: 'linking4.mp3' },
            { sentence: 'I saw_a dog.', correct: 'consonant-vowel', audio: 'linking5.mp3' },
            { sentence: 'They live_in_a small house.', correct: 'consonant-vowel', audio: 'linking6.mp3' }
          ]
        },
        { 
          id: 503, 
          title: 'Contractions & Reductions', 
          level: 'Intermediate', 
          time: '7 min',
          description: 'Learn to use contractions and reduced forms for more natural speech.',
          practice: [
            { sentence: "I'm (I am) going to the store.", correct: 'contraction', audio: 'contraction1.mp3' },
            { sentence: "I'm gonna (going to) visit my friend.", correct: 'reduction', audio: 'reduction1.mp3' },
            { sentence: "We've (We have) been waiting for hours.", correct: 'contraction', audio: 'contraction2.mp3' },
            { sentence: "Whaddya (What do you) think?", correct: 'reduction', audio: 'reduction2.mp3' },
            { sentence: "They'll (They will) be here soon.", correct: 'contraction', audio: 'contraction3.mp3' },
            { sentence: 'Lemme (Let me) help you with that.', correct: 'reduction', audio: 'reduction3.mp3' }
          ]
        },
        { 
          id: 504, 
          title: 'Thought Groups & Pausing', 
          level: 'Advanced', 
          time: '10 min',
          description: 'Master the natural grouping of words and appropriate pausing in speech.',
          practice: [
            { sentence: 'When I was young, | I lived in Paris.', correct: 'pause-comma', audio: 'thought-group1.mp3' },
            { sentence: 'The man, | who was wearing a hat, | walked into the store.', correct: 'pause-relative', audio: 'thought-group2.mp3' },
            { sentence: 'If you want to succeed, | you need to work hard.', correct: 'pause-conditional', audio: 'thought-group3.mp3' },
            { sentence: 'I bought apples, | oranges, | and bananas.', correct: 'pause-list', audio: 'thought-group4.mp3' },
            { sentence: 'Although it was raining, | we decided to go out.', correct: 'pause-subordinate', audio: 'thought-group5.mp3' },
            { sentence: 'The book, | which was on the table, | belongs to me.', correct: 'pause-relative', audio: 'thought-group6.mp3' }
          ]
        },
        { 
          id: 505, 
          title: 'Speed & Rhythm Mastery', 
          level: 'Advanced', 
          time: '15 min',
          description: 'Practice speaking at different speeds while maintaining natural rhythm.',
          practice: [
            { sentence: 'The early bird catches the worm. (slow)', correct: 'slow-clear', audio: 'speed1.mp3' },
            { sentence: 'The early bird catches the worm. (normal)', correct: 'normal-rhythm', audio: 'speed2.mp3' },
            { sentence: 'The early bird catches the worm. (fast)', correct: 'fast-connected', audio: 'speed3.mp3' },
            { sentence: 'She sells seashells by the seashore. (slow)', correct: 'slow-clear', audio: 'speed4.mp3' },
            { sentence: 'She sells seashells by the seashore. (normal)', correct: 'normal-rhythm', audio: 'speed5.mp3' },
            { sentence: 'She sells seashells by the seashore. (fast)', correct: 'fast-connected', audio: 'speed6.mp3' }
          ]
        }
      ],
      progress: 0,
      examples: ['I WANT to GO to the STORE', 'Turn_it_off', "I'm gonna visit my friend"]
    }
  ];

  useEffect(() => {
    // Start animations when component mounts
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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();

    // Load progress data
    loadProgressData();

    // Clean up when component unmounts
    return () => {
      SpeechHelper.stop();
    };
  }, []);
  
  // Use useFocusEffect to handle returning from PronunciationExerciseScreen
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, reloading progress data');
      loadProgressData();
      
      // Check if we're returning from an exercise
      if (route.params?.returnToExercise) {
        const { exerciseId, activityId } = route.params;
        
        // Find the exercise and activity
        const exercise = exercises.find(ex => ex.id === exerciseId);
        if (exercise) {
          setSelectedExercise(exercise);
          
          if (activityId) {
            const activity = exercise.activities.find(act => act.id === activityId);
            if (activity) {
              setSelectedActivity(activity);
            }
          }
          
          // Show the modal
          setModalVisible(true);
        }
      }
      
      return () => {
        // Cleanup if needed
      };
    }, [route.params])
  );
  
  // Function to load progress data from AsyncStorage
  const loadProgressData = async () => {
    try {
      // Get saved progress data
      const progressData = await AsyncStorage.getItem(PROGRESS_KEY);
      if (progressData) {
        const progress = JSON.parse(progressData);
        console.log('Loaded progress data:', progress);
        
        // Update userProgress state with saved data
        setUserProgress(prevProgress => ({
          ...prevProgress,
          ...progress
        }));
        
        // Get completed activities
        const completedActivitiesData = await AsyncStorage.getItem(COMPLETED_ACTIVITIES_KEY);
        if (completedActivitiesData) {
          const completedActivities = JSON.parse(completedActivitiesData);
          console.log('Loaded completed activities:', completedActivities);
          
          // Update exercises with completion data
          const updatedExercises = exercises.map(exercise => {
            const categoryKey = getCategoryKeyById(exercise.id);
            const categoryProgress = progress[categoryKey] || 0;
            
            return {
              ...exercise,
              progress: categoryProgress
            };
          });
          
          // No need to update the exercises array directly as it's constant
          // But we've updated the userProgress state which will be used for display
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    }
  };
  
  // Helper function to get category key by ID
  const getCategoryKeyById = (id) => {
    switch (id) {
      case 1: return 'vowelSounds';
      case 2: return 'consonantClusters';
      case 3: return 'wordStress';
      case 4: return 'intonation';
      case 5: return 'rhythm';
      default: return 'unknown';
    }
  };

  const handleExerciseSelect = (exercise) => {
    // Animation for card selection
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      })
    ]).start();
    
    setSelectedExercise(exercise);
    setModalVisible(true);
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

  // Function to play sound
  async function playSound(text) {
    if (isPlaying) return;
    
    try {
      setIsPlaying(true);
      
      // Extract the actual word/sentence to speak
      let textToSpeak = text;
      
      // Handle word pairs (e.g., "cat/cake")
      if (typeof text === 'string' && text.includes('/')) {
        textToSpeak = text.split('/')[0];
      }
      
      // Handle sentences with annotations (e.g., "That's great! (excited)")
      if (typeof text === 'string' && text.includes('(')) {
        textToSpeak = text.split('(')[0].trim();
      }
      
      // Choose the appropriate speech method based on the content
      const isSentence = textToSpeak.includes(' ') || 
                         textToSpeak.includes('.') || 
                         textToSpeak.includes('?') || 
                         textToSpeak.includes('!');
      
      const options = {
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      };
      
      if (isSentence) {
        await SpeechHelper.speakSentence(textToSpeak, options);
      } else {
        await SpeechHelper.speakWord(textToSpeak, options);
      }
    } catch (error) {
      console.log('Error speaking: ', error);
      setIsPlaying(false);
    }
  }

  const renderExerciseCard = ({ item }) => {
    // Get the progress value from userProgress state based on the exercise ID
    const categoryKey = getCategoryKeyById(item.id);
    const progressValue = userProgress[categoryKey] || 0;
    
    return (
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [
          { translateY: slideAnim },
          { scale: scaleAnim }
        ]
      }}>
        <TouchableOpacity
          style={[
            styles.exerciseCard,
            { borderLeftColor: item.color, borderLeftWidth: 4 }
          ]}
          onPress={() => handleExerciseSelect(item)}
          activeOpacity={0.7}
        >
          <View style={[styles.exerciseIconContainer, { backgroundColor: `${item.color}20` }]}>
            <MaterialCommunityIcons name={item.icon} size={28} color={item.color} />
          </View>
          
          <View style={styles.exerciseTextContainer}>
            <View style={styles.exerciseHeaderRow}>
              <Text style={styles.exerciseTitle}>{item.title}</Text>
              <View style={[styles.progressBadge, { backgroundColor: `${item.color}20` }]}>
                <Text style={[styles.progressText, { color: item.color }]}>{progressValue}%</Text>
              </View>
            </View>
            
            <Text style={styles.exerciseDescription}>{item.description}</Text>
            
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { width: `${progressValue}%`, backgroundColor: item.color }
                ]} 
              />
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Helper function to get color based on level
  const getLevelColor = (level) => {
    switch(level) {
      case 'Beginner': return '#E3F2FD';
      case 'Intermediate': return '#E1F5FE';
      case 'Advanced': return '#E0F7FA';
      default: return '#E3F2FD';
    }
  };

  const renderExampleItem = (example, index) => {
    // Check if the example is a word pair (e.g., "cat/cake")
    const isPair = typeof example === 'string' && example.includes('/');
    const words = isPair ? example.split('/') : [example];
    
    return (
      <View key={index} style={styles.exampleContainer}>
        {isPair ? (
          // For word pairs, show both words with separate play buttons
          <View style={styles.wordPairContainer}>
            {words.map((word, wordIndex) => (
              <View key={wordIndex} style={styles.wordWithButton}>
                <TouchableOpacity 
                  style={styles.playButton}
                  onPress={() => playSound(word)}
                  disabled={isPlaying}
                >
                  <Ionicons 
                    name={isPlaying ? "pause-circle" : "play-circle"} 
                    size={24} 
                    color="#0072ff" 
                  />
                </TouchableOpacity>
                <Text style={styles.exampleText}>{word.trim()}</Text>
              </View>
            ))}
          </View>
        ) : (
          // For single words or phrases
          <View style={styles.wordWithButton}>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => playSound(example)}
              disabled={isPlaying}
            >
              <Ionicons 
                name={isPlaying ? "pause-circle" : "play-circle"} 
                size={24} 
                color="#0072ff" 
              />
            </TouchableOpacity>
            <Text style={styles.exampleText}>{example}</Text>
          </View>
        )}
      </View>
    );
  };

  // Effect to handle navigation params and show modal when returning from an activity
  useEffect(() => {
    if (showModal && selectedExerciseId) {
      // Find the selected exercise
      const exercise = exercises.find(ex => ex.id === selectedExerciseId);
      if (exercise) {
        setSelectedExercise(exercise);
        
        // Find the selected activity if available
        if (selectedActivityId) {
          const activity = exercise.activities.find(act => act.id === selectedActivityId);
          if (activity) {
            setSelectedActivity(activity);
          }
        }
        
        // Show the modal
        setModalVisible(true);
      }
    }
  }, [showModal, selectedExerciseId, selectedActivityId]);

  // Effect to clean up resources when component unmounts
  useEffect(() => {
    return () => {
      SpeechHelper.stop();
    };
  }, []);

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Pronunciation</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Practice English pronunciation for better communication</Text>
        
        <FlatList
          data={exercises}
          renderItem={renderExerciseCard}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.exercisesContainer}
        />
        
        <TouchableOpacity 
          style={styles.dailyPracticeButton}
          onPress={() => navigation.navigate('DailyPracticeScreen')}
        >
          <LinearGradient
            colors={['#2200CC', '#3311DD']}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <FontAwesome5 name="calendar-check" size={16} color="white" style={styles.buttonIcon} />
            <Text style={styles.dailyPracticeText}>Daily 5-Min Practice</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {selectedExercise?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.divider} />
            
            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <Text style={styles.sectionTitle}>Example Words</Text>
              <View style={styles.examplesContainer}>
                {selectedExercise?.examples.map((example, index) => {
                  // Check if the example is a sentence (for intonation patterns)
                  const isSentence = typeof example === 'string' && 
                    (example.includes('.') || example.includes('?') || example.includes('!'));
                  
                  return (
                    <View key={index} style={[
                      styles.exampleContainer,
                      isSentence && styles.sentenceExampleContainer
                    ]}>
                      <TouchableOpacity 
                        style={styles.playButton}
                        onPress={() => playSound(example)}
                        disabled={isPlaying}
                      >
                        <Ionicons 
                          name={isPlaying ? "pause-circle" : "play-circle"} 
                          size={24} 
                          color="#0072ff" 
                        />
                      </TouchableOpacity>
                      <Text style={[
                        styles.exampleText,
                        isSentence && styles.sentenceExampleText
                      ]}>
                        {example}
                      </Text>
                    </View>
                  );
                })}
              </View>
              
              <Text style={styles.sectionTitle}>Activities</Text>
              <View style={styles.activitiesContainer}>
                {selectedExercise?.activities.map(activity => (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.activityItem,
                      selectedActivity?.id === activity.id && styles.selectedActivityItem
                    ]}
                    onPress={() => handleActivitySelect(activity)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.activityHeader}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <View style={styles.activityMetaContainer}>
                        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(activity.level) }]}>
                          <Text style={styles.levelText}>{activity.level}</Text>
                        </View>
                        <View style={styles.timeContainer}>
                          <Ionicons name="time-outline" size={16} color="#666" style={styles.timeIcon} />
                          <Text style={styles.timeText}>{activity.time}</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <TouchableOpacity 
              style={[
                styles.startButton,
                !selectedActivity && styles.disabledButton
              ]}
              disabled={!selectedActivity}
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('PronunciationExerciseScreen', {
                  exerciseId: selectedExercise?.id,
                  activityId: selectedActivity?.id,
                  exerciseData: selectedExercise,
                  activityData: selectedActivity
                });
              }}
            >
              <Text style={styles.startButtonText}>
                {selectedActivity ? 'Start Activity' : 'Select an Activity'}
              </Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  exercisesContainer: {
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  exerciseIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  exerciseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
  },
  exerciseDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E8F4FF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  dailyPracticeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  dailyPracticeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '85%',
    display: 'flex',
    flexDirection: 'column',
  },
  modalScrollContent: {
    flexGrow: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 15,
  },
  examplesContainer: {
    marginBottom: 20,
  },
  exampleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F5F9FF',
    padding: 12,
    borderRadius: 10,
  },
  playButton: {
    marginRight: 10,
  },
  exampleText: {
    fontSize: 16,
    color: '#333',
  },
  activitiesContainer: {
    marginBottom: 20,
  },
  activityItem: {
    backgroundColor: '#F5F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E8F4FF',
  },
  selectedActivityItem: {
    backgroundColor: '#E8F4FF',
    borderColor: '#0072ff',
    borderWidth: 2,
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  activityHeader: {
    flexDirection: 'column',
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  activityMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0072ff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    marginRight: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#2200CC',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#9999CC',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  wordPairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  wordWithButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  sentenceExampleContainer: {
    backgroundColor: '#E8F4FF',
    padding: 12,
    borderRadius: 10,
  },
  sentenceExampleText: {
    fontSize: 16,
    color: '#333',
  }
});