const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth,window.innerHeight)
document.body.appendChild(renderer.domElement)

camera.position.z = 40
camera.position.y = 10

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(10,20,10)
scene.add(light)

const ambient = new THREE.AmbientLight(0x404040)
scene.add(ambient)

// GROUND
const groundGeo = new THREE.PlaneGeometry(200,200)
const groundMat = new THREE.MeshStandardMaterial({color:0x145214})
const ground = new THREE.Mesh(groundGeo,groundMat)
ground.rotation.x = -Math.PI/2
scene.add(ground)

// TREES
for(let i=0;i<40;i++){

const trunkGeo = new THREE.CylinderGeometry(0.3,0.5,5)
const trunkMat = new THREE.MeshStandardMaterial({color:0x5c3a21})
const trunk = new THREE.Mesh(trunkGeo,trunkMat)

trunk.position.set(
Math.random()*180-90,
2.5,
Math.random()*180-90
)

scene.add(trunk)

const leavesGeo = new THREE.SphereGeometry(2)
const leavesMat = new THREE.MeshStandardMaterial({color:0x1f7a1f})
const leaves = new THREE.Mesh(leavesGeo,leavesMat)

leaves.position.set(
trunk.position.x,
6,
trunk.position.z
)

scene.add(leaves)
}

// MOUNTAINS
for(let i=0;i<5;i++){

const mountainGeo = new THREE.ConeGeometry(15,25,4)
const mountainMat = new THREE.MeshStandardMaterial({color:0x555555})
const mountain = new THREE.Mesh(mountainGeo,mountainMat)

mountain.position.set(
Math.random()*120-60,
12,
Math.random()*120-60
)

scene.add(mountain)
}

// VOLCANO
const volcanoGeo = new THREE.ConeGeometry(10,20,32)
const volcanoMat = new THREE.MeshStandardMaterial({color:0x3b2f2f})
const volcano = new THREE.Mesh(volcanoGeo,volcanoMat)

volcano.position.set(0,10,-60)
scene.add(volcano)

// DINOSAURS
const dinos = []

for(let i=0;i<20;i++){

const dinoGeo = new THREE.BoxGeometry(2,2,4)
const dinoMat = new THREE.MeshStandardMaterial({color:0x3cb043})
const dino = new THREE.Mesh(dinoGeo,dinoMat)

dino.position.set(
Math.random()*100-50,
1,
Math.random()*100-50
)

scene.add(dino)
dinos.push(dino)
}

// FLYING DINOSAURS
const flyers = []

for(let i=0;i<6;i++){

const geo = new THREE.BoxGeometry(3,0.5,2)
const mat = new THREE.MeshStandardMaterial({color:0x8844ff})
const bird = new THREE.Mesh(geo,mat)

bird.position.set(
Math.random()*100-50,
20 + Math.random()*10,
Math.random()*100-50
)

scene.add(bird)
flyers.push(bird)
}

// ROAR SOUND
function roar(){
const audio = new Audio("https://www.soundjay.com/misc/sounds/dinosaur-roar-1.mp3")
audio.volume = 1.0
audio.play()
}

// ANIMATION
function animate(){

requestAnimationFrame(animate)

dinos.forEach(d=>{
d.position.x += 0.02
if(d.position.x > 50) d.position.x = -50
})

flyers.forEach((f,i)=>{
f.position.x += Math.sin(Date.now()*0.001+i)*0.02
})

renderer.render(scene,camera)

}

animate()
