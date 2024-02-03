varying float vPosition;
void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vPosition = abs(cos(modelPosition.x))
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}