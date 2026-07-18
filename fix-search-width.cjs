const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Global Search Bar */}
            <div className="flex-1 max-w-4xl mx-4 lg:mx-12">
               <SearchBar onSearch={handleSearchSubmit} currentQuery={searchQuery} kidsMode={kidsMode} />
            </div>`;
const newCode = `{/* Global Search Bar */}
            <div className="flex-1 max-w-6xl mx-4 lg:mx-8 w-full">
               <SearchBar onSearch={handleSearchSubmit} currentQuery={searchQuery} kidsMode={kidsMode} />
            </div>`;

code = code.replace(target, newCode);
fs.writeFileSync('src/App.tsx', code);
