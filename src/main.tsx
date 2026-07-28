const originalError = console.error; console.error = (...args) => { if (args.length > 0 && typeof args[0] === "object" && args[0] !== null) { try { if (args[0].error === null) return; if (Object.keys(args[0]).length === 0) return; } catch(e){} } originalError(...args); };
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx';
import './index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
