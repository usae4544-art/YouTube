const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

code = code.replace(/          <motion\.div\n            id="search-dropdown"\n            initial=\{\{ opacity: 0, y: 10, scale: 0\.98 \}\}\n            animate=\{\{ opacity: 1, y: 5, scale: 1 \}\}\n            exit=\{\{ opacity: 0, y: 10, scale: 0\.98 \}\}\n            transition=\{\{ duration: 0\.2, ease: "easeOut" \}\}\n            className=\{`absolute left-0 right-0 mt-2 p-3 rounded-2xl shadow-2xl border \$\{\n              kidsMode\n                \? "bg-white border-rose-150 text-rose-900"\n                : "bg-\\[#0b0b12\\]\/95 backdrop-blur-2xl border-white\/10 text-gray-200"\n            \}`\}\n          >\n/g, '');

fs.writeFileSync('src/components/SearchBar.tsx', code);
