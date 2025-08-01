import * as Speech from 'expo-speech';

/**
 * Centralized speech functionality for the entire app
 */
export const SpeechHelper = {
  // Track if speech is currently playing
  isPlaying: false,
  
  // Store current utterance ID to track active speech
  currentUtteranceId: null,
  
  /**
   * Speak text with standard options
   * @param {string} text - The text to speak
   * @param {Object} options - Optional speech configuration options
   * @returns {Promise<void>}
   */
  speak: async (text, options = {}) => {
    try {
      // Stop any ongoing speech first
      await SpeechHelper.stop();
      
      // Set playing state to true
      SpeechHelper.isPlaying = true;
      
      // Default speech options
      const defaultOptions = {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.8,
      };
      
      // Extract callback handlers
      const { onStart, onDone, onStopped, onError } = options;
      
      // Create a unique ID for this utterance
      const utteranceId = Date.now().toString();
      SpeechHelper.currentUtteranceId = utteranceId;
      
      // Merge default options with provided options (excluding callbacks)
      const speechOptions = {
        ...defaultOptions,
        ...options,
        onStart: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          if (onStart) onStart();
        },
        onDone: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onDone) onDone();
        },
        onStopped: () => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onStopped) onStopped();
        },
        onError: (error) => {
          if (SpeechHelper.currentUtteranceId !== utteranceId) return;
          console.error('Speech error:', error);
          SpeechHelper.isPlaying = false;
          SpeechHelper.currentUtteranceId = null;
          if (onError) onError(error);
        }
      };
      
      // Speak the text
      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('Speech error:', error);
      SpeechHelper.isPlaying = false;
      SpeechHelper.currentUtteranceId = null;
      if (options.onError) options.onError(error);
      throw error;
    }
  },
  
  /**
   * Speak a word with clear pronunciation
   * @param {string} word - The word to speak
   * @param {Object} options - Optional speech configuration options
   * @returns {Promise<void>}
   */
  speakWord: async (word, options = {}) => {
    try {
      // Remove annotations in parentheses if present
      let textToSpeak = word;
      if (textToSpeak.includes('(')) {
        textToSpeak = textToSpeak.split('(')[0].trim();
      }
      
      // Set a slightly slower rate for clearer pronunciation of words
      const wordOptions = {
        rate: 0.7,
        ...options,
      };
      
      await SpeechHelper.speak(textToSpeak, wordOptions);
    } catch (error) {
      console.error('Word speech error:', error);
      throw error;
    }
  },
  
  /**
   * Speak a sentence with natural intonation
   * @param {string} sentence - The sentence to speak
   * @param {Object} options - Optional speech configuration options
   * @returns {Promise<void>}
   */
  speakSentence: async (sentence, options = {}) => {
    try {
      // Adjust speech parameters based on sentence type
      let sentenceOptions = { ...options };
      
      // If it's a question, use higher pitch at the end
      if (sentence.endsWith('?')) {
        sentenceOptions.pitch = 1.1;
      } 
      // If it's an exclamation, use more emphasis
      else if (sentence.endsWith('!')) {
        sentenceOptions.volume = 1.2;
      }
      
      await SpeechHelper.speak(sentence, sentenceOptions);
    } catch (error) {
      console.error('Sentence speech error:', error);
      throw error;
    }
  },
  
  /**
   * Stop any ongoing speech
   * @returns {Promise<void>}
   */
  stop: async () => {
    try {
      if (SpeechHelper.isPlaying) {
        await Speech.stop();
        SpeechHelper.isPlaying = false;
        SpeechHelper.currentUtteranceId = null;
      }
    } catch (error) {
      console.error('Stop speech error:', error);
      SpeechHelper.isPlaying = false;
      SpeechHelper.currentUtteranceId = null;
    }
  },
  
  /**
   * Check if the device supports speech
   * @returns {Promise<boolean>}
   */
  isSpeechAvailable: async () => {
    try {
      return await Speech.isSpeechAvailable();
    } catch (error) {
      console.error('Speech availability check error:', error);
      return false;
    }
  }
};

export default SpeechHelper; 