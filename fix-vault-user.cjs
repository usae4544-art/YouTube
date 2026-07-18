const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldHeaderVault = `{/* Secure Vault Access */}
                  <button
                    onClick={() => setShowVaultPrompt(true)}
                    className={\`p-2.5 rounded-full transition-all cursor-pointer \${
                      kidsMode
                        ? "bg-rose-100 text-rose-900"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }\`}
                    title="Open Secure Vault"
                  >
                    <Lock className="w-4 h-4" />
                  </button>`;

const newHeaderVault = `{/* Secure Vault Access */}
                  {user && (
                    <button
                      onClick={() => setShowVaultPrompt(true)}
                      className={\`p-2.5 rounded-full transition-all cursor-pointer \${
                        kidsMode
                          ? "bg-rose-100 text-rose-900"
                          : "bg-white/5 text-gray-300 hover:bg-white/10"
                      }\`}
                      title="Open Secure Vault"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  )}`;

code = code.replace(oldHeaderVault, newHeaderVault);

const oldHandleVault = `  const handleToggleVault = (video: YouTubeVideo) => {
    if (!vaultPassword) {`;

const newHandleVault = `  const handleToggleVault = (video: YouTubeVideo) => {
    if (!user) {
      alert("Please sign in from the Profile tab to use the Secure Vault.");
      return;
    }
    if (!vaultPassword) {`;

code = code.replace(oldHandleVault, newHandleVault);

fs.writeFileSync('src/App.tsx', code);
