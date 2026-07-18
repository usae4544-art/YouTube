const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');

code = code.replace(
  'console.error(`Failed to fetch ${cat.id}:`, e);',
  '// silently catch network errors since we have fallbacks\n            // console.error(`Failed to fetch ${cat.id}:`, e);'
);

code = code.replace(
  'console.error(err);\n      // Fallback search results',
  '// silently catch network errors\n      // Fallback search results'
);

code = code.replace(
  'console.error("Failed to load home data", err);',
  '// console.error("Failed to load home data", err);'
);

fs.writeFileSync('src/components/MusicTab.tsx', code);
