const fs = require('fs');
let code = fs.readFileSync('AdMob_Guide.md', 'utf8');

const oldLogic = `        val timePassed = currentTime - lastAdTime >= THREE_HOURS_MILLIS
        val isThirdVideo = videoCount % 3 == 0

        if (timePassed || isThirdVideo) {`;

const newLogic = `        // Trigger on EVERY video play as requested, 
        // and time condition is adjusted (though every video play implies ad will show anyway)
        val timePassed = currentTime - lastAdTime >= 1 * 60 * 60 * 1000L // 1 hour
        val isFirstVideo = videoCount == 1

        if (true) { // Trigger on every video play`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync('AdMob_Guide.md', code);
