uniform float uTime;
uniform float uVitesse;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.z += mod(35.0*uTime, 40.0) -20.0;
    modelPosition.y += sin(uVitesse*uTime/2.0)/2.0;

    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}