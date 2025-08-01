import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntermediateLevelModuleSelectionScreen() {
  const navigation = useNavigation();
  const [selectedModule, setSelectedModule] = useState(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const modules = [
    {
      id: 1,
      title: 'Module 1: Grammar patterns',
      screen: 'IntermediateGrammarScreen',
      description: 'Grammar rules and structures',
      icon: 'book'
    },
    {
      id: 2,
      title: 'Module 2: Language Skills → Spoken and Comprehension Practice',
      screen: 'IntermediateLanguageSkillsScreen',
      description: 'Develop reading, writing, speaking and listening skills → Spoken, Reading and Comprehension',
      icon: 'chatbubbles'
    },
    {
      id: 3,
      title: 'Module 3: Vocabulary Expansion → Vocabulary',
      screen: 'IntermediateVocabularyScreen',
      description: 'Useful Daily Words and Phrases',
      icon: 'text'
    }
  ];

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    
    // Animate character when selecting a module
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleModulePress = (module) => {
    // Create a press animation effect
    const pressAnimation = Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);
    
    pressAnimation.start(() => {
      handleModuleSelect(module);
    });
  };

  const handleContinue = () => {
    if (selectedModule) {
      navigation.navigate(selectedModule.screen);
    }
  };

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-circle" size={36} color="#fff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Intermediate</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.characterContainer}>
          <Animated.Image 
            source={require('../../../assets/items/character.png')} 
            style={[
              styles.characterImage,
              { transform: [{ scale: scaleAnim }] }
            ]}
            resizeMode="contain"
          />
          <TouchableOpacity style={styles.selectModuleButton}>
            <Text style={styles.selectModuleText}>Select Your Module</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.moduleContainer}>
          {modules.map(module => (
            <TouchableOpacity 
              key={module.id} 
              style={[
                styles.moduleButton,
                selectedModule?.id === module.id && styles.selectedModuleButton
              ]}
              onPress={() => handleModulePress(module)}
              activeOpacity={0.7}
            >
              <View style={styles.moduleIconContainer}>
                <Ionicons name={module.icon} size={28} color="#0072ff" />
              </View>
              <View style={styles.moduleTextContainer}>
                <Text style={[
                  styles.moduleText,
                  selectedModule?.id === module.id && styles.selectedModuleText
                ]}>
                  {module.title}
                </Text>
                <Text style={[
                  styles.moduleDescription,
                  selectedModule?.id === module.id && styles.selectedModuleDescription
                ]}>
                  {module.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[
          styles.continueButton,
          !selectedModule && styles.disabledButton
        ]}
        onPress={handleContinue}
        disabled={!selectedModule}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
        <Ionicons name="arrow-forward" size={20} color="#0072ff" style={styles.buttonIcon} />
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 60,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 50,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '70%',
  },
  profileButton: {
    position: 'absolute',
    right: 15,
    top: 50,
    zIndex: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  characterImage: {
    width: 150,
    height: 150,
    marginBottom: 5,
  },
  selectModuleButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 5,
    marginBottom: 20,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectModuleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    textAlign: 'center',
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingHorizontal: 25,
  },
  speechText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    textAlign: 'center',
  },
  moduleContainer: {
    width: '100%',
    marginBottom: 20,
  },
  moduleButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#E0E0E0',
    transition: 'all 0.3s',
  },
  selectedModuleButton: {
    backgroundColor: '#E8F4FF',
    borderLeftColor: '#0072ff',
    borderLeftWidth: 4,
    transform: [{ scale: 1.02 }],
  },
  moduleIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleTextContainer: {
    flex: 1,
  },
  moduleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 8,
  },
  selectedModuleText: {
    color: '#0058c6',
  },
  moduleDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  selectedModuleDescription: {
    color: '#444444',
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  continueButtonText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});