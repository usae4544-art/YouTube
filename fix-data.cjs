const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');
code = code.replace(
  'console.warn("Could not find audio URL in response", data);',
  'console.warn("Could not find audio URL in response");'
);
fs.writeFileSync('src/components/MusicTab.tsx', code);
