uniform float uTime;


void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    modelPosition.z += 25.0*cos(uTime*2.0);
    modelPosition.x += 10.0*sin(uTime*2.0);

    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}