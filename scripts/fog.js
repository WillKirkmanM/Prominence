let isShaderActive = false;
let fogShader = null;

function createFogShader() {
  if (fogShader !== null) return; // Prevent multiple initialization
  
  try {
    fogShader = loadShader('scripts/fog.vert', 'scripts/fog.frag');
    // Set default fog parameters
    fogParams = {
      color: [0.65, 0.345, 0.75],
      near: 10.0,
      far: 10.0,
      density: 0.5
    };
  } catch (e) {
    console.error('Failed to create fog shader:', e);
  }
}

function updateFog() {
  shader(fogShader);
  isShaderActive = true
  
  fogShader.setUniform('fogColor', fogParams.color);
  fogShader.setUniform('fogNear', fogParams.near);
  fogShader.setUniform('fogFar', fogParams.far);
  fogShader.setUniform('fogDensity', fogParams.density);
}

function resetFogShader() {
    if (isShaderActive) {
        isShaderActive = false;
    }
}