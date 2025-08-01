import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function IntermediateLanguageSkillsProgressScreen() {
  const navigation = useNavigation();

  const skills = [
    {
      id: 1,
      name: 'Pronunciation',
      progress: 25,
      exercises: 4,
      completed: 1,
      screen: 'pronunciation/Pronunciation'
    },
    {
      id: 2,
      name: 'Reading Comprehension',
      progress: 0,
      exercises: 4,
      completed: 0,
      screen: 'reading/ReadingComprehension'
    },
    {
      id: 3,
      name: 'Listening',
      progress: 0,
      exercises: 4,
      completed: 0,
      screen: null // Not implemented yet
    },
    {
      id: 4,
      name: 'Speaking',
      progress: 0,
      exercises: 4,
      completed: 0,
      screen: null // Not implemented yet
    }
  ];

  const totalExercises = skills.reduce((sum, skill) => sum + skill.exercises, 0);
  const completedExercises = skills.reduce((sum, skill) => sum + skill.completed, 0);
  const overallProgress = Math.round((completedExercises / totalExercises) * 100);

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
        
        <Text style={styles.headerTitle}>Language Skills Progress</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.overallProgressContainer}>
          <Text style={styles.progressTitle}>Overall Progress</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
          </View>
          <Text style={styles.progressText}>{overallProgress}% Complete</Text>
          <Text style={styles.exerciseCountText}>
            {completedExercises} of {totalExercises} exercises completed
          </Text>
        </View>
        
        <ScrollView 
          style={styles.skillsContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Skills Breakdown</Text>
          
          {skills.map(skill => (
            <TouchableOpacity
              key={skill.id}
              style={styles.skillCard}
              onPress={() => {
                if (skill.screen) {
                  navigation.navigate(skill.screen);
                }
              }}
              disabled={!skill.screen}
            >
              <View style={styles.skillHeader}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <View style={[styles.statusBadge, !skill.screen && styles.comingSoonBadge]}>
                  <Text style={[styles.statusText, !skill.screen && styles.comingSoonText]}>
                    {skill.screen ? `${skill.progress}%` : 'Coming Soon'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.skillProgressBarContainer}>
                <View 
                  style={[
                    styles.skillProgressBar, 
                    { width: `${skill.progress}%` }
                  ]} 
                />
              </View>
              
              <Text style={styles.skillProgressText}>
                {skill.completed} of {skill.exercises} exercises completed
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => navigation.navigate('IntermediateLevelModuleSelectionScreen')}
        >
          <Text style={styles.continueButtonText}>Back to Modules</Text>
        </TouchableOpacity>
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  overallProgressContainer: {
    backgroundColor: '#F5F9FF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 15,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E8F4FF',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0072ff',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  exerciseCountText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 15,
  },
  skillsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  skillCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  statusBadge: {
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadge: {
    backgroundColor: '#F0F0F0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0072ff',
  },
  comingSoonText: {
    color: '#999',
  },
  skillProgressBarContainer: {
    height: 8,
    backgroundColor: '#E8F4FF',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  skillProgressBar: {
    height: '100%',
    backgroundColor: '#0072ff',
    borderRadius: 4,
  },
  skillProgressText: {
    fontSize: 12,
    color: '#666',
  },
  continueButton: {
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});