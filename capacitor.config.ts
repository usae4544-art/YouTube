import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.nexus.videoportal",
  appName: "Nexus Videos",
  webDir: "dist",
  server: {
    androidScheme: "https",
    allowNavigation: [
      "*.youtube.com",
      "*.youtube-nocookie.com",
      "*.ytimg.com",
      "*.googleapis.com",
      "*.google.com",
    ],
  },
  android: {
    backgroundColor: "#050508",
    allowMixedContent: true,
    webContentsDebuggingEnabled: false,
  },
};

export default config;
