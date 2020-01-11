precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // `step` is a builtin function of GLSL.
    // the first argument is the edge location.
    // the second argument is the value of comparing to the first argument.
    // this function return value is 0.0 or 1.0
    // examples:
    // step( 0.0, 1.0 ) == 1.0
    // step( 1.0, 1.0 ) == 0.0
    // step( 2.0, 1.0 ) == 0.0
    // step(-1.0, 0.0 ) == 1.0
    // step( 2.0, 3.0 ) == 1.0
    float horizon = step(p.y, 0.0);

    // float wave = step(p.y, sin(p.x + time));

    gl_FragColor = vec4(vec3(horizon), 1.0);
}
