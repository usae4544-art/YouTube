const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Sync Manager */}
                  <button
                    id="open-sync-hub-btn"`;

const newCode = `{/* Secure Vault Access */}
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
                  {/* Sync Manager */}
                  <button
                    id="open-sync-hub-btn"`;

code = code.replace(target, newCode);
fs.writeFileSync('src/App.tsx', code);
