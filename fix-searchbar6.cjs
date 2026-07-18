const fs = require('fs');
let code = fs.readFileSync('src/components/SearchBar.tsx', 'utf8');

const missingFunctions = `
  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced API Call for Suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!inputValue.trim()) {
        setSuggestions([]);
        setSafetyCheck({ safe: true });
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(\`/api/gemini/suggest?q=\${encodeURIComponent(inputValue)}&kidsMode=\${kidsMode}\`);
        const data = await res.json();
        setSuggestions(data.suggestions || []);
        setSafetyCheck({ safe: data.safe ?? true, explanation: data.safetyExplanation });
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [inputValue, kidsMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    if (!safetyCheck.safe) {
      alert("Please adjust your search. Let's find something safe!");
      return;
    }
    
    addToHistory(inputValue);
    onSearch(inputValue);
    setIsOpen(false);
  };

  const selectSuggestion = (val: string) => {
    setInputValue(val);
    addToHistory(val);
    onSearch(val);
    setIsOpen(false);
  };

  const handleClear = () => {
    setInputValue("");
    setSuggestions([]);
    setSafetyCheck({ safe: true });
  };
`;

const replaceIndex = code.indexOf('  // Close suggestions dropdown when clicking outside');
const renderIndex = code.indexOf('  return (');
code = code.slice(0, replaceIndex) + missingFunctions + '\n' + code.slice(renderIndex);

fs.writeFileSync('src/components/SearchBar.tsx', code);
