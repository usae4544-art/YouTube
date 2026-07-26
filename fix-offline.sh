#!/bin/bash
sed -i 's/offline downloads/background playback/gi' src/App.tsx
sed -i 's/downloads, / /g' src/App.tsx
sed -i 's/DownloadCloud,//g' src/App.tsx
sed -i 's/Download,//g' src/App.tsx
sed -i 's/DownloadCloud,//g' src/components/VideoGrid.tsx
