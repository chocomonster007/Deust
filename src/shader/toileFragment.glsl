uniform sampler2D uTexture;
uniform sampler2D uPreviousTexture;
uniform float uTimeElapsed;
uniform float uTime;
varying vec2 vUv;
void main(){
    float faster = (uTime - uTimeElapsed)*2.5;
    vec4 previousTextureColor = texture2D(uPreviousTexture, vUv);
    vec4 textureColor = texture2D(uTexture, vUv);
    float interpolation = min(faster,1.0);
    vec4 mixColor = mix(previousTextureColor,textureColor, interpolation);
    gl_FragColor = mixColor;
}