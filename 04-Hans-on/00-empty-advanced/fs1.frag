uniform sampler2D backbuffer;
varying vec2 vUv;

// uniform float time;

void main(){
  vec3 c = texture2D(backbuffer, vUv).rgb;
  gl_FragColor = vec4(c, 1.0);
}