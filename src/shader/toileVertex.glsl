uniform float uTime;
varying vec2 vUv;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;
    vUv = uv;

    gl_Position = projectedPosition;
}