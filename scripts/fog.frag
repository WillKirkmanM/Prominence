precision mediump float;

uniform sampler2D uTexture;
uniform vec3 fogColor;
uniform float fogNear;
uniform float fogFar;
uniform float fogDensity;

varying vec2 vTexCoord;
varying float vFogDepth;

void main() {
  vec4 texColor = texture2D(uTexture, vTexCoord);
  float fogFactor = clamp((fogFar - vFogDepth)/(fogFar - fogNear), 0.0, 1.0);
  gl_FragColor = mix(vec4(fogColor, 1.0), texColor, fogFactor);
}