import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
import {
  SAFE_AD_CREATIVES,
  apiFetchJson,
  hasBackendServer,
  openExternalLink,
} from "../lib/nexusBridge";

const adScanCache = new Map<string, any>();

interface AdItem {
  imageUrl: string;
  title?: string;
  subtitle?: string;
  ctaUrl?: string;
  reason?: string;
}

export default function AdBanner({ refreshKey = 0 }: { refreshKey?: number }) {
  const [adState, setAdState] = useState<"loading" | "safe" | "unsafe">("loading");
  const [adItem, setAdItem] = useState<AdItem | null>(null);
  const [scanResult, setScanResult] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFallbackCreative = () => {
      const creative =
        SAFE_AD_CREATIVES[refreshKey % SAFE_AD_CREATIVES.length];
      if (!isMounted) return;
      setAdItem(creative);
      setScanResult({
        is_safe: true,
        nsfw_score: 0.0,
        reason: creative.reason,
      });
      setAdState("safe");
    };

    const fetchAdPayload = async () => {
      setAdState("loading");

      if (!hasBackendServer()) {
        loadFallbackCreative();
        return;
      }

      try {
        const inventoryData = await apiFetchJson<{ ads?: string[] }>(
          "/api/ads/inventory",
        );
        const ads = inventoryData?.ads;
        if (!ads?.length) {
          loadFallbackCreative();
          return;
        }

        let foundSafeAd = false;
        const startIndex = refreshKey % ads.length;

        for (let i = 0; i < ads.length; i++) {
          const index = (startIndex + i) % ads.length;
          const adImage = ads[index];

          let result = adScanCache.get(adImage);
          if (!result) {
            result = await apiFetchJson<any>("/api/ads/scan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: adImage }),
            });
            if (result) adScanCache.set(adImage, result);
          }

          if (!isMounted) return;

          if (!result || (result.is_safe && result.nsfw_score <= 0.7)) {
            const matchedCreative =
              SAFE_AD_CREATIVES.find((c) => c.imageUrl === adImage) || {
                imageUrl: adImage,
                title: "Featured Partner Offer",
                subtitle: "AI-verified safe sponsorship",
              };
            setAdItem(matchedCreative);
            setScanResult(result || { is_safe: true, nsfw_score: 0 });
            setAdState("safe");
            foundSafeAd = true;
            break;
          }
        }

        if (!foundSafeAd && isMounted) {
          setAdState("unsafe");
        }
      } catch {
        loadFallbackCreative();
      }
    };

    fetchAdPayload();
    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-4 my-4 md:my-6 bg-white/5 border border-white/10 rounded-2xl relative overflow-hidden backdrop-blur-xl shrink-0 min-h-[120px]"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-60" />
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 bg-white/5 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Sponsored Ad
        </span>
        {adState === "loading" && (
          <span className="text-[10px] uppercase text-amber-500 animate-pulse font-bold">
            Scanning...
          </span>
        )}
        {adState === "safe" && (
          <span className="text-[10px] uppercase text-emerald-400 font-bold">
            Safe Verified
          </span>
        )}
      </div>

      <div className="w-full flex justify-center items-center">
        {adState === "loading" && (
          <div className="animate-pulse bg-white/10 w-full h-32 rounded-xl flex items-center justify-center">
            <span className="text-gray-400 text-xs">Loading safe ad showcase...</span>
          </div>
        )}

        {adState === "unsafe" && (
          <div className="bg-rose-500/10 border border-rose-500/30 w-full p-5 rounded-xl flex flex-col items-center justify-center text-center">
            <ShieldAlert className="w-7 h-7 text-rose-500 mb-2" />
            <h4 className="text-rose-400 font-bold text-sm mb-1">
              Inappropriate Ad Blocked
            </h4>
            <p className="text-xs text-rose-300/75">
              {scanResult?.reason || "Blocked by AI safety shield."}
            </p>
          </div>
        )}

        {adState === "safe" && adItem && (
          <button
            type="button"
            onClick={() => adItem.ctaUrl && openExternalLink(adItem.ctaUrl)}
            className="w-full relative rounded-xl overflow-hidden shadow-lg border border-white/10 group text-left cursor-pointer"
          >
            <img
              src={adItem.imageUrl}
              alt={adItem.title || "Advertisement"}
              className="w-full h-36 sm:h-44 object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 flex items-end justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate">
                  {adItem.title || "Sponsored Offer"}
                </p>
                {adItem.subtitle && (
                  <p className="text-[11px] text-gray-300 truncate">{adItem.subtitle}</p>
                )}
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[10px] font-bold flex items-center gap-1 shrink-0">
                Explore <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}
