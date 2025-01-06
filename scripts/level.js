/**
 * Manages level state, transitions and interactions
 */
class LevelManager {
  static get FADE_SPEED() { return 10; }
  static get MAX_FADE() { return 255; }
  static get TELEPORT_COOLDOWN() { return 10; }
  
  constructor() {
    this._walls = [];
    this._teleportZone = {
      x: 0,
      z: 0,
      radius: 500
    };
  }

  // Getters and setters
  get walls() { return this._walls; }
  get teleportZone() { return this._teleportZone; }
 

  /**
   * Initiates teleport sequence with fade effect
   */
  startTeleportSequence() {
    gameState.isFading = true;
    gameState.fadeAlpha = 0;
  }

  /**
   * Updates teleportation fade effect and triggers teleport
   */
  handleTeleportation() {
    if (!gameState.isFading) return;

    this._updateFadeEffect();
    this._renderFadeOverlay();
    
    if (gameState.fadeAlpha >= LevelManager.MAX_FADE) {
      this._completeTeleport();
    }
  }

  /**
   * Sets up initial level state and boundaries
   */
  setupLevel() {
    this._walls = [];
    this._createStartPlatform();
    this._resetPlayerPosition();
  }

  /**
   * Checks if player is in teleport zone
   */
  checkTeleport() {
    if (gameState.isInHouse) return;

    const distance = dist(
      player.pos.x,
      player.pos.z,
      this.teleportZone.x,
      this.teleportZone.z
    );
    
    if (distance < this.teleportZone.radius && !gameState.teleportCooldown) {
      this.teleportToHouse();
    }
  }

  /**
   * Teleports player to house interior
   */
  teleportToHouse() {
    this._walls = [];
    this._setupHouseWalls();
    this._updateGameState();
    this._movePlayerToHouse();
    this._addTeleportCooldown();
  }

  // Private helper methods
  _updateFadeEffect() {
    gameState.fadeAlpha += LevelManager.FADE_SPEED;
  }

  _renderFadeOverlay() {
    push();
    translate(0, 0, -100);
    fill(0, 0, 0, gameState.fadeAlpha);
    rect(-width/2, -height/2, width, height);
    pop();
  }

  _completeTeleport() {
    this.teleportToHouse();
    gameState.isFading = false;
    gameState.fadeAlpha = 0;
  }

  _createStartPlatform() {
    // Start area platform boundaries
    this.walls.push(new Boundary(-100, -600, 100, -600));
    this.walls.push(new Boundary(100, -600, 100, -400));
    this.walls.push(new Boundary(-100, -600, -100, -400));
  }

  _resetPlayerPosition() {
    player.pos = createVector(
      gameState.startPosition.x,
      gameState.startPosition.y,
      gameState.startPosition.z
    );
  }

  _setupHouseWalls() {
    // To be implemented: Add house interior walls
  }

  _updateGameState() {
    gameState.isInHouse = true;
  }

  _movePlayerToHouse() {
    player.pos = createVector(
      gameState.housePosition.x,
      gameState.housePosition.y,
      gameState.housePosition.z  
    );
  }

  _addTeleportCooldown() {
    gameState.teleportCooldown = LevelManager.TELEPORT_COOLDOWN;
  }
}

/**
 * Handles keyboard input for level interactions
 * @param {string} key - Pressed key
 */
function handleKeyPress() {
  if (key.toLowerCase() === 'e') {
    console.log("Checking Interaction");
    if (npc.checkInteraction(player.pos)) {
      npc.interact();
    }
  }
}

function startTeleportSequence() {
  levelManager.startTeleportSequence();
}

function handleTeleportation() {
  levelManager.handleTeleportation();
}

function setupLevel() {
  levelManager.setupLevel();
}

function checkTeleport() {
  levelManager.checkTeleport();
}

function teleportToHouse() {
  levelManager.teleportToHouse();
}