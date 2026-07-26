#!/bin/bash
sed -i '/<nav/,/<\/nav>/c\
            {/* MOBILE NAVIGATION */}\
            <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-3 border-t ${\
              kidsMode ? "bg-white/40 border-white/50 backdrop-blur-3xl backdrop-saturate-200" : "bg-[#0b0b12]/50 border-white/10 backdrop-blur-3xl backdrop-saturate-200"\
            }`}>\
              <button\
                onClick={() => setActiveTab("home")}\
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${\
                  activeTab === "home" ? (kidsMode ? "text-rose-500" : "text-white") : "text-gray-500"\
                }`}\
              >\
                <Home className="w-6 h-6" />\
                <span>Home</span>\
              </button>\
\
              <button\
                id="mob-nav-subs"\
                onClick={() => setActiveTab("favorites")}\
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${\
                  activeTab === "favorites" ? (kidsMode ? "text-rose-500" : "text-white") : "text-gray-500"\
                }`}\
              >\
                <Heart className="w-6 h-6" />\
                <span>Favorites</span>\
              </button>\
              \
              <button\
                id="mob-nav-you"\
                onClick={() => setActiveTab("profile")}\
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${\
                  activeTab === "profile" ? (kidsMode ? "text-rose-500" : "text-white") : "text-gray-500"\
                }`}\
              >\
                {user && user.picture ? (\
                  <img src={user.picture} alt="Profile" className={`w-6 h-6 rounded-full border ${activeTab === "profile" ? "border-white" : "border-transparent"}`} />\
                ) : (\
                  <User className="w-6 h-6" />\
                )}\
                <span>You</span>\
              </button>\
\
              <button\
                id="mob-nav-kids"\
                onClick={requestToggleKidsMode}\
                className={`flex flex-col items-center gap-1 text-[10px] font-bold ${\
                  kidsMode ? "text-rose-500" : "text-gray-500 hover:text-white"\
                }`}\
              >\
                <Baby className="w-6 h-6" />\
                <span>Kids Mode</span>\
              </button>\
\
              {user && !kidsMode && (\
                <button\
                  id="mob-nav-issue"\
                  onClick={() => setActiveTab("issues")}\
                  className={`flex flex-col items-center gap-1 text-[10px] font-bold ${\
                    activeTab === "issues" ? "text-white" : "text-gray-500 hover:text-white"\
                  }`}\
                >\
                  <AlertCircle className="w-6 h-6" />\
                  <span>Issues</span>\
                </button>\
              )}\
            </nav>\
' src/App.tsx
