/**
 * Represents a collectible key item in the game world
 * Handles rendering, interaction and collection logic
 */
class Key {
  // Static constants
  static get INTERACTION_KEY() { return 69; } // 'E' key
  static get ROTATION_SPEED() { return 0.02; }
  static get DIALOG_HEIGHT() { return -100; }
  static get DIALOG_PADDING() { return 20; }
  static get KEY_COLOR() { return [255, 215, 0]; } // Gold color
  static get KEY_DIMENSIONS() {
    return {
      base: [20, 10, 10],
      teeth: [10, 10, 5]
    };
  }

  constructor(x, y, z) {
    this._position = createVector(x, y, z);
    this._rotation = 0;
    this._collected = false;
    this._interactionRange = 500;
    this._dialog = "Press 'E' to collect key";
    this._showDialog = true;
  }

  // Getters and setters
  get position() { return this._position; }
  get rotation() { return this._rotation; }
  get collected() { return this._collected; }
  get showDialog() { return this._showDialog; }
  get dialog() { return this._dialog; }
  
  set rotation(value) { this._rotation = value; }
  set showDialog(value) { this._showDialog = value; }

  /**
   * Renders the key model and interaction prompt
   */
  draw() {
    if (this.collected) return;
    
    this._renderKey();
    this._renderDialog();
    this._updateRotation();
  }

  /**
   * Checks if player is in range to collect the key
   * @param {p5.Vector} playerPos - Current player position
   */
  checkCollection(playerPos) {
    if (this.collected) return;
    
    const distance = this._getDistanceToPlayer(playerPos);
    this.showDialog = distance < this._interactionRange;
    
    if (this._canCollect(distance)) {
      this._collect();
    }
  }

  // Private helper methods
  _renderKey() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateY(this.rotation);

    fill(...Key.KEY_COLOR);
    
    // Draw base
    const [baseW, baseH, baseD] = Key.KEY_DIMENSIONS.base;
    box(baseW, baseH, baseD);
    
    // Draw teeth
    translate(15, 0, 0);
    const [teethW, teethH, teethD] = Key.KEY_DIMENSIONS.teeth;
    box(teethW, teethH, teethD);
    
    pop();
  }

  _renderDialog() {
      if (!this.showDialog) return;
  
      push();
      translate(this.position.x, this.position.y + Key.DIALOG_HEIGHT, this.position.z);
      
      textAlign(CENTER, CENTER);
      textSize(20);
      
      // Calculate text dimensions
      const padding = Key.DIALOG_PADDING;
      const dialogWidth = textWidth(this.dialog);
      
      // Background
      fill("white");
      noStroke();
      rect(-dialogWidth/2 - padding, -20, dialogWidth + padding*2, 40);
      
      // Text
      text(this.dialog, 0, 0);
      pop();
  }

  _updateRotation() {
    this.rotation += Key.ROTATION_SPEED;
  }

  _getDistanceToPlayer(playerPos) {
    return dist(
      this.position.x, this.position.z,
      playerPos.x, playerPos.z
    );
  }

  _canCollect(distance) {
    return distance < this._interactionRange && 
           keyIsDown(Key.INTERACTION_KEY);
  }

  _collect() {
    this._collected = true;
    gameState.hasKey = true;
    console.log("You picked up the key!");
  }
}