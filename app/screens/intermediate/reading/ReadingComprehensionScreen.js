import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ReadingComprehensionScreen() {
  const navigation = useNavigation();
  const [selectedText, setSelectedText] = useState(null);
  const [readingTexts, setReadingTexts] = useState([
    {
      id: 1,
      title: 'City Life',
      difficulty: 'Easy',
      wordCount: 250,
      estimatedTime: '5 mins',
      content: 'Cities are bustling centers of activity where millions of people live and work. They offer many opportunities for education, employment, and entertainment. However, city life also comes with challenges like traffic, pollution, and high costs of living.\n\nModern cities feature tall skyscrapers, extensive public transportation systems, and diverse cultural attractions. People from different backgrounds come together, creating vibrant communities with unique traditions and cuisines.\n\nCity dwellers often enjoy convenient access to services, shops, and restaurants within walking distance. Parks and public spaces provide green areas for relaxation and recreation amid the concrete landscape.\n\nWhile some people thrive on the energy and opportunities of urban environments, others find the pace of city life stressful. The constant noise, crowds, and limited personal space can be overwhelming.\n\nDespite these challenges, cities continue to grow as centers of innovation, culture, and economic development. They reflect humanity\'s desire to build communities where ideas, resources, and talents can be shared.',
      quizzes: [
        {
          question: 'What are some challenges of city life mentioned in the text?',
          options: ['Weather', 'Traffic', 'Mountains', 'Rivers'],
          correctAnswer: 'Traffic'
        },
        {
          question: 'Cities offer opportunities for:',
          options: ['Farming', 'Education', 'Isolation', 'Hiking'],
          correctAnswer: 'Education'
        },
        {
          question: 'What do parks provide in cities?',
          options: ['Shopping', 'Green areas', 'Traffic', 'Skyscrapers'],
          correctAnswer: 'Green areas'
        },
        {
          question: 'Why do some people find city life stressful?',
          options: ['Too quiet', 'Noise and crowds', 'Too much nature', 'Low prices'],
          correctAnswer: 'Noise and crowds'
        }
      ]
    },
    {
      id: 2,
      title: 'The Digital Age',
      difficulty: 'Medium',
      wordCount: 350,
      estimatedTime: '7 mins',
      content: 'The digital age has transformed how we live, work, and communicate. Technology has made information more accessible and connected people across the globe. However, it also raises concerns about privacy, security, and the impact of screen time on our health.\n\nComputers, smartphones, and the internet have become essential tools in our daily lives. We use them to stay informed, entertained, and connected with friends and family. Digital platforms enable us to share ideas, collaborate on projects, and access services from anywhere at any time.\n\nSocial media networks have revolutionized personal communication, allowing instant sharing of messages, photos, and videos. While these platforms help maintain relationships across distances, they also create new social dynamics and challenges.\n\nArtificial intelligence and automation are changing industries and creating new types of jobs while making others obsolete. Workers increasingly need digital skills to remain competitive in the job market.\n\nThe rapid pace of technological change presents both opportunities and challenges. Digital literacy has become essential for full participation in society, yet not everyone has equal access to technology or the skills to use it effectively.\n\nAs we navigate this digital landscape, we must balance embracing innovation with addressing concerns about data privacy, digital addiction, and the digital divide. The choices we make today will shape how technology continues to influence our lives in the future.\n\nEducation systems worldwide are adapting to prepare students for this technology-driven world, teaching not just how to use digital tools but also how to evaluate information critically and use technology responsibly.',
      quizzes: [
        {
          question: 'What has the digital age transformed according to the text?',
          options: ['How we eat', 'How we live', 'How we sleep', 'How we exercise'],
          correctAnswer: 'How we live'
        },
        {
          question: 'What concern is mentioned about technology?',
          options: ['Cost', 'Privacy', 'Size', 'Color'],
          correctAnswer: 'Privacy'
        },
        {
          question: 'What has become essential for full participation in society?',
          options: ['Digital literacy', 'Farming skills', 'Athletic ability', 'Cooking knowledge'],
          correctAnswer: 'Digital literacy'
        },
        {
          question: 'What are education systems teaching about technology?',
          options: ['To avoid it', 'To use it responsibly', 'To fear it', 'To build it from scratch'],
          correctAnswer: 'To use it responsibly'
        }
      ]
    },
    {
      id: 3,
      title: 'Environmental Challenges',
      difficulty: 'Medium',
      wordCount: 400,
      estimatedTime: '8 mins',
      content: 'Environmental challenges like climate change, pollution, and resource depletion affect our planet. These issues require global cooperation and individual action. Many people are now adopting sustainable practices to help protect the Earth for future generations.\n\nClimate change is perhaps the most pressing environmental issue of our time. Rising global temperatures are linked to more extreme weather events, rising sea levels, and disruptions to ecosystems worldwide. The burning of fossil fuels for energy and transportation releases greenhouse gases that trap heat in the atmosphere.\n\nPollution takes many forms, including air pollution from industrial emissions and vehicle exhaust, water pollution from chemicals and plastic waste, and soil contamination from pesticides and improper waste disposal. These pollutants harm human health and damage natural habitats.\n\nDeforestation continues at an alarming rate, with forests cleared for agriculture, logging, and development. Trees play a crucial role in absorbing carbon dioxide and providing habitat for countless species. Their loss accelerates climate change and reduces biodiversity.\n\nWater scarcity affects billions of people globally. Overuse, pollution, and changing precipitation patterns due to climate change all contribute to this growing crisis. Access to clean water is fundamental for human health and well-being.\n\nBiodiversity loss is occurring at unprecedented rates as habitats are destroyed and species face threats from pollution, climate change, and direct exploitation. Each species plays a role in its ecosystem, and their loss can have cascading effects on environmental health.\n\nSustainable solutions exist for many of these challenges. Renewable energy sources like solar and wind power can replace fossil fuels. Recycling and reducing consumption help conserve resources. Sustainable agriculture practices can produce food while protecting soil and water quality.\n\nIndividual choices matter. Simple actions like reducing energy use, choosing sustainable products, and supporting environmental policies can collectively make a significant difference. Environmental education helps people understand these complex issues and empowers them to take action.',
      quizzes: [
        {
          question: 'What environmental challenge is mentioned as the most pressing issue of our time?',
          options: ['Climate change', 'Earthquakes', 'Volcanoes', 'Tsunamis'],
          correctAnswer: 'Climate change'
        },
        {
          question: 'What do environmental challenges require according to the text?',
          options: ['Global cooperation', 'New technology only', 'Government action only', 'Nothing can be done'],
          correctAnswer: 'Global cooperation'
        },
        {
          question: 'What role do trees play according to the text?',
          options: ['Absorbing carbon dioxide', 'Creating pollution', 'Causing floods', 'Increasing temperatures'],
          correctAnswer: 'Absorbing carbon dioxide'
        },
        {
          question: 'What is mentioned as a sustainable solution to environmental challenges?',
          options: ['Using more fossil fuels', 'Renewable energy', 'Increasing consumption', 'Reducing recycling'],
          correctAnswer: 'Renewable energy'
        }
      ]
    },
    {
      id: 4,
      title: 'Cultural Diversity',
      difficulty: 'Hard',
      wordCount: 500,
      estimatedTime: '10 mins',
      content: 'Cultural diversity enriches societies through different traditions, languages, arts, and perspectives. Learning about other cultures promotes understanding and respect. In our increasingly connected world, cross-cultural communication skills are becoming more valuable in both personal and professional contexts.\n\nCulture encompasses the shared beliefs, values, customs, behaviors, and artifacts that characterize a group or society. It includes everything from language and religion to food, music, art, and social norms. Culture is dynamic and constantly evolving as people adapt to new circumstances and interact with other cultures.\n\nGlobalization has accelerated cultural exchange through international travel, migration, trade, and digital communication. People now have unprecedented opportunities to experience different cultures without leaving their homes, through films, music, literature, and online communities.\n\nCultural diversity brings many benefits to societies. Exposure to different perspectives encourages creative thinking and innovation. Diverse teams often develop more effective solutions to problems by drawing on a wider range of experiences and viewpoints. Cultural exchanges have historically led to advances in science, art, medicine, and technology.\n\nHowever, cultural differences can also lead to misunderstandings and conflicts when people interpret others\' actions through their own cultural lens. Ethnocentrism—the tendency to view one\'s own culture as superior—can create barriers to mutual respect and cooperation.\n\nCultural intelligence involves recognizing and adapting to cultural differences while maintaining respect for diverse values and practices. This skill helps people navigate multicultural environments effectively and build meaningful relationships across cultural boundaries.\n\nPreserving cultural heritage while embracing change presents a challenge in many societies. Indigenous languages and traditional practices are disappearing as younger generations adopt mainstream cultures. At the same time, cultures must evolve to remain relevant in changing circumstances.\n\nCultural appropriation versus appreciation raises complex questions about the respectful adoption of elements from other cultures. The line between honoring another culture and exploiting it can be difficult to define and varies across contexts.\n\nEducation plays a crucial role in promoting cultural understanding. Multicultural education helps students develop empathy, critical thinking, and communication skills needed in diverse societies. Learning about different cultural perspectives encourages students to question assumptions and broaden their worldview.\n\nIn workplaces, cultural diversity management has become an important aspect of organizational success. Companies with inclusive cultures that value diverse perspectives often show higher employee engagement, creativity, and adaptability to changing markets.\n\nUltimately, embracing cultural diversity while recognizing our common humanity allows societies to benefit from different traditions and perspectives while building cohesion around shared values and goals.',
      quizzes: [
        {
          question: 'How does cultural diversity enrich societies according to the text?',
          options: ['Through different traditions', 'Through uniformity', 'Through isolation', 'Through competition'],
          correctAnswer: 'Through different traditions'
        },
        {
          question: 'What skills are becoming more valuable in our connected world?',
          options: ['Cross-cultural communication', 'Isolation skills', 'Avoiding diversity', 'Cultural separation'],
          correctAnswer: 'Cross-cultural communication'
        },
        {
          question: 'What can cultural differences lead to when people interpret actions through their own cultural lens?',
          options: ['Instant understanding', 'Misunderstandings', 'Perfect harmony', 'Economic growth'],
          correctAnswer: 'Misunderstandings'
        },
        {
          question: 'What do companies with inclusive cultures often show?',
          options: ['Lower profits', 'Higher employee engagement', 'Less innovation', 'Reduced market share'],
          correctAnswer: 'Higher employee engagement'
        },
        {
          question: 'What is ethnocentrism according to the text?',
          options: ['Respecting all cultures', 'Viewing one\'s own culture as superior', 'Learning multiple languages', 'Traveling internationally'],
          correctAnswer: 'Viewing one\'s own culture as superior'
        }
      ]
    }
  ]);
  
  const [showTextPreview, setShowTextPreview] = useState(false);
  const [previewText, setPreviewText] = useState(null);

  // Load saved reading texts
  useEffect(() => {
    const loadSavedTexts = async () => {
      try {
        const savedTexts = await AsyncStorage.getItem('userReadingTexts');
        if (savedTexts) {
          const parsedTexts = JSON.parse(savedTexts);
          setReadingTexts(prevTexts => {
            // Keep default texts and add user texts
            const defaultIds = prevTexts.map(text => text.id);
            const uniqueUserTexts = parsedTexts.filter(text => !defaultIds.includes(text.id));
            return [...prevTexts, ...uniqueUserTexts];
          });
        }
      } catch (error) {
        console.log('Error loading saved texts:', error);
      }
    };
    
    loadSavedTexts();
  }, []);

  const handleTextSelect = (text) => {
    setSelectedText(text);
  };

  const handlePreviewText = (text) => {
    setPreviewText(text);
    setShowTextPreview(true);
  };

  const renderTextDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'Easy':
        return '#4CAF50'; // Green
      case 'Medium':
        return '#FF9800'; // Orange
      case 'Hard':
        return '#F44336'; // Red
      default:
        return '#0072ff'; // Blue
    }
  };

  const renderTextPreview = () => {
    if (!previewText) return null;
    
    // Show first 150 characters of the content
    const previewContent = previewText.content.substring(0, 150) + '...';
    
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTextPreview}
        onRequestClose={() => setShowTextPreview(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.previewModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{previewText.title}</Text>
              <TouchableOpacity onPress={() => setShowTextPreview(false)}>
                <Ionicons name="close-circle" size={24} color="#0072ff" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.previewMetaContainer}>
              <View style={[styles.difficultyBadge, { backgroundColor: `${renderTextDifficultyColor(previewText.difficulty)}20` }]}>
                <Text style={[styles.difficultyText, { color: renderTextDifficultyColor(previewText.difficulty) }]}>
                  {previewText.difficulty}
                </Text>
              </View>
              <Text style={styles.previewMeta}>
                {previewText.wordCount} words • {previewText.estimatedTime}
              </Text>
            </View>
            
            <ScrollView style={styles.previewContentScroll}>
              <Text style={styles.previewContentText}>
                {previewContent}
              </Text>
            </ScrollView>
            
            <View style={styles.previewQuizInfo}>
              <Ionicons name="help-circle-outline" size={20} color="#0072ff" />
              <Text style={styles.previewQuizText}>
                {previewText.quizzes ? previewText.quizzes.length : 0} quiz questions
              </Text>
            </View>
            
            <TouchableOpacity 
              style={styles.startPreviewButton}
              onPress={() => {
                setShowTextPreview(false);
                setSelectedText(previewText);
                // Optional: auto-start reading after preview
                // navigation.navigate('IntermediateReadingExerciseScreen', {
                //   textId: previewText.id,
                //   textData: previewText
                // });
              }}
            >
              <Text style={styles.startPreviewButtonText}>Select This Text</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
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
        
        <Text style={styles.headerTitle}>Reading Comprehension</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subtitle}>Practice reading and understanding paragraphs</Text>
        
        <View style={styles.toolbarContainer}>
          <Text style={styles.sectionTitle}>Select a Reading Text</Text>
          <TouchableOpacity 
            style={styles.progressButton}
            onPress={() => navigation.navigate('ReadingProgressScreen')}
          >
            <Ionicons name="stats-chart" size={22} color="#0072ff" />
            <Text style={styles.progressButtonText}>Progress</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.textsContainer}
          showsVerticalScrollIndicator={false}
        >
          {readingTexts.map(text => (
            <TouchableOpacity
              key={text.id}
              style={[
                styles.textCard,
                selectedText?.id === text.id && styles.selectedTextCard
              ]}
              onPress={() => handleTextSelect(text)}
              activeOpacity={0.7}
            >
              <View style={[styles.textIconContainer, { backgroundColor: `${renderTextDifficultyColor(text.difficulty)}15` }]}>
                <Ionicons name="book" size={24} color={renderTextDifficultyColor(text.difficulty)} />
              </View>
              <View style={styles.textInfoContainer}>
                <Text style={styles.textTitle}>{text.title}</Text>
                <View style={styles.textMetaContainer}>
                  <View style={[styles.difficultyBadge, { backgroundColor: `${renderTextDifficultyColor(text.difficulty)}20` }]}>
                    <Text style={[styles.difficultyText, { color: renderTextDifficultyColor(text.difficulty) }]}>
                      {text.difficulty}
                    </Text>
                  </View>
                  <Text style={styles.textMeta}>{text.wordCount} words • {text.estimatedTime}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.previewButton}
                onPress={() => handlePreviewText(text)}
              >
                <Ionicons name="eye-outline" size={22} color="#0072ff" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <TouchableOpacity 
          style={[
            styles.startButton,
            !selectedText && styles.disabledButton
          ]}
          disabled={!selectedText}
          onPress={() => {
            if (selectedText) {
              // Navigate to reading exercise screen
              navigation.navigate('IntermediateReadingExerciseScreen', {
                textId: selectedText.id,
                textData: selectedText
              });
            }
          }}
        >
          <Text style={styles.startButtonText}>
            {selectedText ? 'Start Reading' : 'Select a Text'}
          </Text>
        </TouchableOpacity>
      </View>

      {renderTextPreview()}
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
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
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
  toolbarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  progressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  progressButtonText: {
    color: '#0072ff',
    fontWeight: '600',
    marginLeft: 5,
  },
  textsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  textCard: {
    flexDirection: 'row',
    backgroundColor: '#F5F9FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  selectedTextCard: {
    backgroundColor: '#E8F4FF',
    borderLeftColor: '#0072ff',
  },
  textIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textInfoContainer: {
    flex: 1,
  },
  textTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  textMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 10,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textMeta: {
    fontSize: 12,
    color: '#666',
  },
  previewButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E8F4FF',
  },
  startButton: {
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
  disabledButton: {
    backgroundColor: '#9999CC',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 20,
  },
  previewModalContent: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  previewMetaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  previewMeta: {
    fontSize: 14,
    color: '#666',
  },
  previewContentScroll: {
    maxHeight: 200,
    backgroundColor: '#F5F9FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  previewContentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  previewQuizInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  previewQuizText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#0072ff',
    fontWeight: '500',
  },
  startPreviewButton: {
    backgroundColor: '#0072ff',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startPreviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});