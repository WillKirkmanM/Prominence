/**
 * Constants for grass generation and positioning
 */
class GrassConstants {
  static get NUM_GRASS() { return 500; }
  static get X_OFFSET() { return -4000; }  // Shift left
  static get Z_OFFSET() { return 1000; }   // Shift back  
  static get MIN_RADIUS() { return 200; }
  static get MAX_RADIUS() { return 800; }
  static get MIN_HEIGHT() { return 10; }
  static get MAX_HEIGHT() { return 30; }
  static get NOISE_SCALE() { return 0.01; }
  static get BASE_Y() { return -50; }
  static get SWAY_MIN() { return 0.02; }
  static get SWAY_MAX() { return 0.05; }
  static get SWAY_MAGNITUDE() { return 0.1; }
  static get BLADE_WIDTH() { return 5; }
  static get COLOR() { return [34, 139, 34]; } // Forest green
}

/**
 * Represents an individual grass blade with physics-based animation
 */
class Grass {
  constructor(x, y, z) {
    this._position = createVector(x, y, z);
    this._rotation = random(TWO_PI);
    this._height = random(GrassConstants.MIN_HEIGHT, GrassConstants.MAX_HEIGHT);
    this._swayAmount = random(GrassConstants.SWAY_MIN, GrassConstants.SWAY_MAX);
    this._swayOffset = random(TWO_PI);
  }

  // Getters
  get position() { return this._position; }
  get rotation() { return this._rotation; }
  get height() { return this._height; }
  get swayAmount() { return this._swayAmount; }
  get swayOffset() { return this._swayOffset; } 

  /**
   * Calculates current sway angle based on time
   * @returns {number} Current sway rotation in radians
   */
  get currentSway() {
    return sin(frameCount * this.swayAmount + this.swayOffset) * GrassConstants.SWAY_MAGNITUDE;
  }

  /**
   * Renders grass blade with proper transformations and animation
   */
  draw() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    rotateY(this.rotation);
    rotateX(this.currentSway);
    
    fill(...GrassConstants.COLOR);
    noStroke();
    plane(GrassConstants.BLADE_WIDTH, this.height);
    
    pop();
  }
}

/**
 * Generates a field of grass blades in a circular pattern
 * @returns {Array<Grass>} Array of generated grass instances
 */
function generateGrass() {
  const grass = [];
  
  for(let i = 0; i < GrassConstants.NUM_GRASS; i++) {
    // Calculate position using polar coordinates
    const angle = random(TWO_PI);
    const radius = random(GrassConstants.MIN_RADIUS, GrassConstants.MAX_RADIUS);
    
    // Convert to cartesian coordinates with offset
    const x = cos(angle) * radius + GrassConstants.X_OFFSET;
    const z = sin(angle) * radius + GrassConstants.Z_OFFSET;
    
    // Add height variation using noise
    const y = GrassConstants.BASE_Y + 
             noise(x * GrassConstants.NOISE_SCALE, 
                  z * GrassConstants.NOISE_SCALE) * 5;
    
    grass.push(new Grass(x, y, z));
  }
  
  return grass;
}