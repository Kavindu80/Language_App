import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch, Alert, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../core/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ProfileSettingsScreen = ({ navigation }) => {
  // State for user profile settings
  const [name, setName] = useState('User Name');
  const [email, setEmail] = useState('user@example.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [languagePreference, setLanguagePreference] = useState('English');
  const [learningLevel, setLearningLevel] = useState('Intermediate');
  const [learningStreak, setLearningStreak] = useState(7);
  const [completedLessons, setCompletedLessons] = useState(42);

  // Toggle switch handlers
  const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
  const toggleSound = () => setSoundEnabled(previousState => !previousState);
  const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            // Clear user session data
            // AsyncStorage.removeItem('userToken');
            navigation.reset({
              index: 0,
              routes: [{ name: 'StartScreen' }],
            });
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Language selection handler
  const handleLanguageSelect = () => {
    navigation.navigate('LanguageSelectionScreen');
  };

  return (
    <LinearGradient
      colors={['#00c6ff', '#0072ff']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#00c6ff" />
      
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Profile Settings</Text>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={require('../../assets/character.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileBadge}>
              <MaterialIcons name="stars" size={18} color="#FFD700" />
            </View>
          </View>
          
          <Text style={styles.profileName}>{name}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learningLevel}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{learningStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Learning Progress */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Learning Progress</Text>
          
          {/* Learning Goals */}
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('GoalsScreen')}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="flag" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Learning Goals</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>
          
          {/* Progress Stats */}
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('OverallProgressScreen')}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="insert-chart" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Progress Statistics</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>
          
          {/* Achievements */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="emoji-events" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Achievements</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>
        </View>
        
        {/* Settings Sections */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          {/* Notifications */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={notificationsEnabled ? '#0072ff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>

          {/* Sound */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="volume-up" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Sound</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={soundEnabled ? '#0072ff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSound}
              value={soundEnabled}
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="brightness-4" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Dark Mode</Text>
            </View>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={darkModeEnabled ? '#0072ff' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDarkMode}
              value={darkModeEnabled}
            />
          </View>

          {/* Language */}
          <TouchableOpacity style={styles.settingItem} onPress={handleLanguageSelect}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="language" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.settingAction}>
              <Text style={styles.settingValue}>{languagePreference}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {/* Change Password */}
          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ResetPasswordScreen')}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="lock" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="privacy-tip" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="description" size={24} color="#0072ff" />
              <Text style={styles.settingText}>Terms of Service</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#0072ff" />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialIcons name="logout" size={24} color="#fff" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 40 : 60,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#0072ff',
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0072ff',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  editButton: {
    backgroundColor: '#0072ff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 2,
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsSection: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
  settingAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff3b30',
    padding: 12,
    borderRadius: 10,
    marginTop: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  appInfo: {
    alignItems: 'center',
    marginVertical: 20,
  },
  appVersion: {
    fontSize: 14,
    color: '#888',
  },
});

export default ProfileSettingsScreen;