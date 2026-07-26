import React, { useEffect, useState } from "react";
import { ShieldAlert } from "lucide-react";

// In-memory cache for ad scanning results to avoid redundant API calls
const adScanCache = new Map<string, any>();

export default function AdBanner({ refreshKey = 0 }: { refreshKey?: number }) {
  const [adState, setAdState] = useState<"loading" | "safe" | "unsafe" | "error">("loading");
  const [adImageUrl, setAdImageUrl] = useState<string>("");
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Simulate intercepting a dynamic ad creative payload from an Ad Network.
    // In a real environment, this payload would come from the Ad SDK before rendering.
    const fetchAdPayload = async () => {
      setAdState("loading");
      
      try {
        const inventoryRes = await fetch("/api/ads/inventory");
        if (!inventoryRes.ok) throw new Error("Failed to fetch ad inventory");
        const inventoryData = await inventoryRes.json();
        const ads: string[] = inventoryData.ads;
        
        let foundSafeAd = false;
        const startIndex = refreshKey % ads.length;
        
        for (let i = 0; i < ads.length; i++) {
          const index = (startIndex + i) % ads.length;
          const adImage = ads[index];
          
          let result;
          if (adScanCache.has(adImage)) {
            result = adScanCache.get(adImage);
          } else {
            // Offload AI vision check to backend/background to prevent main thread blocking
            const res = await fetch("/api/ads/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: adImage })
            });
            
            if (!res.ok) throw new Error("API response error");
            result = await res.json();
            adScanCache.set(adImage, result);
          }

          if (!isMounted) return;
          
          // Evaluate safety based on Gemini Flash output
          if (result.is_safe && result.nsfw_score <= 0.7) {
            setAdImageUrl(adImage);
            setScanResult(result);
            setAdState("safe");
            foundSafeAd = true;
            break; // Stop checking, we found a safe ad
          } else {
            // Unsafe ad detected, discard and move to the next
            console.warn("Blocked unsafe ad:", adImage, "Reason:", result.reason);
          }
        }
        
        if (!foundSafeAd && isMounted) {
          // If all ads in the inventory were marked unsafe
          setAdState("unsafe");
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Ad scanning failed:", err);
        // Fallback to safe state to prevent UI freezing / white screens on API timeout
        setAdState("error");
      }
    };

    fetchAdPayload();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 my-6 md:my-8 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-xl shrink-0 min-h-[120px]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
          Sponsored Advertisement
        </span>
        {adState === "loading" && (
           <span className="text-[10px] uppercase text-amber-500 animate-pulse font-bold">AI Scanning...</span>
        )}
        {adState === "safe" && (
           <span className="text-[10px] uppercase text-green-500 font-bold">✓ Safe Ad</span>
        )}
      </div>
      
      <div className="w-full flex justify-center items-center">
        {adState === "loading" && (
          <div className="animate-pulse bg-white/10 w-full h-32 rounded-xl flex items-center justify-center">
            <span className="text-gray-500 text-sm">Analyzing creative for NSFW content...</span>
          </div>
        )}
        
        {adState === "unsafe" && (
          <div className="bg-rose-500/10 border border-rose-500/30 w-full p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-8 h-8 text-rose-500 mb-2" />
            <h4 className="text-rose-400 font-bold mb-1">Inappropriate Ad Blocked</h4>
            <p className="text-sm text-rose-300/70">
              Our AI vision filter prevented this ad from displaying. <br/>
              <span className="text-rose-400/80 mt-1 block">Reason: {scanResult?.reason || "High NSFW Score"}</span>
            </p>
          </div>
        )}

        {(adState === "safe" || adState === "error") && adImageUrl && (
          <div className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/10">
            <img 
               src={adImageUrl} 
               alt="Advertisement" 
               className="w-full h-auto object-cover max-h-48 transition-opacity duration-500" 
               loading="lazy" 
               style={{ opacity: adState === "safe" || adState === "error" ? 1 : 0 }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
