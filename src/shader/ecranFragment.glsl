varying float vPosition;
void main(){
    float color = vPosition;
    gl_FragColor = vec4(color,color,color,1.0);
}