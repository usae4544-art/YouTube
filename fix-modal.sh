#!/bin/bash
sed -i '/\/\* APK OTA UPDATE MODAL \*\//,/<\/AnimatePresence>/d' src/App.tsx
