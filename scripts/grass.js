const NUM_GRASS = 500; // More dense than trees
let grass = []; // Array to store grass instances

// Add new constants for positioning
// const GRASS_X_OFFSET = -1000;  // Shift left
// const GRASS_Z_OFFSET = 3000;   // Shift back
const GRASS_X_OFFSET = -4000;  // Shift left
const GRASS_Z_OFFSET = 1000;   // Shift back

const GRASS_MIN_RADIUS = 200;
const GRASS_MAX_RADIUS = 800;

class Grass {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z); // Same y level as ground
    this.rotation = random(TWO_PI);
    this.height = random(10, 30);
      // key = new Key(-4000, -5, 2000)
    this.swayAmount = random(0.02, 0.05);
    this.swayOffset = random(TWO_PI);
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateY(this.rotation);
    rotateX(sin(frameCount * this.swayAmount + this.swayOffset) * 0.1);
    fill(34, 139, 34); // Forest green
    noStroke();
    plane(5, this.height); // Thin vertical plane for grass blade
    pop();
  }
}

function generateGrass() {
  grass = [];
  for(let i = 0; i < NUM_GRASS; i++) {
    let angle = random(TWO_PI);
    let radius = random(GRASS_MIN_RADIUS, GRASS_MAX_RADIUS);
    
    // Apply offsets to position
    let x = cos(angle) * radius + GRASS_X_OFFSET;
    let z = sin(angle) * radius + GRASS_Z_OFFSET;    
    let y = -50 + noise(x * 0.01, z * 0.01) * 5;
    
    grass.push(new Grass(x, y, z));
  }
}