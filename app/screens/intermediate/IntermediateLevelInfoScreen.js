import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntermediateLevelInfoScreen() {
  const navigation = useNavigation();

  const handleStartLearning = () => {
    navigation.navigate('IntermediateLevelModuleSelectionScreen');
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
          <Image 
            source={require('../../../assets/items/character.png')} 
            style={styles.characterImage}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.welcomeText}>Great to see you, Mate!</Text>
        
        <Text style={styles.descriptionText}>
          This is designed for learners who already have a basic understanding of English. 
          You'll expand your knowledge with more complex topics:
        </Text>

        <View style={styles.topicContainer}>
          <View style={styles.topicIconContainer}>
            <Ionicons name="book" size={32} color="#0072ff" />
          </View>
          <View style={styles.topicTextContainer}>
            <Text style={styles.topicTitle}>Tenses and Conditionals</Text>
            <Text style={styles.topicDescription}>
              Grammar Tenses, Conditionals, and Sentences for Natural Expressions.
            </Text>
          </View>
        </View>

        <View style={styles.topicContainer}>
          <View style={styles.topicIconContainer}>
            <Ionicons name="chatbubbles" size={32} color="#0072ff" />
          </View>
          <View style={styles.topicTextContainer}>
            <Text style={styles.topicTitle}>Conversation Skills</Text>
            <Text style={styles.topicDescription}>
              Idioms, Expressions, and Practice everyday conversations.
            </Text>
          </View>
        </View>

        <View style={styles.topicContainer}>
          <View style={styles.topicIconContainer}>
            <Ionicons name="text" size={32} color="#0072ff" />
          </View>
          <View style={styles.topicTextContainer}>
            <Text style={styles.topicTitle}>Words and Phrases</Text>
            <Text style={styles.topicDescription}>
              Improve your vocabulary with useful words and phrases for better communication.
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.startButton}
        onPress={handleStartLearning}
      >
        <Text style={styles.startButtonText}>Start Learning</Text>
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
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    maxWidth: '70%',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  characterContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  characterImage: {
    width: 180,
    height: 180,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  topicContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  topicIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  topicTextContainer: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  topicDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: '#fff',
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
  startButtonText: {
    color: '#0072ff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});