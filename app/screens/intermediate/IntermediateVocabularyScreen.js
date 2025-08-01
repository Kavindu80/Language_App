import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  ScrollView, 
  Image 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntermediateVocabularyScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedOption, setSelectedOption] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  const vocabularyOptions = [
    { 
      id: 1, 
      title: 'Useful Words',
      description: 'Essential Vocabulary for Travel, Shopping, Dining, Health, and Technology' 
    },
    { 
      id: 2, 
      title: 'Common Idioms',
      description: 'Common idiomatic expressions for everyday situations' 
    },
    { 
      id: 3, 
      title: 'Phrasal Verbs',
      description: 'Common Phrasal Verbs for Everyday English' 
    },
    { 
      id: 4, 
      title: 'Word Formation',
      description: 'Prefixes, Suffixes, and Compounds' 
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
  }, []);

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  const handleContinue = () => {
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
    ]).start(() => {
      if (selectedOption === 1) {
        // Navigate to Thematic Vocabulary screen
        navigation.navigate('ThematicVocabularyScreen');
      } else if (selectedOption === 2) {
        // Navigate to Idiomatic Expressions screen
        navigation.navigate('IdiomaticExpressionsScreen');
      } else if (selectedOption === 3) {
        // Navigate to Phrasal Verbs screen
        navigation.navigate('PhrasalVerbsScreen');
      } else if (selectedOption === 4) {
        // Navigate to Word Formation screen
        navigation.navigate('WordFormationScreen');
      }
    });
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
        
        <Text style={styles.headerTitle}>Vocabulary</Text>
        
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
            Words and Phrases
          </Text>

          <View style={styles.optionsContainer}>
            {vocabularyOptions.map((option, index) => (
              <Animated.View
                key={option.id}
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
                    styles.optionButton,
                    selectedOption === option.id && styles.selectedOptionButton
                  ]}
                  onPress={() => handleOptionSelect(option.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      selectedOption === option.id ? 
                      ['#bbdefb', '#90caf9'] : 
                      ['#f5f9ff', '#e3f2fd']
                    }
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.optionContent}>
                      <Text 
                        style={[
                          styles.optionText,
                          selectedOption === option.id && styles.selectedOptionText
                        ]}
                      >
                        {option.title}
                      </Text>
                      
                      <Text style={styles.optionDescription}>
                        {option.description}
                      </Text>
                      
                      {selectedOption === option.id && (
                        <View style={styles.selectedIndicator} />
                      )}
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Animated.View style={{ transform: [{ scale: buttonScale }], width: '100%' }}>
          <TouchableOpacity 
            style={[
              styles.continueButton,
              !selectedOption && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedOption}
            activeOpacity={0.8}
          >
              <Text style={styles.continueButtonText}>Continue</Text>
            <FontAwesome5 name="arrow-right" size={16} color="#0072ff" style={styles.buttonIcon} />
          </TouchableOpacity>
        </Animated.View>
      </View>
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedOptionButton: {
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  gradientCard: {
    borderRadius: 15,
    padding: 2,
  },
  optionContent: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 13,
    position: 'relative',
  },
  optionText: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: '600',
    marginBottom: 6,
  },
  selectedOptionText: {
    color: '#0051cb',
    fontWeight: '700',
  },
  optionDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00c6ff',
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -4,
  },
  buttonContainer: {
    width: '100%',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
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