precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3  COLOR = vec3(0.1, 0.3, 1.0);
const int   COUNT = 10;
const float HEIGHT = 0.5;

void main(){
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // declaration and initialize a variable.
    vec3 neonColor = vec3(0.0);

    // additional calculate in the loop.
    for(int i = 0; i < COUNT; ++i){
        // convert from int to float.
        float convertCount = float(i + 1) * 0.5;
        // change the speed of time by counter.
        float offsetTime = time * convertCount;
        // calculate sine.
        float wave = sin(p.x + offsetTime) * HEIGHT;
        // calculate neon.
        float neon = 0.01 / abs(p.y + wave);
        // addition.
        neonColor += COLOR * neon;
    }

    gl_FragColor = vec4(neonColor, 1.0);
}
