let titleScreen = true;
let titleFont;

function preload() {
  // Load font before setup runs
  titleFont = loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf');
}

// function setup() {
  // Create canvas with window dimensions
  // createCanvas(windowWidth, windowHeight, WEBGL);
  // noStroke();
  // perspective(PI / 3.0, width / height, 0.1, 2000); // Add proper perspective
  
  // player.pos = createVector(0, 0, 0); // Adjust starting position
  // player.vel = createVector(0, 0, 0);
  
  // // Create rays with proper vector initialization
  // for (let a = 0; a < TWO_PI; a += PI / 32) {
  //   let startPos = createVector(player.pos.x, player.pos.y - 50, player.pos.z);
  //   rays.push(new Ray(startPos, a));
  // }
  
  // // Create some walls
  // walls.push(new Boundary(-200, -200, 200, -200));
  // walls.push(new Boundary(200, -200, 200, 200));
  // walls.push(new Boundary(200, 200, -200, 200));
// }

function drawTitleScreen() {
  createCanvas(windowWidth, windowHeight);
  // Draw background
  noStroke()
  background(0);

  titleScreen = false
  if (mouseIsPressed) {
    titleScreen = false;
  }
  
  // Calculate center positions
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;
  
  // Debugging: Print center positions
  console.log('Center X:', centerX, 'Center Y:', centerY);
  
  // Title text
  push();
  textFont(titleFont);
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);
  text('3D GAME', centerX, centerY - 100); // Move up from center
  
  // Start button
  let buttonWidth = 200;
  let buttonHeight = 60;
  let buttonX = centerX - buttonWidth / 2;
  let buttonY = centerY + 50; // Move down from center
  
  // Draw button
  fill(100);
  if (mouseX > buttonX && mouseX < buttonX + buttonWidth && 
      mouseY > buttonY && mouseY < buttonY + buttonHeight) {
    fill(150);
    if (mouseIsPressed) {
      titleScreen = false;
    }
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  
  // Button text
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('START', centerX, buttonY + buttonHeight / 2);
  pop();
}

function windowResized() {
  // Adjust canvas size when window is resized
  resizeCanvas(windowWidth, windowHeight);
}