import sys

with open("src/components/VirtualKeyboard.tsx", "r") as f:
    content = f.read()

# Add touch-action: none and hardware acceleration to the main container
content = content.replace(
    'className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pt-2 pb-6 px-1 sm:px-2 select-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"',
    'className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pt-2 pb-6 px-1 sm:px-2 select-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"\n          style={{ touchAction: "none", transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}'
)

# Replace 'onPointerDown' with 'onTouchStart' and 'onMouseDown' for 0 latency?
# The user wants touchstart / pointerdown. `onPointerDown` is already there. Let's change it to `onTouchStart` and `onMouseDown` to ensure minimal latency, and also prevent default to stop scrolling.
# Wait, `handleKeyClick` currently accepts `React.PointerEvent<HTMLButtonElement>`.
# Let's change `handleKeyClick` signature to `(key: string, e: React.UIEvent)`.

content = content.replace(
    'const handleKeyClick = (key: string, e: React.PointerEvent<HTMLButtonElement>) => {',
    'const handleKeyClick = (key: string, e: React.SyntheticEvent) => {'
)

# And replace `onPointerDown={(e) => handleKeyClick(key.char, e)}` with `onTouchStart={(e) => handleKeyClick(key.char, e)} onMouseDown={(e) => handleKeyClick(key.char, e)}`
content = content.replace(
    'onPointerDown={(e) => handleKeyClick(key.char, e)}',
    'onTouchStart={(e) => handleKeyClick(key.char, e)} onMouseDown={(e) => { e.preventDefault(); handleKeyClick(key.char, e); }}'
)
content = content.replace(
    'onPointerDown={(e) => handleKeyClick(char, e)}',
    'onTouchStart={(e) => handleKeyClick(char, e)} onMouseDown={(e) => { e.preventDefault(); handleKeyClick(char, e); }}'
)

# Remove the 50ms throttle which might interfere with ultra-fast typing
content = content.replace(
    'if (now - lastKeyTimeRef.current < 50) return;',
    '// removed throttle for ultra-fast typing\n    // if (now - lastKeyTimeRef.current < 50) return;'
)

# Prevent default on clipboard as well
content = content.replace(
    'onPointerDown={(e) => {',
    'onTouchStart={(e) => {\n                    if (\'preventDefault\' in e) e.preventDefault();\n                    e.stopPropagation();\n                    playClickSound();\n                    triggerHaptic();\n                    onKeyPress(clipboardText);\n                    lastPastedTextRef.current = clipboardText;\n                    setClipboardText("");\n                  }}\n                  onMouseDown={(e) => {'
)

# Also apply will-change to the keyboard motion.div
content = content.replace(
    '<motion.div\n          initial={{ y: "100%", opacity: 0 }}\n          animate={{ y: 0, opacity: 1 }}\n          exit={{ y: "100%", opacity: 0 }}\n          transition={{ type: "spring", damping: 25, stiffness: 300 }}\n          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pt-2 pb-6 px-1 sm:px-2 select-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"',
    '<motion.div\n          initial={{ y: "100%", opacity: 0 }}\n          animate={{ y: 0, opacity: 1 }}\n          exit={{ y: "100%", opacity: 0 }}\n          transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.5 }}\n          style={{ touchAction: "none", transform: "translate3d(0,0,0)", willChange: "transform, opacity" }}\n          className="fixed bottom-0 left-0 right-0 z-50 flex flex-col pt-2 pb-6 px-1 sm:px-2 select-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"'
)

with open("src/components/VirtualKeyboard.tsx", "w") as f:
    f.write(content)
