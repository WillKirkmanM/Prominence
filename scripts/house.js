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
