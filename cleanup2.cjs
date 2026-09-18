const fs = require('fs');
let file = fs.readFileSync('src/components/MainLayout.jsx', 'utf8');

const lines = file.split('\n');
const newLines = [];

for (let i = 0; i < lines.length; i++) {
  // If we are between the start of featureVotes and the end of handleFindPeerMatch
  if (i >= 90 && i <= 210) {
    continue;
  }
  newLines.push(lines[i]);
}

fs.writeFileSync('src/components/MainLayout.jsx', newLines.join('\n'));
console.log('Cleanup 2 complete.');
