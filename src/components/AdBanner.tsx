import React, { useEffect, useRef } from "react";

export default function AdBanner({ refreshKey = 0 }: { refreshKey?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear contents to handle React strict mode double-invocations and refreshes
    containerRef.current.innerHTML = '<div id="container-e1b1c25af8556fb78699ba1057a74b84"></div>';

    const script = document.createElement("script");
    script.src = "https://pl30477425.effectivecpmnetwork.com/e1b1c25af8556fb78699ba1057a74b84/invoke.js";
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    
    containerRef.current.appendChild(script);
  }, [refreshKey]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 my-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">          Sponsored Advertisement        </span>
      </div>
      <div
        className="w-full flex justify-center items-center min-h-[90px]"
        ref={containerRef}
      >
      </div>
    </div>
  );
}
