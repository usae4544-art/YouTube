const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf8');

const targetKidsCat = `  const categories = kidsMode
    ? [
        { id: "all", name: "Safe Feeds 🎈", icon: Baby },
        { id: "cartoon+animation", name: "Cartoons 🧸", icon: Clapperboard },
        { id: "kids+learning+science", name: "Science Secrets 🪐", icon: Lightbulb },
        { id: "kids+toys+games", name: "Toy Fun 🦖", icon: Gamepad2 },
        { id: "kids+singalong+songs", name: "Nursery Rhymes 🎶", icon: Music }
      ]`;

const newKidsCat = `  const categories = kidsMode
    ? [
        { id: "all", name: "Bal Bhakti 🎈", icon: Baby },
        { id: "bal ganesha cartoon", name: "Bal Ganesha 🐘", icon: Clapperboard },
        { id: "little krishna cartoon", name: "Krishna Tales 🦚", icon: Lightbulb },
        { id: "kids hanuman chalisa", name: "Hanuman 🐒", icon: Gamepad2 },
        { id: "kids devotional singalong", name: "Bhajan 🎶", icon: Music }
      ]`;

appCode = appCode.replace(targetKidsCat, newKidsCat);
fs.writeFileSync('src/App.tsx', appCode);

