#!/bin/bash
sed -i '202,204c\
  return (\
    <div' src/components/VideoPlayerModal.tsx
