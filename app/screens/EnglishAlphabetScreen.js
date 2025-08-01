import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export default function EnglishAlphabetScreen({ navigation }) {
  // The alphabet data
  const alphabet = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>English Alphabet</Text>
      
      {/* List of alphabets */}
      <FlatList
        data={alphabet}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.alphabetItem} onPress={() => alert(`You clicked ${item}`)}>
            <Text style={styles.alphabetText}>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.goBack()} // Go back to the previous screen
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  alphabetItem: {
    backgroundColor: '#0055FF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginVertical: 5,
    borderRadius: 8,
  },
  alphabetText: {
    color: '#fff',
    fontSize: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#0072ff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
