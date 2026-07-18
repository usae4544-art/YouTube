const fs = require('fs');
let code = fs.readFileSync('src/components/VideoPlayerModal.tsx', 'utf8');

// The replacement logic:
// We need to change:
//         {isAudioMode ? (
//           <>
//             <div className="w-0 h-0 overflow-hidden opacity-0 pointer-events-none fixed">
//               {/* Keep iframe mounted so it doesn't stop */}
//               <iframe ... />
//             </div>
//             <div className="w-10 h-10 ..."> ... </div>
//             ...
//             </button>
//           </>
//         ) : (
//           <>

// To:
//         <div className={`w-full h-full flex flex-row items-center p-3 gap-3 ${!isAudioMode ? "hidden" : ""}`}>
//             <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
//               <Headphones className="w-5 h-5 text-red-500 animate-pulse" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="text-xs font-bold truncate text-white">{video.title}</p>
//               <p className="text-[10px] text-gray-400 truncate">Playing in background...</p>
//             </div>
//             <button onClick={() => setIsAudioMode(false)} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer shrink-0">
//               <Maximize2 className="w-4 h-4" />
//             </button>
//             <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors cursor-pointer shrink-0">
//               <X className="w-4 h-4" />
//             </button>
//         </div>
//         <div className={`flex flex-col w-full h-full overflow-hidden ${isAudioMode ? "opacity-0 absolute pointer-events-none w-px h-px overflow-hidden" : ""}`}>

// And then replace the closing 
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

const match = code.match(/\{isAudioMode \? \([\s\S]*?\) : \(\s*<>\s*\{\/\* Top Header Controls \*\/\}/);
if (match) {
  code = code.replace(match[0], `        <div className={\`w-full h-full flex flex-row items-center p-3 gap-3 \${!isAudioMode ? "hidden" : ""}\`}>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-red-500 animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-white">{video.title}</p>
              <p className="text-[10px] text-gray-400 truncate">Playing in background...</p>
            </div>
            <button onClick={() => setIsAudioMode(false)} className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors cursor-pointer shrink-0">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
        </div>
        <div className={\`flex flex-col w-full h-full overflow-hidden \${isAudioMode ? "opacity-0 absolute pointer-events-none w-px h-px overflow-hidden" : ""}\`}>
            {/* Top Header Controls */}`);
            
  // Also we need to replace the ending closing fragments because we changed `) : (` to just two sibling divs.
  // We need to find the `          </>\n        )\n      </motion.div>` 
  // wait, the old code had:
  //           </div>
  //         </div>
  //       </>  <--- we need to replace this with </div> (closing the new wrapper)
  //     </motion.div>
  //   </motion.div>
  // );

  code = code.replace(/<\/>\n\s*\}\n\s*<\/motion\.div>/g, '        </div>\n      </motion.div>');
  code = code.replace(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<\/motion\.div>\n\s*<\/motion\.div>\n\s*\);/g, 
  `        </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );`);
  
  // Wait, let's just do a simpler string replace for the ending:
  const endingMatch = code.match(/              \)\}\n            <\/div>\n          <\/div>\n        <\/div>\n      <\/motion\.div>\n    <\/motion\.div>\n  \);\n\}/);
  // Wait, the previous code had `) : (` which means the end is `</>\n      </motion.div>`.
  // Wait, let's read the exact end of file!
}
fs.writeFileSync('src/components/VideoPlayerModal.tsx', code);
console.log("Replaced!");
