import React, { useEffect } from 'react';

export default function PopunderAd({ refreshKey = 0 }: { refreshKey?: number }) {
  useEffect(() => {
    const scriptId = 'popunder-ad-script';
    
    // Remove existing script if it's a refresh
    let existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://pl30477426.effectivecpmnetwork.com/cf/b1/92/cfb192c8306ba8195ea64e8f201ea782.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup the script tag if the component unmounts
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [refreshKey]);

  return null;
}
