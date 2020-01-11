precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    // the fragment shader is working on each pixel.
    // convert the fragment position, converted values are the range of 0.0 ~ 1.0
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;

    // convert the origin from left bottom to center.
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // output a fragment position as a color. (e.g. X -> R, Y -> G)
    gl_FragColor = vec4(p, 0.0, 1.0);

    // gl_FragColor is vec4, range is 0.0 ~ 1.0
}
