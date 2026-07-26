#!/bin/bash
sed -i 's/isDownloaded,//g' src/components/VideoPlayerModal.tsx
sed -i 's/onToggleDownload,//g' src/components/VideoPlayerModal.tsx
sed -i '/isDownloaded: boolean;/d' src/components/VideoPlayerModal.tsx
sed -i '/onToggleDownload: (video: YouTubeVideo) => void;/d' src/components/VideoPlayerModal.tsx
sed -i 's/downloadedVideos = \[\], onToggleDownload,//g' src/components/VideoGrid.tsx
sed -i 's/downloadedVideos,//g' src/components/VideoGrid.tsx
sed -i 's/onToggleDownload,//g' src/components/VideoGrid.tsx
sed -i '/downloadedVideos?: YouTubeVideo\[\];/d' src/components/VideoGrid.tsx
sed -i '/onToggleDownload?: (video: YouTubeVideo) => void;/d' src/components/VideoGrid.tsx
