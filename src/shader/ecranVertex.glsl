varying float vPosition;
uniform float uTime;
float ecranW = 0.28753089904785156;
float ecranH = 0.1490931510925293;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vPosition = position.x+ecranW;
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}