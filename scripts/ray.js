class Ray {
  constructor(pos, angle) {
    // Ensure pos is a p5.Vector
    this.pos = pos instanceof p5.Vector ? pos.copy() : createVector(pos.x, pos.y, pos.z);
    this.dir = p5.Vector.fromAngle(angle);
    this.maxDistance = 1000; // Maximum distance for shadow calculation
  }

  setPosition(pos) {
    if (pos && pos instanceof p5.Vector) {
      this.pos = pos.copy();
    } else if (pos && pos.x !== undefined) {
      this.pos = createVector(pos.x, pos.y, pos.z || 0);
    }
  }

  cast(wall) {
    // Line-line intersection algorithm (keeping existing code)
    const x1 = wall.a.x;
    const y1 = wall.a.y;
    const x2 = wall.b.x;
    const y2 = wall.b.y;

    const x3 = this.pos.x;
    const y3 = this.pos.y;
    const x4 = this.pos.x + this.dir.x;
    const y4 = this.pos.y + this.dir.y;

    const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (den === 0) return;

    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

    if (t > 0 && t < 1 && u > 0) {
      const pt = createVector(
        x1 + t * (x2 - x1),
        y1 + t * (y2 - y1),
        0
      );
      return {
        point: pt,
        distance: p5.Vector.dist(this.pos, pt)
      };
    }
    return null;
  }

  show(walls) {
    let closest = null;
    let record = this.maxDistance;

    walls.forEach(wall => {
      const intersection = this.cast(wall);
      if (intersection) {
        if (intersection.distance < record) {
          record = intersection.distance;
          closest = intersection.point;
        }
      }
    });

    if (closest) {
      // Calculate shadow intensity based on distance
      const shadowIntensity = map(record, 0, this.maxDistance, 255, 0);
      stroke(0, shadowIntensity); // Black shadow with varying opacity
      fill(0, shadowIntensity);
      
      // Draw shadow
      beginShape();
      vertex(this.pos.x, this.pos.y);
      vertex(closest.x, closest.y);
      vertex(closest.x + 5, closest.y + 5); // Add width to shadow
      endShape(CLOSE);
    }
  }
}