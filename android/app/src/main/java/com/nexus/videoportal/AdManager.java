package com.nexus.videoportal;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import androidx.annotation.NonNull;
import com.google.android.gms.ads.AdError;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.FullScreenContentCallback;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

/**
 * Manages AdMob interstitial preloading and frequency-gated playback ads.
 * Ads remain strictly suppressed during Kids Mode and active Premium sessions.
 */
public class AdManager {

    private static final String AD_UNIT_ID = "ca-app-pub-6874503375273361/2835980074";
    private static final String TAG = "NexusAdManager";
    private static final String PREF_NAME = "AdPrefs";
    private static final String PREF_LAST_AD_TIME = "last_ad_time";
    private static final String PREF_VIDEO_COUNT = "video_count";
    private static final long MIN_INTERVAL_MS = 90_000L;

    private final Context appContext;
    private final SharedPreferences prefs;
    private InterstitialAd interstitialAd;
    private boolean isLoading = false;

    public AdManager(Context context) {
        this.appContext = context.getApplicationContext();
        this.prefs = appContext.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
        try {
            MobileAds.initialize(appContext, initializationStatus -> loadAd());
        } catch (Throwable t) {
            Log.w(TAG, "MobileAds initialization skipped", t);
        }
    }

    public void loadAd() {
        new Handler(Looper.getMainLooper()).post(() -> {
            if (interstitialAd != null || isLoading) {
                return;
            }
            isLoading = true;
            try {
                AdRequest adRequest = new AdRequest.Builder().build();
                InterstitialAd.load(
                    appContext,
                    AD_UNIT_ID,
                    adRequest,
                    new InterstitialAdLoadCallback() {
                        @Override
                        public void onAdLoaded(@NonNull InterstitialAd ad) {
                            interstitialAd = ad;
                            isLoading = false;
                        }

                        @Override
                        public void onAdFailedToLoad(@NonNull LoadAdError loadAdError) {
                            Log.d(TAG, "Ad failed to load: " + loadAdError.getMessage());
                            interstitialAd = null;
                            isLoading = false;
                        }
                    }
                );
            } catch (Throwable t) {
                isLoading = false;
                Log.w(TAG, "Ad load failed", t);
            }
        });
    }

    public void showAdIfEligible(Activity activity, boolean kidsMode, boolean isPremium) {
        if (kidsMode || isPremium || activity == null || activity.isFinishing()) {
            return;
        }

        int count = prefs.getInt(PREF_VIDEO_COUNT, 0) + 1;
        long now = System.currentTimeMillis();
        long lastShown = prefs.getLong(PREF_LAST_AD_TIME, 0L);
        prefs.edit().putInt(PREF_VIDEO_COUNT, count).apply();

        boolean intervalPassed = (now - lastShown) >= MIN_INTERVAL_MS;
        boolean cadenceMatch = (count == 1) || (count % 3 == 0);

        if (!(cadenceMatch && intervalPassed)) {
            if (interstitialAd == null) {
                loadAd();
            }
            return;
        }

        if (interstitialAd == null) {
            loadAd();
            return;
        }

        InterstitialAd currentAd = interstitialAd;
        currentAd.setFullScreenContentCallback(new FullScreenContentCallback() {
            @Override
            public void onAdDismissedFullScreenContent() {
                interstitialAd = null;
                prefs.edit().putLong(PREF_LAST_AD_TIME, System.currentTimeMillis()).apply();
                loadAd();
            }

            @Override
            public void onAdFailedToShowFullScreenContent(@NonNull AdError adError) {
                interstitialAd = null;
                loadAd();
            }
        });
        currentAd.show(activity);
    }
}
