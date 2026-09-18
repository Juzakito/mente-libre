const fs = require('fs');
let file = fs.readFileSync('src/components/MainLayout.jsx', 'utf8');

// Replace handleSOS
file = file.replace(/handleSOS:\s*\(\)\s*=>\s*setShowSOS\(true\)/g, "handleSOS: () => navigate('/app/sos')");

// Remove showSOS usage
file = file.replace(/\{showSOS && <SOSModal reason="manual" onClose=\{\(\) => setShowSOS\(false\)\} \/>\}/g, '');
file = file.replace(/const \[showSOS, setShowSOS\] = useState\(false\);/g, '');

// The activeInfoModal is huge. Let's find the start of 'mejoras' and end of 'acerca'.
const startStr = "{activeInfoModal === 'mejoras' && (() => {";
const endStr = "{activeInfoModal === 'acerca' && (";

const startIndex = file.indexOf(startStr);
const endBlockStart = file.indexOf(endStr);
const endIndex = file.indexOf('            )}', endBlockStart) + '            )}'.length;

if (startIndex !== -1 && endIndex !== -1) {
  file = file.substring(0, startIndex) + file.substring(endIndex);
} else {
  console.log('Could not find modal block bounds');
}

// Write back
fs.writeFileSync('src/components/MainLayout.jsx', file);
console.log('Cleanup complete.');
