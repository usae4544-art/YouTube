import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

const rawError = console.error;
console.error = (...args) => {
  if (args.length > 0 && typeof args[0] === "object" && args[0] !== null) {
    try {
      if ((args[0] as any).error === null) return;
      if (Object.keys(args[0]).length === 0) return;
    } catch {}
  }
  rawError(...args);
};

const clientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "100000000000-nexusplaceholder.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
