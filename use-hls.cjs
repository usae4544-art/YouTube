const fs = require('fs');
let code = fs.readFileSync('src/components/MusicTab.tsx', 'utf8');

if (!code.includes('import Hls from')) {
  code = code.replace(
    `import { motion, AnimatePresence } from 'motion/react';`,
    `import { motion, AnimatePresence } from 'motion/react';\nimport Hls from 'hls.js';`
  );
  
  const oldUseEffect = `  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback error", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);`;
  
  const newUseEffect = `  useEffect(() => {
    if (audioUrl && audioRef.current) {
      if (audioUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(audioUrl);
          hls.attachMedia(audioRef.current);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (isPlaying) {
              audioRef.current?.play().catch(e => console.error("HLS Playback error", e));
            }
          });
          return () => hls.destroy();
        } else if (audioRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          audioRef.current.src = audioUrl;
          if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Safari HLS Playback error", e));
          }
        }
      } else {
        audioRef.current.src = audioUrl;
        if (isPlaying) {
          audioRef.current.play().catch(e => console.error("Playback error", e));
        }
      }
    }
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current && audioUrl) {
      if (isPlaying && audioRef.current.paused) {
        audioRef.current.play().catch(e => console.error("Playback error", e));
      } else if (!isPlaying && !audioRef.current.paused) {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioUrl]);`;

  code = code.replace(oldUseEffect, newUseEffect);

  // Remove `src={audioUrl}` from the audio element to avoid double loading
  code = code.replace(/<audio([^>]*)src=\{audioUrl\}/, '<audio$1');

  fs.writeFileSync('src/components/MusicTab.tsx', code);
}
