let isEndScreen = false;
let endScreenOpacity = 0;

function endScreen() {
  background(0);
  push();
  fill(0, 0, 0, endScreenOpacity);
  noStroke();
  rectMode(CENTER);  // Changed to CENTER for consistency
  rect(width/2, height/2, width, height);
  
  if (endScreenOpacity < 255) {
    endScreenOpacity += 2;
  }
  
  // Add centered ending text
  if (endScreenOpacity > 200) {
    textAlign(CENTER, CENTER);
    textSize(96);
    fill(255, min(endScreenOpacity - 200, 255));
    
    // Position text exactly in center
    text("Prominence", 0, 0);
    console.log("Drawing end text:")
  }
  pop();
}

function startEndScreen() {
  isEndScreen = true;
  endScreenOpacity = 0;
  console.log("EndScreen started");
}