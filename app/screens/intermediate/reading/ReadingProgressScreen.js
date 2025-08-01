import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ReadingProgressScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState({});
  const [readingTexts, setReadingTexts] = useState([]);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    highestScore: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load progress data
        const progressString = await AsyncStorage.getItem('readingProgress');
        const progress = progressString ? JSON.parse(progressString) : {};
        setProgressData(progress);
        
        // Load reading texts
        const savedTextsString = await AsyncStorage.getItem('userReadingTexts');
        const defaultTexts = [
          { id: 1, title: 'City Life' },
          { id: 2, title: 'The Digital Age' },
          { id: 3, title: 'Environmental Challenges' },
          { id: 4, title: 'Cultural Diversity' }
        ];
        
        let allTexts = [...defaultTexts];
        
        if (savedTextsString) {
          const userTexts = JSON.parse(savedTextsString);
          allTexts = [...allTexts, ...userTexts];
        }
        
        setReadingTexts(allTexts);
        
        // Calculate statistics
        calculateStats(progress, allTexts);
        
        setLoading(false);
      } catch (error) {
        console.log('Error loading data:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const calculateStats = (progress, texts) => {
    const completedTexts = Object.keys(progress).filter(id => progress[id].completed);
    const totalCompleted = completedTexts.length;
    
    if (totalCompleted === 0) {
      setStats({
        totalCompleted: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        highestScore: 0
      });
      return;
    }
    
    let totalScore = 0;
    let totalTime = 0;
    let highestScore = 0;
    
    completedTexts.forEach(id => {
      const textProgress = progress[id];
      totalScore += textProgress.score;
      totalTime += textProgress.timeSpent || 0;
      
      if (textProgress.score > highestScore) {
        highestScore = textProgress.score;
      }
    });
    
    setStats({
      totalCompleted,
      averageScore: Math.round(totalScore / totalCompleted),
      totalTimeSpent: totalTime,
      highestScore
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getTextTitle = (id) => {
    const text = readingTexts.find(text => text.id.toString() === id.toString());
    return text ? text.title : 'Unknown Text';
  };

  const renderProgressItem = (id, data) => {
    const textTitle = getTextTitle(id);
    const date = new Date(data.date);
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    
    return (
      <View key={id} style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>{textTitle}</Text>
          <View style={[
            styles.scoreBadge,
            data.score >= 80 ? styles.highScore : 
            data.score >= 60 ? styles.mediumScore : styles.lowScore
          ]}>
            <Text style={styles.scoreText}>{data.score}%</Text>
          </View>
        </View>
        
        <View style={styles.progressDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formattedDate}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatTime(data.timeSpent || 0)}</Text>
          </View>
        </View>
        
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${data.score}%` },
              data.score >= 80 ? styles.highScoreFill : 
              data.score >= 60 ? styles.mediumScoreFill : styles.lowScoreFill
            ]}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0072ff" />
        <Text style={styles.loadingText}>Loading progress data...</Text>
      </View>
    );
  }

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
        
        <Text style={styles.headerTitle}>Reading Progress</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statsContainer}>
            <Text style={styles.sectionTitle}>Your Statistics</Text>
            
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.totalCompleted}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.averageScore}%</Text>
                <Text style={styles.statLabel}>Avg. Score</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</Text>
                <Text style={styles.statLabel}>Time Spent</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{stats.highestScore}%</Text>
                <Text style={styles.statLabel}>Best Score</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.sectionTitle}>Reading History</Text>
            
            {Object.keys(progressData).length > 0 ? (
              Object.keys(progressData)
                .sort((a, b) => new Date(progressData[b].date) - new Date(progressData[a].date))
                .map(id => renderProgressItem(id, progressData[id]))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="book-outline" size={48} color="#ccc" />
                <Text style={styles.emptyStateText}>No reading exercises completed yet</Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => navigation.navigate('ReadingComprehensionScreen')}
                >
                  <Text style={styles.startButtonText}>Start Reading</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Reading Tips</Text>
            
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons name="bulb-outline" size={24} color="#0072ff" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Active Reading</Text>
                <Text style={styles.tipText}>
                  Highlight key words and phrases as you read to improve comprehension and retention.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons name="help-circle-outline" size={24} color="#0072ff" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Ask Questions</Text>
                <Text style={styles.tipText}>
                  Form questions about the text as you read to engage more deeply with the content.
                </Text>
              </View>
            </View>
            
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons name="repeat-outline" size={24} color="#0072ff" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Regular Practice</Text>
                <Text style={styles.tipText}>
                  Read for at least 15 minutes daily to improve your reading speed and comprehension.
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#0072ff',
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 25,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 15,
  },
  
  // Stats section
  statsContainer: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  
  // Progress section
  progressContainer: {
    marginBottom: 25,
  },
  progressItem: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    minWidth: 50,
    alignItems: 'center',
  },
  highScore: {
    backgroundColor: '#e6f7e6',
  },
  mediumScore: {
    backgroundColor: '#fff5e6',
  },
  lowScore: {
    backgroundColor: '#ffe6e6',
  },
  scoreText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  progressDetails: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  highScoreFill: {
    backgroundColor: '#4caf50',
  },
  mediumScoreFill: {
    backgroundColor: '#ff9800',
  },
  lowScoreFill: {
    backgroundColor: '#f44336',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#0072ff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Tips section
  tipsContainer: {
    marginBottom: 30,
  },
  tipCard: {
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  }
}); 