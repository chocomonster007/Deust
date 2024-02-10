import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import vertexRetro from './shader/retroVertex.glsl';
import fragmentRetro from './shader/retroFragment.glsl';
import vertexEcran from './shader/ecranVertex.glsl';
import fragmentEcran from './shader/ecranFragment.glsl';
import retroInFragment from './shader/retroInFragment.glsl'
import retroInVertex from './shader/retroInVertex.glsl'
import toileFragment from './shader/toileFragment.glsl'
import toileVertex from './shader/toileVertex.glsl'
import { gsap } from 'gsap'

const infosT = document.querySelector('#infosT')
const programmeT = document.querySelector('#programmeT')
const interviewT = document.querySelector('#interviewT')


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let intersects

const loadingBarElement = document.querySelector('.loading-bar')
const menu = document.querySelector('header')


const loadingManager = new THREE.LoadingManager(
    // Loaded
    () =>
    {
        // Wait a little
        window.setTimeout(() =>
        {
            // Animate overlay
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 1.5, value: 0, delay: 0.5 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
            gsap.to("header",{ duration: 1.5, opacity: 1, delay: 0.5 })
        }, 500)

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

const overlayGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
const overlayMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
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
scene.add(overlay)


const pancarteBaked = textureLoader.load('PANCARTE.jpg')
pancarteBaked.flipY =false
pancarteBaked.colorSpace = THREE.SRGBColorSpace

const solBakedTexture = textureLoader.load('solEnd2.jpg')
solBakedTexture.flipY = false
solBakedTexture.colorSpace = THREE.SRGBColorSpace

const plafondBakedTexture = textureLoader.load('plafond.jpg')
plafondBakedTexture.flipY = false
plafondBakedTexture.colorSpace = THREE.SRGBColorSpace

const allBakedTexture = textureLoader.load('mur2.jpg')
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

const ecranMat = new THREE.ShaderMaterial({
    vertexShader : vertexEcran,
    fragmentShader : fragmentEcran,
    uniforms:{
        uTime:{
            value:0
        }
    }
})

const toileMat = new THREE.ShaderMaterial({
    vertexShader : toileVertex,
    fragmentShader : toileFragment,
    uniforms:{
        uTime:{
            value:0
        }
    }
})

const cone2Geometry = new THREE.ConeGeometry(0.1,0.5)
const cone2Material = new THREE.ShaderMaterial({
    vertexShader : retroInVertex,
    fragmentShader : retroInFragment,
    blending: THREE.AdditiveBlending,
    uniforms : {
        uTime:{value : 0},
    },

})
const cone2 = new THREE.Mesh(cone2Geometry, cone2Material ); 
cone2.position.set(0.05,2.57,-1.66)
cone2.rotation.x=Math.PI/2.5

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

scene.add( cone,cone2 );

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
    const ecrans = gltf.scene.children.filter(child=>/écrans[0-9]{2}/.test(child.name))
    const toileRetro = gltf.scene.children.find(child=>child.name=="toileRetro")

    toileRetro.material = toileMat

    ecrans.forEach(ecran=>ecran.material = ecranMat)
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
        x:-0.0304374098777771,
        y:1.4881799221038818,
        z:-4.3039751052856445

    }
}

const infos = {
    position : {
        x:-0.3777580261230469,
        y:0.8755115270614624,
        z:-0.20133720874786377
    }
}
const programme = {
    position:{
        x:-2.4275617599487305,
        y:0.8755115270614624,
        z:-2.078724193572998
    }
}

const contact = {
    position:{
        x:2.8654136657714844,
        y:1.4804919958114624,
        z:-5.4577956199646
    },
    rotation:{
        y:-Math.PI/2
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
    t.classList.add('on')
}

function suppTemplate(){
    if(document.querySelector('.on'))document.querySelector('.on').classList.remove('on')
}

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro') document.querySelector('body').style.cursor ='pointer' // || intersects[0]?.object.name =='liègeMur'
    else document.querySelector('body').style.cursor ='default'

}

window.addEventListener( 'pointermove', onPointerMove );

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const clock = new THREE.Clock()
const objPos = new THREE.Vector3()
const rotation = {
    x:0,
    y:0,
    z:0
}
let t
let interObj
document.addEventListener('click',letsGo)
function letsGo(){
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
            anim = true
            if(/écrans[1-2][0-9]/.test(interObj.name)){
                t = infosT
            }else{
                t= programmeT
            }
        }
        else if(interObj.name === "toileRetro"){
            objPos.z += 1.5
            anim=true
            t = interviewT

        }

        
        time=undefined
        arriveEcran()

    }

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
    
    const normalize = vectPos.clone().normalize()
    const translation = Math.abs(vectPos.x) < Math.abs(normalize.x) ? vectPos : normalize;
    camera.translateOnAxis(translation,timeSpend/130)
    time = e
    if(Math.abs(camera.position.x-objPos.x)>0.0005 || Math.abs(camera.rotation.x-rotation.x)>0.00005) 
    {requestAnimationFrame(arriveEcran)
    }
    
    if(anim && Math.abs(camera.position.z-objPos.z)<0.15){
        timeAnim = new THREE.Clock()
        animEcran()
        anim = false
    }
}
function animEcran(){
    const elapsedTimeAnim = timeAnim.getElapsedTime()
    ecranMat.uniforms.uTime.value = elapsedTimeAnim
    if(1-Math.abs(0.29*0.14)<1.01-elapsedTimeAnim/10){
        requestAnimationFrame(animEcran)
    }else{
        displayTemplate()
    }  

}

document.querySelector('#infos').addEventListener('click',e=>{
    e.stopPropagation()
    suppTemplate()
    ecranMat.uniforms.uTime.value = 0
    t= infosT
        anim = true
        objPos.x = infos.position.x
        rotation.x = 0
        rotation.y = 0
        rotation.z = 0
        objPos.y = infos.position.y
        objPos.z = infos.position.z
        time=undefined
        arriveEcran()
})
document.querySelector('#programme').addEventListener('click',e=>{
    e.stopPropagation()
    suppTemplate()
    t= programmeT
    ecranMat.uniforms.uTime.value = 0

    anim = true
    objPos.x = programme.position.x
    objPos.y = programme.position.y
    objPos.z = programme.position.z
    time=undefined
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    arriveEcran()
})

document.querySelector('#interviews').addEventListener('click',e=>{
    e.stopPropagation()
    suppTemplate()

    ecranMat.uniforms.uTime.value = 0
    t = interviewT
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0

    objPos.x = interview.position.x
    objPos.y = interview.position.y
    objPos.z = interview.position.z
    time=undefined
    arriveEcran()
})

document.querySelector('#contact').addEventListener('click',e=>{
    e.stopPropagation()
    objPos.x = contact.position.x
    objPos.y = contact.position.y
    objPos.z = contact.position.z
    rotation.y = -Math.PI/2
    rotation.x=0
    rotation.z=0
    arriveEcran()
    
})

document.querySelector('#accueil').addEventListener('click',goToAcc)

function goToAcc(e){
    e.stopPropagation()
    suppTemplate()
    objPos.x = cameraOrigin.position.x
    objPos.y = cameraOrigin.position.y
    objPos.z = cameraOrigin.position.z
    rotation.x = cameraOrigin.rotation.x
    rotation.y = cameraOrigin.rotation.y
    rotation.z = cameraOrigin.rotation.z
    ecranMat.uniforms.uTime.value = 0
    time=undefined
   arriveEcran()
}
document.querySelector('#balade').addEventListener('click',e=>{
    e.stopPropagation()
    if(e.target.dataset.lock == "true"){
        document.removeEventListener("click",letsGo)
        removeEventListener('pointermove',onPointerMove)
        controls.enabled = true
        e.target.innerText = "Arrêter la balade"
        e.target.dataset.lock = "false"
    }else{  
        document.addEventListener("click",letsGo)
        addEventListener('pointermove',onPointerMove)
        controls.enabled = false
        e.target.innerText="Se balader"
        e.target.dataset.lock = "true"
        goToAcc(e)
    }
 
})

//Animation 
function tick(){
    const elapsedTime = clock.getElapsedTime()

    // controls.update()

    renderer.render(scene, camera)

    cone2.material.uniforms.uTime.value = elapsedTime

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects( scene.children );


    window.requestAnimationFrame(tick)
    
}
tick()
