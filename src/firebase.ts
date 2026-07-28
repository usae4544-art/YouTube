import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCT0uSvX52UoQbwZ4TF9k0N9AavNoAC9k4",
  authDomain: "shivansh-4e0a7.firebaseapp.com",
  projectId: "shivansh-4e0a7",
  storageBucket: "shivansh-4e0a7.firebasestorage.app",
  messagingSenderId: "9537672406",
  appId: "1:9537672406:web:189ed43f608cbe0b1ae577",
  measurementId: "G-FR6N73YBV0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
