import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  Image, 
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function QuestionScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));
  
  // Define options first
  const options = [
    "Basic Level",
    "Intermediate Level",
    "Advanced Level",
  ];
  
  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [optionsAnim] = useState(options.map(() => new Animated.Value(0)));

  useEffect(() => {
    // Animate title and image
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate options sequentially
    optionsAnim.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 400,
        delay: 600 + (index * 150),
        useNativeDriver: true,
      }).start();
    });
  }, []);

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

  const handleContinue = () => {
    if (selectedOption === "Basic Level") {
      navigation.navigate('BasicLevelInfoScreen');
    } 
    else if (selectedOption === "Intermediate Level") {
      navigation.navigate('IntermediateLevelInfoScreen');
    }
    else if (selectedOption === "Advanced Level") {
      navigation.navigate('Qs');
    }
    else {
      navigation.navigate('AlphabetScreen');
    }
  };

  return (
    <LinearGradient
      colors={["#00c6ff", "#0072ff"]}
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

      {/* Profile Settings Button */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("ProfileSettingsScreen")}
      >
        <MaterialIcons name="person" size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        {/* Image */}
        <Animated.View 
          style={[
            styles.imageContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Image 
            source={require('../../assets/3.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Question Text */}
        <Animated.Text 
          style={[
            styles.questionText,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          How well do you know English? (selected language)
        </Animated.Text>
        
        {/* Options List */}
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <Animated.View 
              key={index}
              style={{ 
                width: '100%',
                opacity: optionsAnim[index],
                transform: [{ 
                  translateY: optionsAnim[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }}
            >
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  selectedOption === option && styles.selectedOption,
                ]}
                onPress={() => {
                  setSelectedOption(option);
                }}
                activeOpacity={0.8}
              >
                <Text 
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      {/* Continue Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: animationValue }]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            !selectedOption && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedOption}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          >
            <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    marginTop: 20,
  },
  imageContainer: {
    width: width * 0.6,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  questionText: {
    fontSize: width > 380 ? 28 : 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  selectedOption: {
    backgroundColor: '#e3f2fd',
    borderColor: '#1976D2',
    borderWidth: 2,
  },
  optionText: {
    fontSize: width > 380 ? 18 : 16,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#0D47A1',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: width * 0.08,
    marginTop: 20,
  },
  button: {
    width: '80%',
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
  },
  buttonText: {
    color: '#0072ff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 5,
  },
});