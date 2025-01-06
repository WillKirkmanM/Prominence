class Key {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.rotation = 0;
    this.collected = false;
    this.interactionRange = 500;
    this.dialog = "Press 'E' to collect key";
    this.showDialog = true;
  }

  draw() {
    if (this.collected) return;
    
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateY(this.rotation);

    fill(255, 215, 0);
    box(20, 10, 10);
    translate(15, 0, 0);
    box(10, 10, 5);
    
    this.rotation += 0.02;
    pop();

    if (this.showDialog) {
      push();
      translate(this.pos.x, this.pos.y - 100, this.pos.z);
      
      textAlign(CENTER, CENTER);
      textSize(20);
      
      fill("white");
      noStroke();
      let padding = 20;
      let tw = textWidth(this.dialog);
      rect(-tw/2 - padding, -20, tw + padding*2, 40);
      
      text(this.dialog, 0, 0);
      pop();
    }
  }

  checkCollection(playerPos) {
    if (this.collected) return;
    
    let d = dist(this.pos.x, this.pos.z, playerPos.x, playerPos.z);
    this.showDialog = d < this.interactionRange;
    
    if (d < this.interactionRange && keyIsDown(69)) {
      this.collected = true;
      gameState.hasKey = true;
      console.log("You picked up the key!");
    }
  }
}