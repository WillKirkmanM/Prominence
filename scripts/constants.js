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
let doors = [];

// Add at top of sketch.js
let lightSource = {
  angle: 0,
  radius: 200,
  rotationSpeed: 0.05,
  pos: createVector(0, -50, 0)
};

let gameState = {
  isInHouse: false,
  canTeleport: false,
  currentScreen: "intro",
  fadeAlpha: 0,
  isFading: false,
  teleportCooldown: 0,
  startPosition: { x: 0, y: 0, z: -500 },
  housePosition: { x: 0, y: 0, z: 0 },
  doors: {
    openSpeed: 2,
    maxOpen: 90, // degrees
    interactDistance: 50
  }
};

// Add this at the top with other game variables
let teleportZone = {
  x: 0,
  z: -400, // Position it ahead of start position
  radius: 50
};