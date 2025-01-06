// Game assets
let font, keyCollectable;

// Interactive entities
let oldMan, door, npc, house;

// Environment objects
let grass;

// Game systems
let endScreenManager, fogManager, houseManager, levelManager, lightningManager, movementManager, soundManager;

let shaderInitialized = false;
let showDebugInfo = false;

let segmentDurations = []
let dialogEndTime = 0

function preload() {
  preloadTitleScreenAssets()

  preloadSound()
  preloadTextures()

  oldMan = loadModel('/assets/models/oldman/UY3M33687DKX3HZB1LVIODS9E.obj', true)
  house = loadModel('/assets/models/manor/Oldhouse.obj', true)
  
  segment1 = loadSound('/assets/audio/segment_1.wav', () => {
    segmentDurations[0] = segment1.duration() * 2000;
  });
  segment2 = loadSound('/assets/audio/segment_2.wav', () => {
    segmentDurations[1] = segment2.duration() * 2000;
  });
  segment3 = loadSound('/assets/audio/segment_3.wav', () => {
    segmentDurations[2] = segment3.duration() * 2000;
  });
  segment4 = loadSound('/assets/audio/segment_4.wav', () => {
    segmentDurations[3] = segment4.duration() * 2000;
  });

  loadFont('assets/fonts/Helvetica.ttf', 
    // Success callback
    function(f) {
      font = f;
      titleFont = f;
      fontLoaded = true;
    },
    // Error callback
    function(err) {
      console.error('Font failed to load:', err);
      // Use system default font as fallback
      font = 'Arial';
      titleFont = 'Arial';
      fontLoaded = true;
    }
  );
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  endScreenManager = new EndScreen()
  fogManager = new FogManager()
  grass = generateGrass()
  levelManager = new LevelManager()
  lightningManager = new LightningManager()
  movementManager = new MovementManager()
  soundManager = new SoundManager()
  
  setupTextures();
  setupSound()

  if (fontLoaded) {
    console.log("Font is Loaded & font is: ", font.font.names.compatibleFullName.en);
    textFont(font);
    textSize(24);
  }

  if (!shaderInitialized) {
    createFogShader();
    fogManager.initialize()
    shaderInitialized = true;
  }

  noStroke();
  perspective(PI/3.0, width/height, 0.1, 10000);
  textureMode(NORMAL);
  textureWrap(REPEAT);
  generateTrees();
  generateGrass()

  background(10, 10, 20);
  
  ambientLight(5); // Fixed division by 0
  directionalLight(200, 200, 255, 0, 1, -1);

  door = new Door(-318, -485, -1461);
  npc = new NPC(-500, -100, 3000);
  keyCollectable = new Key(-4000, -5, 1000)
  
  player.pos = createVector(gameState.startPosition.x, gameState.startPosition.y, gameState.startPosition.z);
  player.rot = -PI/2
  player.vel = createVector(0, 0, 0);
  
  walls.push(new Boundary(-200, -200, 200, -200));
  walls.push(new Boundary(200, -200, 200, 200));
  walls.push(new Boundary(200, 200, -200, 200));
  walls.push(new Boundary(-200, 200, -200, -200));

  document.addEventListener('click', () => document.body.requestPointerLock());

  textureMode(NORMAL);
  textureWrap(REPEAT);
}

function drawSkybox() {
  push();
  noStroke();
  texture(nightTexture);
  translate(0, 0, 0);
  translate(player.pos.x, player.pos.y, player.pos.z);
  sphere(5000);
  pop();
}

function updateLightPosition() {
  lightSource.pos.x = sin(lightSource.angle) * lightSource.radius;
  lightSource.pos.z = cos(lightSource.angle) * lightSource.radius;
  lightSource.pos.y = -50; // Same height as player
}

function draw() {
  // --- Screen State Management ---
  if (endScreenManager.isActive) {
    endScreen()
    return
  }
  if (titleScreen) {
    drawTitleScreen();
    return;
  }
  if (!texturesLoaded) {
    background(0);
    return;
  }

  // --- Scene Setup ---
  resetFogShader()
  directionalLight(100, 100, 150, 0, 1, -1);
  drawSkybox()

  // --- Environmental Effects ---
  handleKeyPress()
  updateThunder()
  lightningManager.update()

  // --- Player Controls ---
  handleMovement();
  handleMouseLook();
  
  // --- World Objects Rendering ---
  drawHouse()

  // Door interaction and state
  door.draw();
  door.checkInteraction(player.pos);
  door.update();

  // NPC handling
  npc.draw();
  npc.checkInteraction(player.pos)

  // Dialog timeout check
  if (millis() > dialogEndTime) {
    npc.showDialog = false;
  }

  // Environment objects
  grass.forEach(grass => grass.draw());
  keyCollectable.draw()
  keyCollectable.checkCollection(player.pos)

  // --- Camera Configuration ---
  // Sets up first-person perspective with fixed orientation
  camera(
    player.pos.x, 
    player.pos.y - 100, // Eye height
    player.pos.z,
    player.pos.x + cos(player.rot) * cos(player.rotY), // Look direction X
    player.pos.y - 100 + sin(player.rotY),             // Look direction Y
    player.pos.z + sin(player.rot) * cos(player.rotY), // Look direction Z
    0, 1, 0  // Up vector
  );
  
  // --- Ground and Environment Rendering ---
  if (groundTexture && wallTexture && metalTexture) {
    // Ground plane
    push();
    translate(0, 0, 0);
    rotateX(PI/2);
    if (gameState.isInHouse) {
      texture(woodTexture)
    } else {
      texture(groundTexture);
    }
    plane(10000, 10000);
    pop();
    
    // Light source object
    push();
    translate(lightSource.pos.x, lightSource.pos.y, lightSource.pos.z);
    texture(metalTexture);
    pop();
  }
  
  // --- Indoor Scene Elements ---
  if (gameState.isInHouse) {
    drawObjects();
  }
  
  // --- Lighting and Effects ---
  handleLightMovement();
  updateRays();
  checkStairCollision()

  // --- Teleportation System ---
  // Visualization of teleport zone
  if (!gameState.isInHouse) {
    push();
    translate(teleportZone.x, -50, teleportZone.z);
    fill(0, 255, 255, 50);
    cylinder(teleportZone.radius, 100);
    pop();
  }

  // Teleportation logic
  checkTeleport();
  if (gameState.teleportCooldown > 0) {
    gameState.teleportCooldown--;
  }
  updateDoors();
  handleTeleportation()
  resetFogShader()
}

function drawDebugInfo() {
  push();
  fill(255);
  textSize(20);
  text('Player position: ' + player.pos, 10, 20);
  text('Player rotation: ' + player.rot, 10, 40);
  text('Player rotationY: ' + player.rotY, 10, 60);
  text('Player velocity: ' + player.vel, 10, 80);
  text('Player speed: ' + player.speed, 10, 100);
  text('Player mouse sensitivity: ' + player.mouseSensitivity, 10, 120);
  text('Player look up/down: ' + player.maxLookUp + '/' + player.maxLookDown, 10, 140);
  text('NPC position: ' + npc.pos, 10, 160);
  text('NPC dialog: ' + npc.dialog, 10, 180);
  text('NPC interaction range: ' + npc.interactionRange, 10, 200);
  text('Show dialog: ' + showDialog, 10, 220);
  text('Dialog timer: ' + dialogTimer, 10, 240);
  text('Dialog duration: ' + DIALOG_DURATION, 10, 260);
  pop();
}

// This is the order of the textures for the manor.
const textureOrder = [
  30, 22, 23, 24, 25, 9, 21, 5, 9, 6,
  8, 9, 27, 28, 11, 12, 31, 32, 34, 35,
  36, 37, 38, 39, 40, 33, 42, 13, 41, 28,
  0, 1, 2, 3, 4, 7, 10, 14, 15, 16,
  17, 18, 10, 19, 20, 26, 29, 43
];



// let stairStart = createVector(-349, -0, -19);
let stairStart = createVector(-300, 150, -10);
let stairEnd = createVector(-381, -200, -506);
let stairSteps = 6
let stairVisualWidth = 1000; // Width for visualization
let stairCollisionWidth = 1000; // Width for collision detection

function drawStairs() {
  push();
  fill(0, 255, 0, 100);
  noStroke();
  
  for(let i = 0; i < stairSteps; i++) {
    let t = i / (stairSteps - 1);
    let stairX = lerp(stairStart.x, stairEnd.x, t);
    let stairZ = lerp(stairStart.z, stairEnd.z, t);
    let heightAtStep = lerp(stairStart.y, stairEnd.y, t);
    
    push();
    translate(stairX, heightAtStep - 200, stairZ);
    box(stairVisualWidth, 30, stairVisualWidth);
    pop();
  }
  pop();
}

function checkStairCollision() {
  if(checkWalkwayCollision()) return true;
  for(let i = 0; i < stairSteps; i++) {
    let t = i / (stairSteps - 1);
    let stairX = lerp(stairStart.x, stairEnd.x, t);
    let stairZ = lerp(stairStart.z, stairEnd.z, t);
    let heightAtStep = lerp(stairStart.y, stairEnd.y, t);
    
    let distToStair = dist(player.pos.x, player.pos.z, stairX, stairZ);
    if(distToStair < stairCollisionWidth/2) {
      player.pos.y = heightAtStep - 200;
      return true;
    }
  }
  return false;
}

let walkwayStart = createVector(-300, -1000, -100);
let walkwayEnd = createVector(-250, -1000, -1500);
let walkwayWidth = 400;

function drawWalkway() {
  push();
  fill(0, 255, 0, 100);
  noStroke();
  
  let walkwayDir = p5.Vector.sub(walkwayEnd, walkwayStart);
  let walkwayLength = walkwayDir.mag();
  let angle = atan2(walkwayDir.z, walkwayDir.x);
  
  push();
  translate(walkwayStart.x, walkwayStart.y - 20, walkwayStart.z);
  rotateY(angle);
  box(walkwayWidth, 10, walkwayLength);
  pop();
  
  pop();
}

function checkWalkwayCollision() {
  let walkwayVector = p5.Vector.sub(walkwayEnd, walkwayStart);
  let playerVector = p5.Vector.sub(
    createVector(player.pos.x, 0, player.pos.z), 
    createVector(walkwayStart.x, 0, walkwayStart.z)
  );
  
  let t = constrain(playerVector.dot(walkwayVector) / walkwayVector.dot(walkwayVector), 0, 1);
  let closest = p5.Vector.add(walkwayStart, p5.Vector.mult(walkwayVector, t));
  let distToWalkway = dist(player.pos.x, player.pos.z, closest.x, closest.z) - 300;
  
  if(distToWalkway < walkwayWidth/2) {
    player.pos.y = -500; // Keep at top of stairs level
    return true;
  }
  return false;
}

function handleMouseLook() {
  if (document.pointerLockElement) {
    // Horizontal rotation (yaw)
    player.rot += movedX * player.mouseSensitivity;
    
    // Vertical rotation (pitch)
    player.rotY = constrain(
      player.rotY + movedY * player.mouseSensitivity,
      -player.maxLookUp,
      player.maxLookDown
    );
  }
}

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

const updateRays = () => {}

function drawObjects() {
  lights();
  
  // Boxes with Shadows
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

function drawDoors() {
  push();
  texture(wallTexture);
  doors.forEach(door => {
    push();
    translate(door.x, -25, door.z);
    rotateY(radians(door.rotation));
    box(40, 50, 5); // door dimensions
    pop();
  });
  pop();
}

function updateDoors() {
  doors.forEach(door => {
    if(door.rotation !== door.targetRot) {
      let diff = door.targetRot - door.rotation;
      door.rotation += Math.sign(diff) * gameState.doors.openSpeed;
    }
  });
  drawDoors();
}

function drawText(message, x, y, z) {
  push();
  translate(x, y, z);
  rotateY(-player.rot);
  // Draw text
  fill(255);
  text(message, 0, 0);
  pop();
}