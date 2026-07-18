import React, { useState, useEffect } from "react";
import { Signal, Wifi } from "lucide-react";

export default function NetworkSpeedIndicator() {
  const [speed, setSpeed] = useState<string>("Detecting...");
  const [type, setType] = useState<string>("...");

  useEffect(() => {
    const updateSpeed = () => {
      if ('connection' in navigator) {
        const conn = (navigator as any).connection;
        if (conn && conn.downlink) {
          setSpeed(`${conn.downlink} Mbps`);
          setType(conn.effectiveType || "4g");
        }
      } else {
        setSpeed("Fast");
        setType("WIFI");
      }
    };
    
    updateSpeed();
    const interval = setInterval(updateSpeed, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-14 lg:top-20 right-4 z-[999] flex items-center gap-1.5 bg-black/80 backdrop-blur-xl border border-white/10 px-2.5 py-1 rounded-full shadow-2xl pointer-events-none">
      <div className="relative flex items-center justify-center">
        <Wifi className="w-3.5 h-3.5 text-emerald-400" />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-bold text-emerald-400 leading-none">
          {speed}
        </span>
        <span className="text-[8px] text-gray-400 uppercase tracking-wider leading-none mt-0.5">
          {type} NET
        </span>
      </div>
    </div>
  );
}
