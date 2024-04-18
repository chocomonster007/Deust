import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import vertexRetro from './shader/retroVertex.glsl';
import fragmentRetro from './shader/retroFragment.glsl';
import { gsap } from 'gsap'


const infosT = document.querySelector('#infosT')
const programmeT = document.querySelector('#programmeT')
const interviewT = document.querySelector('#interviewT')
const header = document.querySelector('header')
const close = document.querySelector('.close-menu')
const menu = document.querySelector('.menu')
const supps = document.querySelectorAll('.select')
const accueil = document.querySelector('#accueil')

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let intersects

const loadingBarElement = document.querySelector('.loading-bar')

const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 1, value: 0, delay: 0.5 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
            gsap.to(header,{ duration: 1, opacity: 1, delay: 0.5 })
            gsap.to(".menu-div",{ duration: 1, opacity: 1, delay: 0.5 })

        }, 500)


        setTimeout(()=>{
            const obj = scene.getObjectByName('overlay')
            scene.remove(obj)
        },2000)

    },

    // Progress
    (itemUrl, itemsLoaded, itemsTotal) =>
    {
        // Calculate the progress and update the loadingBarElement
        const progressRatio = itemsLoaded / itemsTotal
        loadingBarElement.style.transform = `scaleX(${progressRatio})`
    }
)

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader(loadingManager)

// Draco loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader(loadingManager)
// gltfLoader.setDRACOLoader(dracoLoader)


function createCylindre(zPosition,vitesse,yPosition, rotVitesse, signeRot, rotDelai){
    const signe = signeRot < 0.5 ? 1.0 : -1.0
    const cylinderGeometry = new THREE.CylinderGeometry( 0.02, 0.02, 1.3,2); 
    const cylinderMaterial = new THREE.ShaderMaterial(
        {uniforms: {
            uTime:{value:0},
            uVitesse:{value:vitesse},
            uRot:{value: rotVitesse},
            zPos:{value:zPosition},
            uSigne:{value:signe},
            uDelai:{value:rotDelai}
        },
        vertexShader : `uniform float uTime;
        uniform float uVitesse;
        uniform float uRot;
        uniform float zPos;
        uniform float uSigne;
        uniform float uDelai;
        
        void main(){
            vec4 modelPosition = modelMatrix * vec4(position,1.0);
            modelPosition.z += mod(uVitesse*14.0*uTime+zPos, 30.0) ;
            modelPosition.y += uSigne * (sin(uDelai+(uTime/uRot))/2.0);
        
            vec4 viewPositon = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPositon;
        
            gl_Position = projectedPosition;
        }`,
        fragmentShader : `
        void main()
        {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `
    } );

    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial)
    cylinder.position.set(-5,yPosition,-15)
    cylinder.rotation.x = Math.PI/2

    return cylinder

}


const miniature = textureLoader.load('miniature.jpg')
miniature.flipY = false
const miniatureDavid = textureLoader.load('david.jpg')
miniatureDavid.flipY = false
const miniatureByl = textureLoader.load('miniatureByl.jpg')
miniatureByl.flipY=false
const miniatureAdamou = textureLoader.load('Adamou.jpg')
miniatureAdamou.flipY = false


const miniatures = [miniature, miniatureDavid, miniatureByl, miniatureAdamou]

const cylinder = []

for(let i =0;i<20;i++){
    cylinder.push(createCylindre((Math.random()-0.5)*30,1.0+Math.random(), 0.6+Math.random()*2.5, 1.0+Math.random()*3.0, Math.random(), Math.random()))
    scene.add(cylinder[i])
}

const overlayGeometry = new THREE.PlaneGeometry(4, 4, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms:
    {
        uAlpha: { value: 1 }
    },
    vertexShader: `
        void main()
        {
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uAlpha;

        void main()
        {
            gl_FragColor = vec4(0.0, 0.0, 0.0, uAlpha);
        }
    `
})
const overlay = new THREE.Mesh(overlayGeometry, overlayMaterial)
overlay.name = "overlay"
scene.add(overlay)

const prograImg = textureLoader.load('prograBis.jpg')
prograImg.flipY = false

const infosImg = textureLoader.load('infosBis.jpg')
infosImg.flipY = false

const retroImg = textureLoader.load('huge.jpg')
retroImg.colorSpace = THREE.SRGBColorSpace

const pancarteBaked = textureLoader.load('PANCARTE.jpg')
pancarteBaked.flipY =false
pancarteBaked.colorSpace = THREE.SRGBColorSpace

const solBakedTexture = textureLoader.load('solEnd2.jpg')
solBakedTexture.flipY = false
solBakedTexture.colorSpace = THREE.SRGBColorSpace

const plafondBakedTexture = textureLoader.load('plafond.jpg')
plafondBakedTexture.flipY = false
plafondBakedTexture.colorSpace = THREE.SRGBColorSpace

const allBakedTexture = textureLoader.load('murF.jpg')
allBakedTexture.flipY = false
allBakedTexture.colorSpace = THREE.SRGBColorSpace

const pacarteMurBaked = textureLoader.load('MURPANCARTE.JPG')
pacarteMurBaked.flipY = false
pacarteMurBaked.colorSpace = THREE.SRGBColorSpace

const mobilierBakedTexture = textureLoader.load('ordis.jpg')
mobilierBakedTexture.flipY = false
mobilierBakedTexture.colorSpace = THREE.SRGBColorSpace

const solBakedMaterial = new THREE.MeshBasicMaterial({
    map:solBakedTexture
})

const plafondBakedMaterial = new THREE.MeshBasicMaterial({
    map:plafondBakedTexture
})

const allBakedMaterial = new THREE.MeshBasicMaterial({
    map:allBakedTexture
})

const mobilierBakedMaterial = new THREE.MeshBasicMaterial({
    map:mobilierBakedTexture
})

const pancarteMurMAt = new THREE.MeshBasicMaterial({
    map:pacarteMurBaked
})

const vitre = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent:true,
    opacity:0.1
})


const coneGeometry = new THREE.ConeGeometry(0.4,1)
const coneMaterial = new THREE.ShaderMaterial({
    vertexShader : vertexRetro,
    fragmentShader : fragmentRetro,
    transparent:true,
})
const cone = new THREE.Mesh(coneGeometry, coneMaterial); 
cone.position.set(0.05,2.5,-1.88)
cone.rotation.x=Math.PI/2.5
cone.geometry.computeBoundingBox()

function createEcranMat(id,timeX, length, bgColor){
    return new THREE.ShaderMaterial({
        uniforms:{
            uTime:{
                value:0
            },
            uTimeBis:{
                value:0
            },
            uTexture:{
                value:0
            },
            uDecalage: {value:id},
            uTimeX: {value:timeX},
            uLength:{value:length},
            uBgColor:{value:bgColor}
        },
        vertexShader:`
        varying vec2 vUv;

        void main(){
            vec4 modelPosition = modelMatrix * vec4(position,1.0);
            vec4 viewPositon = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPositon;

            gl_Position = projectedPosition;
            vUv=uv;
        }`,
        fragmentShader:`       
        uniform float uTime;
        uniform float uTimeBis;
        uniform float uDecalage;
        uniform float uTimeX;
        uniform float uLength;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform vec3 uBgColor;

        void main(){
            vec2 duplicateUv = vUv;
            float timeExec = (trunc(mod(uTime/uTimeX,uLength))+1.0)/(uDecalage+1.0);
            float timeSpend = (mod(uTime,uTimeX)/uTimeX)*3.14;
            float timeA = step(1.01,timeExec);
            float timeB = step(1.0,timeExec);
            float timeF = (timeB-timeA);
            float timeTruc = min((sin(timeF*timeSpend)*uTimeX),1.01);
            float click = 1.01-uTimeBis;

            float color = step(timeTruc,abs(duplicateUv.x-0.5)*abs(duplicateUv.y-0.5));
            float colorBis = step(click,1.0-abs(duplicateUv.x-0.5)*abs(duplicateUv.y-0.5));
            vec4 textureColor = texture2D(uTexture, vUv);

            vec4 finalTexture = mix(textureColor, vec4(0.0,0.0,0.0,1.0),color);
            finalTexture = mix(finalTexture, vec4(uBgColor,1.0), colorBis);
            

            gl_FragColor = finalTexture;
        }`
    })
}

function createEcranMatInt(decalage,timeX,length){
    return new THREE.ShaderMaterial({
        uniforms:{
            uTime:{
                value:0
            },
            uTimeBis:{
                value:0
            },
            uTexture:{
                value:0
            },
            uDecalage: {value:decalage},
            uTimeX: {value:timeX},
            uTimeElapsed:{value:0},
            uPreviousTexture: {value:new THREE.Vector4(1.0,1.0,1,1)},
            uLength:{value:length}
        },
        vertexShader:`
        varying vec2 vUv;

        void main(){
            vec4 modelPosition = modelMatrix * vec4(position,1.0);
            vec4 viewPositon = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPositon;

            gl_Position = projectedPosition;
            vUv=uv;
        }`,
        fragmentShader:`       
        uniform float uTime;
        uniform float uTimeBis;
        uniform float uTimeElapsed;
        uniform float uDecalage;
        uniform float uTimeX;
        uniform float uLength;
        varying vec2 vUv;
        uniform sampler2D uTexture;
        uniform sampler2D uPreviousTexture;


        void main(){
            float faster = (uTime - uTimeElapsed)*2.5;

            vec2 duplicateUv = vUv;
            float timeExec = (trunc(mod(uTime/uTimeX,uLength))+1.0)/(uDecalage+1.0);
            float timeSpend = (mod(uTime,uTimeX)/uTimeX)*3.14;
            float timeA = step(1.01,timeExec);
            float timeB = step(1.0,timeExec);
            float timeF = (timeB-timeA);
            float timeTruc = min((sin(timeF*timeSpend)*uTimeX),1.01);
            float click = 1.01-uTimeBis;

            float color = step(timeTruc,abs(duplicateUv.x-0.5)*abs(duplicateUv.y-0.5));
            float colorBis = step(click,1.0-abs(duplicateUv.x-0.5)*abs(duplicateUv.y-0.5));
            vec4 textureColor = texture2D(uTexture, vUv);
            vec4 previousTextureColor = texture2D(uPreviousTexture,vUv);

            float interpolation = min(faster,1.0);
            vec4 mixColor = mix(previousTextureColor,textureColor, interpolation);
            vec4 finalTexture = mix(mixColor, vec4(0.0,0.0,0.0,1.0),color);
            finalTexture = mix(finalTexture, vec4(1.0,1.0,1.0,1.0), colorBis);

            gl_FragColor = finalTexture;
        }`
    })
}

const retroMaterial = new THREE.MeshBasicMaterial({
    map:retroImg
})


const plastiqueNoir = new THREE.MeshBasicMaterial({
    color:0x161616
})

const plastiqueNoirClair = new THREE.MeshBasicMaterial({
    color:0x222222
})


const pancarteMat = new THREE.MeshBasicMaterial({
    map: pancarteBaked
})

const vitreNoir = new THREE.MeshBasicMaterial({
    color:0x111111,
    transparent:true,
    opacity:0.9
})

const vitreGrise = new THREE.MeshBasicMaterial({
    color:0x333333,
    transparent:true,
    opacity:0.3
})

const metalGris = new THREE.MeshBasicMaterial({
    color:0x959692
})
const textMat = new THREE.MeshBasicMaterial({
    color:0xffffff
})

const planeGeo = new THREE.PlaneGeometry(3.3,1.86,8,8)

const planeM = new THREE.Mesh(planeGeo, retroMaterial)
planeM.position.set(-0.03,1.55,-5.8)
planeM.name="toileRetro"

scene.add(planeM)

scene.add( cone );
const allScreen = []
const interwiewScreen = []
const ecransInfos = []
const ecransProgra = []

gltfLoader.load('deustSalle.glb',gltf=>{
    scene.add(gltf.scene)
    const sol = gltf.scene.children.find(child=>child.name === 'sol')
    const plafond = gltf.scene.children.find(child =>child.name === 'plafond')
    const all = gltf.scene.children.filter(child=>['hautRetro','hautTable', 'tableBord','tableProf', 'controleRetro','murFenetre', 'murFond', 'murPorte','murVideo', 'radiateur', 'piedOrdi'].includes(child.name))
    const mobilier = gltf.scene.children.filter(child=>['chaises','enceintes', 'myScreen','porteManteau','pancarteDeust','rétro','rétroprojecteur'].includes(child.name))
    const pancarte = gltf.scene.children.find(child=>child.name=="liègePancarte")
    const pancarteMur = gltf.scene.children.find(child=>child.name=='liègeMur')
    const ordis = gltf.scene.children.filter(child=>["claviers","souris","ordis"].includes(child.name))
    const touches = gltf.scene.children.find(child=>child.name=='touches')
    const vitre1 = gltf.scene.children.find(child=>child.name=="vitre1")
    const fenetre = gltf.scene.children.find(child=>child.name=="fenetres")
    const vitreRetro = gltf.scene.children.find(child=>child.name=="vitreRétro")
    const myecran = gltf.scene.children.find(child=>child.name=="écran")
    const objetMetal = gltf.scene.children.find(child=>child.name=="loquetPorte")
    const texte = gltf.scene.children.find(child=>child.name=="Texte")
    ecransInfos.push(...gltf.scene.children.filter(ecran=>["écrans13","écrans12","écrans20","écrans23","écrans31","écrans40","écrans34"].includes(ecran.name)))
    ecransProgra.push(...gltf.scene.children.filter(ecran=>["écrans14","écrans10","écrans21","écrans24","écrans41","écrans43","écrans33"].includes(ecran.name)))
    interwiewScreen.push(...gltf.scene.children.filter(ecran=>["écrans11","écrans22","écrans30","écrans32","écrans42","écrans44"].includes(ecran.name)))

    const timeXInfos = 6+Math.random()*5
    const timeXProgra = 6+Math.random()*5
    const timeXinterview = 5+Math.random()*5

    const color = new THREE.Color(0xe3d4ff).convertLinearToSRGB()
    console.log(color);

    ecransInfos.forEach((ecran,i)=>{
        ecran.material = createEcranMat(i,timeXInfos,ecransInfos.length,new THREE.Color('white'))
        ecran.material.uniforms.uTexture.value = infosImg
        allScreen.push(ecran)})

    ecransProgra.forEach((ecran,i)=>{
        ecran.material = createEcranMat(i,timeXProgra,ecransProgra.length,color)
        ecran.material.uniforms.uTexture.value = prograImg
        allScreen.push(ecran)
    })

    interwiewScreen.forEach((ecran,i)=>{
        ecran.material = createEcranMatInt(i,timeXinterview,interwiewScreen.length)
            const id = i%4
            ecran.material.uniforms.uTexture.value = miniatures[id]
            ecran.previousImg = id
            ecran.material.uniforms.uPreviousTexture.value = 0
            allScreen.push(ecran)
    })

    texte.material = textMat


    objetMetal.material = metalGris

    fenetre.material = vitre
    vitre1.material = vitreNoir
    myecran.material = vitreNoir

    vitreRetro.material = vitreGrise

    ordis.forEach(ordi=>ordi.material = plastiqueNoir)
    touches.material = plastiqueNoirClair
    pancarte.material = pancarteMat
    pancarteMur.material = pancarteMurMAt
    sol.material = solBakedMaterial
    plafond.material = plafondBakedMaterial
    all.forEach(child=>{
        child.material = allBakedMaterial
    })
    mobilier.forEach(child=>child.material = mobilierBakedMaterial)

})

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Camera

const cameraOrigin = {
    position:{
        x: -2.18,
        y: 2,
        z:5
    },
    rotation:{
        x : -0.22071956777155788,
        y : -0.25277438140050495,
        z:-0.05605543549766235
    }
}

const interview = {
    position:{
        x:-1.3653256789781398,
        y:0.8755300279492055,
        z:-2.028611122128162

    }
}

const infos = {
    position : {
        x:-0.3777675625226148,
        y:0.8755178386639545,
        z:1.5883722214812155
    }
}
const programme = {
    position:{
        x:-2.427559258685168,
        y:0.8755216379390405,
        z:-0.21129048165213207

    }
}

const contact = {
    position:{
        x:2.9654136657714844,
        y:1.4804919958114624,
        z:-5.4577956199646
    }
}


const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height,0.1,40)

const controls = new OrbitControls(camera, canvas)
controls.enabled = false

camera.position.set(cameraOrigin.position.x,cameraOrigin.position.y,cameraOrigin.position.z)
camera.rotation.set(cameraOrigin.rotation.x,cameraOrigin.rotation.y,cameraOrigin.rotation.z)

scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function displayTemplate(){
    console.log(camera.position);
    t.classList.add('on')
    accueil.addEventListener('click',goToAcc)
    t.addEventListener('click',e=>e.stopPropagation())

}

function suppTemplate(){
    if(document.querySelector('.on')){
        if(document.querySelector('#interviewT').classList.contains('on') || (infosT.classList.contains('on') && camera.position.z<-4)){
            document.querySelector('.on').animate([
                {transform:"translateX(0px)"},
                {transform:"translateX(100%)"},
            ],{
                duration: 300
            })
            setTimeout(()=>{
                document.querySelector('.on').classList.remove('on')
            },300)
        }else{
            document.querySelector('.on').classList.remove('on')

        }
    }

}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro') document.body.style.cursor ='pointer' // || intersects[0]?.object.name =='liègeMur'
    else document.body.style.cursor ='default'

}

window.addEventListener( 'pointermove', onPointerMove );

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    if(sizes.width > 850){
        header.style.display = "block"
        document.querySelector('nav').style.width='auto'
        document.querySelector('nav').style.height='auto'

    }else if(header.dataset.open == "true"){
        header.style.display = "flex"

    }else{
        header.style.display = "none"
    }
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()
const objPos = new THREE.Vector3()
const rotation = new THREE.Euler(0,0,0)
let t
let interObj


document.addEventListener('click',letsGo)
function letsGo(event){
    accueil.removeEventListener('click',goToAcc)
    window.removeEventListener('pointermove',onPointerMove)
    document.body.style.cursor = "default"
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects( scene.children );

    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro') // || intersects[0]?.object.name =='liègeMur' 
    {   
        rotation.y = 0
        interObj = intersects[0].object
        rotation.x=0
        rotation.y=0
        rotation.z=0
        objPos.x = interObj.position.x
        objPos.y = interObj.position.y
        objPos.z = interObj.position.z
       
        if(/écrans[0-9]{2}/.test(interObj.name)){
            objPos.z += 0.25
            anim="ecran"
            if(["écrans13","écrans12","écrans20","écrans23","écrans31","écrans40","écrans34"].includes(interObj.name)){
                t = infosT
                activeMenu('#infos')
            }else if(["écrans14","écrans10","écrans21","écrans24","écrans41","écrans43","écrans33"].includes(interObj.name)){
                activeMenu('#programme')
                t= programmeT
            }else{
            document.querySelector('#interviewT').classList.remove('animEntrance')

                console.log(interObj.position);
                activeMenu('#interviews')
                t = interviewT
            }
        }
        else if(interObj.name === "toileRetro"){
            objPos.z += 1.5
            activeMenu('#infos')
            infosT.classList.add('animEntrance')
            t = infosT
            anim="toile"
        }
               
        time=undefined
        arriveEcran()
    }

}

function activeMenu(element){
    document.querySelectorAll('button').forEach(button=>{
        button.classList.remove('active')
        document.querySelector(element).classList.add('active')

        })
}

let time = undefined
let timeAnim = 0
let anim = false

function arriveEcran(e){
    let timeSpend
    if(e !=undefined && time !=undefined){
        timeSpend = e-time
    }else{
        timeSpend = 0
    }
        const vectRotNorm = new THREE.Vector3((rotation.x-camera.rotation.x),
        (rotation.y -camera.rotation.y),
        (rotation.z - camera.rotation.z))
        const normalizeBis = vectRotNorm.clone().normalize()  
        const translationBis = Math.abs(vectRotNorm.x) < Math.abs(normalizeBis.x) ? vectRotNorm : normalizeBis;
        camera.rotateX(translationBis.x*timeSpend/200)
        camera.rotateY(translationBis.y*timeSpend/200)
        camera.rotateZ(translationBis.z*timeSpend/200)


    const quaternion = new THREE.Quaternion()
    quaternion.setFromEuler(new THREE.Euler(-camera.rotation.x,-camera.rotation.y,-camera.rotation.z))

    const vectPosNorm = new THREE.Vector3(objPos.x-camera.position.x,
    objPos.y -camera.position.y,
    objPos.z - camera.position.z)
    const vectPos = vectPosNorm.applyQuaternion(quaternion)
    const vitesse = Math.max((Math.abs(vectPos.x)+Math.abs(vectPos.y)+Math.abs(vectPos.z))/2.5,1)
    
    const normalize = vectPos.clone().normalize()
    const translation = Math.abs(vectPos.x) < Math.abs(normalize.x) ? vectPos : normalize;
    camera.translateOnAxis(translation,timeSpend/130*vitesse)
    time = e
    if(Math.abs(camera.position.x-objPos.x)>0.0005 || Math.abs(camera.rotation.x-rotation.x)>0.00005) 
    {requestAnimationFrame(arriveEcran)
    }else{
        cancelAnimationFrame(arriveEcran)
        if(document.querySelector('#balade').dataset.lock=="false"){
            const vecCam = new THREE.Vector3()
            const vecC = new THREE.Vector3()
            camera.getWorldDirection(vecCam)
            camera.getWorldPosition(vecC)
            
            const result = new THREE.Vector3(
                vecC.x+vecCam.x*8,vecC.y+vecCam.y*8,vecC.z+vecCam.z*8
            )
            controls.enabled = true
            controls.target = result
            controls.update()


            document.querySelector('#balade').innerText = "Arrêter la balade"
        }
        document.querySelector('#balade').addEventListener('click',baladeOn)

    }
    
    if(anim && Math.abs(camera.position.z-objPos.z)<0.05){
        timeAnim = new THREE.Clock()
        if(anim==="ecran") animEcran()
        else displayTemplate()
        anim = false
    }
}


function animEcran(){
    const elapsedTimeAnim = timeAnim.getElapsedTime()
    allScreen.forEach(ecran=>ecran.material.uniforms.uTimeBis.value = elapsedTimeAnim)
    if(elapsedTimeAnim<0.3){
        requestAnimationFrame(animEcran)
    }else{

        displayTemplate()
    }  

}


header.addEventListener('click',e=>e.stopPropagation())
let listenerStop = ()=>{}

document.querySelector('#infos').addEventListener('click',infoGo)
function infoGo(e){
    e.target.removeEventListener('click',infoGo)
    listenerStop()
    listenerStop = ()=>{
        document.querySelector('#infos').addEventListener('click',infoGo)
    }
    activeMenu('#infos')
    objPos.x = infos.position.x
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    objPos.y = infos.position.y
    objPos.z = infos.position.z
    t=infosT
    prepareClick(e)
    anim = "ecran"
}

document.querySelector('#programme').addEventListener('click',programmeGo)
function programmeGo(e){
    e.target.removeEventListener('click',programmeGo)
    listenerStop()
    listenerStop = ()=>{
        document.querySelector('#programme').addEventListener('click',programmeGo)
    }
    activeMenu('#programme')
    objPos.x = programme.position.x
    objPos.y = programme.position.y
    objPos.z = programme.position.z
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    t= programmeT
    prepareClick(e)
    anim = "ecran"
}

function prepareClick(e){
    accueil.removeEventListener('click',goToAcc)
    allScreen.forEach(ecran=>ecran.material.uniforms.uTimeBis.value = 0)
    window.removeEventListener('pointermove',onPointerMove)
    document.body.style.cursor = "default"
    suppTemplate()
    if(parseInt(getComputedStyle(e.target).width)>200){

 
        header.dataset.open = "false"
        gsap.to('.menu-div',{x:0})
        gsap.fromTo('nav',{width:sizes.width,height:sizes.height},{width:0,height:0})
        setTimeout(()=>{
            header.style.display="none"
        },500)
        close.style.display = "none"
        menu.style.display = "block"

    }

    time=undefined
    arriveEcran()
}

document.querySelector('#interviews').addEventListener('click',interviewGo)

function interviewGo(e){
    activeMenu('#interviews')
    document.querySelector('#interviewT').classList.remove('animEntrance')
    e.target.removeEventListener('click',interviewGo)
    listenerStop()
    listenerStop = ()=>{
        document.querySelector('#interviews').addEventListener('click',interviewGo)
    }
    t = interviewT
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    t=interviewT

    objPos.x = interview.position.x
    objPos.y = interview.position.y
    objPos.z = interview.position.z
    anim="ecran"
    prepareClick(e)
}

accueil.addEventListener('click',goToAcc)


function goToAcc(e){
    listenerStop()
    listenerStop = ()=>{}
    e.stopPropagation()
    infosT.classList.remove('animEntrance')
    allScreen.forEach(ecran=>ecran.material.uniforms.uTimeBis.value = 0)
    if(parseInt(getComputedStyle(e.target).width)>200){  
        header.dataset.open = "false"
        close.style.display = "none"
        
        menu.style.display = "block"
        gsap.to('.menu-div',{x:0})
        gsap.fromTo('nav',{width:sizes.width,height:sizes.height},{width:0,height:0})
        setTimeout(()=>{
            header.style.display="none"
        },500)

    }
    suppTemplate()
    activeMenu('#accueil')

    window.addEventListener('pointermove', onPointerMove)
    objPos.x = cameraOrigin.position.x
    objPos.y = cameraOrigin.position.y
    objPos.z = cameraOrigin.position.z
    rotation.x = cameraOrigin.rotation.x
    rotation.y = cameraOrigin.rotation.y
    rotation.z = cameraOrigin.rotation.z
    time=undefined
   arriveEcran()
}
document.querySelector('#balade').addEventListener('click',baladeOn)

function baladeOn(e){
    e.stopPropagation()
    activeMenu('#balade')
    anim = false
    allScreen.forEach(ecran=>ecran.material.uniforms.uTimeBis.value = 0)
    document.querySelector('#balade').removeEventListener('click',baladeOn)

    if(parseInt(getComputedStyle(e.target).width)>200){

        close.style.display = "none"
        menu.style.display = "block"
        gsap.to('.menu-div',{x:0})
        gsap.fromTo('nav',{width:sizes.width,height:sizes.height},{width:0,height:0})
        setTimeout(()=>{
            header.style.display="none"
        },500)
        header.dataset.open = "false"


    }

    if(e.target.dataset.lock == "true"){
        document.removeEventListener("click",letsGo)
        removeEventListener('pointermove',onPointerMove)
        suppTemplate()
        objPos.x = cameraOrigin.position.x
        objPos.y = cameraOrigin.position.y
        objPos.z = cameraOrigin.position.z
        rotation.x = cameraOrigin.rotation.x
        rotation.y = cameraOrigin.rotation.y
        rotation.z = cameraOrigin.rotation.z
        time=undefined
        supps.forEach(supp=>supp.style.display="none")
        e.target.dataset.lock = "false"
        arriveEcran()
        

    }else{  
        document.addEventListener("click",letsGo)
        addEventListener('pointermove',onPointerMove)
        controls.enabled = false
        supps.forEach(supp=>supp.style.display="list-item")
        e.target.innerText="Se balader"
        e.target.dataset.lock = "true"
        goToAcc(e)
    }
 
}
document.querySelector('.menu-div').addEventListener('click',e=>{
    e.stopPropagation()
    if(e.target.dataset.menu == "open"){
        header.style.display="flex"
        header.dataset.open = "true"
        close.style.display="block"
        gsap.to('.menu-div',{x:sizes.width-90})
        gsap.fromTo('nav',{width:0,height:0},{width:sizes.width,height:sizes.height})
    }else{
        header.dataset.open = "false"
        menu.style.display="block"
        gsap.to('.menu-div',{x:0})
        gsap.fromTo('nav',{width:sizes.width,height:sizes.height},{width:0,height:0})
        setTimeout(()=>{
            header.style.display="none"
        },500)

    }
    e.target.style.display='none'
})
let count =0

//Animation 
function tick(e){
    const elapsedTime = clock.getElapsedTime()

    // controls.update()
    renderer.render(scene, camera)

    if(elapsedTime>5*count){
        
        interwiewScreen.forEach(ecran=>{
            const id = (ecran.previousImg +1) %4
            ecran.material.uniforms.uPreviousTexture.value = miniatures[ecran.previousImg]
            ecran.material.uniforms.uTimeElapsed.value = elapsedTime
            ecran.material.uniforms.uTexture.value = miniatures[id]
            ecran.previousImg = id
        })

        count++
    }

    raycaster.setFromCamera( pointer, camera );

    cylinder.forEach(el=>el.material.uniforms.uTime.value = elapsedTime)


    allScreen.forEach(ecran=>ecran.material.uniforms.uTime.value = elapsedTime)

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects( scene.children );

    window.requestAnimationFrame(tick)
    
}
tick()

const txts = document.querySelectorAll('.interviewTitre')

txts.forEach((txt)=>{
    const titles = txt.querySelectorAll('h2')
    const tl = gsap.timeline({repeat:-1,
        repeatDelay:0})

    titles.forEach(title=>{
        const titleLetter = [...title.innerText]
        title.innerText=''
        titleLetter.forEach(letter=>{
            const span = document.createElement('span')
            span.classList.add('letter')
            span.innerText = letter
            if(letter===" ") {
                if(window.innerWidth<850){
                    span.style.width="1rem"
                }else{
                    span.style.width="1.75rem"
                }
            }
            title.appendChild(span)
        })

        tl.from(title.childNodes,{
        opacity:0,
        y:80,
        rotateX:-90,
        stagger:.02
        },"<")
        
        .to(title.children,{
        opacity:1,
        y:0,
        rotateX:0,
        },"<2")
        
        .to(title.childNodes,{
        opacity:0,
        y:-80,
        rotateX:90,
        stagger:.02
        },"<1")

    })
})

