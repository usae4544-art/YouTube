const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
/                          downloadedVideos=\{downloadedVideos\}\n                          onToggleDownload=\{handleToggleDownload\}\n                        \/>/g,
`                          downloadedVideos={downloadedVideos}
                          onToggleDownload={handleToggleDownload}
                          onToggleVault={handleToggleVault}
                        />`
);

code = code.replace(
/                          downloadedVideos=\{downloadedVideos\}\n                          onToggleDownload=\{handleToggleDownload\}\n                          showDeleteMode=\{true\}\n                        \/>/g,
`                          downloadedVideos={downloadedVideos}
                          onToggleDownload={handleToggleDownload}
                          onToggleVault={handleToggleVault}
                          showDeleteMode={true}
                        />`
);

code = code.replace(
/                          downloadedVideos=\{downloadedVideos\}\n                          onToggleDownload=\{handleToggleDownload\}\n                          showDeleteMode=\{isOfflineMode \|\| activeTab === "offline"\}\n                        \/>/g,
`                          downloadedVideos={downloadedVideos}
                          onToggleDownload={handleToggleDownload}
                          onToggleVault={handleToggleVault}
                          showDeleteMode={isOfflineMode || activeTab === "offline"}
                        />`
);

fs.writeFileSync('src/App.tsx', code);
