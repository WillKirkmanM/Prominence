class Boundary {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

    show() {
      push();
      beginShape();
      vertex(this.a.x, this.a.y, this.a.z, 0, 0);
      vertex(this.b.x, this.b.y, this.b.z, 1, 0);
      vertex(this.b.x, this.b.y - 100, this.b.z, 1, 1);
      vertex(this.a.x, this.a.y - 100, this.a.z, 0, 1);
      endShape(CLOSE);
      pop();
  }
}