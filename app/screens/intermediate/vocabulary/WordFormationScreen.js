import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  Animated,
  StatusBar,
  FlatList,
  Modal,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function WordFormationScreen() {
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [activeTab, setActiveTab] = useState('prefixes');
  
  // New state variables for interactive features
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('learn');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [practiceInput, setPracticeInput] = useState('');

  // Word formation data
  const wordFormationData = {
    prefixes: [
      {
        id: 1,
        prefix: 're-',
        meaning: 'again or back',
        level: 'beginner',
        usage: 'Used to indicate repetition or return to a previous state',
        examples: [
          { word: 'rewrite', definition: 'to write again', sentence: 'I had to rewrite my essay after losing the first draft.' },
          { word: 'return', definition: 'to come back', sentence: 'Please return the book to the library by Friday.' },
          { word: 'rebuild', definition: 'to build again', sentence: 'They plan to rebuild the old theater next year.' },
          { word: 'rethink', definition: 'to think again about a decision', sentence: 'You might want to rethink your travel plans due to the weather forecast.' },
        ]
      },
      {
        id: 2,
        prefix: 'un-',
        meaning: 'not or opposite of',
        level: 'beginner',
        usage: 'Used to negate or reverse the meaning of a word',
        examples: [
          { word: 'unhappy', definition: 'not happy', sentence: 'She looked unhappy when she received the news.' },
          { word: 'unlock', definition: 'to open something that was locked', sentence: 'Can you unlock the door for me?' },
          { word: 'unfair', definition: 'not fair', sentence: 'The referee made an unfair decision during the match.' },
          { word: 'uncover', definition: 'to remove a cover from something', sentence: 'The investigation helped uncover the truth.' },
        ]
      },
      {
        id: 3,
        prefix: 'dis-',
        meaning: 'not or opposite of',
        level: 'intermediate',
        usage: 'Used to express negation, reversal, or removal',
        examples: [
          { word: 'disagree', definition: 'to not agree', sentence: 'We disagree on how to solve this problem.' },
          { word: 'disappear', definition: 'to not appear, to vanish', sentence: 'The rabbit disappeared into the magician\'s hat.' },
          { word: 'disconnect', definition: 'to break a connection', sentence: 'Remember to disconnect all appliances before leaving.' },
          { word: 'discomfort', definition: 'lack of comfort', sentence: 'The new shoes caused some discomfort at first.' },
        ]
      },
      {
        id: 4,
        prefix: 'pre-',
        meaning: 'before',
        level: 'intermediate',
        usage: 'Used to indicate something happening before a specified time or action',
        examples: [
          { word: 'preview', definition: 'to view before others', sentence: 'We got to preview the movie before its official release.' },
          { word: 'prepare', definition: 'to make ready beforehand', sentence: 'It\'s important to prepare for your interview.' },
          { word: 'predict', definition: 'to say what will happen before it does', sentence: 'The meteorologist tried to predict the weather for the weekend.' },
          { word: 'pretest', definition: 'a test given before instruction', sentence: 'Students took a pretest to assess their knowledge.' },
        ]
      },
      {
        id: 5,
        prefix: 'mis-',
        meaning: 'wrongly or badly',
        level: 'intermediate',
        usage: 'Used to indicate that something is done incorrectly or improperly',
        examples: [
          { word: 'misunderstand', definition: 'to understand incorrectly', sentence: 'I think you misunderstood what I was trying to say.' },
          { word: 'misspell', definition: 'to spell incorrectly', sentence: 'People often misspell my last name.' },
          { word: 'misplace', definition: 'to put something in the wrong place', sentence: 'I misplaced my keys again this morning.' },
          { word: 'mislead', definition: 'to lead in the wrong direction', sentence: 'The advertisement was designed to mislead consumers.' },
        ]
      },
      {
        id: 6,
        prefix: 'over-',
        meaning: 'too much or above',
        level: 'intermediate',
        usage: 'Used to indicate excess or something being above or beyond normal',
        examples: [
          { word: 'overeat', definition: 'to eat too much', sentence: 'It\'s easy to overeat during holiday celebrations.' },
          { word: 'overwork', definition: 'to work too hard', sentence: 'Don\'t overwork yourself before the vacation.' },
          { word: 'overcome', definition: 'to successfully deal with a problem', sentence: 'She overcame her fear of public speaking.' },
          { word: 'overlook', definition: 'to fail to notice something', sentence: 'Don\'t overlook the details in the contract.' },
        ]
      },
      {
        id: 7,
        prefix: 'in-/im-',
        meaning: 'not or into',
        level: 'intermediate',
        usage: 'Used to negate an adjective or indicate movement into something',
        examples: [
          { word: 'invisible', definition: 'not visible', sentence: 'The ink was almost invisible on the light paper.' },
          { word: 'impossible', definition: 'not possible', sentence: 'It\'s impossible to be in two places at once.' },
          { word: 'incorrect', definition: 'not correct', sentence: 'His answer was incorrect on the test.' },
          { word: 'insert', definition: 'to put into', sentence: 'Please insert your card into the ATM.' },
        ]
      },
      {
        id: 8,
        prefix: 'co-',
        meaning: 'together or with',
        level: 'beginner',
        usage: 'Used to indicate partnership or joint action',
        examples: [
          { word: 'cooperate', definition: 'to work together', sentence: 'The two companies agreed to cooperate on the project.' },
          { word: 'coworker', definition: 'someone you work with', sentence: 'My coworker helped me finish the report on time.' },
          { word: 'coexist', definition: 'to exist together', sentence: 'Different species coexist in this ecosystem.' },
          { word: 'coordinate', definition: 'to bring together in harmony', sentence: 'She coordinates all the activities for the department.' },
        ]
      },
      {
        id: 9,
        prefix: 'de-',
        meaning: 'remove, reduce, or reverse',
        level: 'intermediate',
        usage: 'Used to indicate removal, reduction, or reversal of something',
        examples: [
          { word: 'defrost', definition: 'to remove frost', sentence: 'I need to defrost the chicken before cooking it.' },
          { word: 'devalue', definition: 'to reduce the value of', sentence: 'The currency was devalued by 10% last month.' },
          { word: 'decode', definition: 'to convert from a code to plain text', sentence: 'The spy was able to decode the secret message.' },
          { word: 'dehydrate', definition: 'to remove water from', sentence: 'Hikers often carry dehydrated food to save weight.' },
        ]
      },
      {
        id: 10,
        prefix: 'en-/em-',
        meaning: 'cause to be or put into',
        level: 'intermediate',
        usage: 'Used to form verbs that express causing a state or putting into something',
        examples: [
          { word: 'enable', definition: 'to make able', sentence: 'The scholarship will enable her to attend college.' },
          { word: 'encourage', definition: 'to give courage to', sentence: 'Parents should encourage their children to read.' },
          { word: 'enrich', definition: 'to make rich', sentence: 'Travel can enrich your understanding of different cultures.' },
          { word: 'empower', definition: 'to give power to', sentence: 'Education empowers people to make better choices.' },
        ]
      },
      {
        id: 11,
        prefix: 'inter-',
        meaning: 'between or among',
        level: 'intermediate',
        usage: 'Used to indicate something occurring between multiple entities',
        examples: [
          { word: 'international', definition: 'between nations', sentence: 'The international conference brought together experts from around the world.' },
          { word: 'interact', definition: 'to act upon one another', sentence: 'Students should interact with each other during group work.' },
          { word: 'interconnect', definition: 'to connect with each other', sentence: 'All the computers are interconnected in a network.' },
          { word: 'intervene', definition: 'to come between', sentence: 'The teacher had to intervene in the argument between students.' },
        ]
      },
      {
        id: 12,
        prefix: 'anti-',
        meaning: 'against or opposing',
        level: 'beginner',
        usage: 'Used to indicate opposition or prevention',
        examples: [
          { word: 'antifreeze', definition: 'preventing freezing', sentence: 'Don\'t forget to add antifreeze to your car before winter.' },
          { word: 'antisocial', definition: 'against social norms', sentence: 'His antisocial behavior made others uncomfortable at the party.' },
          { word: 'antibacterial', definition: 'destroying bacteria', sentence: 'This soap has antibacterial properties.' },
          { word: 'antivirus', definition: 'against viruses', sentence: 'Make sure your antivirus software is up to date.' },
        ]
      },
      {
        id: 13,
        prefix: 'sub-',
        meaning: 'under or below',
        level: 'intermediate',
        usage: 'Used to indicate position beneath something or a subordinate status',
        examples: [
          { word: 'submarine', definition: 'a vessel that operates underwater', sentence: 'The submarine can stay underwater for months.' },
          { word: 'subway', definition: 'an underground railway', sentence: 'I take the subway to work every day.' },
          { word: 'subheading', definition: 'a heading below the main heading', sentence: 'Each chapter has a title and several subheadings.' },
          { word: 'subordinate', definition: 'lower in rank or position', sentence: 'The manager delegates tasks to his subordinates.' },
        ]
      },
      {
        id: 14,
        prefix: 'super-',
        meaning: 'above, beyond, or greater',
        level: 'beginner',
        usage: 'Used to indicate something that is above or beyond the norm',
        examples: [
          { word: 'superhuman', definition: 'beyond normal human capability', sentence: 'The athlete showed superhuman strength during the competition.' },
          { word: 'supermarket', definition: 'a large self-service store', sentence: 'I need to go to the supermarket to buy groceries.' },
          { word: 'supernatural', definition: 'beyond what is natural', sentence: 'The movie is about supernatural phenomena.' },
          { word: 'supervise', definition: 'to oversee or direct', sentence: 'She was hired to supervise the new employees.' },
        ]
      },
      {
        id: 15,
        prefix: 'non-',
        meaning: 'not or absence of',
        level: 'beginner',
        usage: 'Used to indicate negation or absence of something',
        examples: [
          { word: 'nonstop', definition: 'without stopping', sentence: 'We took a nonstop flight to Paris.' },
          { word: 'nonsense', definition: 'without sense or meaning', sentence: 'What he said was complete nonsense.' },
          { word: 'nonverbal', definition: 'not involving words', sentence: 'Facial expressions are a form of nonverbal communication.' },
          { word: 'nonprofit', definition: 'not making profit', sentence: 'She works for a nonprofit organization that helps homeless people.' },
        ]
      },
      {
        id: 16,
        prefix: 'bi-',
        meaning: 'two or twice',
        level: 'intermediate',
        usage: 'Used to indicate two or occurring twice',
        examples: [
          { word: 'bilingual', definition: 'speaking two languages', sentence: 'Being bilingual can improve your job prospects.' },
          { word: 'biannual', definition: 'occurring twice a year', sentence: 'The company holds biannual meetings in January and July.' },
          { word: 'bicycle', definition: 'a vehicle with two wheels', sentence: 'Riding a bicycle is good exercise.' },
          { word: 'bilateral', definition: 'involving two sides', sentence: 'The countries signed a bilateral trade agreement.' },
        ]
      },
      {
        id: 17,
        prefix: 'ex-',
        meaning: 'former or out of',
        level: 'beginner',
        usage: 'Used to indicate something that was but is no longer',
        examples: [
          { word: 'ex-president', definition: 'former president', sentence: 'The ex-president still gives speeches occasionally.' },
          { word: 'exhale', definition: 'to breathe out', sentence: 'Inhale deeply, then slowly exhale.' },
          { word: 'extract', definition: 'to take out or remove', sentence: 'The dentist had to extract two of my teeth.' },
          { word: 'ex-wife', definition: 'former wife', sentence: 'He remains on good terms with his ex-wife.' },
        ]
      },
      {
        id: 18,
        prefix: 'post-',
        meaning: 'after or behind',
        level: 'intermediate',
        usage: 'Used to indicate something that comes after in time or sequence',
        examples: [
          { word: 'postwar', definition: 'after a war', sentence: 'The country experienced rapid growth during the postwar period.' },
          { word: 'postpone', definition: 'to put off to a later time', sentence: 'We had to postpone the meeting due to bad weather.' },
          { word: 'postgraduate', definition: 'after graduating from college', sentence: 'She\'s pursuing postgraduate studies in biology.' },
          { word: 'postscript', definition: 'written after', sentence: 'He added a postscript at the end of his letter.' },
        ]
      },
      {
        id: 19,
        prefix: 'semi-',
        meaning: 'half or partly',
        level: 'intermediate',
        usage: 'Used to indicate something that is partial or occurs at intervals',
        examples: [
          { word: 'semicircle', definition: 'half of a circle', sentence: 'The students sat in a semicircle around the teacher.' },
          { word: 'semifinal', definition: 'before the final round', sentence: 'Our team lost in the semifinal match.' },
          { word: 'semiannual', definition: 'occurring twice a year', sentence: 'The magazine is published on a semiannual basis.' },
          { word: 'semiconductor', definition: 'a material with electrical conductivity between a conductor and an insulator', sentence: 'Silicon is commonly used in semiconductor devices.' },
        ]
      },
      {
        id: 20,
        prefix: 'trans-',
        meaning: 'across or beyond',
        level: 'intermediate',
        usage: 'Used to indicate movement across or beyond something',
        examples: [
          { word: 'transport', definition: 'to carry across', sentence: 'The company transports goods across the country.' },
          { word: 'transform', definition: 'to change completely', sentence: 'The renovation will transform the old building into a modern office.' },
          { word: 'translate', definition: 'to change from one language to another', sentence: 'Can you translate this document from Spanish to English?' },
          { word: 'transparent', definition: 'able to be seen through', sentence: 'The company aims to be more transparent about its policies.' },
        ]
      },
    ],
    suffixes: [
      {
        id: 1,
        suffix: '-ment',
        meaning: 'forms nouns from verbs',
        level: 'beginner',
        usage: 'Used to create nouns that express the result or product of an action',
        examples: [
          { word: 'development', definition: 'the process of developing', sentence: 'The development of new technology takes time.' },
          { word: 'agreement', definition: 'the state of agreeing', sentence: 'We finally reached an agreement after hours of discussion.' },
          { word: 'enjoyment', definition: 'the state of enjoying', sentence: 'Reading brings me great enjoyment.' },
          { word: 'achievement', definition: 'something successfully completed', sentence: 'Graduating college was a significant achievement.' },
        ]
      },
      {
        id: 2,
        suffix: '-able/-ible',
        meaning: 'capable of or worthy of',
        level: 'intermediate',
        usage: 'Used to form adjectives that express capability or suitability',
        examples: [
          { word: 'readable', definition: 'capable of being read', sentence: 'The author writes in a very readable style.' },
          { word: 'flexible', definition: 'capable of bending', sentence: 'You need to be flexible with your schedule.' },
          { word: 'reliable', definition: 'worthy of trust', sentence: 'She is a reliable friend who always keeps her promises.' },
          { word: 'incredible', definition: 'difficult to believe', sentence: 'The view from the mountain was incredible.' },
        ]
      },
      {
        id: 3,
        suffix: '-tion/-sion',
        meaning: 'forms nouns from verbs',
        level: 'intermediate',
        usage: 'Used to create nouns that express an action or process',
        examples: [
          { word: 'action', definition: 'the process of acting', sentence: 'We need to take action immediately.' },
          { word: 'discussion', definition: 'the process of discussing', sentence: 'The discussion lasted for over two hours.' },
          { word: 'conclusion', definition: 'the end or final part', sentence: 'What conclusion did you reach after analyzing the data?' },
          { word: 'permission', definition: 'the act of allowing', sentence: 'You need permission from your parents to go on the trip.' },
        ]
      },
      {
        id: 4,
        suffix: '-less',
        meaning: 'without',
        level: 'beginner',
        usage: 'Used to form adjectives that express the absence of something',
        examples: [
          { word: 'homeless', definition: 'without a home', sentence: 'The charity helps homeless people find shelter.' },
          { word: 'careless', definition: 'without care or attention', sentence: 'A careless mistake cost them the game.' },
          { word: 'hopeless', definition: 'without hope', sentence: 'The situation isn\'t hopeless; we can still find a solution.' },
          { word: 'fearless', definition: 'without fear', sentence: 'The fearless explorer ventured into unknown territory.' },
        ]
      },
      {
        id: 5,
        suffix: '-ful',
        meaning: 'full of or characterized by',
        level: 'beginner',
        usage: 'Used to form adjectives that express abundance',
        examples: [
          { word: 'helpful', definition: 'providing help', sentence: 'The staff was very helpful during our stay.' },
          { word: 'beautiful', definition: 'full of beauty', sentence: 'It was a beautiful sunset over the ocean.' },
          { word: 'careful', definition: 'full of care or caution', sentence: 'Be careful when crossing the street.' },
          { word: 'thoughtful', definition: 'showing consideration', sentence: 'It was thoughtful of you to bring flowers.' },
        ]
      },
      {
        id: 6,
        suffix: '-er/-or',
        meaning: 'person who performs an action',
        level: 'beginner',
        usage: 'Used to form nouns that refer to people who do a particular activity',
        examples: [
          { word: 'teacher', definition: 'person who teaches', sentence: 'My teacher assigned a lot of homework this week.' },
          { word: 'actor', definition: 'person who acts', sentence: 'The actor won an award for his performance.' },
          { word: 'writer', definition: 'person who writes', sentence: 'She is a talented writer of short stories.' },
          { word: 'visitor', definition: 'person who visits', sentence: 'The museum welcomes thousands of visitors each day.' },
        ]
      },
      {
        id: 7,
        suffix: '-ity/-ty',
        meaning: 'forms nouns denoting quality or condition',
        level: 'intermediate',
        usage: 'Used to create abstract nouns from adjectives',
        examples: [
          { word: 'ability', definition: 'the quality of being able', sentence: 'She has the ability to solve complex problems quickly.' },
          { word: 'creativity', definition: 'the quality of being creative', sentence: 'His creativity shines through in his artwork.' },
          { word: 'equality', definition: 'the state of being equal', sentence: 'The company promotes equality in the workplace.' },
          { word: 'reality', definition: 'the state of being real', sentence: 'Sometimes dreams can seem like reality.' },
        ]
      },
      {
        id: 8,
        suffix: '-ize/-ise',
        meaning: 'forms verbs from nouns or adjectives',
        level: 'intermediate',
        usage: 'Used to create verbs that mean "to make or become"',
        examples: [
          { word: 'modernize', definition: 'to make modern', sentence: 'They plan to modernize the factory with new equipment.' },
          { word: 'apologize', definition: 'to express regret', sentence: 'He should apologize for his rude behavior.' },
          { word: 'summarize', definition: 'to make a summary', sentence: 'Can you summarize the main points of the article?' },
          { word: 'organize', definition: 'to arrange systematically', sentence: 'I need to organize my files better.' },
        ]
      },
      {
        id: 9,
        suffix: '-ous/-ious',
        meaning: 'full of or characterized by',
        level: 'intermediate',
        usage: 'Used to form adjectives expressing possession of a quality',
        examples: [
          { word: 'dangerous', definition: 'full of danger', sentence: 'Driving in bad weather can be dangerous.' },
          { word: 'curious', definition: 'having curiosity', sentence: 'Children are naturally curious about the world.' },
          { word: 'famous', definition: 'known by many people', sentence: 'The famous actor tried to avoid the paparazzi.' },
          { word: 'delicious', definition: 'having a pleasant taste', sentence: 'The cake was absolutely delicious.' },
        ]
      },
      {
        id: 10,
        suffix: '-ance/-ence',
        meaning: 'action, state, or quality',
        level: 'intermediate',
        usage: 'Used to form nouns from verbs or adjectives',
        examples: [
          { word: 'performance', definition: 'the act of performing', sentence: 'Her performance in the play was outstanding.' },
          { word: 'importance', definition: 'the quality of being important', sentence: 'He stressed the importance of regular exercise.' },
          { word: 'confidence', definition: 'the feeling of trust in one\'s abilities', sentence: 'Practice will help build your confidence.' },
          { word: 'existence', definition: 'the state of existing', sentence: 'Scientists debate the existence of life on other planets.' },
        ]
      },
      {
        id: 11,
        suffix: '-ship',
        meaning: 'position, state, or quality',
        level: 'beginner',
        usage: 'Used to form nouns indicating status or relationship',
        examples: [
          { word: 'friendship', definition: 'the state of being friends', sentence: 'Their friendship has lasted for decades.' },
          { word: 'leadership', definition: 'the position of being a leader', sentence: 'Good leadership is essential for any organization.' },
          { word: 'citizenship', definition: 'the status of being a citizen', sentence: 'He applied for American citizenship last year.' },
          { word: 'relationship', definition: 'the way two people are connected', sentence: 'They have a close relationship with their grandparents.' },
        ]
      },
      {
        id: 12,
        suffix: '-ish',
        meaning: 'somewhat or approximately',
        level: 'beginner',
        usage: 'Used to form adjectives indicating "somewhat like" or "approximately"',
        examples: [
          { word: 'childish', definition: 'somewhat like a child', sentence: 'His childish behavior annoyed everyone at the meeting.' },
          { word: 'reddish', definition: 'somewhat red', sentence: 'The sunset gave the sky a reddish glow.' },
          { word: 'sevenish', definition: 'approximately seven', sentence: 'Let\'s meet at sevenish for dinner.' },
          { word: 'bookish', definition: 'fond of reading or studying', sentence: 'She was a quiet, bookish child who loved libraries.' },
        ]
      },
      {
        id: 13,
        suffix: '-hood',
        meaning: 'state or condition',
        level: 'beginner',
        usage: 'Used to form nouns indicating a state or condition',
        examples: [
          { word: 'childhood', definition: 'the state of being a child', sentence: 'He had a happy childhood in the countryside.' },
          { word: 'adulthood', definition: 'the state of being an adult', sentence: 'The transition to adulthood can be challenging.' },
          { word: 'neighborhood', definition: 'an area where people live', sentence: 'They live in a friendly neighborhood.' },
          { word: 'parenthood', definition: 'the state of being a parent', sentence: 'Parenthood brought them both joy and challenges.' },
        ]
      },
      {
        id: 14,
        suffix: '-dom',
        meaning: 'state of being or domain',
        level: 'intermediate',
        usage: 'Used to form nouns indicating a state of being or a domain',
        examples: [
          { word: 'freedom', definition: 'the state of being free', sentence: 'The protesters were fighting for freedom of speech.' },
          { word: 'kingdom', definition: 'the domain of a king', sentence: 'The kingdom extended across three countries.' },
          { word: 'wisdom', definition: 'the quality of being wise', sentence: 'With age comes wisdom.' },
          { word: 'boredom', definition: 'the state of being bored', sentence: 'The long wait led to extreme boredom.' },
        ]
      },
      {
        id: 15,
        suffix: '-ology',
        meaning: 'study or science of',
        level: 'intermediate',
        usage: 'Used to form nouns referring to a field of study',
        examples: [
          { word: 'psychology', definition: 'the study of the mind', sentence: 'She has a degree in psychology from Harvard.' },
          { word: 'biology', definition: 'the study of living organisms', sentence: 'Biology was his favorite subject in high school.' },
          { word: 'technology', definition: 'the application of scientific knowledge', sentence: 'Modern technology has transformed how we communicate.' },
          { word: 'archaeology', definition: 'the study of human history through artifacts', sentence: 'The archaeology team discovered an ancient temple.' },
        ]
      },
      {
        id: 16,
        suffix: '-ward/-wards',
        meaning: 'in the direction of',
        level: 'beginner',
        usage: 'Used to form adverbs or adjectives indicating direction',
        examples: [
          { word: 'backward', definition: 'in the reverse direction', sentence: 'The child took a few steps backward.' },
          { word: 'forward', definition: 'toward the front', sentence: 'We need to move forward with our plans.' },
          { word: 'homeward', definition: 'toward home', sentence: 'The birds fly homeward at sunset.' },
          { word: 'upward', definition: 'toward a higher place', sentence: 'The prices have been trending upward.' },
        ]
      },
      {
        id: 17,
        suffix: '-esque',
        meaning: 'in the style of',
        level: 'advanced',
        usage: 'Used to form adjectives meaning "in the style or manner of"',
        examples: [
          { word: 'picturesque', definition: 'like a picture', sentence: 'The village was picturesque with its old cottages and gardens.' },
          { word: 'Kafkaesque', definition: 'in the style of Kafka\'s writings', sentence: 'The bureaucratic process was Kafkaesque in its complexity.' },
          { word: 'statuesque', definition: 'like a statue', sentence: 'The model had a statuesque figure.' },
          { word: 'Romanesque', definition: 'in the Roman style', sentence: 'The church has beautiful Romanesque architecture.' },
        ]
      },
      {
        id: 18,
        suffix: '-ify/-fy',
        meaning: 'to make or become',
        level: 'intermediate',
        usage: 'Used to form verbs meaning "to make or cause to be"',
        examples: [
          { word: 'simplify', definition: 'to make simple', sentence: 'The teacher tried to simplify the complex concept.' },
          { word: 'beautify', definition: 'to make beautiful', sentence: 'The community project aims to beautify the local park.' },
          { word: 'purify', definition: 'to make pure', sentence: 'This device can purify water for drinking.' },
          { word: 'classify', definition: 'to arrange in classes', sentence: 'Scientists classify animals into different species.' },
        ]
      },
      {
        id: 19,
        suffix: '-ic',
        meaning: 'relating to or characterized by',
        level: 'intermediate',
        usage: 'Used to form adjectives from nouns',
        examples: [
          { word: 'artistic', definition: 'relating to art', sentence: 'She has great artistic talent.' },
          { word: 'economic', definition: 'relating to economics', sentence: 'The country faces serious economic problems.' },
          { word: 'scientific', definition: 'relating to science', sentence: 'The research paper was published in a scientific journal.' },
          { word: 'heroic', definition: 'showing the qualities of a hero', sentence: 'The firefighter\'s heroic actions saved many lives.' },
        ]
      },
      {
        id: 20,
        suffix: '-ian/-an',
        meaning: 'relating to, belonging to, or resembling',
        level: 'intermediate',
        usage: 'Used to form nouns or adjectives indicating a person or thing',
        examples: [
          { word: 'musician', definition: 'a person who plays music', sentence: 'My brother is a talented musician.' },
          { word: 'historian', definition: 'a person who studies history', sentence: 'The historian wrote a book about ancient Rome.' },
          { word: 'American', definition: 'relating to America', sentence: 'American culture has influenced many countries.' },
          { word: 'vegetarian', definition: 'a person who doesn\'t eat meat', sentence: 'She became a vegetarian for health reasons.' },
        ]
      },
    ],
    compounds: [
      {
        id: 1,
        type: 'closed compound',
        meaning: 'two words joined together',
        level: 'beginner',
        usage: 'Words that are written as one word without spaces or hyphens',
        examples: [
          { word: 'classroom', definition: 'a room where classes are taught', sentence: 'The students gathered in the classroom before the bell rang.' },
          { word: 'keyboard', definition: 'a set of keys for operating a computer', sentence: 'I need to buy a new keyboard for my computer.' },
          { word: 'sunlight', definition: 'light from the sun', sentence: 'The sunlight streamed through the windows.' },
          { word: 'notebook', definition: 'a book for notes', sentence: 'I write all my ideas in my notebook.' },
        ]
      },
      {
        id: 2,
        type: 'hyphenated compound',
        meaning: 'two words joined by a hyphen',
        level: 'intermediate',
        usage: 'Words that are connected with a hyphen',
        examples: [
          { word: 'well-known', definition: 'widely known', sentence: 'She is a well-known author in literary circles.' },
          { word: 'mother-in-law', definition: 'the mother of one\'s spouse', sentence: 'My mother-in-law is visiting next weekend.' },
          { word: 'check-in', definition: 'the act of registering arrival', sentence: 'The hotel check-in starts at 3 PM.' },
          { word: 'self-control', definition: 'control of one\'s emotions', sentence: 'It takes self-control to stick to a diet.' },
        ]
      },
      {
        id: 3,
        type: 'open compound',
        meaning: 'two separate words that function as one',
        level: 'intermediate',
        usage: 'Words that remain separate but function as a single unit',
        examples: [
          { word: 'high school', definition: 'a school for students after elementary school', sentence: 'She graduated from high school last year.' },
          { word: 'living room', definition: 'a room in a house for relaxing', sentence: 'We gathered in the living room to watch a movie.' },
          { word: 'full moon', definition: 'when the moon appears as a complete circle', sentence: 'There will be a full moon tonight.' },
          { word: 'ice cream', definition: 'a frozen dessert', sentence: 'Children love eating ice cream in summer.' },
        ]
      },
    ]
  };

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

  // Handle item selection to show modal with practice and quiz options
  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    setActiveModalTab('learn');
    setQuizCompleted(false);
    setPracticeCompleted(false);
    setPracticeInput('');
    
    // Generate quiz questions for this item
    generateQuizQuestions(item);
  };
  
  // Generate quiz questions for the selected item
  const generateQuizQuestions = (item) => {
    let questions = [];
    const isPrefix = activeTab === 'prefixes';
    const isSuffix = activeTab === 'suffixes';
    const isCompound = activeTab === 'compounds';
    
    // Get all items from current category for options
    let allItems = [];
    if (isPrefix) {
      allItems = wordFormationData.prefixes.filter(p => p.id !== item.id);
    } else if (isSuffix) {
      allItems = wordFormationData.suffixes.filter(s => s.id !== item.id);
    } else {
      allItems = wordFormationData.compounds.filter(c => c.id !== item.id);
    }
    
    // Create 5 quiz questions based on the type of word formation
    if (isPrefix || isSuffix) {
      const affix = isPrefix ? item.prefix : item.suffix;
      
      questions = [
        // Question 1: Select the correct meaning
        {
          type: 'meaning',
          question: `What is the meaning of "${affix}"?`,
          correctAnswer: item.meaning,
          options: [
            item.meaning,
            ...getRandomItems(allItems, 3).map(i => i.meaning)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 2: Select the word that uses this affix
        {
          type: 'word',
          question: `Which word uses the ${isPrefix ? 'prefix' : 'suffix'} "${affix}"?`,
          correctAnswer: item.examples[0].word,
          options: [
            item.examples[0].word,
            ...getRandomItems(wordFormationData.prefixes.concat(wordFormationData.suffixes)
              .filter(a => a.id !== item.id)
              .flatMap(a => a.examples), 3)
              .map(ex => ex.word)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 3: Select the correct usage
        {
          type: 'usage',
          question: `How is "${affix}" typically used?`,
          correctAnswer: item.usage,
          options: [
            item.usage,
            ...getRandomItems(allItems, 3).map(i => i.usage)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 4: Complete the sentence
        {
          type: 'sentence',
          question: `Complete this sentence: "${item.examples[0].sentence.replace(item.examples[0].word, '_____')}"`,
          correctAnswer: item.examples[0].word,
          options: [
            item.examples[0].word,
            ...getRandomItems(wordFormationData.prefixes.concat(wordFormationData.suffixes)
              .flatMap(a => a.examples), 3)
              .map(ex => ex.word)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 5: Match the definition
        {
          type: 'definition',
          question: `What is the definition of "${item.examples[1].word}"?`,
          correctAnswer: item.examples[1].definition,
          options: [
            item.examples[1].definition,
            ...getRandomItems(wordFormationData.prefixes.concat(wordFormationData.suffixes)
              .flatMap(a => a.examples), 3)
              .map(ex => ex.definition)
          ].sort(() => Math.random() - 0.5)
        }
      ];
    } else {
      // Questions for compound words
      questions = [
        // Question 1: Select the correct type
        {
          type: 'type',
          question: `What type of compound word is "${item.examples[0].word}"?`,
          correctAnswer: item.type,
          options: [
            item.type,
            ...getRandomItems(allItems, 3).map(i => i.type)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 2: Select the correct definition
        {
          type: 'definition',
          question: `What is the definition of "${item.examples[0].word}"?`,
          correctAnswer: item.examples[0].definition,
          options: [
            item.examples[0].definition,
            ...getRandomItems(wordFormationData.compounds.flatMap(c => c.examples), 3)
              .map(ex => ex.definition)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 3: Complete the sentence
        {
          type: 'sentence',
          question: `Complete this sentence: "${item.examples[1].sentence.replace(item.examples[1].word, '_____')}"`,
          correctAnswer: item.examples[1].word,
          options: [
            item.examples[1].word,
            ...getRandomItems(wordFormationData.compounds.flatMap(c => c.examples), 3)
              .map(ex => ex.word)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 4: Identify the compound type from definition
        {
          type: 'identify',
          question: `Which type of compound word is described as: "${item.usage}"?`,
          correctAnswer: item.type,
          options: [
            item.type,
            ...getRandomItems(allItems, 3).map(i => i.type)
          ].sort(() => Math.random() - 0.5)
        },
        // Question 5: Match the compound word with its example
        {
          type: 'match',
          question: `Which of these is an example of a ${item.type}?`,
          correctAnswer: item.examples[2].word,
          options: [
            item.examples[2].word,
            ...getRandomItems(allItems.flatMap(i => i.examples), 3)
              .map(ex => ex.word)
          ].sort(() => Math.random() - 0.5)
        }
      ];
    }
    
    setQuizQuestions(questions);
    setCurrentQuizQuestion(0);
    setQuizScore(0);
  };
  
  // Helper function to get random items from an array
  const getRandomItems = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };
  
  // Handle quiz answer selection
  const handleAnswerSelect = (answer, correctAnswer) => {
    if (answer === correctAnswer) {
      setQuizScore(quizScore + 1);
    }
    
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Restart quiz
  const restartQuiz = () => {
    if (selectedItem) {
      generateQuizQuestions(selectedItem);
      setQuizCompleted(false);
    }
  };

  const renderExampleItem = ({ item }) => (
    <View style={styles.exampleItem}>
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
      </View>
      <View style={styles.definitionContainer}>
        <Text style={styles.definitionText}>{item.definition}</Text>
        {item.sentence && (
          <Text style={styles.sentenceText}>"{item.sentence}"</Text>
        )}
      </View>
    </View>
  );

  const renderAffixCard = ({ item, index }) => {
    const isPrefix = activeTab === 'prefixes';
    const isSuffix = activeTab === 'suffixes';
    const isCompound = activeTab === 'compounds';
    
    let affixText = '';
    let highlightedText = null;
    
    if (isPrefix) {
      affixText = item.prefix;
      highlightedText = <Text><Text style={styles.highlightText}>{affixText}</Text>word</Text>;
    } else if (isSuffix) {
      affixText = item.suffix;
      highlightedText = <Text>word<Text style={styles.highlightText}>{affixText}</Text></Text>;
    } else {
      // For compound words
      affixText = item.type;
      highlightedText = <Text><Text style={styles.highlightText}>{item.examples[0].word}</Text></Text>;
    }
    
    return (
      <Animated.View
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
          style={styles.affixCard}
          onPress={() => handleItemPress(item)}
        >
          <View style={styles.affixHeader}>
            <View style={styles.affixHeaderContent}>
              <Text style={styles.affixText}>
                {isCompound ? item.type : (isPrefix ? item.prefix : item.suffix)}
              </Text>
              <View style={[
                styles.levelBadge, 
                {backgroundColor: item.level === 'beginner' ? '#4CAF50' : '#FF9800'}
              ]}>
                <Text style={styles.levelText}>{item.level}</Text>
              </View>
            </View>
            <Text style={styles.meaningText}>
              {isCompound ? item.meaning : item.meaning}
            </Text>
          </View>
          
          <View style={styles.affixPattern}>
            {highlightedText}
          </View>
          
          <View style={styles.usageContainer}>
            <Text style={styles.usageLabel}>Usage:</Text>
            <Text style={styles.usageText}>{item.usage}</Text>
          </View>
          
          <FlatList
            data={item.examples.slice(0, 2)} // Show only first 2 examples in the card
            renderItem={renderExampleItem}
            keyExtractor={(example, idx) => `${item.id}-example-${idx}`}
            scrollEnabled={false}
            contentContainerStyle={styles.examplesList}
          />
          
          <TouchableOpacity 
            style={styles.learnMoreButton}
            onPress={() => handleItemPress(item)}
          >
            <Text style={styles.learnMoreText}>Learn More & Practice</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
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
        
        <Text style={styles.headerTitle}>Word Formation</Text>
        
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileSettingsScreen')}
        >
          <MaterialIcons name="person" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'prefixes' && styles.activeTab]}
            onPress={() => setActiveTab('prefixes')}
          >
            <MaterialCommunityIcons 
              name="format-letter-starts-with" 
              size={20} 
              color={activeTab === 'prefixes' ? '#0072ff' : '#8e8e93'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'prefixes' && styles.activeTabText]}>
              Prefixes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'suffixes' && styles.activeTab]}
            onPress={() => setActiveTab('suffixes')}
          >
            <MaterialCommunityIcons 
              name="format-letter-ends-with" 
              size={20} 
              color={activeTab === 'suffixes' ? '#0072ff' : '#8e8e93'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'suffixes' && styles.activeTabText]}>
              Suffixes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'compounds' && styles.activeTab]}
            onPress={() => setActiveTab('compounds')}
          >
            <MaterialCommunityIcons 
              name="link-variant" 
              size={20} 
              color={activeTab === 'compounds' ? '#0072ff' : '#8e8e93'} 
              style={styles.tabIcon}
            />
            <Text style={[styles.tabText, activeTab === 'compounds' && styles.activeTabText]}>
              Compounds
            </Text>
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
              {activeTab === 'prefixes' ? 
                'Prefixes, Suffixes, and Compounds' :
                activeTab === 'suffixes' ?
                'Prefixes, Suffixes, and Compounds' :
                'Prefixes, Suffixes, and Compounds'
              }
            </Text>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {activeTab === 'prefixes' ? 'What are prefixes?' : 
                 activeTab === 'suffixes' ? 'What are suffixes?' :
                 'What are compound words?'}
              </Text>
              <Text style={styles.infoText}>
                {activeTab === 'prefixes' ? 
                  'Prefixes are added to the beginning of a word to modify its meaning.' :
                  activeTab === 'suffixes' ?
                  'Suffixes are added to the end of a word to modify its meaning or change its part of speech.' :
                  'Compound words are formed when two or more words are joined together to create a new word with a new meaning.'
                }
              </Text>
            </View>
          </Animated.View>

          <FlatList
            data={activeTab === 'prefixes' ? 
                  wordFormationData.prefixes : 
                  activeTab === 'suffixes' ?
                  wordFormationData.suffixes :
                  wordFormationData.compounds}
            renderItem={renderAffixCard}
            keyExtractor={item => `${activeTab}-${item.id}`}
            scrollEnabled={false}
          />
        </ScrollView>
      </View>
      

      
      {/* Item Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="#333" />
                  </TouchableOpacity>
                  
                  <Text style={styles.modalTitle}>
                    {activeTab === 'prefixes' ? selectedItem.prefix : 
                     activeTab === 'suffixes' ? selectedItem.suffix : 
                     selectedItem.type}
                  </Text>
                  
                  <View style={[
                    styles.levelBadgeModal, 
                    {backgroundColor: selectedItem.level === 'beginner' ? '#4CAF50' : '#FF9800'}
                  ]}>
                    <Text style={styles.levelTextModal}>{selectedItem.level}</Text>
                  </View>
                </View>

                <View style={styles.modalTabsContainer}>
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'learn' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('learn')}
                  >
                    <Ionicons name="book" size={16} color={activeModalTab === 'learn' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'learn' && styles.activeModalTabText]}>Learn</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'practice' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('practice')}
                  >
                    <Ionicons name="create" size={16} color={activeModalTab === 'practice' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'practice' && styles.activeModalTabText]}>Practice</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.modalTab, activeModalTab === 'quiz' && styles.activeModalTab]}
                    onPress={() => setActiveModalTab('quiz')}
                  >
                    <Ionicons name="help-circle" size={16} color={activeModalTab === 'quiz' ? '#0072ff' : '#666'} />
                    <Text style={[styles.modalTabText, activeModalTab === 'quiz' && styles.activeModalTabText]}>Quiz</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Content will be added in the next step */}
                {activeModalTab === 'learn' && (
                  <ScrollView style={styles.learnContainer}>
                    <View style={styles.definitionCard}>
                      <Text style={styles.definitionTitle}>Meaning</Text>
                      <Text style={styles.definitionText}>{selectedItem.meaning}</Text>
                    </View>
                    
                    <View style={styles.definitionCard}>
                      <Text style={styles.definitionTitle}>Usage</Text>
                      <Text style={styles.definitionText}>{selectedItem.usage}</Text>
                    </View>
                    
                    <View style={styles.examplesCard}>
                      <Text style={styles.examplesTitle}>Examples</Text>
                      {selectedItem.examples.map((example, index) => (
                        <View key={`example-${index}`} style={styles.exampleDetailItem}>
                          <Text style={styles.exampleWord}>{example.word}</Text>
                          <Text style={styles.exampleDefinition}>{example.definition}</Text>
                          <Text style={styles.exampleSentence}>"{example.sentence}"</Text>
                        </View>
                      ))}
                    </View>
                    
                    <View style={styles.tipsCard}>
                      <Text style={styles.tipsTitle}>Learning Tips</Text>
                      <View style={styles.tipItem}>
                        <Ionicons name="bulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          {activeTab === 'prefixes' ? 
                            'Pay attention to how the prefix changes the meaning of the base word.' :
                            activeTab === 'suffixes' ?
                            'Notice how the suffix may change the word\'s part of speech.' :
                            'Notice how the meaning of a compound word often relates to, but is distinct from, its component words.'
                          }
                        </Text>
                      </View>
                      <View style={styles.tipItem}>
                        <Ionicons name="bulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          Create your own sentences using these examples to reinforce your learning.
                        </Text>
                      </View>
                      <View style={styles.tipItem}>
                        <Ionicons name="bulb" size={16} color="#FF9800" style={styles.tipIcon} />
                        <Text style={styles.tipText}>
                          Try to identify these patterns in your reading to strengthen recognition.
                        </Text>
                      </View>
                    </View>
                  </ScrollView>
                )}
                
                {/* Practice Tab Content */}
                {activeModalTab === 'practice' && (
                  <View style={styles.practiceContainer}>
                    <Text style={styles.practiceTitle}>
                      Practice with {activeTab === 'prefixes' ? selectedItem.prefix : 
                                     activeTab === 'suffixes' ? selectedItem.suffix : 
                                     selectedItem.type}
                    </Text>
                    
                    <View style={styles.practiceCard}>
                      <Text style={styles.practiceInstruction}>
                        Complete the sentence using the correct word:
                      </Text>
                      <Text style={styles.practiceSentence}>
                        {selectedItem.examples[0].sentence.replace(
                          selectedItem.examples[0].word, 
                          '______'
                        )}
                      </Text>
                      
                      <TouchableOpacity 
                        style={styles.showAnswerButton}
                        onPress={() => setPracticeCompleted(true)}
                      >
                        <Text style={styles.showAnswerText}>Show Answer</Text>
                      </TouchableOpacity>
                      
                      {practiceCompleted && (
                        <View style={styles.answerContainer}>
                          <Text style={styles.answerLabel}>Answer:</Text>
                          <Text style={styles.answerText}>{selectedItem.examples[0].word}</Text>
                          <Text style={styles.fullSentence}>{selectedItem.examples[0].sentence}</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.practiceCard}>
                      <Text style={styles.practiceInstruction}>
                        Create your own sentence using {activeTab === 'prefixes' ? 'a word with the prefix' : 
                                                       activeTab === 'suffixes' ? 'a word with the suffix' : 
                                                       'this type of compound word'}:
                      </Text>
                      <TextInput
                        style={styles.practiceInput}
                        placeholder="Write your sentence here..."
                        multiline={true}
                        value={practiceInput}
                        onChangeText={setPracticeInput}
                      />
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.resetPracticeButton}
                      onPress={() => {
                        setPracticeCompleted(false);
                        setPracticeInput('');
                      }}
                    >
                      <Text style={styles.resetPracticeText}>Reset Practice</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Quiz Tab Content */}
                {activeModalTab === 'quiz' && !quizCompleted && (
                  <View style={styles.quizContainer}>
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View 
                          style={[
                            styles.progressFill, 
                            { width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>
                        Question {currentQuizQuestion + 1} of {quizQuestions.length}
                      </Text>
                    </View>

                    <View style={styles.questionCard}>
                      <Text style={styles.questionText}>
                        {quizQuestions[currentQuizQuestion]?.question}
                      </Text>
                    </View>

                    <View style={styles.optionsContainer}>
                      {quizQuestions[currentQuizQuestion]?.options.map((option, index) => (
                        <TouchableOpacity
                          key={`option-${index}`}
                          style={styles.optionButton}
                          onPress={() => handleAnswerSelect(
                            option, 
                            quizQuestions[currentQuizQuestion].correctAnswer
                          )}
                        >
                          <View style={styles.optionContent}>
                            <View style={styles.optionBullet}>
                              <Text style={styles.optionBulletText}>{String.fromCharCode(65 + index)}</Text>
                            </View>
                            <Text style={styles.optionText}>{option}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                
                {/* Quiz Results */}
                {activeModalTab === 'quiz' && quizCompleted && (
                  <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Quiz Complete!</Text>
                    
                    <View style={styles.quizResultCard}>
                      <View style={styles.scoreHeaderContainer}>
                        <Text style={styles.scoreHeaderText}>Your Score</Text>
                        <Text style={styles.scorePercentage}>
                          {Math.round((quizScore / quizQuestions.length) * 100)}%
                        </Text>
                      </View>
                      
                      <View style={styles.scoreCircleContainer}>
                        <View style={[
                          styles.scoreCircleOuter,
                          { 
                            borderColor: quizScore >= quizQuestions.length * 0.7 ? '#4CAF50' : '#FF9800',
                          }
                        ]}>
                          <Text style={styles.scoreValue}>{quizScore}</Text>
                          <Text style={styles.scoreTotal}>/{quizQuestions.length}</Text>
                        </View>
                      </View>
                      
                      <Text style={styles.resultFeedback}>
                        {quizScore === quizQuestions.length ? 
                          'Perfect! You\'ve mastered this concept!' : 
                          quizScore >= quizQuestions.length * 0.7 ? 
                          'Great job! You\'re doing well!' : 
                          'Keep practicing to improve your knowledge!'}
                      </Text>
                    </View>

                    <View style={styles.resultButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.tryAgainButton}
                        onPress={restartQuiz}
                      >
                        <LinearGradient
                          colors={['#29B6F6', '#0288D1']}
                          style={styles.buttonGradient}
                        >
                          <Ionicons name="refresh" size={18} color="#fff" />
                          <Text style={styles.resultButtonText}>Try Again</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.doneButton}
                        onPress={() => setActiveModalTab('learn')}
                      >
                        <LinearGradient
                          colors={['#66BB6A', '#388E3C']}
                          style={styles.buttonGradient}
                        >
                          <Ionicons name="checkmark-circle" size={18} color="#fff" />
                          <Text style={styles.resultButtonText}>Done</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
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
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingTop: 16,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#0072ff',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8e8e93',
  },
  activeTabText: {
    color: '#0072ff',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#0072ff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0072ff',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  affixCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  affixHeader: {
    marginBottom: 12,
  },
  affixHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  affixText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0072ff',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  affixPattern: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  highlightText: {
    color: '#0072ff',
    fontWeight: 'bold',
  },
  examplesList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  exampleItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  wordContainer: {
    flex: 1,
  },
  definitionContainer: {
    flex: 2,
    paddingLeft: 8,
  },
  wordText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  definitionText: {
    fontSize: 14,
    color: '#666',
  },
  sentenceText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  usageContainer: {
    marginTop: 12,
  },
  usageLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  usageText: {
    fontSize: 14,
    color: '#333',
  },
  levelBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  learnMoreButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  learnMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0072ff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  closeButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  levelBadgeModal: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  levelTextModal: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  modalTabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTab: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  activeModalTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0072ff',
  },
  modalTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginLeft: 6,
  },
  activeModalTabText: {
    color: '#0072ff',
    fontWeight: '600',
  },
  learnContainer: {
    padding: 16,
  },
  definitionCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  definitionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 4,
  },
  examplesCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 8,
  },
  exampleDetailItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  exampleWord: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  exampleDefinition: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  exampleSentence: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  practiceContainer: {
    padding: 16,
  },
  practiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
    marginBottom: 16,
  },
  practiceCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  practiceInstruction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 12,
  },
  practiceSentence: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    lineHeight: 24,
  },
  showAnswerButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  showAnswerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  answerContainer: {
    backgroundColor: '#f5f9ff',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  answerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fullSentence: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  practiceInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  resetPracticeButton: {
    backgroundColor: '#0072ff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  resetPracticeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  quizContainer: {
    padding: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0072ff',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    textAlign: 'right',
  },
  questionCard: {
    backgroundColor: '#f7f9fc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#0072ff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionBullet: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionBulletText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0072ff',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  resultContainer: {
    padding: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  quizResultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  scoreHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  scoreHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  scorePercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  scoreCircleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  scoreCircleOuter: {
    width: 90,
    height: 90,
    borderWidth: 4,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  scoreTotal: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
    marginTop: 4,
  },
  resultFeedback: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  resultButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  tryAgainButton: {
    flex: 1,
    marginRight: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  doneButton: {
    flex: 1,
    marginLeft: 10,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  resultButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
});