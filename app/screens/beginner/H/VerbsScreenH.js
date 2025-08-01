import React, { useState } from 'react';
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

export default function VerbsScreenH() {
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

  const verbs = [
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
  ];

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
            onPress={() => navigation.navigate("HPuzzleProgressScreen")}
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
});