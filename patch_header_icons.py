import sys

with open("src/App.tsx", "r") as f:
    app_content = f.read()

old_header_icons = """                <div className="flex items-center gap-1 sm:gap-2 md:gap-4 shrink-0 order-2 sm:order-none ml-auto sm:ml-0">
                  <button
                    onClick={handleFactoryReset}
                    className="p-1.5 sm:p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Reset App Data"
                  >
                    <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setIsTransferAuthOpen(true)}
                    className={`p-1.5 sm:p-2 rounded-full ${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-white/10 text-white hover:bg-white/20"}`}
                    title="Device Transfer Login"
                  >
                    <Repeat className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`p-1.5 sm:p-2 rounded-full ${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-white/10 text-white hover:bg-white/20"}`}
                    title="Settings"
                  >
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>"""

new_header_icons = """                <div className="flex items-center gap-2 sm:gap-3 shrink-0 order-2 sm:order-none ml-auto sm:ml-0">
                  <button
                    onClick={handleFactoryReset}
                    className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    title="Reset App Data"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setIsTransferAuthOpen(true)}
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-white/10 text-white hover:bg-white/20"}`}
                    title="Device Transfer Login"
                  >
                    <Repeat className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowSettings(true)}
                    className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full ${kidsMode ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-white/10 text-white hover:bg-white/20"}`}
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>"""

app_content = app_content.replace(old_header_icons, new_header_icons)

with open("src/App.tsx", "w") as f:
    f.write(app_content)
