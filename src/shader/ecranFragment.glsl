varying float vPositionX;
varying float vPositionY;
uniform float uTime;
void main(){
    float timeTruc = 1.01-uTime/10.0;
    float color = step(timeTruc,1.0-abs(vPositionX*vPositionY));
    gl_FragColor = vec4(color,color,color,1.0);
}