const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add Settings import
if (!code.includes('Settings,')) {
    code = code.replace(/import \{([\s\S]*?)\} from "lucide-react";/, 'import {$1, Settings} from "lucide-react";');
}

// Add state
const statePattern = /const \[vaultPassword, setVaultPassword\] = useState<string \| null>\(localStorage\.getItem\("nexus_vault_pw"\)\);/;
if (!code.includes('const [vaultIcon,')) {
    code = code.replace(
        statePattern, 
        `const [vaultPassword, setVaultPassword] = useState<string | null>(localStorage.getItem("nexus_vault_pw"));
  const [vaultIcon, setVaultIcon] = useState<string>(() => localStorage.getItem("nexus_vault_icon") || "");`
    );
}

// Update header icon
const headerLock = `<Lock className="w-4 h-4" />
                    </button>
                  )}`;
const headerLockReplacement = `{vaultIcon ? <span className="text-sm leading-none">{vaultIcon}</span> : <Lock className="w-4 h-4" />}
                    </button>
                  )}`;
code = code.replace(headerLock, headerLockReplacement);

// Update prompt overlay lock
const promptLock = `<div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>`;
const promptLockReplacement = `<div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
                      {vaultIcon ? <span className="text-3xl leading-none">{vaultIcon}</span> : <Lock className="w-8 h-8 text-white" />}
                    </div>`;
code = code.replace(promptLock, promptLockReplacement);

// Update vault view header lock and add edit button
const vaultViewHeader = `<div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-red-500" />
                      </div>
                      <h2 className="text-xl font-bold text-white font-display">Secure Vault</h2>
                    </div>
                    <button
                      onClick={() => setIsVaultUnlocked(false)}
                      className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>`;

const vaultViewHeaderReplacement = `<div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        {vaultIcon ? <span className="text-xl leading-none">{vaultIcon}</span> : <Lock className="w-5 h-5 text-red-500" />}
                      </div>
                      <h2 className="text-xl font-bold text-white font-display">Secure Vault</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newIcon = prompt("Enter a custom emoji or short text for the Vault icon (leave empty to reset):", vaultIcon);
                          if (newIcon !== null) {
                            setVaultIcon(newIcon);
                            localStorage.setItem("nexus_vault_icon", newIcon);
                          }
                        }}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                        title="Customize Icon"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setIsVaultUnlocked(false)}
                        className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>`;

code = code.replace(vaultViewHeader, vaultViewHeaderReplacement);

fs.writeFileSync('src/App.tsx', code);
