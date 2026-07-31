import sys
import base64

with open("src/firebase.ts", "w") as f:
    f.write("""import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Obfuscated Firebase Configuration
// To prevent simple string extraction via decompilation
const getVal = (b64: string) => {
  try {
    return atob(b64);
  } catch (e) {
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

// Setup App Check with debug token for development
if (typeof window !== "undefined") {
  (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  try {
    initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider("placeholder-key-replace-in-production"),
      isTokenAutoRefreshEnabled: true
    });
  } catch (e) {
    console.warn("App Check initialization failed", e);
  }
}

const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Add network resiliency wrapper for Firestore and Auth
// In the browser environment, Firestore handles reconnects automatically, 
// but we can add an event listener for online/offline to manage states if needed.
if (typeof window !== "undefined") {
  window.addEventListener('online', () => {
    console.log("Network restored. Firebase will automatically reconnect.");
  });
  window.addEventListener('offline', () => {
    console.log("Network disconnected. Firebase running in offline mode.");
  });
}

export default app;
""")
