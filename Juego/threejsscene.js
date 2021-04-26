let renderer = null, 
scene = null, 
camera = null,
cube = null,
sphere = null,
cone = null,
sphereGroup = null;

let canvas;

let duration = 5000; // ms
let currentTime = Date.now();


let textureUrl = "../images/ash_uvgrid01.jpg";
let texture = new THREE.TextureLoader().load(textureUrl);
let material = new THREE.MeshPhongMaterial({ map: texture });


let group = new THREE.Object3D;
let figureList = []

scene = new THREE.Scene();


function addElement(){
    console.log("AddElement")

    figure = random(0,3)

    switch (figure) {
        case 0:
            createSphere()
            //alert('case 1 executed');
            break;
        case 1:
            createCube()
            //alert("case 2 executed");
            break;
        case 2: 
            createCylinder()
            break;
        case 3:
            createDodecahedron()
            break;
            
    //console.log(figure)
    

    //createCube();
    }
}

function addSatellite(){
    console.log("Satelite")
    figure = random(0,3)

    //console.log(figure)
    //console.log(figureList[figureList.length - 1])
    //createSphereChild(figureList[figureList.length - 1])


    switch (figure) {
        case 0:
            createSphereChild(figureList[figureList.length - 1])
            //alert('case 1 executed');
            break;
        case 1:
            createDodecahedronChild(figureList[figureList.length - 1])
            //alert("case 2 executed");
            break;
        case 2: 
            createCylinderChild(figureList[figureList.length - 1])
        break;
        case 3:
            createCubeChild(figureList[figureList.length - 1])
            break;
            
    //console.log(figure)
    

    //createCube();
    }
    //createCube();
}

function reset(){
    console.log("reset")
    //console.log(cubeGroup)

    //scene.remove(cubeGroup);
    //let cubeGroup = new THREE.Object3D;
    //createScene(canvas)
    console.log(scene.children)

    //for (i in scene.children){
        //if ((scene.children[i].type) == 'Object3D'){
            //console.log(scene.children[i].type)        
        //}
    //}
    scene.children.splice('Object3D')

    let light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);
    figureList = [];

}



function main() {
    canvas = document.getElementById("webglcanvas");
    // create the scene
    createScene(canvas);
    
    // Run the run loop

    run();
}

function random(min, max) {
    return ~~(Math.random() * (max - min + 1) + min);
  }

function animate() 
{

    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    // Rotate the cube about its Y axis
    //cube.rotation.y += angle;
    for (i in figureList){
       //console.log(figureList[i])
       figureList[i].rotation.y += angle;
    }

    // Rotate the sphere group about its Y axis
}
function run() {
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Spin the cube for next frame
    animate();
}

function createSphereChild(father){
    console.log("Creating Sphere")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.SphereGeometry(.7, 32, 32);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    
    father.add(newGroup)
    
    //scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    //newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
    

}

function createSphere(){
    console.log("Creating Sphere")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.SphereGeometry(.7, 32, 32);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
    

}

function createDodecahedron(){
    console.log("Creating Dodecahedron")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.DodecahedronGeometry(.7);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)

}
function createDodecahedronChild(father){
    console.log("Creating Dodecahedron")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.DodecahedronGeometry(.7);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    father.add(newGroup)

    //scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    //newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)

}

function createCylinder(){
    console.log("Creating Cylinder")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.CylinderGeometry(.5, .5, .5, 32);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
}

function createCylinderChild(father){
    console.log("Creating Cylinder")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.CylinderGeometry(.5, .5, .5, 32);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    father.add( newGroup )
    
    //scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    //newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
}

function createCube(){
    console.log("Creating cube")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
    
}
function createCubeChild(father){
    console.log("Creating cube")
    x = random(-10, 10) / 5
    y = random(-10, 10) / 5
    z = random(-10, 10) / 5

    //console.log(x, y, z)
    let newGroup = new THREE.Object3D;

    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let cube1 = new THREE.Mesh(geometry, material);
    figureList.push(cube1);
    cube1.rotation.x = Math.PI / 5;
    cube1.rotation.y = Math.PI / 5;

    // Add the cube mesh to our group
    newGroup.add( cube1 );
    newGroup.position.set(x, y, z);
    
    father.add(newGroup);
    //scene.add( newGroup );

    // add mouse handling so we can rotate the scene
    //addMouseHandler(canvas, newGroup);
    // This code gets the world position of the cone.
    //newGroup.updateMatrixWorld();
    //console.log(scene)
    //console.log("cube position:" , cube);
    // Create a group for the sphere
    //console.log(cube1)
    //console.log(group)
    
}



function createScene(canvas)
{    
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);
    
    // Create a new Three.js scene

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);
    
    // Create a group to hold all the objects
    //let cubeGroup = new THREE.Object3D;
    
    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);

    // Create the cube geometry
    
    // Create a group for the sphere
    scene.add( group );
    // add mouse handling so we can rotate the scene
    addMouseHandler(canvas, group);
    // This code gets the world position of the cone.
    group.updateMatrixWorld();
}