const fs = require('fs');
const path = require('path');

// Base directory for beginner screens
const baseDir = path.join(__dirname, '../app/screens/beginner');

// Function to update a file
function updateFile(filePath, letter) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace "Letter - Xx" with just the letter
    const updatedContent = content.replace(
      /<Text style={styles\.letterTitle}>Letter - .*?<\/Text>/,
      `<Text style={styles.letterTitle}>${letter}</Text>`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    
    console.log(`Updated ${filePath}`);
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
  }
}

// Update the main LetterDetailScreen.js (for A)
updateFile(path.join(baseDir, 'LetterDetailScreen.js'), 'A');

// Update all other letter screens
const letters = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
                'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

letters.forEach(letter => {
  const filePath = path.join(baseDir, letter, `LetterDetailScreen${letter}.js`);
  if (fs.existsSync(filePath)) {
    updateFile(filePath, letter);
  } else {
    console.warn(`File not found: ${filePath}`);
  }
});

console.log('All letter detail screens have been updated!'); 