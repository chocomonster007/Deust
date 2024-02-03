import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import vertexRetro from './shader/retroVertex.glsl';
import fragmentRetro from './shader/retroFragment.glsl';
import vertexEcran from './shader/ecranVertex.glsl';
import fragmentEcran from './shader/ecranFragment.glsl';
import retroInFragment from './shader/retroInFragment.glsl'
import retroInVertex from './shader/retroInVertex.glsl'


const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

let intersects

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)


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
// const spotLightMap = textureLoader.load('test.jpg')
// spotLightMap.colorSpace = THREE.SRGBColorSpace


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

const cone2Geometry = new THREE.ConeGeometry(0.1,0.5)
const cone2Material = new THREE.ShaderMaterial({
    vertexShader : retroInVertex,
    fragmentShader : retroInFragment,
    // transparent:true,
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

    toileRetro.material = ecranMat
    ecrans.forEach(ecran=>ecran.material = ecranMat)
    texte.material = textMat


    objetMetal.material = metalGris

    fenetre.material = vitre
    vitre1.material = vitreNoir
    myecran.material = vitreNoir

    vitreRetro.material = vitreGrise

    ordis.forEach(ordi=>ordi.material = plastiqueNoir)
    // const claviers = gltf.scene.children.find(child=>child.name=='claviers')
    touches.material = plastiqueNoirClair
    // claviers.material = ordiPiedBakedMaterial
    pancarte.material = pancarteMat
    pancarteMur.material = pancarteMurMAt
    sol.material = solBakedMaterial
    plafond.material = plafondBakedMaterial
    all.forEach(child=>{
        child.material = allBakedMaterial
    })
    mobilier.forEach(child=>child.material = mobilierBakedMaterial)
    // const drap = gltf.scene.children.find(child =>child.name === 'toileRetro')
    // milieuProj.y = drap.geometry.boundingBox.max.y - (drap.geometry.boundingBox.max.y- drap.geometry.boundingBox.min.y)/2 + 0.15;
    // milieuProj.x = 0
    // milieuProj.z = drap.geometry.boundingBox.max.z

    // const spotLight = new THREE.SpotLight( 0xffffff,100 );
    // spotLight.position.set(0.05,2.65,-1.45)
    // spotLight.angle = Math.PI/8
    // spotLight.intensity = 50
    // spotLight.target.position.set(milieuProj.x,milieuProj.y,milieuProj.z)
    // spotLight.target.updateMatrixWorld();
    // spotLight.map = spotLightMap
    
    // gui.add(spotLight, 'intensity', 1,200)
    // gui.add(spotLight, 'decay', 0.1,3)

    // const spotLightHelper = new THREE.SpotLightHelper(spotLight)

    // scene.add(spotLight,spotLightHelper)
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
        z:-3.3039751052856445

    }
}

const infos = {
    position : {
        x:-0.3777580261230469,
        y:0.8755115270614624,
        z:0.00133720874786377
    }
}
const programme = {
    position:{
        x:-2.4275617599487305,
        y:0.8755115270614624,
        z:-1.778724193572998
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

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro' || intersects[0]?.object.name =='liègeMur') document.querySelector('body').style.cursor ='pointer' 
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
let interObj
document.addEventListener('click',letsGo)
function letsGo(e){
    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro' || intersects[0]?.object.name =='liègeMur' )
    {   
        rotation.y = 0
        interObj = intersects[0].object

        objPos.x = interObj.position.x
        objPos.y = interObj.position.y
        objPos.z = interObj.position.z
        if(/écrans[0-9]{2}/.test(interObj.name)){
            objPos.z += 0.5
        }
        else if(interObj.name === "toileRetro"){
            objPos.z += 2.5
        }
        else if(interObj.name === "liègeMur"){
            rotation.y = Math.PI/2
            objPos.x +=1
        }

        arriveEcran()

    }

}
let time = 0
let timeAnim = 0
function arriveEcran(e){
    let timeSpend
    if(e !=undefined && time !=undefined){
        timeSpend = e-time
    }else{
        timeSpend = 0
    }

    let vectRotNorm = new THREE.Vector3(rotation.x-camera.rotation.x,
    rotation.y -camera.rotation.y,
    rotation.z - camera.rotation.z)

    const RotNorm = Math.sqrt(vectRotNorm.x*vectRotNorm.x+vectRotNorm.y*vectRotNorm.y+vectRotNorm.z*vectRotNorm.z)

    const normalizeBis = vectRotNorm.clone().normalize()  
    const translationBis = RotNorm < Math.sqrt(normalizeBis.x*normalizeBis.x+normalizeBis.y*normalizeBis.y+normalizeBis.z*normalizeBis.z) ? vectRotNorm : normalizeBis;
    camera.rotateOnAxis(translationBis,timeSpend/200)
    
    
    let vectPosNorm = new THREE.Vector3(objPos.x-camera.position.x,
        objPos.y -camera.position.y,
        objPos.z - camera.position.z)
    const PosNorm = Math.sqrt(vectPosNorm.x*vectPosNorm.x+vectPosNorm.y*vectPosNorm.y+vectPosNorm.z*vectPosNorm.z)
    
    const normalize = vectPosNorm.clone().normalize()  
    const translation = PosNorm < Math.sqrt(normalize.x*normalize.x+normalize.y*normalize.y+normalize.z*normalize.z) ? vectPosNorm : normalize;
    // camera.translateOnAxis(translation,timeSpend/100)
    camera.translateX(translation.x*timeSpend/100)
    camera.translateY(translation.y*timeSpend/100)   
    camera.translateZ(translation.z*timeSpend/100)   

    time = e
    if(PosNorm>0.01 || RotNorm>0.01){
        requestAnimationFrame(arriveEcran)                
    }else{
        const clockBis = new THREE.Clock()
        timeAnim = clockBis.getElapsedTime()
        animEcran()
    }  
}

function animEcran(){
    console.log(timeAnim);
    interObj.material.uniforms.uTime.value = timeAnim
    requestAnimationFrame(animEcran)
}

document.querySelector('#infos').addEventListener('click',e=>{
    e.stopPropagation()

        objPos.x = infos.position.x
        objPos.y = infos.position.y
        objPos.z = infos.position.z

        arriveEcran()
})
document.querySelector('#programme').addEventListener('click',e=>{
    e.stopPropagation()

    objPos.x = programme.position.x
    objPos.y = programme.position.y
    objPos.z = programme.position.z

    arriveEcran()
})

document.querySelector('#interviews').addEventListener('click',e=>{
    e.stopPropagation()

    objPos.x = interview.position.x
    objPos.y = interview.position.y
    objPos.z = interview.position.z

    arriveEcran()
})

document.querySelector('#contact').addEventListener('click',e=>{
    e.stopPropagation()
    objPos.x = contact.position.x
    objPos.y = contact.position.y
    objPos.z = contact.position.z

    rotation.y = -Math.PI/2

    
})

document.querySelector('#accueil').addEventListener('click',e=>{
    e.stopPropagation()
   accueil()
})

document.querySelector('#balade').addEventListener('click',e=>{
    e.stopPropagation()
    if(e.target.dataset.lock == "true"){
        document.removeEventListener("click",letsGo)
        removeEventListener('pointermove',onPointerMove)
        const cameraBefore = new THREE.Vector3()
        camera.getWorldDirection(cameraBefore)
        controls.target = cameraBefore
        camera.lookAt(cameraBefore)

        controls.enabled = true
        controls.autoRotate = true
        camera.lookAt(cameraBefore)
        controls.target = cameraBefore


        e.target.innerText = "Arrêter la balade"
        e.target.dataset.lock = "false"
    }else{  
        document.addEventListener("click",letsGo)
        addEventListener('pointermove',onPointerMove)
        controls.enabled = false
        e.target.innerText="Se balader"
        e.target.dataset.lock = "true"
        accueil()

    }
 
})


function accueil(e){
    let timeSpend
    if(e !=undefined && time !=undefined){
        timeSpend = e-time
    }else{
        timeSpend = 0
    }

        let vectPosNorm = new THREE.Vector3(cameraOrigin.position.x-camera.position.x-camera.rotation.x,
        cameraOrigin.position.y -camera.position.y-camera.rotation.y,
        cameraOrigin.position.z - camera.position.z-camera.rotation.z)

        let vectRotNorm = new THREE.Vector3(cameraOrigin.rotation.x-camera.rotation.x,
        cameraOrigin.rotation.y -camera.rotation.y,
        cameraOrigin.rotation.z - camera.rotation.z)
        const PosNorm = Math.sqrt(vectPosNorm.x*vectPosNorm.x+vectPosNorm.y*vectPosNorm.y+vectPosNorm.z*vectPosNorm.z)
        const RotNorm = Math.sqrt(vectRotNorm.x*vectRotNorm.x+vectRotNorm.y*vectRotNorm.y+vectRotNorm.z*vectRotNorm.z)
    
        if(PosNorm>0.05 || RotNorm>0.005 ){
            requestAnimationFrame(accueil)
        }
        const normalize = vectPosNorm.clone().normalize()  
        const translation = PosNorm < Math.sqrt(normalize.x*normalize.x+normalize.y*normalize.y+normalize.z*normalize.z) ? vectPosNorm : normalize;
    
        const normalizeBis = vectRotNorm.clone().normalize()  
        const translationBis = RotNorm < Math.sqrt(normalize.x*normalize.x+normalize.y*normalize.y+normalize.z*normalize.z) ? vectRotNorm : normalizeBis;
            camera.translateOnAxis(translation,timeSpend/100)
                       
            camera.rotateOnAxis(translationBis,timeSpend/200)
        time =e

}

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
