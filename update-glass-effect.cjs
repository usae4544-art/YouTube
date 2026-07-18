const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const headerTarget = `<header className={\`sticky top-0 z-30 transition-colors duration-500 border-b shadow-sm backdrop-blur-xl \${
              kidsMode
                ? "bg-white/80 border-rose-100 backdrop-blur-md"
                : "bg-[#0f0f0f] border-white/10"
            }\`}>`;
const headerNew = `<header className={\`sticky top-0 z-30 transition-colors duration-500 border-b shadow-lg \${
              kidsMode
                ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200"
                : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"
            }\`}>`;

code = code.replace(headerTarget, headerNew);

const sidebarTarget = `<aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none \${kidsMode ? "bg-white/50 border-rose-100" : "bg-[#0f0f0f] border-white/10"}\`}>`;
const sidebarNew = `<aside className={\`hidden md:flex flex-col w-64 lg:w-72 border-r overflow-y-auto scrollbar-none \${kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"}\`}>`;

code = code.replace(sidebarTarget, sidebarNew);

const navMobileTarget = `<nav className={\`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t backdrop-blur-xl \${
              kidsMode ? "bg-white/90 border-rose-100" : "bg-[#0f0f0f]/90 border-white/10"
            }\`}>`;
const navMobileNew = `<nav className={\`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t \${
              kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"
            }\`}>`;

code = code.replace(navMobileTarget, navMobileNew);

fs.writeFileSync('src/App.tsx', code);
