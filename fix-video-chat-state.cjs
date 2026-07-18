const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayerModal.tsx', 'utf8');

if (!code.includes('const [chatMessages')) {
    code = code.replace(
        'const [aiSummary, setAiSummary] = useState<AISummary | null>(null);',
        `const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [chatMessages, setChatMessages] = useState<{role: 'user'|'assistant', text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const handleChat = async () => {
    if (!chatInput.trim() || isChatting) return;
    
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsChatting(true);
    
    try {
      const res = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          videoContext: {
            title: video.title,
            description: video.description,
            channelTitle: video.channelTitle
          },
          kidsMode
        })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", text: data.reply || "Sorry, I couldn't understand that." }]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: "assistant", text: "Oops, something went wrong!" }]);
    } finally {
      setIsChatting(false);
    }
  };`
    );
    fs.writeFileSync('src/components/VideoPlayerModal.tsx', code);
}
