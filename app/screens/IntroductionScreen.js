import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  Dimensions,
  StatusBar 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function IntroductionScreen({ navigation }) {
  // Animation values
  const [fadeAnim] = React.useState(new Animated.Value(0));
  const [slideAnim] = React.useState(new Animated.Value(30));
  const [buttonAnim] = React.useState(new Animated.Value(0));
  const [nameAnim] = React.useState(new Animated.Value(0));

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // First animate the content
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
      ]),
      // Then animate the name with a bounce effect
      Animated.spring(nameAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      // Then animate the button
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

      {/* Character Image */}
      <Animated.View 
        style={[
          styles.characterContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }
            ]
          }
        ]}
      >
        <Image
          source={require("../../assets/2.png")}
          style={styles.characterImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Text Content */}
      <Animated.View 
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.greeting}>
          Hi there! I'm{' '}
          <Animated.Text 
            style={[
              styles.name,
              {
                opacity: nameAnim,
                transform: [
                  { scale: nameAnim }
                ]
              }
            ]}
          >
            Name
          </Animated.Text>
        </Text>
      </Animated.View>

      {/* Continue Button */}
      <Animated.View 
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnim,
            transform: [
              { translateY: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("QuestionsIntroScreen")}
        >
          <View style={styles.buttonGradient}>
            <Text style={styles.buttonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color="#0072ff" style={styles.buttonIcon} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
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
    top: 40,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    width: width * 0.7,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.05,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: height * 0.05,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFEB3B',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButton: {
    width: width * 0.7,
    height: 56,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    color: '#0072ff',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  buttonIcon: {
    marginLeft: 5,
  },
});