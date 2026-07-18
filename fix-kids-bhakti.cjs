const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetFallbackKids = `const FALLBACK_KIDS_VIDEOS: YouTubeVideo[] = [
  {
    id: "WRVsOCh907o",
    title: "Dinosaur Educational Facts - Cute Science Tour for Kids!",
    thumbnail: "https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE4",
    channelTitle: "DinoSchool",
    description: "Learn fun science facts about the Tyrannosaurus Rex, Triceratops, and flying Pterodactyls! Super safe and fun cartoons.",
    publishedAt: "2025-04-12T00:00:00Z",
    viewCount: "1200000",
    likeCount: "95000",
    duration: "8:22",
    tags: ["Kids", "Dinosaurs", "Science", "Cartoons", "Educational"]
  },
  {
    id: "lG8eB0zAn_Y",
    title: "Animated Nursery Rhymes and Safe Singalong Songs",
    thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE5",
    channelTitle: "Melody Garden",
    description: "Bright colors, friendly animals, and cheerful singalong songs perfect for ages 2 to 7. Safely compiled nursery loops.",
    publishedAt: "2024-09-20T00:00:00Z",
    viewCount: "3400000",
    likeCount: "180000",
    duration: "12:15",
    tags: ["Kids", "Nursery Rhymes", "Singalong", "Music"]
  },
  {
    id: "3AenU5tXh2Q",
    title: "Space Secrets 101 - Planetary Adventures for Young Astronomers",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE6",
    channelTitle: "CosmicJunior",
    description: "Fly across the solar system! Discover glowing rings on Saturn, crater peaks on Mars, and how hot our Sun shines.",
    publishedAt: "2025-02-15T00:00:00Z",
    viewCount: "980000",
    likeCount: "75000",
    duration: "9:40",
    tags: ["Kids", "Space", "Science", "Education", "Solar System"]
  }
];`;

const newFallbackKids = `const FALLBACK_KIDS_VIDEOS: YouTubeVideo[] = [
  {
    id: "WRVsOCh907o",
    title: "Bal Ganesha - Kids Devotional Animated Movie",
    thumbnail: "https://images.unsplash.com/photo-1629851410190-671c6d173360?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE4",
    channelTitle: "Kids Devotional",
    description: "Watch the fun and magical adventures of Bal Ganesha. Safe and inspiring.",
    publishedAt: "2025-04-12T00:00:00Z",
    viewCount: "1200000",
    likeCount: "95000",
    duration: "45:22",
    tags: ["Kids", "Bal Ganesha", "Devotional", "Cartoons"]
  },
  {
    id: "lG8eB0zAn_Y",
    title: "Hanuman Chalisa For Kids - Animated Chants",
    thumbnail: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE5",
    channelTitle: "Bhakti For Kids",
    description: "Sing along to Hanuman Chalisa with these beautiful animations for kids.",
    publishedAt: "2024-09-20T00:00:00Z",
    viewCount: "3400000",
    likeCount: "180000",
    duration: "12:15",
    tags: ["Kids", "Hanuman Chalisa", "Singalong", "Music"]
  },
  {
    id: "3AenU5tXh2Q",
    title: "Little Krishna - Beautiful Tales of Vrindavan",
    thumbnail: "https://images.unsplash.com/photo-1601633519842-1e90d7f4bebd?w=600&auto=format&fit=crop&q=60",
    channelId: "UC6nSelB_S_S-XvQ-Dkk4qE6",
    channelTitle: "Vrindavan Tales",
    description: "Enjoy the beautiful stories of Little Krishna in Vrindavan.",
    publishedAt: "2025-02-15T00:00:00Z",
    viewCount: "980000",
    likeCount: "75000",
    duration: "20:40",
    tags: ["Kids", "Krishna", "Devotional", "Stories"]
  }
];`;

appCode = appCode.replace(targetFallbackKids, newFallbackKids);
fs.writeFileSync('src/App.tsx', appCode);

