import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  StatusBar,
  Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntermediateLanguageSkillsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  const languageSkills = [
    { 
      id: 1, 
      title: 'Pronunciation',
      description: 'Speak English confidently with clear pronunciation',
      screen: 'pronunciation/Pronunciation'
    },
    { 
      id: 2, 
      title: 'Reading and Comprehension',
      description: 'Practice reading and understanding paragraphs',
      screen: 'reading/ReadingComprehension'
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

  const handleSkillPress = (skill) => {
    setSelectedSkill(skill);
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
      if (selectedSkill) {
        // Navigate to selected skill screen
        navigation.navigate(`Intermediate${selectedSkill.screen}Screen`);
      } else {
        // Navigate to progress screen if no skill is selected
        navigation.navigate('IntermediateLanguageSkillsProgressScreen');
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
        
        <Text style={styles.headerTitle}>Language Skills</Text>
        
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
            Practice Pronunciation and Reading Comprehension
          </Text>

          <View style={styles.skillsContainer}>
            {languageSkills.map((skill, index) => (
              <Animated.View
                key={skill.id}
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
                    styles.skillButton,
                    selectedSkill?.id === skill.id && styles.selectedSkillButton
                  ]}
                  onPress={() => handleSkillPress(skill)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={
                      selectedSkill?.id === skill.id ? 
                      ['#bbdefb', '#90caf9'] : 
                      ['#f5f9ff', '#e3f2fd']
                    }
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <View style={styles.skillContent}>
                      <Text 
                        style={[
                          styles.skillText,
                          selectedSkill?.id === skill.id && styles.selectedSkillText
                        ]}
                      >
                        {skill.title}
                      </Text>
                      
                      <Text style={styles.skillDescription}>
                        {skill.description}
                      </Text>
                      
                      {selectedSkill?.id === skill.id && (
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
            style={styles.continueButton}
            onPress={handleContinue}
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
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  skillsContainer: {
    marginBottom: 20,
  },
  skillButton: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedSkillButton: {
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientCard: {
    borderRadius: 16,
    padding: 20,
  },
  skillContent: {
    position: 'relative',
  },
  skillText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 8,
  },
  selectedSkillText: {
    color: '#0044cc',
  },
  skillDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#0072ff',
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  continueButtonText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});