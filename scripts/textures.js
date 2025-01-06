class TextureManager {
  static TEXTURE_PATHS = {
    house: '/assets/models/manor/House_Diffuse_2K.png',
    body: '/assets/models/oldman/alec_body_d.jpg',
    head: '/assets/models/oldman/alec_head_d.jpg',
    arms: '/assets/models/oldman/alec_arms_d.jpg',
    grey: '/assets/models/oldman/default-grey.jpg',
    ground: './assets/textures/ground.jpg',
    wood: './assets/textures/wood.jpg',
    wall: './assets/textures/wall.jpg',
    metal: './assets/textures/metal.jpg',
    night: './assets/textures/night.jpg'
  };

  constructor() {
    this._textures = new Map();
    this._loadedCount = 0;
    this._totalCount = Object.keys(TextureManager.TEXTURE_PATHS).length;
  }

  get isLoaded() {
    return this._loadedCount === this._totalCount;
  }

  async preload() {
    // Load character textures first
    await Promise.all([
      this._loadTexture('house'),
      this._loadTexture('body'),
      this._loadTexture('head'),
      this._loadTexture('arms'),
      this._loadTexture('grey')
    ]);
  }

  async setup() {
    // Create default textures
    this._createDefaultTextures();

    // Load environment textures
    const loadPromises = [
      this._loadTexture('ground'),
      this._loadTexture('wood'),
      this._loadTexture('wall'),
      this._loadTexture('metal'),
      this._loadTexture('night')
    ];

    await Promise.allSettled(loadPromises);
    console.log('Texture loading complete');
  }

  getTexture(name) {
    return this._textures.get(name);
  }

  // Private methods
  _createDefaultTextures() {
    const defaults = {
      ground: color(100, 80, 60),
      wall: color(120, 120, 120),
      metal: color(180, 180, 180)
    };

    for (const [name, color] of Object.entries(defaults)) {
      if (!this._textures.has(name)) {
        const tex = createGraphics(256, 256);
        tex.background(color);
        this._textures.set(name, tex);
      }
    }
  }

  async _loadTexture(name) {
    try {
      const path = TextureManager.TEXTURE_PATHS[name];
      const texture = await this._loadImageAsync(path);
      this._textures.set(name, texture);
      this._loadedCount++;
    } catch (err) {
      console.error(`Failed to load texture ${name}:`, err);
    }
  }

  _loadImageAsync(path) {
    return new Promise((resolve, reject) => {
      loadImage(
        path,
        img => resolve(img),
        () => reject(new Error(`Failed to load: ${path}`))
      );
    });
  }
}

const textureManager = new TextureManager();

let bodyTexture, headTexture, armsTexture, greyTexture;
let groundTexture, wallTexture, metalTexture, nightTexture, woodTexture;
let houseTexture;
let texturesLoaded = false;

async function preloadTextures() {
  await textureManager.preload();
  
  bodyTexture = textureManager.getTexture('body');
  headTexture = textureManager.getTexture('head');
  armsTexture = textureManager.getTexture('arms');
  greyTexture = textureManager.getTexture('grey');
  houseTexture = textureManager.getTexture('house');
}

async function setupTextures() {
  await textureManager.setup();
  
  groundTexture = textureManager.getTexture('ground');
  wallTexture = textureManager.getTexture('wall');
  metalTexture = textureManager.getTexture('metal');
  nightTexture = textureManager.getTexture('night');
  woodTexture = textureManager.getTexture('wood');
  
  texturesLoaded = textureManager.isLoaded;
}