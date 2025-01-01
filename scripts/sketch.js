function keyPressed() {
  if (key === 'e' || key === 'E') {
    if (!gameState.isInHouse && !gameState.isFading) {
      startTeleportSequence();
    } else {
      // Check for door interaction
      doors.forEach(door => {
        let d = dist(player.pos.x, player.pos.z, door.x, door.z);
        if (d < gameState.doors.interactDistance) {
          door.isOpen = !door.isOpen;
          door.targetRot = door.isOpen ? gameState.doors.maxOpen : 0;
        }
      });
    }
  }
}

function startTeleportSequence() {
  gameState.isFading = true;
  gameState.fadeAlpha = 0;
}

function handleTeleportation() {
  if (gameState.isFading) {
    gameState.fadeAlpha += 10;
    
    // Fade to black
    push();
    translate(0, 0, -100);
    fill(0, 0, 0, gameState.fadeAlpha);
    rect(-width/2, -height/2, width, height);
    pop();
    
    // When fade complete, teleport
    if (gameState.fadeAlpha >= 255) {
      teleportToHouse();
      gameState.isFading = false;
      gameState.fadeAlpha = 0;
    }
  }
}

function setupLevel() {
  // Clear existing walls
  walls = [];
  
  // Start area platform
  walls.push(new Boundary(-100, -600, 100, -600)); 
  walls.push(new Boundary(100, -600, 100, -400));
  walls.push(new Boundary(-100, -600, -100, -400));
  
  // Reset player position
  player.pos = createVector(
    gameState.startPosition.x,
    gameState.startPosition.y, 
    gameState.startPosition.z
  );
}

function checkTeleport() {
  if (!gameState.isInHouse) {
    let d = dist(
      player.pos.x,
      player.pos.z,
      teleportZone.x,
      teleportZone.z
    );
    
    if (d < teleportZone.radius && !gameState.teleportCooldown) {
      teleportToHouse();
    }
  }
}

function teleportToHouse() {
  // Clear existing level
  walls = [];
  
  // Setup house walls
  
  // Update game state
  gameState.isInHouse = true;
  
  // Move player to house position
  player.pos = createVector(
    gameState.housePosition.x,
    gameState.housePosition.y,
    gameState.housePosition.z
  );
  
  // Add cooldown to prevent immediate teleport back
  gameState.teleportCooldown = 10;
}



let groundTexture, wallTexture, metalTexture, nightTexture;
let texturesLoaded = false;
let textureLoadCount = 0;

function createDefaultTexture(color) {
  let tex = createGraphics(256, 256);
  tex.background(color);
  return tex;
}

function setupTextures() {
  // Default textures
  try {
    groundTexture = createDefaultTexture(color(100, 80, 60));
    wallTexture = createDefaultTexture(color(120, 120, 120));
    metalTexture = createDefaultTexture(color(180, 180, 180));
  } catch (e) {
    console.error('Failed to create default textures:', e);
  }
  
  // Load actual textures
  loadImage('./assets/textures/ground.jpg', 
    img => {
      groundTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
  
  loadImage('./assets/textures/wall.jpg',
    img => {
      wallTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
  
  loadImage('./assets/textures/metal.jpg',
    img => {
      metalTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );

  loadImage('./assets/textures/night.jpg',
    img => {
      nightTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
}

function checkTexturesLoaded() {
  textureLoadCount++;
  if (textureLoadCount >= 4) {
    texturesLoaded = true;
    console.log('All textures loaded or defaulted');
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setupTextures();
  noStroke();
  perspective(PI/3.0, width/height, 0.1, 10000); // Add proper perspective
  textureMode(NORMAL);
  textureWrap(REPEAT);

  // Set dark background color
  background(10, 10, 20); // Very dark blue for night sky
  
  // Add dim ambient light
  ambientLight(5/0); // Reduced ambient light for night effect
  
  // Add dim directional light (moonlight effect)
  directionalLight(200, 200, 255, 0, 1, -1);
  
  player.pos = createVector(0, 0, 0); // Adjust starting position
  player.vel = createVector(0, 0, 0);
  
  // Create rays with proper vector initialization

  // Uncomment for Ray Tracing
  // for (let a = 0; a < TWO_PI; a += PI/32) {
  //   let startPos = createVector(player.pos.x, player.pos.y - 50, player.pos.z);
  //   rays.push(new Ray(startPos, a));
  // }
  
  // Create some walls
  walls.push(new Boundary(-200, -200, 200, -200));
  walls.push(new Boundary(200, -200, 200, 200));
  walls.push(new Boundary(200, 200, -200, 200));
  walls.push(new Boundary(-200, 200, -200, -200));
  
  document.addEventListener('click', () => document.body.requestPointerLock());

  if(!texturesLoaded) {
    console.warn('Using fallback textures - please check assets folder exists');
  }
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
  if (!texturesLoaded) {
    background(0);
    return;
  }

  // background(135, 206, 235);  // Sky blue
  background(0)
  // directionalLight(200, 200, 255, 0, 1, -1);
  directionalLight(100, 100, 150, 0, 1, -1); // Dimmer light for night
  ambientLight(50)

  drawSkybox()
  
  handleMovement();
  handleMouseLook();
  
  // Camera setup with fixed orientation
  camera(
    player.pos.x, 
    player.pos.y - 100, // Eye height
    player.pos.z,
    player.pos.x + cos(player.rot) * cos(player.rotY),
    player.pos.y - 100 + sin(player.rotY), // Look at point adjusted for height
    player.pos.z + sin(player.rot) * cos(player.rotY),
    0, 1, 0  // Changed to positive up vector
  );
  
  if (groundTexture && wallTexture && metalTexture) {
    // Draw ground
    push();
    translate(0, 0, 0);
    rotateX(PI/2);
    texture(groundTexture);
    plane(10000, 10000);
    pop();
    
    push();
    translate(lightSource.pos.x, lightSource.pos.y, lightSource.pos.z);
    texture(metalTexture);
    pop();
  }
  
  if (gameState.isInHouse) {
    drawObjects();
  }
  
  handleLightMovement();
  updateRays();

  // Draw teleport zone if player isn't in house
  if (!gameState.isInHouse) {
    push();
    translate(teleportZone.x, -50, teleportZone.z);
    fill(0, 255, 255, 50);
    cylinder(teleportZone.radius, 100);
    pop();
  }

  checkTeleport();
  if (gameState.teleportCooldown > 0) {
    gameState.teleportCooldown--;
  }
  updateDoors();
  handleTeleportation()
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

const updateRays = () => {}

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

// Add to draw() function before handleTeleportation
function updateDoors() {
  doors.forEach(door => {
    if(door.rotation !== door.targetRot) {
      let diff = door.targetRot - door.rotation;
      door.rotation += Math.sign(diff) * gameState.doors.openSpeed;
    }
  });
  drawDoors();
}