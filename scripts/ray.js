class Ray {
  constructor(pos, angle) {
    this.pos = pos instanceof p5.Vector ? pos.copy() : createVector(pos.x, pos.y, pos.z);
    // Pre-calculate direction components
    this.dir = p5.Vector.fromAngle(angle);
    this.dirX = this.dir.x;
    this.dirY = this.dir.y;
    this.maxDistance = 1000;
    // Cache for repeated calculations
    this.endX = this.pos.x + this.dirX;
    this.endY = this.pos.y + this.dirY;
  }

  setPosition(pos) {
    if (pos) {
      if (pos instanceof p5.Vector) {
        this.pos.set(pos); // Using set instead of copy
      } else {
        this.pos.set(pos.x, pos.y, pos.z || 0);
      }
      // Update cached end position
      this.endX = this.pos.x + this.dirX;
      this.endY = this.pos.y + this.dirY;
    }
  }

  cast(wall) {
    // Destructure for faster access
    const { x: x1, y: y1 } = wall.a;
    const { x: x2, y: y2 } = wall.b;
    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.endX;
    const y4 = this.endY;

    // Pre-calculate common expressions
    const xDiff = x1 - x2;
    const yDiff = y3 - y4;
    const den = xDiff * yDiff - (y1 - y2) * (x3 - x4);

    if (den === 0) return null;

    const t = ((x1 - x3) * yDiff - (y1 - y3) * (x3 - x4)) / den;
    if (t <= 0 || t >= 1) return null;

    const u = -(xDiff * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;
    if (u <= 0) return null;

    // Reuse vector for intersection point
    const pt = createVector(
      x1 + t * (x2 - x1),
      y1 + t * (y2 - y1)
    );
    
    return {
      point: pt,
      distance: dist(this.pos.x, this.pos.y, pt.x, pt.y) // Using p5.js dist() is faster
    };
  }

  generate() {
    for (let a = 0; a < TWO_PI; a += PI/32) {
      let startPos = createVector(player.pos.x, player.pos.y - 50, player.pos.z);
      rays.push(new Ray(startPos, a));
    }
  }

  show(walls) {
    let closest = null;
    let record = this.maxDistance;

    // Using for loop instead of forEach
    for (let i = 0; i < walls.length; i++) {
      const intersection = this.cast(walls[i]);
      if (intersection && intersection.distance < record) {
        record = intersection.distance;
        closest = intersection.point;
      }
    }

    if (closest) {
      // Pre-calculate shadow intensity
      const shadowIntensity = (this.maxDistance - record) * 0.255; // Faster than map()
      // Set style once
      stroke(0, shadowIntensity);
      fill(0, shadowIntensity);
      
      // Single shape drawing
      triangle(
        this.pos.x, this.pos.y,
        closest.x, closest.y,
        closest.x + 5, closest.y + 5
      );
    }
  }
}