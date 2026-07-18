const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const targetDropdown = `className={\`absolute left-0 right-0 mt-3 p-4 rounded-3xl shadow-2xl border \${`;
const newDropdown = `className={\`absolute left-1/2 -translate-x-1/2 w-full max-w-3xl mt-3 p-4 rounded-3xl shadow-2xl border \${`;
code = code.replace(targetDropdown, newDropdown);

// Also make sure the search bar wrapper is large enough on desktop
const targetRoot = `className={\`relative w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto z-40 \${fontSizeClass}\`}`;
const newRoot = `className={\`relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto z-40 \${fontSizeClass}\`}`;
code = code.replace(targetRoot, newRoot);

fs.writeFileSync('src/components/SearchBar.tsx', code);
