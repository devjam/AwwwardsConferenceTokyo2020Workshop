precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// constant value
const vec3 COLOR = vec3(0.1, 0.3, 1.0);

void main(){
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // `abs` is a builtin function of GLSL.
    // this function is return absolute.
    // examples
    // abs( 2.0 ) == 2.0
    // abs(-2.0 ) == 2.0
    float neon = 0.01 / abs(p.y);

    // neon = 0.01 / abs(p.y + sin(p.x + time));

    gl_FragColor = vec4(COLOR * neon, 1.0);
}
