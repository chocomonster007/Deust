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
import tubeVertex from './shader/tubeVertex.glsl'
import tubeFragment from './shader/tubeFragment.glsl'
import tubeFragment2 from './shader/tubeFragment2.glsl'
import tubeVertex2 from './shader/tubeVertex2.glsl'

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
            gsap.to(overlayMaterial.uniforms.uAlpha, { duration: 1.5, value: 0, delay: 0.5 })

            // Update loadingBarElement
            loadingBarElement.classList.add('ended')
            loadingBarElement.style.transform = ''
            gsap.to(header,{ duration: 1.5, opacity: 1, delay: 0.5 })
            gsap.to(".menu-div",{ duration: 1.5, opacity: 1, delay: 0.5 })

        }, 500)


        setTimeout(()=>{
            const obj = scene.getObjectByName('overlay')
            scene.remove(obj)
        },2500)

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

const cylinderGeometry = new THREE.CylinderGeometry( 0.02, 0.02, 2,32); 
const cylinderMaterial = new THREE.ShaderMaterial(
    {uniforms: {
        uTime:{value:0},
    },
    vertexShader : tubeVertex,
    fragmentShader : tubeFragment,
} );


const cylinder1 = new THREE.Mesh( cylinderGeometry, cylinderMaterial );

 
cylinder1.position.set(0,1.5,0)
cylinder1.rotation.x = Math.PI/2
scene.add(cylinder1)


const overlayGeometry = new THREE.PlaneGeometry(4, 4, 1, 1)
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
overlay.name = "overlay"
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
    t.classList.add('on')
    accueil.addEventListener('click',goToAcc)
    t.addEventListener('click',e=>e.stopPropagation())

}

function suppTemplate(){
    if(document.querySelector('.on'))document.querySelector('.on').classList.remove('on')
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
        anim=true
        if(/écrans[0-9]{2}/.test(interObj.name)){
            objPos.z += 0.25
 
            if(/écrans[1-2][0-9]/.test(interObj.name)){
                t = infosT
                activeMenu('#infos')
            }else{
                activeMenu('#programme')


                t= programmeT
            }
        }
        else if(interObj.name === "toileRetro"){
            objPos.z += 1.5
            activeMenu('#interviews')

            t = interviewT

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
    
    const normalize = vectPos.clone().normalize()
    const translation = Math.abs(vectPos.x) < Math.abs(normalize.x) ? vectPos : normalize;
    camera.translateOnAxis(translation,timeSpend/130)
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
            console.log(vecCam);
            controls.enabled = true
            controls.target = result
            controls.update()


            document.querySelector('#balade').innerText = "Arrêter la balade"
        }
        document.querySelector('#balade').addEventListener('click',baladeOn)

    }
    
    if(anim && Math.abs(camera.position.z-objPos.z)<0.05){
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


header.addEventListener('click',e=>e.stopPropagation())

document.querySelector('#infos').addEventListener('click',e=>{
        activeMenu('#infos')


        objPos.x = infos.position.x
        rotation.x = 0
        rotation.y = 0
        rotation.z = 0
        objPos.y = infos.position.y
        objPos.z = infos.position.z
        t=infosT
        prepareClick(e)

})
document.querySelector('#programme').addEventListener('click',e=>{

    activeMenu('#programme')
    anim = true
    
    anim = true
    objPos.x = programme.position.x
    objPos.y = programme.position.y
    objPos.z = programme.position.z

    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    t= programmeT
    prepareClick(e)
})

function prepareClick(e){
    e.stopPropagation()
    accueil.removeEventListener('click',goToAcc)
    window.removeEventListener('pointermove',onPointerMove)
    document.body.style.cursor = "default"
    ecranMat.uniforms.uTime.value = 0
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

    anim = true
    time=undefined
    arriveEcran()
}

document.querySelector('#interviews').addEventListener('click',e=>{
    activeMenu('#interviews')

    ecranMat.uniforms.uTime.value = 0
    t = interviewT
  
    ecranMat.uniforms.uTime.value = 0
    t = interviewT
    rotation.x = 0
    rotation.y = 0
    rotation.z = 0
    t=interviewT

    objPos.x = interview.position.x
    objPos.y = interview.position.y
    objPos.z = interview.position.z

    prepareClick(e)
})

document.querySelector('#contact').addEventListener('click',e=>{
    activeMenu('#contact')

    objPos.x = contact.position.x
    objPos.y = contact.position.y
    objPos.z = contact.position.z
    rotation.y = -Math.PI/2.02
    rotation.x=0
    rotation.z=0
    t=infosT

    prepareClick(e)
   
})

accueil.addEventListener('click',goToAcc)

function goToAcc(e){
    e.stopPropagation()
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
    ecranMat.uniforms.uTime.value = 0
    time=undefined
   arriveEcran()
}
document.querySelector('#balade').addEventListener('click',baladeOn)

function baladeOn(e){
    e.stopPropagation()
    activeMenu('#balade')
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
        if(document.querySelector('.on')){
            document.querySelector('.on').classList.remove('on')
        }
        objPos.x = cameraOrigin.position.x
        objPos.y = cameraOrigin.position.y
        objPos.z = cameraOrigin.position.z
        rotation.x = cameraOrigin.rotation.x
        rotation.y = cameraOrigin.rotation.y
        rotation.z = cameraOrigin.rotation.z
        time=undefined
        supps.forEach(supp=>supp.style.display="none")
        document.querySelector('ul :nth-child(6)').style.borderBottom = "none"
        ecranMat.uniforms.uTime.value = 0
        e.target.dataset.lock = "false"
        arriveEcran()
        

    }else{  
        document.addEventListener("click",letsGo)
        addEventListener('pointermove',onPointerMove)
        document.querySelector('ul :nth-child(6)').style.borderBottom = "1px solid rgba(0, 0, 0, 0.247)"
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

//Animation 
function tick(){
    const elapsedTime = clock.getElapsedTime()

    // controls.update()
    renderer.render(scene, camera)

    cone2.material.uniforms.uTime.value = elapsedTime

    raycaster.setFromCamera( pointer, camera );

    cylinder1.material.uniforms.uTime.value = elapsedTime
	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects( scene.children );

    window.requestAnimationFrame(tick)
    
}
tick()
