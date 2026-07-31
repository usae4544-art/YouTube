import sys

with open("src/firebase.ts", "r") as f:
    content = f.read()

network_logic = """
// Add network resiliency wrapper for Firestore and Auth
import { enableNetwork, disableNetwork } from "firebase/firestore";

if (typeof window !== "undefined") {
  window.addEventListener('online', async () => {
    console.log("Network restored. Reconnecting Firebase...");
    try {
      await enableNetwork(db);
    } catch (e) {
      console.warn("Error re-enabling network:", e);
    }
  });
  window.addEventListener('offline', async () => {
    console.log("Network disconnected. Firebase running in offline mode.");
    try {
      await disableNetwork(db);
    } catch (e) {
      console.warn("Error disabling network:", e);
    }
  });
}
"""

content = content.replace(
"""// Add network resiliency wrapper for Firestore and Auth
// In the browser environment, Firestore handles reconnects automatically, 
// but we can add an event listener for online/offline to manage states if needed.
if (typeof window !== "undefined") {
  window.addEventListener('online', () => {
    console.log("Network restored. Firebase will automatically reconnect.");
  });
  window.addEventListener('offline', () => {
    console.log("Network disconnected. Firebase running in offline mode.");
  });
}""", network_logic)

with open("src/firebase.ts", "w") as f:
    f.write(content)
