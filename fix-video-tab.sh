#!/bin/bash
sed -i '382,385c\
                className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${\
                  activeTab === "info"\
                    ? kidsMode ? "border-rose-500 text-rose-600" : "border-red-500 text-white bg-white/2"\
                    : "border-transparent text-gray-400 hover:text-gray-200"\
                }`}' src/components/VideoPlayerModal.tsx
