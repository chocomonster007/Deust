
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const gui = new GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

const solBakedTexture = textureLoader.load('solEnd2.jpg')
solBakedTexture.flipY = false
solBakedTexture.colorSpace = THREE.SRGBColorSpace

const plafondBakedTexture = textureLoader.load('plafond.jpg')
plafondBakedTexture.flipY = false
plafondBakedTexture.colorSpace = THREE.SRGBColorSpace

console.log(plafondBakedTexture);

const allBakedTexture = textureLoader.load('FINALBOUM.jpg')
allBakedTexture.flipY = false
allBakedTexture.colorSpace = THREE.SRGBColorSpace

const pacarteMurBaked = textureLoader.load('MURPANCARTE.JPG')
pacarteMurBaked.flipY = false
pacarteMurBaked.colorSpace = THREE.SRGBColorSpace

const ordiBaked = textureLoader.load('ordifinal2.jpg')
ordiBaked.flipY = false
ordiBaked.colorSpace = THREE.SRGBColorSpace

const mobilierBakedTexture = textureLoader.load('ordis.jpg')
mobilierBakedTexture.flipY = false
mobilierBakedTexture.colorSpace = THREE.SRGBColorSpace

const solBakedMaterial = new THREE.MeshBasicMaterial({
    map:solBakedTexture
})

const ordiBakedMaterial = new THREE.MeshBasicMaterial({
    map:ordiBaked
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

// const spotLightMap = textureLoader.load('test.jpg')
// spotLightMap.colorSpace = THREE.SRGBColorSpace

const milieuProj = {}

const coneGeometry = new THREE.ConeGeometry(0.6,2)
const coneMaterial = new THREE.MeshBasicMaterial({color: 0x20A8FC,
                                                    transparent:true,
                                                    opacity:0.2,
                                                    blending: THREE.AdditiveBlending,})
const cone = new THREE.Mesh(coneGeometry, coneMaterial ); 
cone.position.set(0.05,2.35,-2.35)
cone.rotation.x=Math.PI/2.5


const pancarteBaked = textureLoader.load('PANCARTE.jpg')
pancarteBaked.flipY =false
pancarteBaked.colorSpace = THREE.SRGBColorSpace
const pancarteMat = new THREE.MeshBasicMaterial({
    map: pancarteBaked
})

const clavierMat =new THREE.MeshBasicMaterial({
    color:0x1E1B1B,

})

scene.add( cone );

gltfLoader.load('deustSalle.glb',gltf=>{
    scene.add(gltf.scene)
    const sol = gltf.scene.children.find(child=>child.name === 'sol')
    const plafond = gltf.scene.children.find(child =>child.name === 'plafond')
    const all = gltf.scene.children.filter(child=>['hautRetro','hautTable', 'tableBord','tableProf', 'controleRetro', 'loquetPorte','murFenetre', 'murFond', 'murPorte','murVideo', 'radiateur'].includes(child.name))
    const mobilier = gltf.scene.children.filter(child=>['chaises','enceintes', 'myScreen','porteManteau','pancarteDeust','rétro','rétroprojecteur'].includes(child.name))
    const pancarte = gltf.scene.children.find(child=>child.name=="liègePancarte")
    const pancarteMur = gltf.scene.children.find(child=>child.name=='liègeMur')
    const ordis = gltf.scene.children.find(child=>child.name=='ordis')
    const claviers = gltf.scene.children.find(child=>child.name=='claviers')

    console.log(ordis, ordiBakedMaterial);
    ordis.material = ordiBakedMaterial
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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(-2,2,5)
scene.add(camera)
console.log(camera,canvas);
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


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

//Animation 
function tick(){
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
    
}
tick()
