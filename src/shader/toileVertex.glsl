uniform float uTime;
varying vec2 vUv;
varying float vPos;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vPos = (2.0+modelPosition.x)*uTime*2.0;
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;
    vUv = uv;

    gl_Position = projectedPosition;
}