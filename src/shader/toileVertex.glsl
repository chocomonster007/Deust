varying float vPosition;
uniform float uTime;
float toileW = 1.6542716026306152;
float toileH = 0.8800675868988037;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vPosition = (position.x+0.5)*uTime;
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}