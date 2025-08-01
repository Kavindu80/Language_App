import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  Animated, 
  ScrollView, 
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ModuleThreeTopicsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  // Topics in Module 3: Grammar Fundamentals
  const topics = [
    {
      id: 1,
      title: 'Prepositions',
      screen: 'grammar/PrepositionsScreen',
      description: 'Words that show relationships between nouns, pronouns, and other words in a sentence',
      isActive: true
    },
    {
      id: 2,
      title: 'Basic Tenses',
      screen: 'PronounsScreen',
      description: 'Simple tenses show actions or events that happen in the past, present, or future',
      isActive: true
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

  const handleTopicSelect = (topic) => {
    if (!topic.isActive) {
      return; // Inactive topics cannot be selected
    }
    setSelectedTopic(topic);
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
      if (selectedTopic) {
        if (selectedTopic.id === 2) {
          // Navigate to PronounsScreen when Basic Tenses is selected
          navigation.navigate('PronounsScreen');
        } else {
          // For other topics, use the screen property
          navigation.navigate(selectedTopic.screen);
        }
      }
    });
  };

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <StatusBar backgroundColor="#00c6ff" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Module 3: Grammar Fundamentals</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.profileButton}
        >
          <Image 
            source={require("../../../assets/items/profile.jpg")} 
            style={styles.profileImage} 
          />
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
            Basic grammar rules and sentence structure
          </Text>

          <View style={styles.topicsContainer}>
            {topics.map((topic, index) => (
              <Animated.View
                key={topic.id}
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
                    styles.topicButton,
                    selectedTopic?.id === topic.id && styles.selectedTopicButton,
                    !topic.isActive && styles.inactiveTopicButton
                  ]}
                  onPress={() => handleTopicSelect(topic)}
                  activeOpacity={topic.isActive ? 0.7 : 1}
                >
                  <View style={[
                    styles.topicCard,
                    selectedTopic?.id === topic.id && styles.selectedTopicCard
                  ]}>
                    <View style={styles.topicContent}>
                      <Text 
                        style={[
                          styles.topicText,
                          selectedTopic?.id === topic.id && styles.selectedTopicText,
                          !topic.isActive && styles.inactiveTopicText
                        ]}
                      >
                        {topic.title}
                      </Text>
                      
                      <Text 
                        style={[
                          styles.topicDescription,
                          !topic.isActive && styles.inactiveTopicText
                        ]}
                      >
                        {topic.description}
                      </Text>
                      
                      {!topic.isActive && (
                        <View style={styles.lockIconContainer}>
                          <FontAwesome5 name="lock" size={16} color="#888" />
                        </View>
                      )}
                      
                      {selectedTopic?.id === topic.id && (
                        <View style={styles.selectedIndicator} />
                      )}
                    </View>
                  </View>
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
              !selectedTopic && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedTopic}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    maxWidth: width * 0.6,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#ffffff',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.9,
  },
  topicsContainer: {
    marginTop: 10,
  },
  topicButton: {
    marginBottom: 20,
    borderRadius: 15,
  },
  selectedTopicButton: {
    transform: [{scale: 1.02}],
  },
  inactiveTopicButton: {
    opacity: 0.6,
  },
  topicCard: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 20,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedTopicCard: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  topicContent: {
    position: 'relative',
  },
  topicText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  selectedTopicText: {
    color: '#0044cc',
  },
  inactiveTopicText: {
    color: '#888',
  },
  topicDescription: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -5,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00c6ff',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 114, 255, 0.2)',
  },
  continueButton: {
    backgroundColor: '#ffffff',
    height: 60,
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledButton: {
    opacity: 0.6,
  },
  continueButtonText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  }
});