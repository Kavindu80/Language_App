const fs = require('fs');
const path = require('path');

// Base directory for beginner screens
const baseDir = path.join(__dirname, '../app/screens/beginner');

// Function to update a file
function updateFile(filePath) {
  try {
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file contains the help text pattern we're looking for
    if (content.includes('placedTiles.includes(null)') && 
        (content.includes('Tap a letter to place it') || 
         content.includes('Tap a placed letter to remove it'))) {
      
      // Replace the help text
      const updatedContent = content.replace(
        /\{placedTiles\.includes\(null\) \? [^\n]*"Tap a letter to place it"[^\n]*: [^\n]*"Tap a placed letter to remove it"[^\n]*\}/,
        '{placedTiles.includes(null) ? "Tap letters to make a word." : "Tap a letter to take it out."}'
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      
      console.log(`Updated ${filePath}`);
    } else {
      console.log(`No matching pattern found in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
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

wordPuzzleScreens.forEach(filePath => {
  updateFile(filePath);
});

console.log('All word puzzle screens have been updated!'); 