uniform float uTime;

void main(){
    vec4 modelPosition = modelMatrix * vec4(position,1.0);
    if(modelPosition.z < 20.0){
        modelPosition.z += uTime*5.0;

    }else{
        modelPosition.z -= 40.0;
    }
    
    vec4 viewPositon = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPositon;

    gl_Position = projectedPosition;
}