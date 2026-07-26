#!/bin/bash
sed -i '/const \[apkUpdateAvailable/,/apkUrl: string;/d' src/App.tsx
sed -i '/apkUrl: string; } | null>(null);/d' src/App.tsx

# Try to remove the check for updates effect block
sed -i '/\/\/ Check for APK OTA Updates/,/\[user\]);/d' src/App.tsx

