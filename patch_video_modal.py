import sys

with open("src/components/VideoPlayerModal.tsx", "r") as f:
    content = f.read()

state_adds = """  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [retryKey, setRetryKey] = useState(0);"""

content = content.replace("""  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");""", state_adds)


effect_adds = """
  // Network resiliency for YouTube iframe
  useEffect(() => {
    const handleOnline = () => {
      // Force iframe reload when network reconnects to fix ERR_NETWORK_CHANGED
      setRetryKey(prev => prev + 1);
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);
"""

content = content.replace("  const generateFallbackComments = () => {", effect_adds + "\n  const generateFallbackComments = () => {")

iframe_str = """              <iframe
                id="youtube-player-frame"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin || 'https://www.youtube.com'}`}"""

iframe_repl = """              <iframe
                key={`yt-${retryKey}`}
                id="youtube-player-frame"
                src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&enablejsapi=1&origin=${window.location.origin || 'https://www.youtube.com'}`}"""

content = content.replace(iframe_str, iframe_repl)

with open("src/components/VideoPlayerModal.tsx", "w") as f:
    f.write(content)
