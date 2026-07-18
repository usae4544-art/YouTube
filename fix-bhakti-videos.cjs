const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetFallback = `const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "9bZkp7q19f0",
    title: "PSY - GANGNAM STYLE (강남스타일) M/V",
    thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qEA",
    channelTitle: "officialpsy",
    description: "Official Music Video for Gangnam Style. Visual feast and world-famous dance loops.",
    publishedAt: "2012-07-15T00:00:00Z",
    viewCount: "5100000000",
    likeCount: "28000000",
    duration: "4:12",
    tags: ["Music", "Gangnam Style", "K-pop", "Dance"]
  },
  {
    id: "fKopy74sxnw",
    title: "SpaceX Starship Flight Test Flight Mapped on Orbit",
    thumbnail: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE1",
    channelTitle: "SpaceX",
    description: "Starship's orbital trajectory and atmospheric reentry highlights. Watch the largest spacecraft ever built.",
    publishedAt: "2024-03-14T12:00:00Z",
    viewCount: "8900000",
    likeCount: "420000",
    duration: "10:35",
    tags: ["Space", "SpaceX", "Starship", "Rocket", "Engineering"]
  },
  {
    id: "R7OAtvT9jX4",
    title: "Nature Drone Footage 4K - Ultra HD Relaxation Tour",
    thumbnail: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE2",
    channelTitle: "Ambient Planet",
    description: "Soothing drone views of the world's most scenic waterfalls, lush green canyons, and high alpine ridges.",
    publishedAt: "2025-01-01T08:00:00Z",
    viewCount: "4500000",
    likeCount: "120000",
    duration: "25:00",
    tags: ["Relaxation", "Nature", "Drone", "4K", "Ambient"]
  },
  {
    id: "kJQP7kiw5Fk",
    title: "Luis Fonsi - Despacito ft. Daddy Yankee",
    thumbnail: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE3",
    channelTitle: "LuisFonsiVEVO",
    description: "Luis Fonsi - Despacito ft. Daddy Yankee Music Video. Sunny beaches and addictive dance beats.",
    publishedAt: "2017-01-12T00:00:00Z",
    viewCount: "8400000000",
    likeCount: "53000000",
    duration: "4:41",
    tags: ["Music", "Despacito", "Dance", "Hits"]
  }
];`;

const newFallback = `const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: "bhakti1",
    title: "Bageshwar Dham Sarkar | Guruji Ke Divya Darshan Aur Updesh",
    thumbnail: "https://images.unsplash.com/photo-1590059942691-62d22d5f3069?w=600&auto=format&fit=crop&q=60",
    channelId: "BageshwarDham",
    channelTitle: "Guruji Khabar",
    description: "Janiye Guruji Bageshwar Dham Sarkar ke divya pravachan aur khabar.",
    publishedAt: "2025-05-12T00:00:00Z",
    viewCount: "1250000",
    likeCount: "120000",
    duration: "25:12",
    tags: ["Bhakti", "Guruji Khabar", "Bageshwar Dham"]
  },
  {
    id: "bhakti2",
    title: "Shree Hanuman Chalisa (Hanuman Ashtak) | Best Devotional Song",
    thumbnail: "https://images.unsplash.com/photo-1570716616086-a21a50df8ddf?w=600&auto=format&fit=crop&q=60",
    channelId: "BhaktiSagar",
    channelTitle: "Bhakti Song Option",
    description: "Sunein pavitra Hanuman Chalisa. Achha achha video aur bhakti geet.",
    publishedAt: "2024-03-14T12:00:00Z",
    viewCount: "8900000",
    likeCount: "420000",
    duration: "10:35",
    tags: ["Bhakti Song", "Devotional", "Hanuman Chalisa"]
  },
  {
    id: "bhakti3",
    title: "Pandit Pradeep Mishra Ji Ke Anmol Vachan | Shiv Puran Katha",
    thumbnail: "https://images.unsplash.com/photo-1601633519842-1e90d7f4bebd?w=600&auto=format&fit=crop&q=60",
    channelId: "PradeepMishraJi",
    channelTitle: "Guruji Khabar",
    description: "Janiye Guruji Pradeep Mishra ji ke Shiv Puran Katha ke niyam aur upay.",
    publishedAt: "2025-01-01T08:00:00Z",
    viewCount: "4500000",
    likeCount: "120000",
    duration: "45:00",
    tags: ["Guruji", "Shiv Puran", "Katha"]
  },
  {
    id: "bhakti4",
    title: "Mata Rani Ke Best Bhajans | Navratri Special (Achha Achha Video)",
    thumbnail: "https://images.unsplash.com/photo-1621251346083-d023b7a8a65c?w=600&auto=format&fit=crop&q=60",
    channelId: "BhaktiHits",
    channelTitle: "Bhakti Song",
    description: "Mata rani ke sabse pyare aur achhe achhe bhajan aur video dekhein.",
    publishedAt: "2023-10-12T00:00:00Z",
    viewCount: "24000000",
    likeCount: "530000",
    duration: "1:04:41",
    tags: ["Bhakti Song", "Bhajan", "Mata Rani"]
  }
];`;

appCode = appCode.replace(targetFallback, newFallback);


const targetCategories = `  const categories = kidsMode
    ? [
        { id: "all", name: "Safe Feeds 🎈", icon: Baby },
        { id: "cartoon+animation", name: "Cartoons 🧸", icon: Clapperboard },
        { id: "kids+learning+science", name: "Science Secrets 🪐", icon: Lightbulb },
        { id: "kids+toys+games", name: "Toy Fun 🦖", icon: Gamepad2 },
        { id: "kids+singalong+songs", name: "Nursery Rhymes 🎶", icon: Music }
      ]
    : [
        { id: "all", name: "Home", icon: Flame },
        { id: "bhakti", name: "Bhakti", icon: Music },
        { id: "gyan uday guruji class 10 hindi board", name: "Gyan Uday Guruji", icon: Lightbulb },
        { id: "study motivation", name: "Study Motivation", icon: ZoomIn },
        { id: "comedy viral clips", name: "Comedy & Fun", icon: Smile }
      ];`;

const newCategories = `  const categories = kidsMode
    ? [
        { id: "all", name: "Safe Feeds 🎈", icon: Baby },
        { id: "cartoon+animation", name: "Cartoons 🧸", icon: Clapperboard },
        { id: "kids+learning+science", name: "Science Secrets 🪐", icon: Lightbulb },
        { id: "kids+toys+games", name: "Toy Fun 🦖", icon: Gamepad2 },
        { id: "kids+singalong+songs", name: "Nursery Rhymes 🎶", icon: Music }
      ]
    : [
        { id: "all", name: "Home", icon: Flame },
        { id: "bhakti song", name: "Bhakti Song", icon: Music },
        { id: "guruji bageshwar dham khabar", name: "Guruji Khabar", icon: Info },
        { id: "achha achha bhajan video", name: "Achha Video", icon: Sparkles },
        { id: "pradeep mishra ji katha", name: "Katha", icon: BookOpen }
      ];`;

appCode = appCode.replace(targetCategories, newCategories);

// Also we need to import BookOpen from lucide-react if not imported
if (!appCode.includes('BookOpen')) {
  appCode = appCode.replace('Baby, LogOut,', 'Baby, LogOut, BookOpen,');
}

fs.writeFileSync('src/App.tsx', appCode);

// Finally let's update the prompt in server/gemini.ts so the search suggestions are devotional focused
let serverCode = fs.readFileSync('server.ts', 'utf8');
const searchPromptTarget = `          "Please generate 5 short, popular YouTube search query suggestions based on this partial input: '${q}'\n\nReturn JSON in this format: { \\"suggestions\\": [\\"query1\\", \\"query2\\"] }."`;
const searchPromptNew = `          "Please generate 5 short, popular YouTube search query suggestions based on this partial input: '${q}'. Focus primarily on Bhakti songs, Guruji (Bageshwar Dham / Pradeep Mishra) khabar, devotional content, and nice videos (achha video). If the input is empty or vague, suggest things like 'Bhakti song hindi', 'Guruji Bageshwar Dham latest khabar', 'Best bhajan achha video', 'Hanuman chalisa'.\n\nReturn JSON in this format: { \\"suggestions\\": [\\"query1\\", \\"query2\\"] }."`;
serverCode = serverCode.replace(searchPromptTarget, searchPromptNew);
fs.writeFileSync('server.ts', serverCode);

