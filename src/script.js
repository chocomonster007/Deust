
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import vertexRetro from './shader/retroVertex.glsl';
import fragmentRetro from './shader/retroFragment.glsl';
import vertexRetrobis from './shader/retroVertexbis.glsl';
import fragmentRetrobis from './shader/retroFragmentbis.glsl';


const cubeTextureLoader = new THREE.CubeTextureLoader()
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

const milieuProj = {}

const coneGeometry = new THREE.ConeGeometry(0.6,2)
const coneMaterial = new THREE.ShaderMaterial({
    vertexShader : vertexRetro,
    fragmentShader : fragmentRetro,
    transparent:true,
    opacity:0,
    uniforms : {
        uTime:{value : 0},
        uColor:{value : new THREE.Vector3(1,1,1)}
    },
})
const cone = new THREE.Mesh(coneGeometry, coneMaterial); 
cone.position.set(0.05,2.35,-2.35)
cone.rotation.x=Math.PI/2.5
cone.geometry.computeBoundingBox()
console.log(cone.geometry.boundingBox, cone.position);

// const cone2Geometry = new THREE.ConeGeometry(0.5,2)
// const cone2Material = new THREE.ShaderMaterial({
//     vertexShader : vertexRetro,
//     fragmentShader : fragmentRetro,
//     // transparent:true,
//     // blendColor: 
//     uniforms : {
//         uTime:{value : 0},
//         uColor:{value : new THREE.Vector3(0.2,0.2,1)}
//     },

// })
// const cone2 = new THREE.Mesh(cone2Geometry, cone2Material ); 
// cone2.position.set(0.05,2.35,-2.35)
// cone2.rotation.x=Math.PI/2.5

const plastiqueNoir = new THREE.MeshBasicMaterial({
    color:0x161616
})

const plastiqueNoirClair = new THREE.MeshBasicMaterial({
    color:0x222222
})


const pancarteBaked = textureLoader.load('PANCARTE.jpg')
pancarteBaked.flipY =false
pancarteBaked.colorSpace = THREE.SRGBColorSpace
const pancarteMat = new THREE.MeshBasicMaterial({
    map: pancarteBaked
})

const clavierMat =new THREE.MeshBasicMaterial({
    color:0x1E1B1B,

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
scene.add( cone );

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
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.set(-2,2,5)
camera.lookAt(-1,-5,0.5)

scene.add(camera)
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
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

    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro') document.querySelector('body').style.cursor ='pointer' 
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

document.addEventListener('click',e=>{
    if(/écrans[0-9]{2}/.test(intersects[0]?.object.name) || intersects[0]?.object.name =='toileRetro')
    {
        const obj = intersects[0]
        console.log(obj.object);
        camera.position.set(obj.object.position.x,obj.object.position.y,obj.object.position.z)
    }

})

//Animation 
function tick(){
    const elapsedTime = clock.getElapsedTime()

    controls.update()

    renderer.render(scene, camera)

    cone.material.uniforms.uTime.value = elapsedTime
    // cone2.material.uniforms.uTime.value = elapsedTime

    raycaster.setFromCamera( pointer, camera );

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects( scene.children );


    window.requestAnimationFrame(tick)
    
}
tick()
