/**
 * Manages fog shader effects and parameters
 */
class FogManager {
  static get DEFAULT_FOG_PARAMS() {
    return {
      color: [0.65, 0.345, 0.75],
      near: 10.0,
      far: 10.0, 
      density: 0.5
    };
  }

  constructor() {
    this._shader = null;
    this._isActive = false;
    this._params = {...FogManager.DEFAULT_FOG_PARAMS};
  }

  // Getters and setters
  get isActive() { return this._isActive; }
  get shader() { return this._shader; }
  
  get params() { return this._params; }
  set params(value) {
    this._params = {
      ...FogManager.DEFAULT_FOG_PARAMS,
      ...value
    };
  }

  /**
   * Creates and initializes the fog shader
   * @returns {boolean} Whether initialization was successful
   */
  initialize() {
    if (this._shader) return true;

    try {
      this._shader = loadShader('scripts/fog.vert', 'scripts/fog.frag');
      this.params = FogManager.DEFAULT_FOG_PARAMS;
      return true;
    } catch (error) {
      console.error('Failed to create fog shader:', error);
      return false;
    }
  }

  /**
   * Updates shader uniforms and activates fog effect
   */
  update() {
    if (!this._shader) return;

    shader(this._shader);
    this._isActive = true;

    // Update all shader uniforms
    this._updateUniforms();
  }

  /**
   * Deactivates the fog effect
   */
  reset() {
    if (this._isActive) {
      this._isActive = false;
      resetShader();
    }
  }

  // Private helper methods
  _updateUniforms() {
    const {color, near, far, density} = this._params;
    
    this._shader.setUniform('fogColor', color);
    this._shader.setUniform('fogNear', near);
    this._shader.setUniform('fogFar', far); 
    this._shader.setUniform('fogDensity', density);
  }
}

function createFogShader() {
  return fogManager.initialize();
}

function updateFog() {
  fogManager.update();
}

function resetFogShader() {
  fogManager.reset();
}