let dialogTimer = 0;
const DIALOG_DURATION = 2000;
let segment1, segment2, segment3, segment4;
let currentPlayingSegment = null;
let isAudioPlaying = false;

class NPC {
  static DIALOG_DURATION = 2000;
  static _showPrompt = false;
  static _showDialog = false;

  // Getter/setter for showPrompt
  static get showPrompt() {
    return NPC._showPrompt;
  }

  static set showPrompt(value) {
    NPC._showPrompt = value;
  }

  // Add getter/setter for showDialog
  static get showDialog() {
    return NPC._showDialog;
  }

  static set showDialog(value) {
    NPC._showDialog = value;
  }

  constructor(x, y, z) {
    this.pos = createVector(x, y, z);
    this.dialogSequence = [
      "I haven't seen you here around before...",
      "This is Prominence, a mansion owned once before...",
      "Don't bother opening the door it has not been open in quite some time",
      "If only there was a key somewhere around here...",
    ];
    this.currentDialogIndex = -1;
    this.dialog = this.dialogSequence[0];
    this.interactionRange = 1000;
    this.dialogTimer = 0;
    this.canAdvanceDialog = true;
    this.isPlaying = false;
    this.dialogComplete = false;
    this.interactPrompt = "Press 'E' to interact";
    this.isDialogSequenceActive = false; // Add this line
    this.dialogStartTime = 0;
    this.currentDialogDuration = 0;
  }

  advanceDialog() {
    if (!this.canAdvanceDialog) return;

    this.currentDialogIndex = (this.currentDialogIndex + 1) % this.dialogSequence.length;
    this.dialog = this.dialogSequence[this.currentDialogIndex];
    this.dialogTimer = millis();
    this.canAdvanceDialog = false;

    // Reset ability to advance after delay
    setTimeout(() => {
      this.canAdvanceDialog = true;
    }, 2000);
  }

  draw() {
    push();
    ambientLight(60);

    // Main directional light from front-top
    directionalLight(255, 255, 255, 0, -1, -1);

    // Additional point light for detail
    pointLight(200, 200, 200, 0, -50, 100);

    translate(-800, -100, 3000);
    // translate(-this.pos.x, -this.pos.y, this.pos.z);
    rotateY(2.2 * PI)
    rotateX(PI);
    texture(bodyTexture);
    model(oldMan)
    rotateX(-player.rotX)
    pop();

    // Draw interaction prompt
    if (NPC.showPrompt) {
          push();

          // Position at NPC location
          translate(-500, -150, 3000); 
      
          // Move up for dialog
          translate(-300, -100, 0);

          // Text settings
          textAlign(CENTER, CENTER);
          textSize(20);
          
          // Add red background
          fill("white"); // Red with transparency
          noStroke();
          let padding = 20;
          let tw = textWidth(this.dialog);
          rect(-tw/2 - padding, -20, tw + padding*2, 40);
          
          // Draw dialog text in bright red
          text(this.interactPrompt, 0, 0);
          
          pop();
    }

    // Update dialog rendering condition
    if (NPC.showDialog) {
          push();
          
          // Position at NPC location
          translate(-500, -100, 3000); 
      
          // Move up for dialog
          translate(-300, -150, -100); 
          
          // Text settings
          textAlign(CENTER, CENTER);
          textSize(20);
          
          // Add red background
          fill("white"); // Red with transparency
          noStroke();
          let padding = 20;
          let tw = textWidth(this.dialog);
          rect(-tw/2 - padding, -20, tw + padding*2, 40);
          
          // Draw dialog text in bright red
          text(this.dialog, 0, 0);
          
          pop();
        }
  }

  checkInteraction(playerPos) {
    let d = dist(this.pos.x, this.pos.z, playerPos.x, playerPos.z);
    let inRange = d < this.interactionRange;

    // Show prompt only when ready for new interaction
    NPC.showPrompt = inRange && !this.isPlaying && !this.isDialogSequenceActive && !this.dialogComplete;

    // Update to use static setter
    NPC.showDialog = inRange && this.isPlaying;

    return inRange;
  }

  interact() {
    // Only start the sequence if not already playing and not complete
    if (!isAudioPlaying && !this.dialogComplete && !this.isPlaying) {
      NPC.showDialog = true; // Update to use static
      this.isPlaying = true;
      this.isDialogSequenceActive = true; // Add this line
      this.dialogStartTime = millis();
      this.advanceDialog();
      playSegment(this.currentDialogIndex + 1);
    }
  }
}

function getPlayerScreenPosition() {
  // Convert player's 3D world position to screen coordinates
  let screenPos = createVector(player.pos.x, player.pos.y, player.pos.z);

  // Transform position based on current camera view
  screenPos.y += cos(player.rotY) * 50; // Offset up/down based on look angle

  return screenPos;
}

// Add audio control methods
function playSegment(number) {
  if (isAudioPlaying) return;

  let segment;
  switch (number) {
    case 1: segment = segment1; break;
    case 2: segment = segment2; break;
    case 3: segment = segment3; break;
    case 4: segment = segment4; break;
  }

  if (segment) {
    isAudioPlaying = true;
    npc.isPlaying = true;
    NPC.showDialog = true; // Update to use static
    segment.play();

    segment.onended(() => {
      isAudioPlaying = false;
      
      if (npc.currentDialogIndex < npc.dialogSequence.length - 1) {
        // Wait briefly then start next segment
        setTimeout(() => {
          npc.isPlaying = false;
          NPC.showDialog = false; // Update to use static
          npc.interact();
        }, 1000);
      } else {
        npc.isPlaying = false;
        NPC.showDialog = false; // Update to use static
        npc.dialogComplete = true;
        npc.isDialogSequenceActive = false;
      }
    });
  }
}
