uniform sampler2D uTexture;

varying vec2 vUv;
varying float vPos;

void main(){

    vec4 textureColor = texture2D(uTexture, vUv);
    vec4 colorF = vec4(textureColor.x+vPos,textureColor.y+vPos,textureColor.z+vPos,1.0);
    gl_FragColor = colorF;
}