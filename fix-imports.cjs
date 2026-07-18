const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(/import {([^}]+)} from "lucide-react";/, (match, p1) => {
  return `import { ${p1.trim()}, Check } from "lucide-react";`;
});
fs.writeFileSync('src/App.tsx', code);
