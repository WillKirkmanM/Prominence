/**
 * Manages the game's ending sequence and fade transition
 */
class EndScreen {
  static get FADE_SPEED() { return 2; }
  static get TEXT_FADE_THRESHOLD() { return 200; }
  static get MAX_OPACITY() { return 255; }
  static get TITLE_TEXT() { return "Prominence"; }
  static get TITLE_SIZE() { return 96; }

  constructor() {
    this._isActive = false;
    this._opacity = 0;
  }

  // Getters and setters
  get isActive() { return this._isActive; }
  get opacity() { return this._opacity; }
  
  set opacity(value) {
    this._opacity = Math.max(0, Math.min(EndScreen.MAX_OPACITY, value));
  }

  /**
   * Starts the ending sequence
   */
  start() {
    this._isActive = true;
    this._opacity = 0;
    console.log("EndScreen sequence initiated");
  }

  /**
   * Renders the ending sequence frame
   */
  draw() {
    if (!this._isActive) return;

    this._renderBackground();
    this._updateFade();
    this._renderTitle();
  }

  // Private helper methods
  _renderBackground() {
    push();
    background(0);
    fill(0, 0, 0, this._opacity);
    noStroke();
    rectMode(CENTER);
    rect(width/2, height/2, width, height);
    pop();
  }

  _updateFade() {
    if (this._opacity < EndScreen.MAX_OPACITY) {
      this.opacity += EndScreen.FADE_SPEED;
    }
  }

  _renderTitle() {
    if (this._opacity <= EndScreen.TEXT_FADE_THRESHOLD) return;

    push();
    textAlign(CENTER, CENTER);
    textSize(EndScreen.TITLE_SIZE);
    
    // Calculate text opacity based on fade threshold
    const textOpacity = Math.min(
      this._opacity - EndScreen.TEXT_FADE_THRESHOLD, 
      EndScreen.MAX_OPACITY
    );
    
    fill(255, textOpacity);
    text(EndScreen.TITLE_TEXT, 0, 0);
    pop();
  }
}

/**
 * Main draw function for ending sequence
 */
function endScreen() {
  endScreenManager.draw();
}

/**
 * Initiates the ending sequence
 */
function startEndScreen() {
  endScreenManager.start();
}