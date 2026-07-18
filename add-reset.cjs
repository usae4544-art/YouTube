const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Insert handleFactoryReset before return
const returnTarget = `  return (\n    <div`;
const resetFunction = `  const handleFactoryReset = () => {
    if (window.confirm("Are you sure you want to completely reset the app? This will clear all data, including history, favorites, downloads, vault, and logins.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div`;

code = code.replace(returnTarget, resetFunction);

// Add button to header
const headerTarget = `<div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button onClick={() => setKidsMode(!kidsMode)}`;
const headerReplacement = `<div className="flex items-center gap-2 md:gap-4 shrink-0">
                  <button onClick={handleFactoryReset} className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors" title="Reset App Data">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => setKidsMode(!kidsMode)}`;

code = code.replace(headerTarget, headerReplacement);

fs.writeFileSync('src/App.tsx', code);
