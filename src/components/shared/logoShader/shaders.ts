// =========================================
// shaders.ts (Part 1A)
// Shared Uniforms, Varyings & Noise Library
// =========================================

// ======================================================
// Vertex Shader (Part 1B)
// Replace the previous vertexShader string with this one.
// ======================================================

export const vertexShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDir;
varying float vDistortion;

// ----------------------------------------------------
// HASH
// ----------------------------------------------------

float hash11(float p){
    p = fract(p * 0.1031);
    p *= p + 33.33;
    p *= p + p;
    return fract(p);
}

float hash12(vec2 p){
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3,p3.yzx+33.33);
    return fract((p3.x+p3.y)*p3.z);
}

// ----------------------------------------------------
// VALUE NOISE
// ----------------------------------------------------

float noise(vec2 p){

    vec2 i = floor(p);
    vec2 f = fract(p);

    float a = hash12(i);
    float b = hash12(i+vec2(1.0,0.0));
    float c = hash12(i+vec2(0.0,1.0));
    float d = hash12(i+vec2(1.0,1.0));

    vec2 u = f*f*(3.0-2.0*f);

    return mix(
        mix(a,b,u.x),
        mix(c,d,u.x),
        u.y
    );
}

// ----------------------------------------------------
// FBM
// ----------------------------------------------------

float fbm(vec2 p){

    float v=0.0;
    float a=0.5;

    for(int i=0;i<6;i++){

        v+=a*noise(p);

        p*=2.02;

        a*=0.5;
    }

    return v;
}

// ----------------------------------------------------

vec2 domainWarp(vec2 p){

    float x=fbm(p+uTime*.08);

    float y=fbm(p+vec2(5.2,1.3)+uTime*.11);

    return p+vec2(x,y);
}

float distortionField(vec2 uv){

    vec2 q=domainWarp(uv*3.0);

    float n=fbm(q);

    n+=0.5*fbm(q*2.0);

    n+=0.25*fbm(q*4.0);

    return n;
}

// ----------------------------------------------------

void main(){

    vUv = uv;

    vec3 pos = position;

    float t = uTime;

    float n = distortionField(uv);

    // Floating
    pos.y += sin(t + position.x * 2.5) * 0.03;
    pos.y += cos(t * 0.7 + position.z * 2.0) * 0.02;

    // Idle breathing
    pos += normal * n * 0.015;

    // Hover distortion
    pos += normal * n * uHover * 0.05;

    // Mouse influence
    vec2 mouse = uMouse * 2.0 - 1.0;

    vec2 diff = uv - mouse;

    float radius = 0.45;

    float influence = smoothstep(
        radius,
        0.0,
        length(diff)
    );

    pos += normal * influence * 0.05;

    // Liquid ripple
    float ripple =
        sin(
            length(diff) * 22.0
            - t * 6.0
        );

    pos += normal
        * ripple
        * influence
        * 0.012;

    // Twisting
    float angle =
        n * 0.35
        + uHover * 0.2;

    mat2 rot = mat2(

        cos(angle),
        -sin(angle),

        sin(angle),
        cos(angle)

    );

    pos.xz = rot * pos.xz;

    // World Position
    vec4 worldPosition =
        modelMatrix
        * vec4(pos,1.0);

    vWorldPosition =
        worldPosition.xyz;

    // View Direction
    vViewDir =
        normalize(
            cameraPosition
            -
            worldPosition.xyz
        );

    // Correct Normal
    vNormal =
        normalize(
            normalMatrix
            *
            normal
        );

    vDistortion =
        n;

    gl_Position =
        projectionMatrix
        *
        viewMatrix
        *
        worldPosition;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uHover;
uniform vec2 uMouse;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDir;
varying float vDistortion;

// ===== Part 1B continues here =====
`;