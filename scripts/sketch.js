let player = {
  pos: null,
  vel: null,
  rot: 0,
  bobAmount: 0.4,        // Intensity of bob
  bobSpeed: 0.1,        // Speed of bob cycle
  bobCycle: 0,          // Tracks bob animation
  isJumping: false,
  isSprinting: false,
  bobPhase: 0,
  bobAmplitude: 0.15,
  bobFrequency: 0.3,
  currentSpeed: 4,
  baseSpeed: 4,
  sprintSpeed: 8,
  sprintAcceleration: 0.2,
  rotY: 0,  // vertical rotation (pitch)
  mouseSensitivity: 0.002,
  maxLookUp: Math.PI/2.5,    // ~72 degrees up
  maxLookDown: Math.PI/2.5,   // ~72 degrees down
  maxJumpVel: -12,      // Maximum jump velocity
  minJumpVel: -6,       // Minimum jump velocity when tapping
  gravity: 0.6,         // Reduced gravity for smoother fall
  coyoteTime: 100,      // Ms of jump grace period
  lastGroundTime: 0,     // Track when player was last grounded
  height: 5,
  heightSpeed: 0.1,
  minHeight: 0.5,
  maxHeight: 10,
};

// Add to your existing player object
let rays = [];
let walls = [];

// Add at top of sketch.js
let lightSource = {
  angle: 0,
  radius: 200,
  rotationSpeed: 0.05,
  pos: createVector(0, -50, 0)
};

// In setup(), adjust starting height and add perspective
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  perspective(PI/3.0, width/height, 0.1, 2000); // Add proper perspective
  
  player.pos = createVector(0, 0, 0); // Adjust starting position
  player.vel = createVector(0, 0, 0);
  
  // Create rays with proper vector initialization
  for (let a = 0; a < TWO_PI; a += PI/32) {
    let startPos = createVector(player.pos.x, player.pos.y - 50, player.pos.z);
    rays.push(new Ray(startPos, a));
  }
  
  // Create some walls
  walls.push(new Boundary(-200, -200, 200, -200));
  walls.push(new Boundary(200, -200, 200, 200));
  walls.push(new Boundary(200, 200, -200, 200));
  walls.push(new Boundary(-200, 200, -200, -200));
  
  document.addEventListener('click', () => document.body.requestPointerLock());
}

// Add to setup()
function updateLightPosition() {
  lightSource.pos.x = sin(lightSource.angle) * lightSource.radius;
  lightSource.pos.z = cos(lightSource.angle) * lightSource.radius;
  lightSource.pos.y = -50; // Same height as player
}

// In draw(), adjust ground plane and camera
function draw() {

  if (titleScreen) {
    drawTitleScreen();
    return;
  }
  background(135, 206, 235);  // Sky blue
  
  handleMovement();
  handleMouseLook();
  
  // Camera setup with fixed orientation
  camera(
    player.pos.x, 
    player.pos.y - 50, // Eye height
    player.pos.z,
    player.pos.x + cos(player.rot) * cos(player.rotY),
    player.pos.y - 50 + sin(player.rotY), // Look at point adjusted for height
    player.pos.z + sin(player.rot) * cos(player.rotY),
    0, 1, 0  // Changed to positive up vector
  );
  
  // Draw ground plane below player with correct rotation
  push();
  fill(34, 139, 34);
  translate(0, 0, 0);
  rotateX(-PI/2); // Inverted rotation for ground plane
  plane(1000, 1000);
  pop();
  
  // Draw objects with lighting
  drawObjects();
  
  // Update rays last
  handleLightMovement();
  updateRays();
}



function handleMouseLook() {
  if (document.pointerLockElement) {
    // Horizontal rotation (yaw)
    player.rot += movedX * player.mouseSensitivity;
    
    // Vertical rotation (pitch)
    // Added negative sign to movedY to fix inverted look
    player.rotY = constrain(
      player.rotY + movedY * player.mouseSensitivity,
      -player.maxLookUp,
      player.maxLookDown
    );
  }
}

// Add at the top of sketch.js after variable declarations
function createVector(x = 0, y = 0, z = 0) {
  // Validate inputs
  x = isNaN(x) ? 0 : x;
  y = isNaN(y) ? 0 : y;
  z = isNaN(z) ? 0 : z;
  
  // Create new p5.Vector instance
  return new p5.Vector(x, y, z);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Add light controls to handleMovement()
function handleLightMovement() {
  // Left/Right rotation
  if (keyIsDown(LEFT_ARROW)) {
    lightSource.angle -= lightSource.rotationSpeed;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    lightSource.angle += lightSource.rotationSpeed;
  }
  
  // Up/Down height control
  if (keyIsDown(UP_ARROW)) {
    lightSource.height = constrain(
      lightSource.height + lightSource.heightSpeed,
      lightSource.minHeight,
      lightSource.maxHeight
    );
  }
  if (keyIsDown(DOWN_ARROW)) {
    lightSource.height = constrain(
      lightSource.height - lightSource.heightSpeed,
      lightSource.minHeight,
      lightSource.maxHeight
    );
  }
  
  updateLightPosition();
}

// Modify updateRays()
function updateRays() {
  ambientLight(50);
  directionalLight(255, 255, 255, 0, -1, -1);
  
  push();
  blendMode(SCREEN);
  noFill();
  
  // Draw light source
  push();
  translate(lightSource.pos.x, lightSource.pos.y, lightSource.pos.z);
  fill(255, 255, 0);
  sphere(10);
  pop();
  
  rays.forEach(ray => {
    // Use light source position instead of player position
    const newPos = createVector(
      lightSource.pos.x,
      lightSource.pos.y,
      lightSource.pos.z
    );
    
    ray.setPosition(newPos);
    
    let closest = null;
    let record = Infinity;
    
    walls.forEach(wall => {
      const result = ray.cast(wall);
      if (result && result.point) {
        const d = result.distance;
        if (d < record) {
          record = d;
          closest = result.point;
        }
      }
    });
    
    if (closest) {
      const alpha = map(record, 0, ray.maxDistance, 150, 0);
      stroke(255, 255, 100, alpha); // Yellow-ish light
      strokeWeight(1);
      line(ray.pos.x, ray.pos.y, ray.pos.z,
           closest.x, closest.y, closest.z);
    }
  });
  
  pop();
  blendMode(BLEND);
}

// Add this to draw() before drawing objects:
function drawObjects() {
  // Enable lights for 3D objects
  lights();
  
  // Draw boxes with shadows
  fill(150);
  noStroke();
  for(let i = 0; i < 10; i++) {
    push();
    translate(sin(i) * 200, -50, cos(i) * 200);
    // Add ambient occlusion
    ambientMaterial(150);
    box(30);
    pop();
  }
}