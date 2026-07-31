import sys

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace desktop sidebar issue button condition
content = content.replace(
"""                  {user && !kidsMode && (
                    <button
                      onClick={() => setActiveTab("issues")}
                      className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "issues" ? "bg-white/10 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <AlertCircle
                        className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "issues" ? "scale-110" : "group-hover:scale-110"}`}
                      />{" "}
                      <span className="font-bold relative z-10">Issues</span>
                    </button>
                  )}""",
"""                  {user && !kidsMode && user?.email?.toLowerCase() === "usae4544@gmail.com" && (
                    <button
                      onClick={() => setActiveTab("issues")}
                      className={`group w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-300 relative overflow-hidden ${activeTab === "issues" ? "bg-white/10 text-white shadow-lg" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
                    >
                      <AlertCircle
                        className={`w-6 h-6 relative z-10 transition-transform duration-300 ${activeTab === "issues" ? "scale-110" : "group-hover:scale-110"}`}
                      />{" "}
                      <span className="font-bold relative z-10">Issue Mode</span>
                    </button>
                  )}""")

# Replace mobile nav issue button condition
content = content.replace(
"""              {user && !kidsMode && (
                <button
                  id="mob-nav-issue"
                  onClick={() => setActiveTab("issues")}
                  className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                    activeTab === "issues"
                      ? "text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <AlertCircle className="w-6 h-6" />
                  <span>Issues</span>
                </button>
              )}""",
"""              {user && !kidsMode && user?.email?.toLowerCase() === "usae4544@gmail.com" && (
                <button
                  id="mob-nav-issue"
                  onClick={() => setActiveTab("issues")}
                  className={`flex flex-col items-center gap-1 text-[10px] font-bold ${
                    activeTab === "issues"
                      ? "text-white"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  <AlertCircle className="w-6 h-6" />
                  <span>Issue Mode</span>
                </button>
              )}""")

with open("src/App.tsx", "w") as f:
    f.write(content)
