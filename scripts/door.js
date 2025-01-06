class Door {
  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.isOpen = false;
    this.rotation = 0;
    this.targetRot = 0;
    this.interactionRange = 500;
    this.dialog = "Press 'E' to open door";
    this.showDialog = true;
    this.locked = false;
    this.fadeStarted = false;
    this.fadeOpacity = 0;
  }

draw() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateY(radians(this.rotation));
    
    // Show interaction prompt
    if (this.showDialog && !this.isOpen) {
      push();
      translate(0, -150, 0);
      
      // Draw background
      fill(0, 0, 0, 200);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, 800, 90, 90);
      
      // Draw text
      textSize(30);
      textAlign(CENTER);
      fill(255);
      text(gameState.hasKey ? this.dialog : "No use, it appears to be locked, for quite some time...", 0, 0);
      pop();
    }
    
    // Draw fade overlay if active
    if (this.fadeStarted) {
      push();
      translate(0, -150, 0);
      rotateY(-player.rot);
      fill(0, 0, 0, this.fadeOpacity);
      noStroke();
      translate(0, 0, -1000); // Ensure overlay is in front
      plane(10000, 10000); // Large enough to cover screen
      pop();
    }
    pop();
  }

  checkInteraction(playerPos) {
    let d = dist(this.pos.x, this.pos.z, playerPos.x, playerPos.z);
    this.showDialog = d < this.interactionRange;
    
    console.log("Distance to door:", d);    
    if (d < this.interactionRange && keyIsDown(69) && gameState.hasKey && !this.isOpen) { // 69 is 'E' key
    console.log("Can go through the door")
    this.isOpen = true;
    this.targetRot = 90;
    this.fadeStarted = true;
    startEndScreen()
      return true;
    }
    return false;
  }

  update() {
    if (this.rotation !== this.targetRot) {
      let diff = this.targetRot - this.rotation;
      this.rotation += Math.sign(diff) * 2;
    }
    
    if (this.fadeStarted && this.fadeOpacity < 255) {
      this.fadeOpacity += 2;
    }
  }
}