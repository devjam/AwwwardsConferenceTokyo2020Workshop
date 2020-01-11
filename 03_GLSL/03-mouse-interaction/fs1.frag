precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // mouse position add to fragment position.
    gl_FragColor = vec4(p + mouse, 0.0, 1.0);
}
