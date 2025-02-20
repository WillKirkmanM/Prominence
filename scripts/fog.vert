precision mediump float;

attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec2 vTexCoord;
varying float vFogDepth;

void main() {
  vec4 viewPosition = uModelViewMatrix * vec4(aPosition, 1.0);
  gl_Position = uProjectionMatrix * viewPosition;
  vTexCoord = aTexCoord;
  vFogDepth = -viewPosition.z;
}