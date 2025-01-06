/**
 * Manages all audio playback and effects for the game
 */
class SoundManager {
  static get THUNDER_COUNT() { return 4; }
  static get DEFAULT_VOLUME() { return 0.1; }
  static get BELL_SETTINGS() {
    return {
      volume: 0.9,
      rate: 0.8,
      reverbDuration: 5,
      reverbDecay: 2
    };
  }

  constructor() {
    // Audio sources
    this._backgroundMusic = null;
    this._bellSound = null; 
    this._thunderSounds = [];
    
    // Audio effects
    this._bellReverb = null;
    
    // State
    this._lastThunderTime = 0;
    this._isInitialized = false;
  }

  // Public getters
  get isInitialized() { return this._isInitialized; }
  get lastThunderTime() { return this._lastThunderTime; }

  /**
   * Initializes audio processing chain and effects
   */
  setup() {
    if (!this._backgroundMusic || !this._bellSound) return;

    this._setupBackgroundMusic();
    this._setupBellSound();
    this._setupThunderSounds();
    
    this._isInitialized = true;
  }

  // Public control methods  
  toggleBackgroundMusic(playing) {
    if (!this._backgroundMusic) return;
    
    if (playing && !this._backgroundMusic.isPlaying()) {
      this._backgroundMusic.loop();
    } else if (!playing) {
      this._backgroundMusic.stop(); 
    }
  }

  setBackgroundVolume(level) {
    if (this._backgroundMusic) {
      this._backgroundMusic.setVolume(constrain(level, 0, 1));
    }
  }

  toggleBells(playing) {
    if (!this._bellSound) return;
    
    if (playing && !this._bellSound.isPlaying()) {
      this._bellSound.loop();
    } else if (!playing) {
      this._bellSound.stop();
    }
  }

  playRandomThunder() {
    if (this._thunderSounds.length === 0) return;
    
    const index = floor(random(this._thunderSounds.length));
    this._thunderSounds[index].play();
    this._lastThunderTime = millis();
  }

  // Private helper methods
  _loadSound(path) {
    return new Promise((resolve, reject) => {
      loadSound(path, 
        () => resolve(sound),
        (err) => reject(err)
      );
    });
  }

  _setupBackgroundMusic() {
    this._backgroundMusic.setVolume(SoundManager.DEFAULT_VOLUME);
    this._backgroundMusic.loop();
  }

  _setupBellSound() {
    const settings = SoundManager.BELL_SETTINGS;
    
    // Create and configure reverb
    this._bellReverb = new p5.Reverb();
    this._bellSound.disconnect();
    this._bellSound.connect(this._bellReverb);
    this._bellReverb.set(settings.reverbDuration, settings.reverbDecay);
    
    // Configure bell sound
    this._bellSound.rate(settings.rate);
    this._bellSound.setVolume(settings.volume);
    this._bellSound.loop();
  }

  _setupThunderSounds() {
    this._thunderSounds.forEach(thunder => 
      thunder.setVolume(SoundManager.DEFAULT_VOLUME)
    );
  }
}

let thunderSounds = []
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
  soundManager.setup();
}

function toggleBackgroundMusic(playing) {
  soundManager.toggleBackgroundMusic(playing);
}

function setBackgroundVolume(level) {
  soundManager.setBackgroundVolume(level);
}

function toggleBells(playing) {
  soundManager.toggleBells(playing);
}