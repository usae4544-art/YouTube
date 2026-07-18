const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const navMobileTarget = `              <button
                id="mob-nav-you"
                onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "profile" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }\`}
              >
                {user && user.picture ? (
                  <img src={user.picture} alt="Profile" className={\`w-6 h-6 rounded-full border \${activeTab === "profile" ? "border-white" : "border-transparent"}\`} />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span>You</span>
              </button>
            </nav>`;

const navMobileNew = `              <button
                id="mob-nav-you"
                onClick={() => { setActiveTab("profile"); setIsOfflineMode(false); }}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  activeTab === "profile" && !isOfflineMode
                    ? kidsMode ? "text-rose-500" : "text-white"
                    : "text-gray-500"
                }\`}
              >
                {user && user.picture ? (
                  <img src={user.picture} alt="Profile" className={\`w-6 h-6 rounded-full border \${activeTab === "profile" ? "border-white" : "border-transparent"}\`} />
                ) : (
                  <User className="w-6 h-6" />
                )}
                <span>You</span>
              </button>
              
              <button
                id="mob-nav-kids"
                onClick={toggleKidsMode}
                className={\`flex flex-col items-center gap-1 text-[10px] font-bold \${
                  kidsMode
                    ? "text-rose-500"
                    : "text-gray-500 hover:text-white"
                }\`}
              >
                <Baby className="w-6 h-6" />
                <span>Kids</span>
              </button>
            </nav>`;

code = code.replace(navMobileTarget, navMobileNew);

fs.writeFileSync('src/App.tsx', code);
