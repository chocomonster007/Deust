uniform float uTime;
uniform float uVitesse;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.z += 25.0*cos(uTime*2.0*uVitesse);
    modelPosition.x += 6.0*sin(uTime*2.0*uVitesse);

    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}