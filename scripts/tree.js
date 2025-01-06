/**
 * Configuration for forest generation
 */
class ForestConfig {
  static get DEFAULT_SETTINGS() {
    return {
      NUM_TREES: 10,
      FOREST_RADIUS: 1000,
      MIN_HEIGHT: 100,
      MAX_HEIGHT: 200,
      MIN_TRUNK: 5,
      MAX_TRUNK: 10,
      MIN_LEAF: 30,
      MAX_LEAF: 50,
      GRID_SIZE: 100,
      SPAWN_CLEARANCE: 150,
      PLACEMENT_CHANCE: 0.3,
      POSITION_VARIANCE: 20
    };
  }
}

/**
 * Represents a single tree in the forest
 */
class Tree {
  constructor(x, z) {
    this._position = createVector(x, 0, z);
    this._dimensions = {
      height: random(ForestConfig.DEFAULT_SETTINGS.MIN_HEIGHT, 
                     ForestConfig.DEFAULT_SETTINGS.MAX_HEIGHT),
      trunkRadius: random(ForestConfig.DEFAULT_SETTINGS.MIN_TRUNK,
                         ForestConfig.DEFAULT_SETTINGS.MAX_TRUNK),
      leafRadius: random(ForestConfig.DEFAULT_SETTINGS.MIN_LEAF,
                        ForestConfig.DEFAULT_SETTINGS.MAX_LEAF)
    };
    this._textures = {
      bark: null,
      leaves: null
    };
  }

  get position() { return this._position; }
  get height() { return this._dimensions.height; }
  get trunkRadius() { return this._dimensions.trunkRadius; }
  get leafRadius() { return this._dimensions.leafRadius; }

  set barkTexture(texture) { this._textures.bark = texture; }
  set leafTexture(texture) { this._textures.leaves = texture; }

  draw() {
    push();
    this._drawTrunk();
    this._drawLeaves();
    pop();
  }

  _drawTrunk() {
    push();
    translate(this._position.x, -50, this._position.z);
    
    if (this._textures.bark) {
      texture(this._textures.bark);
    }
    
    rotateX(-PI/2);
    cylinder(this._dimensions.trunkRadius, this._dimensions.height);
    pop();
  }

  _drawLeaves() {
    push();
    translate(this._position.x, 
             -50 - this._dimensions.height/2,
             this._position.z);
             
    if (this._textures.leaves) {
      texture(this._textures.leaves);
    }
    
    sphere(this._dimensions.leafRadius);
    pop();
  }
}

/**
 * Manages forest generation and rendering
 */
class ForestManager {
  constructor() {
    this._trees = [];
  }
  
  get trees() { return this._trees; }

  generateGridForest() {
    this._trees = [];
    const config = ForestConfig.DEFAULT_SETTINGS;
    
    for(let x = -500; x < 500; x += config.GRID_SIZE) {
      for(let z = -500; z < 500; z += config.GRID_SIZE) {
        if(abs(x) < config.SPAWN_CLEARANCE && 
           abs(z) < config.SPAWN_CLEARANCE) continue;
        
        if(random() < config.PLACEMENT_CHANCE) {
          const position = this._randomizePosition(x, z);
          this._trees.push(new Tree(position.x, position.z));
        }
      }
    }
  }

  generateRadialForest() {
    this._trees = [];
    const config = ForestConfig.DEFAULT_SETTINGS;
    
    for(let i = 0; i < config.NUM_TREES; i++) {
      const position = this._getRadialPosition();
      this._trees.push(new Tree(position.x, position.z));
    }
  }

  _randomizePosition(baseX, baseZ) {
    const variance = ForestConfig.DEFAULT_SETTINGS.POSITION_VARIANCE;
    return {
      x: baseX + random(-variance, variance),
      z: baseZ + random(-variance, variance)
    };
  }

  _getRadialPosition() {
    const angle = random(TWO_PI);
    const radius = random(200, ForestConfig.DEFAULT_SETTINGS.FOREST_RADIUS);
    return {
      x: cos(angle) * radius,
      z: sin(angle) * radius
    };
  }
}

let trees = [];
let treeTexture;
let barkTexture;
const forestManager = new ForestManager();

function generateTrees() {
  forestManager.generateRadialForest();
  trees = forestManager.trees;
}