// Add at top of file with other globals
let isFlashing = false;
let lastFlashTime = 0;
let flashDuration = 1000;
let minFlashInterval = 5000;
let maxFlashInterval = 15000;
let nextFlashTime = 0;

let flashSequence = [];
let isFlashSequence = false;
let sequenceStartTime = 0;
const SEQUENCE_DURATION = 4000; // 2 seconds for entire sequence

function triggerLightningFlash() {
  isFlashing = true;
  lastFlashTime = millis();
}

function createFlashSequence() {
  flashSequence = [];
  let timeOffset = 0;
  
  const numFlashes = floor(random(3, 6));
  
  for(let i = 0; i < numFlashes; i++) {
    // Longer main flash
    flashSequence.push({
      time: timeOffset,
      intensity: random(200, 255),
      duration: random(150, 300) // Added duration
    });
    
    // Slower echo flashes
    const numEchoes = floor(random(2, 4));
    for(let j = 0; j < numEchoes; j++) {
      timeOffset += random(100, 300); // Increased from 50,150
      flashSequence.push({
        time: timeOffset,
        intensity: random(100, 200),
        duration: random(100, 200) // Added duration
      });
    }
    
    // Longer gaps between groups
    timeOffset += random(400, 800); // Increased from 200,400
  }
}

function lightning() {
  let currentTime = millis();
  
  if (currentTime > nextFlashTime) {
    isFlashSequence = true;
    sequenceStartTime = currentTime;
    createFlashSequence();
    nextFlashTime = currentTime + random(minFlashInterval, maxFlashInterval);
  }
  
  if (isFlashSequence) {
    let sequenceAge = currentTime - sequenceStartTime;
    
    if (sequenceAge < SEQUENCE_DURATION) {
      // Find current flash intensity
      let totalIntensity = 60; // Base ambient light
      
      flashSequence.forEach(flash => {
        let flashAge = sequenceAge - flash.time;
        if (flashAge > 0 && flashAge < 100) {
          let flashContribution = flash.intensity * (1 - flashAge/100);
          totalIntensity = max(totalIntensity, flashContribution);
        }
      });
      
      // Add flicker
      totalIntensity += random(-10, 10);
      totalIntensity = constrain(totalIntensity, 60, 255);
      
      ambientLight(totalIntensity);
    } else {
      isFlashSequence = false;
      ambientLight(60);
    }
  }
}

function updateThunder() {
  const currentTime = millis();
  const minInterval = 5000;  
  const maxInterval = 20000; 
  
  if (currentTime - lastThunderTime > random(minInterval, maxInterval)) {
    const randomThunder = random(thunderSounds);
    if (randomThunder && !randomThunder.isPlaying()) {
    console.log("Playing thunder sound");
      randomThunder.play();
      lightning()
      lastThunderTime = currentTime;
    }
  updateThunder();
}}