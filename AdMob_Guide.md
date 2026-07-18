# AdMob Integration Guide for Android

Here is the robust, production-ready Kotlin code to implement your AdMob logic. 

**Important Note on AdMob Limitations**: 
Google AdMob strictly controls the video ad UI, including the skip button timer. You cannot manually override an AdMob Interstitial or Rewarded ad to force a skip button to appear at exactly 7 seconds. AdMob typically shows the skip button after 5 seconds for skippable interstitials. The code below implements standard Interstitial Ads, which provide the closest experience to what you described.

### `AdManager.kt`

```kotlin
import android.app.Activity
import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import java.util.concurrent.TimeUnit

class AdManager(private val context: Context) {

    private var mInterstitialAd: InterstitialAd? = null
    private var isAdLoading = false

    private val prefs: SharedPreferences = context.getSharedPreferences("AdPrefs", Context.MODE_PRIVATE)
    
    companion object {
        const val AD_UNIT_ID = "ca-app-pub-6874503375273361/2835980074"
        const val TAG = "AdManager"
        const val PREF_LAST_AD_TIME = "last_ad_time"
        const val PREF_VIDEO_COUNT = "video_count"
        const val THREE_HOURS_MILLIS = 3 * 60 * 60 * 1000L
    }

    init {
        // Initialize AdMob
        MobileAds.initialize(context) { }
        loadAd()
    }

    private fun loadAd() {
        if (mInterstitialAd != null || isAdLoading) {
            return
        }
        isAdLoading = true
        val adRequest = AdRequest.Builder().build()

        InterstitialAd.load(context, AD_UNIT_ID, adRequest, object : InterstitialAdLoadCallback() {
            override fun onAdFailedToLoad(adError: LoadAdError) {
                Log.d(TAG, "Ad failed to load: ${adError.message}")
                mInterstitialAd = null
                isAdLoading = false
            }

            override fun onAdLoaded(interstitialAd: InterstitialAd) {
                Log.d(TAG, "Ad was loaded.")
                mInterstitialAd = interstitialAd
                isAdLoading = false
            }
        })
    }

    /**
     * Call this method right before playing a video.
     * @param activity The current activity
     * @param onVideoResume Callback triggered when the ad finishes, is skipped, or if no ad is shown.
     */
    fun showAdIfEligible(activity: Activity, onVideoResume: () -> Unit) {
        val currentTime = System.currentTimeMillis()
        val lastAdTime = prefs.getLong(PREF_LAST_AD_TIME, 0)
        var videoCount = prefs.getInt(PREF_VIDEO_COUNT, 0)

        videoCount++ // Increment count for this video play
        prefs.edit().putInt(PREF_VIDEO_COUNT, videoCount).apply()

        // Trigger on EVERY video play as requested, 
        // and time condition is adjusted (though every video play implies ad will show anyway)
        val timePassed = currentTime - lastAdTime >= 1 * 60 * 60 * 1000L // 1 hour
        val isFirstVideo = videoCount == 1

        if (true) { // Trigger on every video play
            if (mInterstitialAd != null) {
                mInterstitialAd?.fullScreenContentCallback = object : FullScreenContentCallback() {
                    override fun onAdDismissedFullScreenContent() {
                        Log.d(TAG, "Ad was dismissed.")
                        mInterstitialAd = null
                        // Update last ad time
                        prefs.edit().putLong(PREF_LAST_AD_TIME, System.currentTimeMillis()).apply()
                        loadAd() // Preload next ad
                        onVideoResume() // Resume video
                    }

                    override fun onAdFailedToShowFullScreenContent(adError: AdError) {
                        Log.d(TAG, "Ad failed to show: ${adError.message}")
                        mInterstitialAd = null
                        onVideoResume() // Resume video fallback
                    }

                    override fun onAdShowedFullScreenContent() {
                        Log.d(TAG, "Ad showed fullscreen content.")
                        // Ad is currently playing, video should be paused.
                    }
                }
                
                mInterstitialAd?.show(activity)
            } else {
                Log.d(TAG, "The interstitial ad wasn't ready yet.")
                loadAd()
                onVideoResume() // Resume immediately if ad is not ready
            }
        } else {
            // Conditions not met, just play the video
            onVideoResume()
        }
    }
}
```

### Usage in your Activity/Fragment:

```kotlin
class VideoPlayerActivity : AppCompatActivity() {
    
    private lateinit var adManager: AdManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_video)
        
        // Initialize AdManager (It will preload the ad)
        adManager = AdManager(this)
        
        val playButton = findViewById<Button>(R.id.playButton)
        playButton.setOnClickListener {
            // Call showAdIfEligible before playing the video
            adManager.showAdIfEligible(this) {
                // This block executes when ad is dismissed, skipped, or if no ad was shown.
                startOrResumeVideo()
            }
        }
    }
    
    private fun startOrResumeVideo() {
        // Logic to play/resume your video
    }
    
    // Remember to handle lifecycle if needed, though AdManager handles AdMob state.
}
```

### Setup Instructions
1. Ensure your `AndroidManifest.xml` has the AdMob App ID configured:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-6874503375273361~5629096154"/>
```
2. Add dependencies to your `build.gradle`:
```gradle
implementation 'com.google.android.gms:play-services-ads:23.0.0'
```
