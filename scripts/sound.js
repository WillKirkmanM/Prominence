let backgroundMusic;
let thunderSounds = [];
let bellSound;
let lastThunderTime = 0;
let bellReverb;
let bellDelay;

function preloadSound() {
  soundFormats('mp3');
  backgroundMusic = loadSound('./assets/audio/deathbells.mp3', 
    () => console.log('Sound loaded successfully'),
    (err) => console.error('Sound failed to load:', err)
  );
  
  bellSound = loadSound('./assets/audio/bells.mp3',
    () => console.log('Bells loaded successfully'),
    (err) => console.error('Bells failed to load:', err)
  );
  
  // Load thunder sounds
  for(let i = 1; i <= 4; i++) {
    console.log("Loaded thunder sound", i);
    thunderSounds.push(loadSound(`./assets/audio/thunder_${i}.mp3`));
  }
}

function setupSound() {
  if (backgroundMusic) {
    backgroundMusic.setVolume(0.1); // 50% volume
    backgroundMusic.loop();         // Enable looping
  }
    
  if (bellSound) {
    // Create reverb effect
    bellReverb = new p5.Reverb();
   
    // Connect sound to reverb
    bellSound.disconnect();
    bellSound.connect(bellReverb);
    
    // Set reverb parameters
    bellReverb.set(5, 2); // 5 second reverb, 2 second decay
    
    // Adjust playback rate (0.5 = half speed, lower pitch)
    bellSound.rate(0.8);
    
    // Set volume and start playing
    bellSound.setVolume(0.9);
    bellSound.loop();
  }
  // Initialize thunder sounds
  thunderSounds.forEach(thunder => thunder.setVolume(0.3));
}

function toggleBackgroundMusic(playing) {
  if (!backgroundMusic) return;
  
  if (playing) {
    if (!backgroundMusic.isPlaying()) {
      backgroundMusic.loop();
    }
  } else {
    backgroundMusic.stop();
  }
}

function setBackgroundVolume(level) {
  if (backgroundMusic) {
    backgroundMusic.setVolume(constrain(level, 0, 1));
  }
}



function toggleBells(playing) {
  if (!bellSound) return;
  
  if (playing) {
    if (!bellSound.isPlaying()) {
      bellSound.loop();
    }
  } else {
    bellSound.stop();
  }
}