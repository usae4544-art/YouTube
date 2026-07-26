#!/bin/bash
sed -i 's/, Download, Share2/, Share2/g' src/components/VideoPlayerModal.tsx
sed -i 's/DownloadCloud, //g' src/components/VideoPlayerModal.tsx
