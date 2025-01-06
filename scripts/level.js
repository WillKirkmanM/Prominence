function keyPressed() {
  if (key === 'e' || key === 'E') {
    console.log("Checking Interaction")
    if (npc.checkInteraction(player.pos)) {
      npc.interact();
      return
    }

    // if (!gameState.isInHouse && !gameState.isFading) {
    //   startTeleportSequence();
    // } else {
    //   // Check for door interaction
    //   doors.forEach(door => {
    //     let d = dist(player.pos.x, player.pos.z, door.x, door.z);
    //     if (d < gameState.doors.interactDistance) {
    //       door.isOpen = !door.isOpen;
    //       door.targetRot = door.isOpen ? gameState.doors.maxOpen : 0;
    //     }
    //   });
    // }
  }
}

function startTeleportSequence() {
  gameState.isFading = true;
  gameState.fadeAlpha = 0;
}

function handleTeleportation() {
  if (gameState.isFading) {
    gameState.fadeAlpha += 10;
    
    // Fade to black
    push();
    translate(0, 0, -100);
    fill(0, 0, 0, gameState.fadeAlpha);
    rect(-width/2, -height/2, width, height);
    pop();
    
    // When fade complete, teleport
    if (gameState.fadeAlpha >= 255) {
      teleportToHouse();
      gameState.isFading = false;
      gameState.fadeAlpha = 0;
    }
  }
}

function setupLevel() {
  // Clear existing walls
  walls = [];
  
  // Start area platform
  walls.push(new Boundary(-100, -600, 100, -600)); 
  walls.push(new Boundary(100, -600, 100, -400));
  walls.push(new Boundary(-100, -600, -100, -400));
  
  // Reset player position
  player.pos = createVector(
    gameState.startPosition.x,
    gameState.startPosition.y, 
    gameState.startPosition.z
  );
}

function checkTeleport() {
  if (!gameState.isInHouse) {
    let d = dist(
      player.pos.x,
      player.pos.z,
      teleportZone.x,
      teleportZone.z
    );
    
    if (d < teleportZone.radius && !gameState.teleportCooldown) {
      teleportToHouse();
    }
  }
}

function teleportToHouse() {
  // Clear existing level
  walls = [];
  
  // Setup house walls
  
  // Update game state
  gameState.isInHouse = true;
  
  // Move player to house position
  player.pos = createVector(
    gameState.housePosition.x,
    gameState.housePosition.y,
    gameState.housePosition.z
  );
  
  // Add cooldown to prevent immediate teleport back
  gameState.teleportCooldown = 10;
}