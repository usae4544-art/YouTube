import sys

with open("src/components/VirtualKeyboard.tsx", "r") as f:
    content = f.read()

bad_block = """                   onTouchStart={(e) => {
                    if ('preventDefault' in e) e.preventDefault();
                    e.stopPropagation();
                    playClickSound();
                    triggerHaptic();
                    onKeyPress(clipboardText);
                    lastPastedTextRef.current = clipboardText;
                    setClipboardText("");
                  }}
                  onMouseDown={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      lastPastedTextRef.current = clipboardText;
                      setClipboardText("");
                   }}"""

good_block = """                   onTouchStart={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      lastPastedTextRef.current = clipboardText;
                      setClipboardText("");
                   }}
                   onMouseDown={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      lastPastedTextRef.current = clipboardText;
                      setClipboardText("");
                   }}"""

content = content.replace(bad_block, good_block)

with open("src/components/VirtualKeyboard.tsx", "w") as f:
    f.write(content)
