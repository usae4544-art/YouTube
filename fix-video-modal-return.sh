#!/bin/bash
sed -i 's/<div/<motion.div/g' src/components/VideoPlayerModal.tsx
sed -i 's/<\/div>/<\/motion.div>/g' src/components/VideoPlayerModal.tsx
