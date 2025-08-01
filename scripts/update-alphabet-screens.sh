#!/bin/bash
echo "Updating alphabet screens..."
node scripts/update-letter-titles.js
echo ""
echo "Updating word puzzle screens..."
node scripts/update-word-puzzle-screens.js
echo ""
echo "All updates completed!" 