function pointToTriangle(point, v1, v2, v3) {
  // Calculate triangle edges
  let edge1 = p5.Vector.sub(v2, v1);
  let edge2 = p5.Vector.sub(v3, v1);
  
  // Get triangle normal
  let normal = p5.Vector.cross(edge1, edge2).normalize();
  
  // Calculate distance from point to triangle plane
  let planeDistance = abs(p5.Vector.sub(point, v1).dot(normal));
  
  // Project point onto triangle plane
  let projected = p5.Vector.add(
    point, 
    p5.Vector.mult(normal, -planeDistance)
  );
  
  // Check if projected point is inside triangle
  let area = p5.Vector.cross(edge1, edge2).mag() / 2;
  let area1 = p5.Vector.cross(
    p5.Vector.sub(projected, v1),
    p5.Vector.sub(projected, v2)
  ).mag() / 2;
  let area2 = p5.Vector.cross(
    p5.Vector.sub(projected, v2),
    p5.Vector.sub(projected, v3)
  ).mag() / 2;
  let area3 = p5.Vector.cross(
    p5.Vector.sub(projected, v3),
    p5.Vector.sub(projected, v1)
  ).mag() / 2;
  
  // If point is inside triangle, return plane distance
  if (abs(area - (area1 + area2 + area3)) < 0.01) {
    return planeDistance;
  }
  
  // Otherwise return minimum distance to edges
  let edgeDist1 = pointToLineSegment(point, v1, v2);
  let edgeDist2 = pointToLineSegment(point, v2, v3);
  let edgeDist3 = pointToLineSegment(point, v3, v1);
  
  return min(edgeDist1, edgeDist2, edgeDist3);
}

function pointToLineSegment(p, a, b) {
  let ab = p5.Vector.sub(b, a);
  let ap = p5.Vector.sub(p, a);
  let proj = ap.dot(ab) / ab.dot(ab);
  proj = constrain(proj, 0, 1);
  let closest = p5.Vector.add(a, p5.Vector.mult(ab, proj));
  return p5.Vector.dist(p, closest);
}

function handleMovement() {
  // Mouse look remains the same
  if (mouseX !== pmouseX && document.pointerLockElement) {
    player.rot += (mouseX - pmouseX) * 0.005;
  }
  
  // Sprint handling remains the same
  if (keyIsDown(SHIFT)) {
    player.isSprinting = true;
    player.currentSpeed = lerp(player.currentSpeed, player.sprintSpeed, player.sprintAcceleration);
  } else {
    player.isSprinting = false;
    player.currentSpeed = lerp(player.currentSpeed, player.baseSpeed, player.sprintAcceleration);
  }

  let speed = player.currentSpeed;
  let newPos = createVector(player.pos.x, player.pos.y, player.pos.z);
  
  // Calculate attempted movement
  if (keyIsDown(87)) { // W
    newPos.x += cos(player.rot) * speed;
    newPos.z += sin(player.rot) * speed;
  }
  if (keyIsDown(83)) { // S
    newPos.x -= cos(player.rot) * speed;
    newPos.z -= sin(player.rot) * speed;
  }
  if (keyIsDown(65)) { // A
    newPos.x += cos(player.rot - PI/2) * speed;
    newPos.z += sin(player.rot - PI/2) * speed;
  }
  if (keyIsDown(68)) { // D
    newPos.x += cos(player.rot + PI/2) * speed;
    newPos.z += sin(player.rot + PI/2) * speed;
  }
  
  // Check collision before updating position
  player.pos.x = newPos.x;
  player.pos.z = newPos.z;
  
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