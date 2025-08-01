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
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ModuleTwoTopicsScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [buttonScale] = useState(new Animated.Value(1));

  // Topics in Module 2
  const topics = [
    {
      id: 1,
      title: 'Simple Greetings',
      screen: 'SimpleGreetingsScreen',
      description: 'Basic greetings and introductions',
      isActive: true
    },
    {
      id: 2,
      title: 'Feelings and Appearance',
      screen: 'EmotionsDescriptionsScreen',
      description: 'Emotions and faces of people or things',
      isActive: true
    },
    {
      id: 3,
      title: 'Basic Questions',
      screen: 'BasicQuestionsScreen',
      description: 'Learn to ask and answer simple questions',
      isActive: false
    },
    {
      id: 4,
      title: 'Daily Conversations',
      screen: 'DailyConversationsScreen',
      description: 'Common phrases for everyday situations',
      isActive: false
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
        navigation.navigate(selectedTopic.screen);
      }
    });
  };

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
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
        
        <Text style={styles.headerTitle}>Module 2: Conversation Skills</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile")}
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
            Conversation skills and vocabulary
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
                  <LinearGradient
                    colors={
                      !topic.isActive ? ['#e0e0e0', '#c0c0c0'] :
                      selectedTopic?.id === topic.id ? 
                      ['#bbdefb', '#90caf9'] : 
                      ['#f5f9ff', '#e3f2fd']
                    }
                    style={styles.gradientCard}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
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
              !selectedTopic && styles.disabledButton
            ]}
            onPress={handleContinue}
            disabled={!selectedTopic}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!selectedTopic ? ['#90caf9', '#64b5f6'] : ['#0044ff', '#0072ff']}
              style={styles.gradientButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <FontAwesome5 name="arrow-right" size={16} color="white" style={styles.buttonIcon} />
            </LinearGradient>
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
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: "#fff",
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
  topicsContainer: {
    marginBottom: 20,
  },
  topicButton: {
    borderRadius: 15,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  selectedTopicButton: {
    shadowColor: '#0072ff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  inactiveTopicButton: {
    opacity: 0.7,
  },
  gradientCard: {
    borderRadius: 15,
    padding: 2,
  },
  topicContent: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 13,
    position: 'relative',
  },
  topicText: {
    fontSize: 18,
    color: '#0072ff',
    fontWeight: '600',
    marginBottom: 6,
  },
  selectedTopicText: {
    color: '#0051cb',
    fontWeight: '700',
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
    right: 16,
    top: '50%',
    marginTop: -8,
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
    width: '100%',
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  disabledButton: {
    opacity: 0.8,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});