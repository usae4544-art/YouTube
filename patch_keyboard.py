import sys

with open("src/components/VirtualKeyboard.tsx", "r") as f:
    content = f.read()

# 1. Add lastPastedTextRef
content = content.replace(
    'const [clipboardText, setClipboardText] = useState("");',
    'const [clipboardText, setClipboardText] = useState("");\n  const lastPastedTextRef = useRef("");'
)

# 2. Update readClipboard in useEffect
old_read = """  useEffect(() => {
    const readClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text) {
             setClipboardText(text);
          }
        }
      } catch (err) {
        // console.warn("Clipboard read not permitted");
      }
    };
    if (isOpen) {
      readClipboard();
    }
  }, [isOpen]);"""

new_read = """  useEffect(() => {
    const readClipboard = async () => {
      try {
        if (navigator.clipboard && navigator.clipboard.readText) {
          const text = await navigator.clipboard.readText();
          if (text && text !== lastPastedTextRef.current) {
             setClipboardText(text);
          }
        }
      } catch (err) {
        // console.warn("Clipboard read not permitted");
      }
    };
    if (isOpen) {
      readClipboard();
    }
  }, [isOpen]);"""

content = content.replace(old_read, new_read)

# 3. Update handleCopy in useEffect
old_handleCopy = """  useEffect(() => {
     const handleCopy = () => {
        setTimeout(async () => {
           try {
             if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                if (text) setClipboardText(text);
             } else {
                const selection = window.getSelection();
                if (selection) setClipboardText(selection.toString());
             }
           } catch (e) {}
        }, 100);
     };
     document.addEventListener('copy', handleCopy);
     return () => document.removeEventListener('copy', handleCopy);
  }, []);"""

new_handleCopy = """  useEffect(() => {
     const handleCopy = () => {
        setTimeout(async () => {
           try {
             if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                if (text && text !== lastPastedTextRef.current) setClipboardText(text);
             } else {
                const selection = window.getSelection();
                if (selection) {
                    const text = selection.toString();
                    if (text && text !== lastPastedTextRef.current) setClipboardText(text);
                }
             }
           } catch (e) {}
        }, 100);
     };
     document.addEventListener('copy', handleCopy);
     return () => document.removeEventListener('copy', handleCopy);
  }, []);"""

content = content.replace(old_handleCopy, new_handleCopy)

# 4. Update paste bar click
old_paste = """                  onPointerDown={(e) => {
                    if ('preventDefault' in e) e.preventDefault();
                    e.stopPropagation();
                    playClickSound();
                    triggerHaptic();
                    onKeyPress(clipboardText);
                    setClipboardText("");
                  }}"""

new_paste = """                  onPointerDown={(e) => {
                    if ('preventDefault' in e) e.preventDefault();
                    e.stopPropagation();
                    playClickSound();
                    triggerHaptic();
                    onKeyPress(clipboardText);
                    lastPastedTextRef.current = clipboardText;
                    setClipboardText("");
                  }}"""

content = content.replace(old_paste, new_paste)

# 5. Update dismiss button click
old_dismiss = """                   onPointerDown={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      setClipboardText("");
                   }}"""

new_dismiss = """                   onPointerDown={(e) => {
                      if ('preventDefault' in e) e.preventDefault();
                      e.stopPropagation();
                      lastPastedTextRef.current = clipboardText;
                      setClipboardText("");
                   }}"""

content = content.replace(old_dismiss, new_dismiss)

with open("src/components/VirtualKeyboard.tsx", "w") as f:
    f.write(content)
