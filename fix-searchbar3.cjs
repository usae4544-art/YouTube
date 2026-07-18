const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const target = `          <motion.div
            id="search-dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={\`absolute left-0 right-0 mt-2 p-3 rounded-2xl shadow-2xl border \${
              kidsMode
                ? "bg-white border-rose-150 text-rose-900"
                : "bg-[#0b0b12]/95 backdrop-blur-2xl border-white/10 text-gray-200"
            }\`}
          >
            {/* Safety block message in Kids Mode */}`;

const newCode = `            {/* Safety block message in Kids Mode */}`;

code = code.replace(target, newCode);
fs.writeFileSync('src/components/SearchBar.tsx', code);
