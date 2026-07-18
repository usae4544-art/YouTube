const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayerModal.tsx', 'utf8');

if (!code.includes('Send,')) {
    code = code.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import {$1, Send} from "lucide-react";');
    fs.writeFileSync('src/components/VideoPlayerModal.tsx', code);
}
