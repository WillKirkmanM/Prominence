function handleMovement() {
  // Mouse look
  if (mouseX !== pmouseX && document.pointerLockElement) {
    player.rot += (mouseX - pmouseX) * 0.005;
  }
  
  // Sprint check
  if (keyIsDown(SHIFT)) {
    player.isSprinting = true;
    player.currentSpeed = lerp(player.currentSpeed, player.sprintSpeed, player.sprintAcceleration);
  } else {
    player.isSprinting = false;
    player.currentSpeed = lerp(player.currentSpeed, player.baseSpeed, player.sprintAcceleration);
  }

  let speed = player.currentSpeed;
  
  // WASD movement
  if (keyIsDown(87)) { // W
    player.pos.x += cos(player.rot) * speed;
    player.pos.z += sin(player.rot) * speed;
  }
  if (keyIsDown(83)) { // S
    player.pos.x -= cos(player.rot) * speed;
    player.pos.z -= sin(player.rot) * speed;
  }
  if (keyIsDown(65)) { // A
    player.pos.x += cos(player.rot - Math.PI/2) * speed; // Fixed Math.Math.PI to Math.PI
    player.pos.z += sin(player.rot - Math.PI/2) * speed;
  }
  if (keyIsDown(68)) { // D
    player.pos.x += cos(player.rot + Math.PI/2) * speed;
    player.pos.z += sin(player.rot + Math.PI/2) * speed;
  }
  
  handleJump();
  handleLightMovement();
}

function handleJump() {
  let now = millis();
  let canJump = now - player.lastGroundTime < player.coyoteTime;

  if (player.pos.y >= -50) { // On ground
    player.lastGroundTime = now;
  }

  if (keyIsDown(32)) { // Space
    if (!player.isJumping && canJump) {
      player.vel.y = player.maxJumpVel;
      player.isJumping = true;
    }
  } else if (player.vel.y < player.minJumpVel) {
    // Cut jump short if space released
    player.vel.y = player.minJumpVel;
  }
  
  // Apply gravity with terminal velocity
  player.vel.y = min(player.vel.y + player.gravity, 15);
  player.pos.y += player.vel.y;
  
  // Ground collision
  if (player.pos.y > -50) {
    player.pos.y = -50;
    player.vel.y = 0;
    player.isJumping = false;
  }
}