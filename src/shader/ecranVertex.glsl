varying float vPositionX;
varying float vPositionY;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    vPositionX = position.x;
    vPositionY = position.y;
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}