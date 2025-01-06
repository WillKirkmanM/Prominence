let houseCollider = {
  x: -1000,
  y: -1550,
  z: -2000,
  width: 1000,  // Adjust based on house model size
  height: 1550, // Adjust based on house model size
  depth: 2000   // Adjust based on house model size
};

// const DISTANCE_THRESHOLD = 500;

function checkHouseCollision(playerPos) {}

// function checkHouseCollision(playerPos) {
//   let dx = Math.abs(playerPos.x - (houseCollider.x + houseCollider.width/2));
//   let dy = Math.abs(playerPos.y - (houseCollider.y + houseCollider.height/2));
//   let dz = Math.abs(playerPos.z - (houseCollider.z + houseCollider.depth/2));
  
//   let totalDistance = Math.sqrt(dx*dx + dy*dy + dz*dz);
  
//   console.log("Distance to House:", {
//     x: dx.toFixed(2),
//     y: dy.toFixed(2),
//     z: dz.toFixed(2),
//     total: totalDistance.toFixed(2)
//   });

//   // Return true if too close to house
//   if (totalDistance < DISTANCE_THRESHOLD) {
//     return false;
//   }

//   return (
//     playerPos.x >= houseCollider.x && 
//     playerPos.x <= houseCollider.x + houseCollider.width &&
//     playerPos.y >= houseCollider.y && 
//     playerPos.y <= houseCollider.y + houseCollider.height &&
//     playerPos.z >= houseCollider.z && 
//     playerPos.z <= houseCollider.z + houseCollider.depth
//   );
// }

function drawHouse() {
  push()
    // Base ambient light
    ambientLight(100);
    
    // Main directional light from above
    directionalLight(255, 255, 255, 0, -1, -0.5);
    
    // Accent point lights
    pointLight(200, 180, 160, 0, 0, 100);  
    pointLight(100, 120, 150, -100, 0, -100);
    
    translate(houseCollider.x, houseCollider.y, houseCollider.z);
    rotateX(PI)
    rotateY(PI)
    scale(20)
    texture(houseTexture)
    model(house)
    
  pop()
}


function updatePlayerPosition() {}
// Update player movement
// function updatePlayerPosition() {
//   // Try movement on each axis separately
//   let nextPosX = createVector(
//     player.pos.x + player.vel.x,
//     player.pos.y,
//     player.pos.z
//   );
  
//   let nextPosY = createVector(
//     player.pos.x,
//     player.pos.y + player.vel.y,
//     player.pos.z
//   );
  
//   let nextPosZ = createVector(
//     player.pos.x,
//     player.pos.y,
//     player.pos.z + player.vel.z
//   );
  
//   // Update only axes that don't collide
//   if (!checkHouseCollision(nextPosX)) {
//     player.pos.x += player.vel.x;
//   }
  
//   if (!checkHouseCollision(nextPosY)) {
//     player.pos.y += player.vel.y;
//   }
  
//   if (!checkHouseCollision(nextPosZ)) {
//     player.pos.z += player.vel.z;
//   }

//   // Add buffer to prevent clipping
//   const BUFFER = 50;
//   player.pos.x = constrain(
//     player.pos.x,
//     houseCollider.x - BUFFER,
//     houseCollider.x + houseCollider.width + BUFFER
//   );
  
//   player.pos.y = constrain(
//     player.pos.y,
//     houseCollider.y - BUFFER, 
//     houseCollider.y + houseCollider.height + BUFFER
//   );
  
//   player.pos.z = constrain(
//     player.pos.z,
//     houseCollider.z - BUFFER,
//     houseCollider.z + houseCollider.depth + BUFFER
//   );
// }