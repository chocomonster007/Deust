varying float vOpacity;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vOpacity = abs(modelPosition.y-1)*2;
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}