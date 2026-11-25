import React, { useEffect } from "react";
import { isNativeAndroid } from "../lib/nexusBridge";

export default function PopunderAd({
  refreshKey = 0,
  isVisible = true,
}: {
  refreshKey?: number;
  isVisible?: boolean;
}) {
  const nativeAndroid = isNativeAndroid();

  useEffect(() => {
    const scriptId = "popunder-ad-script";
    const existingScript = document.getElementById(scriptId);

    // Never load popunder script on Android APK (native AdMob handles monetization) or when hidden
    if (nativeAndroid || !isVisible) {
      if (existingScript) existingScript.remove();
      return;
    }

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://pl30477426.effectivecpmnetwork.com/cf/b1/92/cfb192c8306ba8195ea64e8f201ea782.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [refreshKey, isVisible, nativeAndroid]);

  if (nativeAndroid) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: !isVisible
          ? `
        body > *:not(#root):not(script):not(style) {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
          height: 0 !important;
          width: 0 !important;
        }
        html, body {
          padding-top: 0 !important;
          margin-top: 0 !important;
        }
      `
          : "",
      }}
    />
  );
}
