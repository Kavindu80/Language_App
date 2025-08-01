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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SpeechHelper from '../../../helpers/SpeechHelper';

// Constants for AsyncStorage keys
const PROGRESS_KEY = 'pronunciation_progress';
const COMPLETED_ACTIVITIES_KEY = 'pronunciation_completed_activities';

export default function PronunciationExerciseScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { exerciseId, activityId, exerciseData, activityData } = route.params || {};
  
  const [currentExercise, setCurrentExercise] = useState(null);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState(null); // 'correct' or 'incorrect'
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedItems, setCompletedItems] = useState([]);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [progressSaved, setProgressSaved] = useState(false);
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Mock data - in a real app this would come from a database or API
  const exercises = [
    {
      id: 1,
      title: 'Vowel Sounds',
      color: '#4FC3F7',
      activities: [
        { 
          id: 101, 
          title: 'Long A vs Short A', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn to distinguish and pronounce long A (as in "cake") and short A (as in "cat") sounds.',
          instructions: 'Listen to each word, then identify whether it contains a long A or short A sound.',
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
          instructions: 'Listen to each word, then identify whether it contains a short E or long E sound.',
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
          instructions: 'Listen to each word, then identify whether it contains a short I or long I sound.',
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
          instructions: 'Listen to each word, then identify whether it contains a short O or long O sound.',
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
          instructions: 'Listen to each word, then identify the specific U sound it contains.',
          practice: [
            { word: 'cup', correct: 'short', audio: 'cup.mp3' },
            { word: 'cute', correct: 'long', audio: 'cute.mp3' },
            { word: 'put', correct: 'short-oo', audio: 'put.mp3' },
            { word: 'rule', correct: 'long-oo', audio: 'rule.mp3' },
            { word: 'turn', correct: 'er', audio: 'turn.mp3' },
            { word: 'pure', correct: 'y-sound', audio: 'pure.mp3' }
          ]
        }
      ]
    },
    {
      id: 2,
      title: 'Consonant Clusters',
      color: '#7986CB',
      activities: [
        { 
          id: 201, 
          title: 'ST, SP, SK Clusters', 
          level: 'Beginner',
          time: '5 min',
          description: 'Practice initial S clusters that are challenging for many language learners.',
          instructions: 'Listen to each word, then practice pronouncing it. Pay special attention to the initial consonant cluster.',
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
          instructions: 'Listen to each word, then identify the correct initial consonant cluster.',
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
          instructions: 'Listen to each word, then identify the correct final consonant cluster.',
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
          instructions: 'Listen to each word, then identify the correct initial three-consonant cluster.',
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
          instructions: 'Listen to each word, then identify the correct complex consonant cluster.',
          practice: [
            { word: 'strengths', correct: 'ngths', audio: 'strengths.mp3' },
            { word: 'sixths', correct: 'ksths', audio: 'sixths.mp3' },
            { word: 'glimpsed', correct: 'mpst', audio: 'glimpsed.mp3' },
            { word: 'twelfths', correct: 'lfths', audio: 'twelfths.mp3' },
            { word: 'prompted', correct: 'mpt', audio: 'prompted.mp3' },
            { word: 'scratched', correct: 'tcht', audio: 'scratched.mp3' }
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Word Stress',
      color: '#9575CD',
      activities: [
        { 
          id: 301, 
          title: 'Two-Syllable Words', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn the stress patterns in common two-syllable words.',
          instructions: 'Listen to each word, then identify which syllable is stressed.',
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
          instructions: 'Listen to each word, then identify which syllable receives the primary stress.',
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
          instructions: 'Listen to each sentence, then identify whether the highlighted word is used as a noun or verb based on its stress pattern.',
          practice: [
            { sentence: 'I need to preSENT my findings.', correct: 'verb', audio: 'present-sentence1.mp3' },
            { sentence: 'I bought a PREsent for her.', correct: 'noun', audio: 'present-sentence2.mp3' },
            { sentence: 'They will reCORD the meeting.', correct: 'verb', audio: 'record-sentence1.mp3' },
            { sentence: 'I listened to the REcord.', correct: 'noun', audio: 'record-sentence2.mp3' },
            { sentence: 'Please conDUCT the interview.', correct: 'verb', audio: 'conduct-sentence1.mp3' },
            { sentence: 'The CONduct was inappropriate.', correct: 'noun', audio: 'conduct-sentence2.mp3' }
          ]
        },
        { 
          id: 304, 
          title: 'Stress Shifts', 
          level: 'Advanced', 
          time: '12 min',
          description: 'Master how stress shifts when adding suffixes to words.',
          instructions: 'Listen to each word pair, then identify how the stress changes when the suffix is added.',
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
          instructions: 'Listen to each word or phrase, then identify whether the stress is on the first or second word.',
          practice: [
            { word: 'BLACKboard', correct: 'first', audio: 'blackboard.mp3' },
            { word: 'black BOARD', correct: 'second', audio: 'black-board.mp3' },
            { word: 'GREENhouse', correct: 'first', audio: 'greenhouse.mp3' },
            { word: 'green HOUSE', correct: 'second', audio: 'green-house.mp3' },
            { word: 'SOFTware', correct: 'first', audio: 'software.mp3' },
            { word: 'HOT dog', correct: 'first', audio: 'hotdog.mp3' }
          ]
        }
      ]
    },
    {
      id: 4,
      title: 'Intonation Patterns',
      color: '#4DB6AC',
      activities: [
        { 
          id: 401, 
          title: 'Questions vs Statements', 
          level: 'Beginner', 
          time: '5 min',
          description: 'Learn the basic intonation patterns for questions and statements.',
          instructions: 'Listen to each sentence, then identify whether it has rising or falling intonation.',
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
          instructions: 'Listen to each phrase, then identify the emotion being expressed through the intonation pattern.',
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
          instructions: 'Listen to each sentence, then identify which word is being emphasized through intonation.',
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
          instructions: 'Listen to each sentence, then identify the intonation pattern being used.',
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
          instructions: 'Listen to each greeting, then identify which regional accent it represents.',
          practice: [
            { sentence: 'Good morning! (American)', correct: 'american', audio: 'american1.mp3' },
            { sentence: 'Good morning! (British)', correct: 'british', audio: 'british1.mp3' },
            { sentence: 'How are you? (American)', correct: 'american', audio: 'american2.mp3' },
            { sentence: 'How are you? (British)', correct: 'british', audio: 'british2.mp3' },
            { sentence: 'Excuse me. (Australian)', correct: 'australian', audio: 'australian1.mp3' },
            { sentence: 'Excuse me. (Canadian)', correct: 'canadian', audio: 'canadian1.mp3' }
          ]
        }
      ]
    },
    {
      id: 5,
      title: 'Rhythm & Fluency',
      color: '#FF7043',
      activities: [
        { 
          id: 501, 
          title: 'Sentence Stress', 
          level: 'Beginner', 
          time: '6 min',
          description: 'Learn which words to stress in sentences for natural rhythm.',
          instructions: 'Listen to each sentence, then identify which type of words are stressed.',
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
          instructions: 'Listen to each phrase, then identify the type of linking being used.',
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
          instructions: 'Listen to each phrase, then identify whether it uses a contraction or a reduction.',
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
          instructions: 'Listen to each sentence, then identify the type of pausing pattern being used.',
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
          instructions: 'Listen to each sentence, then identify the speed and rhythm pattern being used.',
          practice: [
            { sentence: 'The early bird catches the worm. (slow)', correct: 'slow-clear', audio: 'speed1.mp3' },
            { sentence: 'The early bird catches the worm. (normal)', correct: 'normal-rhythm', audio: 'speed2.mp3' },
            { sentence: 'The early bird catches the worm. (fast)', correct: 'fast-connected', audio: 'speed3.mp3' },
            { sentence: 'She sells seashells by the seashore. (slow)', correct: 'slow-clear', audio: 'speed4.mp3' },
            { sentence: 'She sells seashells by the seashore. (normal)', correct: 'normal-rhythm', audio: 'speed5.mp3' },
            { sentence: 'She sells seashells by the seashore. (fast)', correct: 'fast-connected', audio: 'speed6.mp3' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    // First try to use the data passed directly from PronunciationScreen
    if (exerciseData && activityData) {
      console.log('Using passed exercise and activity data');
      setCurrentExercise(exerciseData);
      setCurrentActivity(activityData);
      
      // Initialize progress animation
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }
    
    // If no direct data, try to find the exercise and activity in local data
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (exercise) {
      setCurrentExercise(exercise);
      const activity = exercise.activities.find(act => act.id === activityId);
      if (activity) {
        setCurrentActivity(activity);
        // Initialize progress animation
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }
    } else {
      // If exercise not found in local data, create a default one based on the IDs
      // This ensures compatibility with data passed from PronunciationScreen
      console.log(`Creating default exercise for ID: ${exerciseId}, activity: ${activityId}`);
      
      // Map exercise IDs to titles and colors
      const exerciseTitles = {
        1: 'Vowel Sounds',
        2: 'Consonant Clusters',
        3: 'Word Stress',
        4: 'Intonation Patterns',
        5: 'Rhythm & Fluency'
      };
      
      const exerciseColors = {
        1: '#4FC3F7',
        2: '#7986CB',
        3: '#9575CD',
        4: '#4DB6AC',
        5: '#FF7043'
      };
      
      // Create a default exercise with basic structure
      const defaultExercise = {
        id: exerciseId,
        title: exerciseTitles[exerciseId] || 'Pronunciation Exercise',
        color: exerciseColors[exerciseId] || '#4FC3F7',
        activities: [{
          id: activityId,
          title: `Activity ${activityId}`,
          level: 'Beginner',
          time: '5 min',
          description: 'Practice your pronunciation skills',
          instructions: 'Listen to each word or sentence, then select the correct answer.',
          practice: [
            { word: 'example', correct: 'example', audio: 'example.mp3' }
          ]
        }]
      };
      
      setCurrentExercise(defaultExercise);
      setCurrentActivity(defaultExercise.activities[0]);
      
      // Initialize progress animation
      Animated.timing(progressAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    
    // Clean up audio when component unmounts
    return () => {
      SpeechHelper.stop();
    };
  }, [exerciseId, activityId, exerciseData, activityData]);

  // Function to play audio
  const playAudio = async (audioFile) => {
    try {
      setIsPlaying(true);
      
      const currentItem = currentActivity?.practice[currentStep];
      let textToSpeak = '';
      
      // Determine what to speak based on context
      if (typeof audioFile === 'string') {
        textToSpeak = audioFile;
      } else if (currentItem?.word) {
        textToSpeak = currentItem.word;
      } else if (currentItem?.sentence) {
        textToSpeak = currentItem.sentence;
      } else if (currentItem?.example) {
        textToSpeak = currentItem.example;
      }
      
      // Remove annotations
      if (textToSpeak.includes('(')) {
        textToSpeak = textToSpeak.split('(')[0].trim();
      }
      
      // Configure options
      const speechOptions = {
        onDone: () => setIsPlaying(false),
        onError: () => setIsPlaying(false)
      };
      
      // Apply exercise-specific adjustments
      if (currentExercise?.id === 4) { // Intonation
        if (textToSpeak.endsWith('?')) {
          speechOptions.pitch = 1.2; // Higher pitch for questions
        }
      } else if (currentExercise?.id === 5) { // Rhythm
        speechOptions.rate = 0.7; // Slower for rhythm exercises
        
        // Adjust rate based on speed indicators
        if (textToSpeak.includes('(slow)')) {
          speechOptions.rate = 0.6;
        } else if (textToSpeak.includes('(fast)')) {
          speechOptions.rate = 1.0;
        }
      }
      
      // Choose the appropriate speech method based on the content
      const isSentence = textToSpeak.includes(' ') || 
                         textToSpeak.includes('.') || 
                         textToSpeak.includes('?') || 
                         textToSpeak.includes('!');
      
      if (isSentence) {
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
    const currentItem = currentActivity?.practice[currentStep];
    const isCorrect = currentItem?.correct === answer;
    
    // Update score and show feedback
    if (isCorrect) {
      setScore(score + 1);
      setFeedbackType('correct');
    } else {
      setFeedbackType('incorrect');
    }
    
    setShowFeedback(true);
    
    // Add to completed items
    setCompletedItems([...completedItems, currentStep]);
    
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
      if (currentStep < (currentActivity?.practice.length - 1)) {
        setCurrentStep(currentStep + 1);
        
        // Update progress animation
        Animated.timing(progressAnim, {
          toValue: (currentStep + 1) / (currentActivity?.practice.length || 1) * 100,
          duration: 300,
          useNativeDriver: false,
        }).start();
      } else {
        // Exercise completed
        setShowCompletionModal(true);
        
        // Save progress
        saveProgress().then(result => {
          if (result) {
            console.log('Progress saved successfully');
            setProgressSaved(true);
          }
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
        handleAnswer(currentActivity?.practice[currentStep]?.correct);
      }, 1000);
    } else {
      setIsRecording(true);
      // In a real app, you would start recording here
    }
  };

  // Function to restart the exercise
  const restartExercise = () => {
    setCurrentStep(0);
    setScore(0);
    setCompletedItems([]);
    setShowCompletionModal(false);
    
    // Reset progress animation
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Function to save progress to AsyncStorage
  const saveProgress = async () => {
    try {
      if (!currentExercise || !currentActivity) return;
      
      // Calculate percentage score
      const percentageScore = Math.round((score / currentActivity.practice.length) * 100);
      console.log(`Activity completed with score: ${percentageScore}%`);
      
      // Get existing progress data
      const progressData = await AsyncStorage.getItem(PROGRESS_KEY);
      let progress = progressData ? JSON.parse(progressData) : {};
      
      // Get existing completed activities
      const completedActivitiesData = await AsyncStorage.getItem(COMPLETED_ACTIVITIES_KEY);
      let completedActivities = completedActivitiesData ? JSON.parse(completedActivitiesData) : [];
      
      // Add this activity to completed activities if not already there
      const activityKey = `${currentExercise.id}-${currentActivity.id}`;
      if (!completedActivities.includes(activityKey)) {
        completedActivities.push(activityKey);
      }
      
      // Update progress for this category
      const categoryKey = getCategoryKeyById(currentExercise.id);
      if (!progress[categoryKey]) {
        progress[categoryKey] = 0;
      }
      
      // Calculate category progress based on completed activities
      const totalActivitiesInCategory = getTotalActivitiesInCategory(currentExercise.id);
      const completedActivitiesInCategory = completedActivities.filter(key => 
        key.startsWith(`${currentExercise.id}-`)
      ).length;
      
      const categoryProgress = Math.round((completedActivitiesInCategory / totalActivitiesInCategory) * 100);
      progress[categoryKey] = categoryProgress;
      
      console.log(`Updated ${categoryKey} progress: ${categoryProgress}%`);
      
      // Save updated data
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      await AsyncStorage.setItem(COMPLETED_ACTIVITIES_KEY, JSON.stringify(completedActivities));
      
      return { progress, completedActivities };
    } catch (error) {
      console.error('Error saving progress:', error);
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
  
  // Helper function to get total activities in a category
  const getTotalActivitiesInCategory = (categoryId) => {
    // Find the category in our exercises array
    const category = exercises.find(ex => ex.id === categoryId);
    return category ? category.activities.length : 5; // Default to 5 if not found
  };

  // Function to handle back button press
  const handleBackPress = () => {
    // Simply go back to the previous screen
    navigation.goBack();
  };

  // If no exercise or activity is found, show an error
  if (!currentExercise || !currentActivity) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBackPress}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Get the current practice item
  const currentItem = currentActivity.practice[currentStep];

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={[currentExercise.color, '#FFFFFF']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>{currentActivity.title}</Text>
            <View style={styles.headerSubtitleContainer}>
              <Text style={styles.headerSubtitle}>{currentExercise.title}</Text>
              <View style={styles.levelBadge}>
                <Text style={styles.levelText}>{currentActivity.level}</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
          </TouchableOpacity>
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
            {currentStep + 1}/{currentActivity.practice.length}
          </Text>
        </View>
        
        {/* Main Content */}
        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            <Text style={styles.instructionsText}>{currentActivity.instructions}</Text>
          </View>
          
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
                onPress={() => playAudio(currentItem.audio)}
                disabled={isPlaying}
              >
                <Ionicons 
                  name={isPlaying ? "pause-circle" : "play-circle"} 
                  size={36} 
                  color={currentExercise.color} 
                />
              </TouchableOpacity>
            </View>
            
            {/* Answer Options - Customize based on exercise type */}
            <View style={styles.answerOptionsContainer}>
              {/* Vowel Sounds exercise options */}
              {currentExercise.id === 1 && (
                <>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('short')}
                  >
                    <Text style={styles.answerButtonText}>Short Vowel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('long')}
                  >
                    <Text style={styles.answerButtonText}>Long Vowel</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {/* Consonant Clusters exercise options */}
              {currentExercise.id === 2 && (
                <View style={styles.clusterOptionsContainer}>
                  {/* Create buttons based on the current activity */}
                  {currentActivity?.id === 201 ? (
                    // ST, SP, SK Clusters
                    <>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('st')}
                      >
                        <Text style={styles.clusterButtonText}>ST</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('sp')}
                      >
                        <Text style={styles.clusterButtonText}>SP</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('sk')}
                      >
                        <Text style={styles.clusterButtonText}>SK</Text>
                      </TouchableOpacity>
                    </>
                  ) : currentActivity?.id === 202 ? (
                    // BL, CL, FL Clusters
                    <>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('bl')}
                      >
                        <Text style={styles.clusterButtonText}>BL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('cl')}
                      >
                        <Text style={styles.clusterButtonText}>CL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('fl')}
                      >
                        <Text style={styles.clusterButtonText}>FL</Text>
                      </TouchableOpacity>
                    </>
                  ) : currentActivity?.id === 204 ? (
                    // Three Consonant Clusters
                    <>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('str')}
                      >
                        <Text style={styles.clusterButtonText}>STR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('spl')}
                      >
                        <Text style={styles.clusterButtonText}>SPL</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('scr')}
                      >
                        <Text style={styles.clusterButtonText}>SCR</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.clusterButton}
                        onPress={() => handleAnswer('spr')}
                      >
                        <Text style={styles.clusterButtonText}>SPR</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    // For other activities, use the recording option
                    <TouchableOpacity 
                      style={[
                        styles.recordButton,
                        isRecording && styles.recordingButton
                      ]}
                      onPress={toggleRecording}
                    >
                      <FontAwesome5 
                        name={isRecording ? "stop-circle" : "microphone"} 
                        size={24} 
                        color="#fff" 
                      />
                      <Text style={styles.recordButtonText}>
                        {isRecording ? 'Stop Recording' : 'Record Pronunciation'}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
              
              {/* Word Stress exercise options */}
              {currentExercise.id === 3 && (
                <>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('first')}
                  >
                    <Text style={styles.answerButtonText}>First Syllable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('second')}
                  >
                    <Text style={styles.answerButtonText}>Second Syllable</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {/* Intonation Patterns exercise options */}
              {currentExercise.id === 4 && (
                <>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('rising')}
                  >
                    <Text style={styles.answerButtonText}>Rising Intonation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.answerButton}
                    onPress={() => handleAnswer('falling')}
                  >
                    <Text style={styles.answerButtonText}>Falling Intonation</Text>
                  </TouchableOpacity>
                </>
              )}
              
              {/* Rhythm & Fluency exercise options */}
              {currentExercise.id === 5 && (
                <TouchableOpacity 
                  style={[
                    styles.recordButton,
                    isRecording && styles.recordingButton
                  ]}
                  onPress={toggleRecording}
                >
                  <FontAwesome5 
                    name={isRecording ? "stop-circle" : "microphone"} 
                    size={24} 
                    color="#fff" 
                  />
                  <Text style={styles.recordButtonText}>
                    {isRecording ? 'Stop Recording' : 'Practice Speaking'}
                  </Text>
                </TouchableOpacity>
              )}
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
                colors={['#4CAF50', '#2E7D32']}
                style={styles.modalHeader}
              >
                <Ionicons name="trophy" size={64} color="#FFD700" />
                <Text style={styles.modalTitle}>Exercise Complete!</Text>
              </LinearGradient>
              
              <View style={styles.modalBody}>
                <Text style={styles.scoreText}>Your Score</Text>
                <Text style={styles.scoreValue}>{score}/{currentActivity.practice.length}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    <Text style={styles.statValue}>{score}</Text>
                    <Text style={styles.statLabel}>Correct</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="close-circle" size={24} color="#F44336" />
                    <Text style={styles.statValue}>{currentActivity.practice.length - score}</Text>
                    <Text style={styles.statLabel}>Incorrect</Text>
                  </View>
                  
                  <View style={styles.statItem}>
                    <Ionicons name="time-outline" size={24} color="#2196F3" />
                    <Text style={styles.statValue}>{currentActivity.time}</Text>
                    <Text style={styles.statLabel}>Time</Text>
                  </View>
                </View>
                
                {progressSaved && (
                  <View style={styles.progressSavedContainer}>
                    <Ionicons name="cloud-done" size={20} color="#4CAF50" />
                    <Text style={styles.progressSavedText}>Progress saved!</Text>
                  </View>
                )}
                
                <View style={styles.modalButtonsContainer}>
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.restartButton]}
                    onPress={restartExercise}
                  >
                    <Ionicons name="refresh" size={20} color="#fff" />
                    <Text style={styles.modalButtonText}>Restart</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.nextButton]}
                    onPress={() => {
                      setShowCompletionModal(false);
                      handleBackPress();
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
  headerTitleContainer: {
    flex: 1,
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
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  levelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  menuButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
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
    backgroundColor: '#fff',
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
  instructionsContainer: {
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
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
    color: '#0288D1',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7986CB',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingButton: {
    backgroundColor: '#F44336',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
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
    marginBottom: 32,
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
  modalButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 8,
  },
  restartButton: {
    backgroundColor: '#9E9E9E',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginHorizontal: 4,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    textAlign: 'center',
    marginVertical: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 16,
  },
  clusterOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  clusterButton: {
    backgroundColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 80,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  clusterButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0288D1',
    textAlign: 'center',
  },
  progressSavedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
  },
  progressSavedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginLeft: 8,
  },
}); 