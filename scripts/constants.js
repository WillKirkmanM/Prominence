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
  sprintSpeed: 50,
  sprintAcceleration: 0.2,
  rotY: 0,  // vertical rotation (pitch)
  mouseSensitivity: 0.002,
  maxLookUp: Math.PI/2.5,
  maxLookDown: Math.PI/2.5,
  maxJumpVel: -12,   
  minJumpVel: -6,    
  gravity: 0.6,      
  coyoteTime: 100,   
  lastGroundTime: 0,  
  height: 5,
  heightSpeed: 0.1,
  minHeight: 0.5,
  maxHeight: 10,
};

let rays = [];
let walls = [];
let doors = [];

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
  startPosition: { x: -1180, y: -50, z: 3518 },
  housePosition: { x: 0, y: 0, z: 0 },
  hasKey: false,
  doors: {
    openSpeed: 2,
    maxOpen: 90, // degrees
    interactDistance: 50
  }
};

let teleportZone = {
  x: 0,
  z: -400,
  radius: 50
};

/**
 * Constants for dialog system configuration
 */
const DialogConfig = {
    ADVANCE_DELAY: 2000,
    SEGMENT_TRANSITION_DELAY: 1000,
    DEFAULT_RANGE: 1000,
    PROMPT_TEXT: "Press 'E' to interact"
  };
  
let houseCollider = {
  x: -1000,
  y: -1550,
  z: -2000,
  width: 1000,  // Adjust based on house model size
  height: 1550, // Adjust based on house model size
  depth: 2000   // Adjust based on house model size
};

