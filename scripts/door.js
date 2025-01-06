/**
 * Represents an interactive door in the game world
 * Handles door state, animations and player interactions
 */
class Door {
  static get FADE_SPEED() { return 2; }
  static get ROTATION_SPEED() { return 2; }
  static get OPEN_ANGLE() { return 90; }
  static get OVERLAY_DISTANCE() { return -1000; }
  static get OVERLAY_SIZE() { return 10000; }
  static get PROMPT_HEIGHT() { return -150; }
  static get PROMPT_WIDTH() { return 800; }
  static get PROMPT_HEIGHT() { return 90; }
  static get INTERACTION_KEY() { return 69; } // 'E' key

  constructor(x, y, z) {
    // Position and rotation state
    this._position = createVector(x, y, z);
    this._rotation = 0;
    this._targetRotation = 0;
    
    // Interaction properties  
    this._interactionRange = 500;
    this._isOpen = false;
    this._showDialog = true;
    this._locked = false;

    // Visual effects
    this._fadeStarted = false;
    this._fadeOpacity = 0;

    // Dialog text
    this._lockedMessage = "No use, it appears to be locked, for quite some time...";
    this._unlockedMessage = "Press 'E' to open door";
  }

  // Getters and setters
  get position() { return this._position; }
  get rotation() { return this._rotation; }
  get isOpen() { return this._isOpen; }
  get showDialog() { return this._showDialog; }
  get fadeOpacity() { return this._fadeOpacity; }
  
  set showDialog(value) { this._showDialog = value; }
  set fadeOpacity(value) { this._fadeOpacity = Math.max(0, Math.min(255, value)); }

  get currentMessage() {
    return gameState.hasKey ? this._unlockedMessage : this._lockedMessage;
  }

  /**
   * Renders the door and associated UI elements
   */
  draw() {
    push();
    this._renderDoor();
    this._renderDialogPrompt();  
    this._renderFadeOverlay();
    pop();
  }

  /**
   * Handles door interaction based on player position
   * @param {p5.Vector} playerPos - Current player position
   * @returns {boolean} Whether interaction was successful
   */
  checkInteraction(playerPos) {
    const distance = this._getDistanceToPlayer(playerPos);
    this.showDialog = distance < this._interactionRange;
    
    if (this._canInteract(distance)) {
      this._triggerInteraction();
      return true;
    }
    return false;
  }

  /**
   * Updates door state and animations
   */
  update() {
    this._updateRotation();
    this._updateFadeEffect();
  }

  // Private helper methods
  _renderDoor() {
    translate(this.position.x, this.position.y, this.position.z);
    rotateY(radians(this.rotation));
  }

  _renderDialogPrompt() {
    if (!this.showDialog || this.isOpen) return;

      push();
      translate(0, -150, 0);
      
      // Draw background
      fill(0, 0, 0, 200);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, 800, 90, 90);
      
      // Draw text
      textSize(30);
      textAlign(CENTER);
      fill(255);
      text(gameState.hasKey ? this._unlockedMessage: "No use, it appears to be locked, for quite some time...", 0, 0);
      pop();
  }

  _renderFadeOverlay() {
    if (!this._fadeStarted) return;

    push();
    translate(0, Door.PROMPT_HEIGHT, 0);
    rotateY(-player.rot);
    fill(0, 0, 0, this.fadeOpacity);
    noStroke();
    translate(0, 0, Door.OVERLAY_DISTANCE);
    plane(Door.OVERLAY_SIZE, Door.OVERLAY_SIZE);
    pop();
  }

  _getDistanceToPlayer(playerPos) {
    return dist(this.position.x, this.position.z, playerPos.x, playerPos.z);
  }

  _canInteract(distance) {
    return distance < this._interactionRange && 
           keyIsDown(Door.INTERACTION_KEY) && 
           gameState.hasKey && 
           !this.isOpen;
  }

  _triggerInteraction() {
    this._isOpen = true;
    this._targetRotation = Door.OPEN_ANGLE;
    this._fadeStarted = true;
    startEndScreen();
  }

  _updateRotation() {
    if (this.rotation === this._targetRotation) return;
    
    const diff = this._targetRotation - this.rotation;
    this._rotation += Math.sign(diff) * Door.ROTATION_SPEED;
  }

  _updateFadeEffect() {
    if (this._fadeStarted && this.fadeOpacity < 255) {
      this.fadeOpacity += Door.FADE_SPEED;
    }
  }
}