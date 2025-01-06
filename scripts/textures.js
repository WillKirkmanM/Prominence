let bodyTexture, headTexture, armsTexture, greyTexture;
let groundTexture, wallTexture, metalTexture, nightTexture, woodTexture;
let texturesLoaded = false;
let textureLoadCount = 0;

let houseTexture;

function preloadTextures() {
  houseTexture = loadImage('/assets/models/manor/House_Diffuse_2K.png');

  bodyTexture = loadImage('/assets/models/oldman/alec_body_d.jpg');
  headTexture = loadImage('/assets/models/oldman/alec_head_d.jpg');
  armsTexture = loadImage('/assets/models/oldman/alec_arms_d.jpg');
  greyTexture = loadImage('/assets/models/oldman/default-grey.jpg');
}

function createDefaultTexture(color) {
  let tex = createGraphics(256, 256);
  tex.background(color);
  return tex;
}

function setupTextures() {
  // Default textures
  try {
    groundTexture = createDefaultTexture(color(100, 80, 60));
    wallTexture = createDefaultTexture(color(120, 120, 120));
    metalTexture = createDefaultTexture(color(180, 180, 180));
  } catch (e) {
    console.error('Failed to create default textures:', e);
  }
  
  // Load actual textures
  loadImage('./assets/textures/ground.jpg', 
    img => {
      groundTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );

  // Load actual textures
  loadImage('./assets/textures/wood.jpg', 
    img => {
      woodTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
  
  loadImage('./assets/textures/wall.jpg',
    img => {
      wallTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
  
  loadImage('./assets/textures/metal.jpg',
    img => {
      metalTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );

  loadImage('./assets/textures/night.jpg',
    img => {
      nightTexture = img;
      checkTexturesLoaded();
    },
    () => checkTexturesLoaded()
  );
}

function checkTexturesLoaded() {
  textureLoadCount++;
  if (textureLoadCount >= 5) {
    texturesLoaded = true;
    console.log('All textures loaded or defaulted');
  }
}