uniform sampler2D backbuffer;
uniform float time;
varying vec2 vUv;

void main(){
  // vec3 c = texture2D(backbuffer, vUv).rgb;
	
  float offsetX = sin(length((vUv - 0.5) * 10.0) + time) * 0.1;
  float offsetY = cos(vUv.x * 20.0 + time) * 0.05;
  vec3 c = texture2D(backbuffer, vUv + vec2(offsetX, offsetY)).rgb;

  gl_FragColor = vec4(c, 1.0);
}