// Add after other global variables
let trees = [];
let treeTexture;

let NUM_TREES = 10
FOREST_RADIUS = 1000

let barkTexture;

class Tree {
  constructor(x, z) {
    this.pos = createVector(x, 0, z);
    this.height = random(100, 200);
    this.trunkRadius = random(5, 10);
    this.leafRadius = random(30, 50);
  }

  draw() {
    push();
    translate(this.pos.x, -50, this.pos.z);
    
    // Draw trunk
    // texture(barkTexture);
    push();
    rotateX(-PI/2);
    cylinder(this.trunkRadius, this.height);
    pop();
    
    // Draw leaves
    // texture(leafTexture);
    translate(0, -this.height/2, 0);
    sphere(this.leafRadius);
    pop();
  }
}
function generateTrees() {
  // Clear existing trees
  trees = [];
  
  // Generate new trees in a grid pattern around spawn
  for(let x = -500; x < 500; x += 100) {
    for(let z = -500; z < 500; z += 100) {
      // Skip center area where player spawns
      if(abs(x) < 150 && abs(z) < 150) continue;
      
      // Random chance to place tree
      if(random() < 0.3) {
        // Add some randomness to position
        let tx = x + random(-20, 20);
        let tz = z + random(-20, 20);
        trees.push(new Tree(tx, tz));
      }
    }
  }
}

function generateTrees() {
  trees = [];
  for(let i = 0; i < NUM_TREES; i++) {
    let angle = random(TWO_PI);
    let radius = random(200, FOREST_RADIUS);
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    trees.push(new Tree(x, z));
  }
}

