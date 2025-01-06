let titleScreen = true;
let fontLoaded = false;
let introImage;
let introSound;
let introSoundPlaying = false;
let gameStarted = false;

function preloadTitleScreenAssets() {
  introImage = loadImage('./assets/images/intro.webp');
  introSound = loadSound('./assets/audio/mainmenu.mp3');
}

function drawTitleScreen() {
  createCanvas(windowWidth, windowHeight);
  
  // Only start playing if not already playing
  if (titleScreen && !introSoundPlaying) {
    introSound.play();
    introSoundPlaying = true;
  } else if (!titleScreen) {
    introSoundPlaying = false;
  }
  
  push();
  image(introImage, -1100, -1000, 2000, 2000);
  filter(BLUR, 8);
  pop();

  if (mouseIsPressed) {
    introSound.stop();
    introSoundPlaying = false;
    titleScreen = false;
    if (!titleScreen && !introSoundPlaying) {
      console.log("Playing background music because")
      console.log(titleScreen, introSoundPlaying)
      backgroundMusic.play();
      bellSound.play()
    }
  }
  
  let centerX = 0
  let centerY = 0
  
  push();
  if (fontLoaded) {
    textFont(titleFont);
  } else {
    textFont('Arial');
  }
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(255);
  text('Prominence, A Horror Film', centerX, centerY - 50);
  
  // Start button
  let buttonWidth = 200;
  let buttonHeight = 60;
  let buttonX = centerX - buttonWidth / 2;
  let buttonY = centerY + 50;
  
  let isOverButton = mouseX > buttonX && mouseX < buttonX + buttonWidth && 
                    mouseY > buttonY && mouseY < buttonY + buttonHeight;
                    
  if (mouseIsPressed && isOverButton) {
    titleScreen = false;
  }
  
  fill(100, 200);
  if (isOverButton) {
    fill(150, 200);
  }
  rect(buttonX, buttonY, buttonWidth, buttonHeight);
  
  // Button text
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text('Click to Play', centerX, centerY + 80);
  pop();
}