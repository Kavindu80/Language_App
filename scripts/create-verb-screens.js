const fs = require('fs');
const path = require('path');

// Template for verb screen files
const getVerbScreenTemplate = (letter, verbs, puzzleScreenName) => `import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StatusBar,
  Animated,
  Easing
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

export default function VerbsScreen${letter}() {
  const navigation = useNavigation();
  const [selectedVerb, setSelectedVerb] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.timing(animationValue, {
      toValue: 0.98,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 150,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  };

  const verbs = ${JSON.stringify(verbs, null, 2)};

  const handleVerbPress = (verb) => {
    setSelectedVerb(verb.id === selectedVerb?.id ? null : verb);
  };

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
          <Ionicons name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>English Alphabet</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
        >
          <Image 
            source={require("../../../../assets/items/profile.jpg")}
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.verbsTitle}>Verbs</Text>
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {verbs.map((verb) => (
          <View key={verb.id} style={styles.verbContainer}>
            <TouchableOpacity 
              style={[
                styles.verbButton,
                selectedVerb?.id === verb.id && styles.selectedVerbButton
              ]}
              onPress={() => handleVerbPress(verb)}
              activeOpacity={0.8}
            >
              <Text style={styles.verbText}>{verb.word}</Text>
              <View style={styles.meaningContainer}>
                <Ionicons name="volume-medium" size={22} color="#3B82F6" />
                <Text style={styles.meaningText}>Meaning</Text>
              </View>
            </TouchableOpacity>
            
            {selectedVerb?.id === verb.id && (
              <View style={styles.meaningBox}>
                <Text style={styles.meaningDefinition}>{verb.meaning}</Text>
                <Text style={styles.exampleTitle}>Example:</Text>
                <Text style={styles.exampleText}>{verb.example}</Text>
              </View>
            )}
          </View>
        ))}
        
        <Animated.View 
          style={[
            { transform: [{ scale: animationValue }] },
            styles.continueButtonContainer
          ]}
        >
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => navigation.navigate("${puzzleScreenName}")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingTop: 10,
  },
  backButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  profileButton: {
    padding: 10,
  },
  profileImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#fff",
  },
  verbsTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  verbContainer: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  verbButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedVerbButton: {
    backgroundColor: '#F8FAFC',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  verbText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  meaningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meaningText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginLeft: 6,
  },
  meaningBox: {
    backgroundColor: '#F8FAFC',
    padding: 18,
    paddingTop: 14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  meaningDefinition: {
    fontSize: 16,
    lineHeight: 22,
    color: '#334155',
    marginBottom: 10,
  },
  exampleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
    marginTop: 5,
  },
  exampleText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
    color: '#334155',
    marginTop: 4,
  },
  continueButtonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: "#0039CB",
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignSelf: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  continueText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    letterSpacing: 0.5,
  },
});`;

// Verbs for letters G-Z
const verbsByLetter = {
  // G verbs
  G: [
    { 
      id: 1, 
      word: 'Gain', 
      meaning: 'To get something useful or positive.',
      example: 'She gained a lot of experience from her internship.'
    },
    { 
      id: 2, 
      word: 'Gather', 
      meaning: 'To collect things or people together.',
      example: 'We gathered all the books for the donation.'
    },
    { 
      id: 3, 
      word: 'Give', 
      meaning: 'To present something to someone.',
      example: 'He gave her a gift for her birthday.'
    },
    { 
      id: 4, 
      word: 'Go', 
      meaning: 'To move from one place to another.',
      example: 'They go to school by bus every day.'
    },
    { 
      id: 5, 
      word: 'Grow', 
      meaning: 'To increase in size, number, or importance.',
      example: 'The plants grow quickly in spring.'
    },
    { 
      id: 6, 
      word: 'Guess', 
      meaning: 'To give an answer without being sure if it is correct.',
      example: 'Can you guess the answer to this question?'
    },
    { 
      id: 7, 
      word: 'Guard', 
      meaning: 'To protect someone or something.',
      example: 'The dog guards the house at night.'
    },
    { 
      id: 8, 
      word: 'Guide', 
      meaning: 'To show the way or help someone do something.',
      example: 'The teacher guided the students through the project.'
    },
    { 
      id: 9, 
      word: 'Glance', 
      meaning: 'To look quickly at something.',
      example: 'She glanced at her watch during the meeting.'
    },
    { 
      id: 10, 
      word: 'Grin', 
      meaning: 'To smile widely.',
      example: 'He grinned when he saw the surprise.'
    }
  ],
  
  // H verbs
  H: [
    { 
      id: 1, 
      word: 'Happen', 
      meaning: 'To take place or occur.',
      example: 'The accident happened yesterday.'
    },
    { 
      id: 2, 
      word: 'Hang', 
      meaning: 'To attach or suspend something from above.',
      example: 'She hung the picture on the wall.'
    },
    { 
      id: 3, 
      word: 'Harm', 
      meaning: 'To hurt or damage someone or something.',
      example: 'Smoking can harm your health.'
    },
    { 
      id: 4, 
      word: 'Hate', 
      meaning: 'To dislike someone or something very much.',
      example: 'I hate waiting in long lines.'
    },
    { 
      id: 5, 
      word: 'Have', 
      meaning: 'To own or possess something.',
      example: 'They have a big house.'
    },
    { 
      id: 6, 
      word: 'Hear', 
      meaning: 'To notice a sound with your ears.',
      example: 'I can hear music from the next room.'
    },
    { 
      id: 7, 
      word: 'Help', 
      meaning: 'To make it easier or possible for someone to do something.',
      example: 'She helped me with my homework.'
    },
    { 
      id: 8, 
      word: 'Hold', 
      meaning: 'To keep something in your hand or arms.',
      example: 'He held the baby carefully.'
    },
    { 
      id: 9, 
      word: 'Hope', 
      meaning: 'To want something to happen or be true.',
      example: 'We hope for good weather tomorrow.'
    },
    { 
      id: 10, 
      word: 'Hurt', 
      meaning: 'To cause pain or injury.',
      example: 'I hurt my leg while running.'
    }
  ],
  
  // I verbs
  I: [
    { 
      id: 1, 
      word: 'Imagine', 
      meaning: 'To form a picture or idea in your mind.',
      example: 'Try to imagine a world without phones.'
    },
    { 
      id: 2, 
      word: 'Improve', 
      meaning: 'To get better or make something better.',
      example: 'She wants to improve her English skills.'
    },
    { 
      id: 3, 
      word: 'Include', 
      meaning: 'To have something or someone as part of a group or total.',
      example: 'The price includes breakfast.'
    },
    { 
      id: 4, 
      word: 'Increase', 
      meaning: 'To become larger in number or amount.',
      example: 'The company increased its profits last year.'
    },
    { 
      id: 5, 
      word: 'Influence', 
      meaning: 'To affect or change how someone thinks or behaves.',
      example: 'His speech influenced many people.'
    },
    { 
      id: 6, 
      word: 'Inform', 
      meaning: 'To tell someone about something.',
      example: 'Please inform me if you cannot come.'
    },
    { 
      id: 7, 
      word: 'Insist', 
      meaning: 'To say firmly that something must be done or is true.',
      example: 'She insisted on paying the bill.'
    },
    { 
      id: 8, 
      word: 'Introduce', 
      meaning: 'To tell someone another person\'s name for the first time.',
      example: 'Let me introduce you to my friend.'
    },
    { 
      id: 9, 
      word: 'Invest', 
      meaning: 'To put money, effort, or time into something to get a return.',
      example: 'They invested a lot in the new project.'
    },
    { 
      id: 10, 
      word: 'Invite', 
      meaning: 'To ask someone to come to an event or place.',
      example: 'We invited them to our party.'
    }
  ],
  
  // J verbs
  J: [
    { 
      id: 1, 
      word: 'Jump', 
      meaning: 'To push yourself into the air using your legs.',
      example: 'She jumped over the puddle.'
    },
    { 
      id: 2, 
      word: 'Join', 
      meaning: 'To become part of a group or activity.',
      example: 'He joined the football team last week.'
    },
    { 
      id: 3, 
      word: 'Judge', 
      meaning: 'To form an opinion after thinking carefully.',
      example: 'Don\'t judge people by their appearance.'
    },
    { 
      id: 4, 
      word: 'Justify', 
      meaning: 'To show or prove that something is right.',
      example: 'Can you justify your decision?'
    },
    { 
      id: 5, 
      word: 'Joke', 
      meaning: 'To say something funny.',
      example: 'He joked about his cooking skills.'
    },
    { 
      id: 6, 
      word: 'Jog', 
      meaning: 'To run slowly for exercise.',
      example: 'She jogs every morning.'
    },
    { 
      id: 7, 
      word: 'Jot', 
      meaning: 'To write something quickly.',
      example: 'I jotted down the address.'
    },
    { 
      id: 8, 
      word: 'Jingle', 
      meaning: 'To make a light ringing sound.',
      example: 'The bells jingle on the door.'
    },
    { 
      id: 9, 
      word: 'Jail', 
      meaning: 'To put someone in prison.',
      example: 'The police jailed the thief.'
    },
    { 
      id: 10, 
      word: 'Jerk', 
      meaning: 'To move suddenly or sharply.',
      example: 'He jerked the rope hard.'
    }
  ],
  
  // K verbs
  K: [
    { 
      id: 1, 
      word: 'Keep', 
      meaning: 'To have or continue to have something.',
      example: 'Keep your phone in your bag.'
    },
    { 
      id: 2, 
      word: 'Kick', 
      meaning: 'To hit something with your foot.',
      example: 'He kicked the ball into the goal.'
    },
    { 
      id: 3, 
      word: 'Kiss', 
      meaning: 'To touch someone with your lips to show love.',
      example: 'She kissed her baby goodnight.'
    },
    { 
      id: 4, 
      word: 'Kneel', 
      meaning: 'To go down on your knees.',
      example: 'They knelt to pray.'
    },
    { 
      id: 5, 
      word: 'Knock', 
      meaning: 'To hit a door to get attention.',
      example: 'Please knock before entering.'
    },
    { 
      id: 6, 
      word: 'Know', 
      meaning: 'To have information or understanding.',
      example: 'I know the answer.'
    },
    { 
      id: 7, 
      word: 'Knit', 
      meaning: 'To make clothing by using yarn and needles.',
      example: 'My grandma knits warm sweaters.'
    },
    { 
      id: 8, 
      word: 'Keep on', 
      meaning: 'To continue doing something.',
      example: 'He kept on talking during the movie.'
    },
    { 
      id: 9, 
      word: 'Kid', 
      meaning: 'To joke or tease someone.',
      example: 'Are you kidding me?'
    },
    { 
      id: 10, 
      word: 'Kick off', 
      meaning: 'To begin something, especially a game or event.',
      example: 'The match kicked off at 4 PM.'
    }
  ],
  
  // Placeholder for other letters (L-Z)
  // You would add the remaining letters here
};

// Function to create verb screen files
const createVerbScreens = () => {
  // Letters A-F are already created manually
  const letters = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  
  letters.forEach(letter => {
    // Skip if no verbs defined for this letter
    if (!verbsByLetter[letter]) {
      console.log(`No verbs defined for letter ${letter}, skipping...`);
      return;
    }
    
    // Create directory if it doesn't exist
    const dirPath = path.join(__dirname, '..', 'app', 'screens', 'beginner', letter);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    // Generate file content
    const puzzleScreenName = `${letter}PuzzleProgressScreen`;
    const fileContent = getVerbScreenTemplate(letter, verbsByLetter[letter], puzzleScreenName);
    
    // Write the file
    const filePath = path.join(dirPath, `VerbsScreen${letter}.js`);
    fs.writeFileSync(filePath, fileContent);
    
    console.log(`Created VerbsScreen${letter}.js`);
  });
  
  console.log('All verb screen files created successfully!');
};

// Execute the function
createVerbScreens(); 