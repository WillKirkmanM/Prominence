/**
 * Handles collision detection and physics calculations for 3D movement 
 */
class MovementManager {
  static get MIN_JUMP_VEL() { return -6; }
  static get MAX_JUMP_VEL() { return -12; }
  static get GRAVITY() { return 0.6; }
  static get GROUND_Y() { return -50; }
  static get TERMINAL_VELOCITY() { return 15; }
  static get MOUSE_SENSITIVITY() { return 0.005; }

  /**
   * Calculates shortest distance between a point and triangle in 3D space
   */
  static pointToTriangle(point, v1, v2, v3) {
    // Calculate triangle edges and normal
    const edge1 = p5.Vector.sub(v2, v1);
    const edge2 = p5.Vector.sub(v3, v1);
    const normal = p5.Vector.cross(edge1, edge2).normalize();
    
    // Get plane distance
    const planeDistance = abs(p5.Vector.sub(point, v1).dot(normal));
    
    // Project point onto triangle plane
    const projected = p5.Vector.add(
      point,
      p5.Vector.mult(normal, -planeDistance)  
    );

    // Calculate areas to determine if point is inside triangle
    const triangleArea = p5.Vector.cross(edge1, edge2).mag() / 2;
    const area1 = this._getTriangleArea(projected, v1, v2);
    const area2 = this._getTriangleArea(projected, v2, v3); 
    const area3 = this._getTriangleArea(projected, v3, v1);

    // Check if point projects inside triangle
    if (abs(triangleArea - (area1 + area2 + area3)) < 0.01) {
      return planeDistance;
    }

    // Get minimum edge distance if outside
    return min(
      this.pointToLineSegment(point, v1, v2),
      this.pointToLineSegment(point, v2, v3),
      this.pointToLineSegment(point, v3, v1)
    );
  }

  /**
   * Calculates shortest distance between point and line segment
   */
  static pointToLineSegment(p, a, b) {
    const ab = p5.Vector.sub(b, a);
    const ap = p5.Vector.sub(p, a);
    const proj = constrain(ap.dot(ab) / ab.dot(ab), 0, 1);
    const closest = p5.Vector.add(a, p5.Vector.mult(ab, proj));
    return p5.Vector.dist(p, closest);
  }

  /**
   * Updates player movement based on input
   */
  static handleMovement() {
    this._handleMouseLook();
    this._handleSprint(); 
    this._handleDirectionalMovement();
    this._handleJump();
  }

  // Private helper methods
  static _getTriangleArea(p, v1, v2) {
    return p5.Vector.cross(
      p5.Vector.sub(p, v1),
      p5.Vector.sub(p, v2)
    ).mag() / 2;
  }

  static _handleMouseLook() {
    if (mouseX !== pmouseX && document.pointerLockElement) {
      player.rot += (mouseX - pmouseX) * this.MOUSE_SENSITIVITY;
    }
  }

  static _handleSprint() {
    if (keyIsDown(SHIFT)) {
      player.isSprinting = true;
      player.currentSpeed = lerp(
        player.currentSpeed, 
        player.sprintSpeed,
        player.sprintAcceleration
      );
    } else {
      player.isSprinting = false; 
      player.currentSpeed = lerp(
        player.currentSpeed,
        player.baseSpeed, 
        player.sprintAcceleration
      );
    }
  }

  static _handleDirectionalMovement() {
    const newPos = createVector(player.pos.x, player.pos.y, player.pos.z);
    const speed = player.currentSpeed;

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

    // Update position after collision check
    player.pos.x = newPos.x;
    player.pos.z = newPos.z;
  }

  static _handleJump() {
    const now = millis();
    const canJump = now - player.lastGroundTime < player.coyoteTime;

    // Ground check
    if (player.pos.y >= this.GROUND_Y) {
      player.lastGroundTime = now;
    }

    // Jump input
    if (keyIsDown(32) && !player.isJumping && canJump) {
      player.vel.y = this.MAX_JUMP_VEL;
      player.isJumping = true;
    } else if (player.vel.y < this.MIN_JUMP_VEL) {
      // Cut jump short if space released
      player.vel.y = this.MIN_JUMP_VEL; 
    }

    // Apply gravity
    player.vel.y = min(
      player.vel.y + this.GRAVITY, 
      this.TERMINAL_VELOCITY
    );
    player.pos.y += player.vel.y;

    // Ground collision
    if (player.pos.y > this.GROUND_Y) {
      player.pos.y = this.GROUND_Y;
      player.vel.y = 0;
      player.isJumping = false;
    }
  }
}

// For backwards compatibility
function handleMovement() {
  MovementManager.handleMovement();
}

function handleJump() {
  MovementManager._handleJump(); 
}