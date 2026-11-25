import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, enableNetwork, disableNetwork } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

const getVal = (b64: string) => {
  try {
    return atob(b64);
  } catch {
    return "";
  }
};

const firebaseConfig = {
  apiKey: getVal("QUl6YVN5Q1QwdVN2WDUyVW9RYndaNFRGOWswTjlBYXZOb0FDOWs0"),
  authDomain: getVal("c2hpdmFuc2gtNGUwYTcuZmlyZWJhc2VhcHAuY29t"),
  projectId: getVal("c2hpdmFuc2gtNGUwYTc="),
  storageBucket: getVal("c2hpdmFuc2gtNGUwYTcuZmlyZWJhc2VzdG9yYWdlLmFwcA=="),
  messagingSenderId: getVal("OTUzNzY3MjQwNg=="),
  appId: getVal("MTo5NTM3NjcyNDA2OndlYjoxODllZDQzZjYwOGNiZTBiMWFlNTc3"),
  measurementId: getVal("Ry1GUjZONzNZQlYw")
};

const app = initializeApp(firebaseConfig);

// Initialize App Check only when a real reCAPTCHA Enterprise key is configured
const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
if (typeof window !== "undefined" && recaptchaSiteKey) {
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider(recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true
    });
  } catch (e) {
    console.warn("App Check initialization skipped:", e);
  }
}

if (typeof window !== "undefined") {
  isAnalyticsSupported()
    .then((supported) => {
      if (supported) getAnalytics(app);
    })
    .catch(() => {});

  window.addEventListener("online", async () => {
    try {
      await enableNetwork(db);
    } catch (e) {
      console.warn("Error re-enabling Firestore network:", e);
    }
  });

  window.addEventListener("offline", async () => {
    try {
      await disableNetwork(db);
    } catch (e) {
      console.warn("Error disabling Firestore network:", e);
    }
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
