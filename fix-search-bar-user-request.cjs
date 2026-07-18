const fs = require('fs');

// 1. Fix App.tsx (Make search bar wider)
let appCode = fs.readFileSync('src/App.tsx', 'utf8');
const searchContainerTarget = `<div className="flex-1 max-w-4xl mx-auto px-4 lg:px-12 w-full">
                   <SearchBar onSearch={setCurrentQuery} kidsMode={kidsMode} fontSizeClass={getFontSizeClass()} />
                </div>`;
const searchContainerNew = `<div className="flex-1 max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-12 w-full">
                   <SearchBar onSearch={setCurrentQuery} kidsMode={kidsMode} fontSizeClass={getFontSizeClass()} />
                </div>`;
appCode = appCode.replace(searchContainerTarget, searchContainerNew);
fs.writeFileSync('src/App.tsx', appCode);

// 2. Fix SearchBar.tsx (Restore dropdown shape to left-0 right-0 so it matches input, instead of max-w-3xl)
let searchBarCode = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');
const dropdownTarget = `className={\`absolute left-1/2 -translate-x-1/2 w-full max-w-3xl mt-3 p-4 rounded-3xl shadow-2xl border \${`;
const dropdownNew = `className={\`absolute left-0 right-0 mt-3 p-4 rounded-3xl shadow-2xl border \${`;
searchBarCode = searchBarCode.replace(dropdownTarget, dropdownNew);

const rootTarget = `className={\`relative w-full max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto z-40 \${fontSizeClass}\`}`;
const rootNew = `className={\`relative w-full mx-auto z-40 \${fontSizeClass}\`}`;
searchBarCode = searchBarCode.replace(rootTarget, rootNew);

fs.writeFileSync('src/components/SearchBar.tsx', searchBarCode);
