#!/bin/bash

# Script to help automate fixing WordsStartingWith screens
# This script will generate a command to copy the template for each letter

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== WordsStartingWith Screen Fixer Helper =====${NC}"
echo -e "${YELLOW}This script helps fix screen refresh issues in letter screens${NC}"
echo ""

# Letter arrays (B and G, N already fixed)
# Remaining letters to fix: C-F, H-M, O-Z
letters=("C" "D" "E" "F" "H" "I" "J" "K" "L" "M" "O" "P" "Q" "R" "S" "T" "U" "V" "W" "X" "Y" "Z")

# Script base directory
base_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
app_dir="$base_dir/../app"

# For each letter
for letter in "${letters[@]}"; do
    # Lowercase letter
    letter_lower=$(echo "$letter" | tr '[:upper:]' '[:lower:]')
    
    # Screen file path (typical pattern)
    screen_path="$app_dir/screens/beginner/$letter/WordsStartingWith${letter}Screen.js"
    
    # Handle special case if directory structure is different
    if [ ! -d "$app_dir/screens/beginner/$letter" ]; then
        # Try alternative path
        screen_path="$app_dir/screens/beginner/WordsStartingWith${letter}Screen.js"
    fi
    
    if [ -f "$screen_path" ]; then
        echo -e "${GREEN}Found screen for letter $letter: $screen_path${NC}"
        echo "To fix this screen, you need to:"
        echo "1. Open the file in your editor"
        echo "2. Apply the template from scripts/fix-remaining-screens.js"
        echo "3. Update the letter-specific parts (words array, screen names, etc.)"
        echo ""
    else
        echo -e "${YELLOW}Could not find screen for letter $letter${NC}"
        echo "Please check if the file exists at a different location"
        echo ""
    fi
done

echo -e "${BLUE}===== Important Reminder =====${NC}"
echo "When fixing each screen, remember to:"
echo "1. Move word arrays outside the component"
echo "2. Use useRef for animation values"
echo "3. Add refs for state tracking"
echo "4. Use useCallback for all functions"
echo "5. Create memoized render functions"
echo "6. Add navigation protection during audio playback"
echo "7. Handle back button properly"
echo "8. Disable scrolling during audio playback"

echo -e "${GREEN}Happy fixing!${NC}" 