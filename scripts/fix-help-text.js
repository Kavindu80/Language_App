const fs = require('fs');
const path = require('path');

// Base directory for beginner screens
const baseDir = path.join(__dirname, '../app/screens/beginner');

// Function to update a file
function updateFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Simple string replacement
    if (content.includes('"Tap a letter to place it"') && content.includes('"Tap a placed letter to remove it"')) {
      content = content.replace('"Tap a letter to place it"', '"Tap letters to make a word."');
      content = content.replace('"Tap a placed letter to remove it"', '"Tap a letter to take it out."');
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Get all word puzzle screen files
function findWordPuzzleScreens(dir) {
  const files = [];
  
  // Read all files in the directory
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    if (item.isDirectory()) {
      // Recursively search in subdirectories
      files.push(...findWordPuzzleScreens(fullPath));
    } else if (item.isFile() && item.name.includes('WordPuzzleScreen') && item.name.endsWith('.js')) {
      // Add word puzzle screen files
      files.push(fullPath);
    }
  }
  
  return files;
}

// Find and update all word puzzle screens
const wordPuzzleScreens = findWordPuzzleScreens(baseDir);
console.log(`Found ${wordPuzzleScreens.length} word puzzle screens`);

let updatedCount = 0;
wordPuzzleScreens.forEach(filePath => {
  if (updateFile(filePath)) {
    updatedCount++;
  }
});

console.log(`Updated ${updatedCount} word puzzle screens!`); 