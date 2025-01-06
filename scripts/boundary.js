/**
 * Represents a boundary wall in 3D space
 * Creates a vertical rectangular surface between two points
 */
class Boundary {
  static WALL_HEIGHT = 100;

  /**
   * @param {number} x1 - Start point x coordinate
   * @param {number} y1 - Start point y coordinate
   * @param {number} x2 - End point x coordinate
   * @param {number} y2 - End point y coordinate
   */
  constructor(x1, y1, x2, y2) {
    // Validate inputs
    if (!this.#validateCoordinates(x1, y1, x2, y2)) {
      throw new Error("Invalid boundary coordinates");
    }

    // Create vectors for wall endpoints
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);

    // Set default wall properties
    this.height = Boundary.WALL_HEIGHT;
  }

  /**
   * Renders the boundary wall as a 3D rectangular surface
   * Uses vertex mapping for texture coordinates
   */
  show() {
    push();
    beginShape();

    // Create vertices in counter-clockwise order
    // Format: x, y, z, texU, texV

    // Bottom front
    vertex(this.a.x, this.a.y, this.a.z, 0, 0);
    // Bottom back
    vertex(this.b.x, this.b.y, this.b.z, 1, 0);
    // Top back
    vertex(this.b.x, this.b.y - this.height, this.b.z, 1, 1);
    // Top front
    vertex(this.a.x, this.a.y - this.height, this.a.z, 0, 1);

    endShape(CLOSE);
    pop();
  }

  /**
   * Validates input coordinates
   * @private
   */
  #validateCoordinates(x1, y1, x2, y2) {
    return ![x1, y1, x2, y2].some(
      (coord) => typeof coord !== "number" || Number.isNaN(coord)
    );
  }

  /**
   * Sets the wall height
   * @param {number} height - New wall height
   */
  setHeight(height) {
    if (typeof height === "number" && height > 0) {
      this.height = height;
    }
  }
}
