const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The music tab button in the sidebar starts with id="nav-music-btn" and goes up to the next button or similar.
const navBtnReg = /<button[\s\S]*?id="nav-music-btn"[\s\S]*?<\/button>/g;
code = code.replace(navBtnReg, "");

const mobBtnReg = /<button[\s\S]*?id="mob-nav-music"[\s\S]*?<\/button>/g;
code = code.replace(mobBtnReg, "");

fs.writeFileSync('src/App.tsx', code);
