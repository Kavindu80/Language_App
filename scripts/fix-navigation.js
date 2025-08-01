// Script to fix navigation mismatches in letter screens
const fs = require('fs');
const path = require('path');

// Base directory for the screens
const baseDir = path.join(__dirname, '../app/screens/beginner');

// Get the App.jsx content to check registered screen names
const appJsxPath = path.join(__dirname, '../App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');

// Letters to check
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Results tracking
const results = {
  checked: 0,
  fixed: 0,
  skipped: 0,
  errors: []
};

console.log('Starting navigation check for all letter screens...\n');

// Map to store registered screen names from App.jsx
const registeredScreens = {};

// Find all registered screen names in App.jsx
letters.forEach(letter => {
  // More flexible regex to catch different naming patterns
  const screenNameRegex = new RegExp(`<Stack\\.Screen\\s+name=["']([^"']*WordsStartingWith${letter}[^"']*)["']`, 'i');
  const match = appJsxContent.match(screenNameRegex);
  
  if (match && match[1]) {
    registeredScreens[letter] = match[1];
    console.log(`Letter ${letter} registered as: ${match[1]}`);
  } else {
    console.log(`No registration found for letter ${letter} in App.jsx`);
    results.skipped++;
  }
});

// Check and fix navigation in LetterDetailScreen files
letters.forEach(letter => {
  try {
    // Look for LetterDetailScreen file in the letter directory
    const letterDir = path.join(baseDir, letter);
    let letterDetailPath;
    
    if (fs.existsSync(letterDir) && fs.statSync(letterDir).isDirectory()) {
      // Directory exists, look for the file inside
      const detailScreenPath = path.join(letterDir, `LetterDetailScreen${letter}.js`);
      if (fs.existsSync(detailScreenPath)) {
        letterDetailPath = detailScreenPath;
      }
    } else {
      // Try in the base directory
      const detailScreenPath = path.join(baseDir, `LetterDetailScreen${letter}.js`);
      if (fs.existsSync(detailScreenPath)) {
        letterDetailPath = detailScreenPath;
      }
    }
    
    // Skip if the file doesn't exist
    if (!letterDetailPath) {
      console.log(`No LetterDetailScreen file found for letter ${letter}`);
      results.skipped++;
      return;
    }
    
    // Skip if there's no registered screen for this letter
    if (!registeredScreens[letter]) {
      console.log(`No registered screen found for letter ${letter}`);
      results.skipped++;
      return;
    }
    
    // Read the file content
    const fileContent = fs.readFileSync(letterDetailPath, 'utf8');
    results.checked++;
    
    // Look for navigation.navigate call
    const navigateRegex = /navigation\.navigate\(["']([^"']*WordsStartingWith[^"']*)["']\)/;
    const navigateMatch = fileContent.match(navigateRegex);
    
    if (navigateMatch && navigateMatch[1]) {
      const currentTarget = navigateMatch[1];
      const correctTarget = registeredScreens[letter];
      
      // If there's a mismatch, fix it
      if (currentTarget !== correctTarget) {
        console.log(`Fixing navigation for letter ${letter}: ${currentTarget} -> ${correctTarget}`);
        
        // Create a backup
        fs.writeFileSync(`${letterDetailPath}.navigation.backup`, fileContent);
        
        // Replace the navigation target
        const updatedContent = fileContent.replace(
          `navigation.navigate("${currentTarget}")`,
          `navigation.navigate("${correctTarget}")`
        );
        
        // Write the updated file
        fs.writeFileSync(letterDetailPath, updatedContent);
        
        console.log(`✅ Fixed navigation in ${letterDetailPath}`);
        results.fixed++;
      } else {
        console.log(`✓ Navigation for letter ${letter} is correct`);
      }
    } else {
      console.log(`Could not find navigation.navigate call in ${letterDetailPath}`);
      results.skipped++;
    }
  } catch (error) {
    console.error(`Error processing letter ${letter}:`, error.message);
    results.errors.push({ letter, error: error.message });
  }
});

// Print summary
console.log('\n===== Navigation Fix Summary =====');
console.log(`Total letters checked: ${results.checked}`);
console.log(`Fixed screens: ${results.fixed}`);
console.log(`Skipped screens: ${results.skipped}`);
console.log(`Errors: ${results.errors.length}`);

if (results.errors.length > 0) {
  console.log('\nErrors:');
  results.errors.forEach(({ letter, error }) => {
    console.log(`- Letter ${letter}: ${error}`);
  });
}

console.log('\nNavigation check and fix completed.'); 