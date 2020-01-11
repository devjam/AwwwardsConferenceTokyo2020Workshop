precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(){
    vec2 fragmentPosition = gl_FragCoord.xy / resolution;
    vec2 p = fragmentPosition * 2.0 - 1.0;

    // animation by calculate `sin(time)`
    p.x += sin(time);

    gl_FragColor = vec4(p, 0.0, 1.0);

    // sine or cosine is the range of -1.0 ~ 1.0
}
