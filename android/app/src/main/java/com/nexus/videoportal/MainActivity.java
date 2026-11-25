package com.nexus.videoportal;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.activity.OnBackPressedCallback;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebChromeClient;
import java.util.ArrayList;
import java.util.List;

public class MainActivity extends BridgeActivity {

    private static final int REQ_APP_PERMISSIONS = 1001;
    private AdManager adManager;
    private View customVideoView;
    private WebChromeClient.CustomViewCallback customViewCallback;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        adManager = new AdManager(this);
        configureWebView();
        requestMissingPermissions();

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (customVideoView != null) {
                    hideCustomVideoView();
                    return;
                }
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView != null) {
                    webView.evaluateJavascript(
                        "(function(){return window.__nexusHandleBack ? window.__nexusHandleBack() : 'exit';})()",
                        result -> {
                            if (!"\"handled\"".equals(result)) {
                                if (webView.canGoBack()) {
                                    webView.goBack();
                                } else {
                                    finish();
                                }
                            }
                        }
                    );
                } else {
                    finish();
                }
            }
        });
    }

    private void configureWebView() {
        Bridge currentBridge = getBridge();
        if (currentBridge == null || currentBridge.getWebView() == null) {
            return;
        }
        WebView webView = currentBridge.getWebView();
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setDatabaseEnabled(true);

        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        webView.addJavascriptInterface(new NexusAndroidBridge(), "NexusAndroid");
        webView.setWebChromeClient(new FullscreenBridgeWebChromeClient(currentBridge));
    }

    private void requestMissingPermissions() {
        List<String> needed = new ArrayList<>();
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.RECORD_AUDIO);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
                && ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS)
                        != PackageManager.PERMISSION_GRANTED) {
            needed.add(Manifest.permission.POST_NOTIFICATIONS);
        }
        if (!needed.isEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toArray(new String[0]), REQ_APP_PERMISSIONS);
        }
    }

    private void hideCustomVideoView() {
        if (customVideoView == null) return;
        ViewGroup root = findViewById(android.R.id.content);
        if (root != null) {
            root.removeView(customVideoView);
        }
        customVideoView = null;
        if (customViewCallback != null) {
            customViewCallback.onCustomViewHidden();
            customViewCallback = null;
        }
    }

    private class FullscreenBridgeWebChromeClient extends BridgeWebChromeClient {
        FullscreenBridgeWebChromeClient(Bridge bridge) {
            super(bridge);
        }

        @Override
        public void onShowCustomView(View view, CustomViewCallback callback) {
            if (customVideoView != null) {
                hideCustomVideoView();
            }
            customVideoView = view;
            customViewCallback = callback;

            FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            );
            view.setBackgroundColor(Color.BLACK);
            ViewGroup root = findViewById(android.R.id.content);
            if (root != null) {
                root.addView(view, params);
            }
        }

        @Override
        public void onHideCustomView() {
            hideCustomVideoView();
        }
    }

    private class NexusAndroidBridge {
        @JavascriptInterface
        public void showAdIfEligible(boolean kidsMode, boolean isPremium) {
            runOnUiThread(() -> {
                if (adManager != null) {
                    adManager.showAdIfEligible(MainActivity.this, kidsMode, isPremium);
                }
            });
        }

        @JavascriptInterface
        public void requestAppPermissions() {
            runOnUiThread(MainActivity.this::requestMissingPermissions);
        }

        @JavascriptInterface
        public boolean hasMicPermission() {
            return ContextCompat.checkSelfPermission(
                    MainActivity.this, Manifest.permission.RECORD_AUDIO)
                == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public boolean hasNotificationPermission() {
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
                return true;
            }
            return ContextCompat.checkSelfPermission(
                    MainActivity.this, Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
        }

        @JavascriptInterface
        public void openExternalUrl(String url) {
            if (url == null || url.trim().isEmpty()) return;
            runOnUiThread(() -> {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "No app available to open link.", Toast.LENGTH_SHORT).show();
                }
            });
        }

        @JavascriptInterface
        public void showToast(String message) {
            if (message == null) return;
            runOnUiThread(() -> Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show());
        }

        @JavascriptInterface
        public String getAppVersion() {
            return "1.2.0";
        }
    }
}
