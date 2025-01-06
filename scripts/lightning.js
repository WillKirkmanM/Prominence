/**
 * Manages lightning effects and thunder sound synchronization
 */
class LightningManager {
  static get MIN_FLASH_INTERVAL() { return 5000; }
  static get MAX_FLASH_INTERVAL() { return 15000; }
  static get SEQUENCE_DURATION() { return 500; }
  static get BASE_AMBIENT_LIGHT() { return 60; }
  static get MAX_LIGHT_INTENSITY() { return 255; }
  
  constructor() {
    this._isFlashing = false;
    this._lastFlashTime = 0;
    this._nextFlashTime = 0;
    this._flashSequence = [];
    this._isFlashSequence = false;
    this._sequenceStartTime = 0;
    this._currentIntensity = this.constructor.BASE_AMBIENT_LIGHT;
  }

  // Getters and setters
  get isFlashing() { return this._isFlashing; }
  get isFlashSequence() { return this._isFlashSequence; }
  
  /**
   * Creates a new lightning flash sequence
   */
  createFlashSequence() {
    this._flashSequence = [];
    let timeOffset = 0;
    
    // Generate main flashes
    const numFlashes = floor(random(3, 6));
    for(let i = 0; i < numFlashes; i++) {
      // Main flash
      this._flashSequence.push({
        time: timeOffset,
        intensity: random(200, this.constructor.MAX_LIGHT_INTENSITY),
        duration: random(150, 300)
      });
      
      // Echo flashes
      const numEchoes = floor(random(2, 4));
      for(let j = 0; j < numEchoes; j++) {
        timeOffset += random(100, 300);
        this._flashSequence.push({
          time: timeOffset,
          intensity: random(100, 200),
          duration: random(100, 200)
        });
      }
      timeOffset += random(400, 800);
    }
  }

  /**
   * Updates lightning state and renders effects
   */
  update() {
    const currentTime = millis();
    
    if (currentTime > this._nextFlashTime) {
      this._isFlashSequence = true;
      this._sequenceStartTime = currentTime;
      this.createFlashSequence();
      this._nextFlashTime = currentTime + random(
        this.constructor.MIN_FLASH_INTERVAL, 
        this.constructor.MAX_FLASH_INTERVAL
      );
    }
    
    if (this._isFlashSequence) {
      let sequenceAge = currentTime - this._sequenceStartTime;
      
      if (sequenceAge < this.constructor.SEQUENCE_DURATION) {
        this._currentIntensity = this.constructor.BASE_AMBIENT_LIGHT;
        
        this._flashSequence.forEach(flash => {
          let flashAge = sequenceAge - flash.time;
          if (flashAge > 0 && flashAge < flash.duration) {
            let flashContribution = flash.intensity * (1 - flashAge/flash.duration);
            this._currentIntensity = max(this._currentIntensity, flashContribution);
          }
        });
        
        // Add subtle flicker
        this._currentIntensity += random(-5, 5);
        this._currentIntensity = constrain(
          this._currentIntensity, 
          this.constructor.BASE_AMBIENT_LIGHT, 
          this.constructor.MAX_LIGHT_INTENSITY
        );
        
        ambientLight(this._currentIntensity);
      } else {
        this._isFlashSequence = false;
        ambientLight(this.constructor.BASE_AMBIENT_LIGHT);
      }
    }
  }

  /**
   * Triggers a lightning flash effect
   */
  triggerFlash() {
    this._isFlashing = true;
    this._lastFlashTime = millis();
  }

  /**
   * Forces a new lightning sequence to start immediately
   */
  forceSequence() {
    this._startNewSequence(millis());
  }

  // Private helper methods
  _addFlash(time, minIntensity, maxIntensity, minDuration, maxDuration) {
    this._flashSequence.push({
      time: time,
      intensity: random(minIntensity, maxIntensity),
      duration: random(minDuration, maxDuration)
    });
  }

  _addEchoFlashes(timeOffset) {
    const numEchoes = floor(random(2, 4));
    for(let j = 0; j < numEchoes; j++) {
      timeOffset += random(100, 300);
      this._addFlash(timeOffset, 100, 200, 100, 200);
    }
    return timeOffset;
  }

  _startNewSequence(currentTime) {
    this._isFlashSequence = true;
    this._sequenceStartTime = currentTime;
    this.createFlashSequence();
    this._nextFlashTime = currentTime + 
      random(LightningManager.MIN_FLASH_INTERVAL, LightningManager.MAX_FLASH_INTERVAL);
  }

  _updateSequence(currentTime) {
    const sequenceAge = currentTime - this._sequenceStartTime;
    
    if (sequenceAge < LightningManager.SEQUENCE_DURATION) {
      this._updateLightIntensity(sequenceAge);
    } else {
      this._resetSequence();
    }
  }

  _updateLightIntensity(sequenceAge) {
    let totalIntensity = LightningManager.BASE_AMBIENT_LIGHT;
    
    this._flashSequence.forEach(flash => {
      const flashAge = sequenceAge - flash.time;
      if (flashAge > 0 && flashAge < flash.duration) {
        const flashContribution = flash.intensity * (1 - flashAge/flash.duration);
        totalIntensity = max(totalIntensity, flashContribution);
      }
    });

    // Add dynamic flicker effect
    totalIntensity += random(-10, 10);
    totalIntensity = constrain(
      totalIntensity, 
      LightningManager.BASE_AMBIENT_LIGHT,
      LightningManager.MAX_LIGHT_INTENSITY
    );
    
    ambientLight(totalIntensity);
  }

  _resetSequence() {
    this._isFlashSequence = false;
    ambientLight(LightningManager.BASE_AMBIENT_LIGHT);
  }
}

function lightning() {
  lightningManager.update();
}

function triggerLightningFlash() {
  lightningManager.triggerFlash();
}

/**
 * Updates thunder sound effects
 */
function updateThunder() {
  const currentTime = millis();
  const minInterval = 5000;  
  const maxInterval = 20000;
  
  if (currentTime - lightningManager.lastThunderTime > random(minInterval, maxInterval)) {
    const randomThunder = random(thunderSounds);
    if (randomThunder && !randomThunder.isPlaying()) {
      console.log("Playing thunder sound");
      randomThunder.play();
      lightningManager.forceSequence();
      lightningManager.lastThunderTime = currentTime;
    }
  }
}