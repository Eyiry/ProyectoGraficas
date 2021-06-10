//import * as THREE from '../libs/three.js/r125/three.module.js'
import * as THREE from '../three.js/build/three.module.js';

//import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { OBJLoader } from '../three.js/examples/jsm/loaders/OBJLoader.js';

//import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

import { createEnvironment } from './createMap.js';
import { getSong } from './snowHalation.js';

import { EffectComposer } from '../three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../three.js/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../three.js/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from '../three.js/examples/jsm/postprocessing/ShaderPass.js';
import {UnrealBloomPass} from '../three.js/examples/jsm/postprocessing/UnrealBloomPass.js'
import { Pass } from '../three.js/examples/jsm/postprocessing/Pass.js';

import { ConvexGeometry } from '../three.js/examples/jsm/geometries/ConvexGeometry.js';
import { ConvexObjectBreaker } from '../three.js/examples/jsm/misc/ConvexObjectBreaker.js';
import { PointerLockControls } from '../three.js/examples/jsm/controls/PointerLockControls.js';

///https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/UnrealBloomPass.js


let renderer = null, scene = null, camera = null, root = null, group = null, water = null, cubes = null, material = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let lastPositionx = 0;
let lastPositiony = 0;

let startTime = Date.now();
let lastTimeout = 0;

let noteIndex = 0;
let noteFlag = true;
let finishFlag = false;

let currentTime = Date.now();
let spotLight = null, ambientLight = null;
let objectList = []

//Score and UI references
let scoreReference = null, comboReference = null;
let score = 0;

//Combo multiplier stuff
let combo = 0;
let multiplier = 1;
let comboThreshold = [2, 4, 8, 16];

//Change this to our floor
let mapUrl = "../images/spruce.png";
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

//let modelUrls = ["../models/gltf/Horse.glb", "../models/gltf/Parrot.glb", "../models/gltf/Stork.glb", "../models/gltf/Flamingo.glb"];

////COSAS PARA EL BLOOM
const materials = {};
let bloomComposer;
let finalComposer;
let bloomLayer;


let arrow;
let cylinder;
let planeDetector;
// Physics variables
const gravityConstant = 0;
let collisionConfiguration;
let dispatcher;
let broadphase;
let solver;
let softBodySolver;
let physicsWorld;
let rigidBodies = [];
let margin = 0.05;
let mass = 30;
let hinge;
let rope;
let transformAux1;
const clock = new THREE.Clock();
let sableCreated = true;
let sable;
const objectsToRemove = [];
let numObjectsToRemove = 0;
let tempBtVec3_1;

let controls;
let cameraVector;
let lastCameraVector;


let velX = 0;
let velY = 0;

let theBroken= []

const convexBreaker = new ConvexObjectBreaker();

const impactPoint = new THREE.Vector3();
const impactNormal = new THREE.Vector3();

let armMovement = 0;
const params = {
    exposure: 3,
    bloomStrength: .5,
    bloomThreshold: 0,
    bloomRadius: 1,
    scene: "Scene with Glow"
};




/*var song = {
    events: [],
    notes: [{ "_time": 3.9270829999999997, "_lineIndex": 2, "_lineLayer": 2, "_type": 1, "_cutDirection": 0 },
    { "_time": 5.927083, "_lineIndex": 3, "_lineLayer": 1, "_type": 1, "_cutDirection": 3 },
    { "_time": 7.927083, "_lineIndex": 2, "_lineLayer": 0, "_type": 0, "_cutDirection": 0 },
    { "_time": 9.927083, "_lineIndex": 0, "_lineLayer": 1, "_type": 0, "_cutDirection": 3 },
    { "_time": 11.927083, "_lineIndex": 0, "_lineLayer": 0, "_type": 0, "_cutDirection": 1 }],
    obstacles: [{ "_time": 19.921875, "_duration": 6, "_type": 0, "_lineIndex": 0, "_width": 1 }, { "_time": 27.921875, "_duration": 4, "_type": 0, "_lineIndex": 3, "_width": 1 }, { "_time": 35.921875, "_duration": 2, "_type": 1, "_lineIndex": 0, "_width": 4 }, { "_time": 67.921875, "_duration": 0.25, "_type": 1, "_lineIndex": 0, "_width": 4 }]
}*/

var song = getSong();

function main() {
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    //playAudio();

    update();
}


function update()
{
    requestAnimationFrame(function() { update(); });
    if (sableCreated){
        createLine(scene)
    }
    followRythm();
    animate();

    //renderer.render( scene, camera );
    renderBloom(true);

    // render the entire scene, then render bloom scene on top
    //console.log(camera.position)
    //console.log("raycaster direction", raycaster.ray.direction, "origin", raycaster.ray.origin)
    //console.log(cylinder.position)

    const deltaTime = clock.getDelta();
    //console.log(physicsWorld.)
    finalComposer.render();
    updatePhysics( deltaTime );
    updateLine()




}


function followRythm() {

    if (noteFlag && noteIndex < song.notes.length) {
        let momentTime = Date.now()
        let nextNote = song.notes[noteIndex]._time * 1000;
        let timeout = (startTime + nextNote - momentTime - lastTimeout);
        noteFlag = false;
        setTimeout(() => {
            let line = song.notes[noteIndex]._lineIndex;
            let column = song.notes[noteIndex]._lineLayer;
            let cutDirection = song.notes[noteIndex]._cutDirection % 4;
            let lineNumb = 0;
            let columnNumb = 0;

            switch (line) {
                case 0:
                    lineNumb = -6;
                    break;
                case 1:
                    lineNumb = -2;
                    break;
                case 2:
                    lineNumb = 2;
                    break;
                case 3:
                    lineNumb = 6;
                    break;
                default:
                    console.log('Not valid position in line');
            }

            switch (column) {
                case 0:
                    columnNumb = 5;
                    break;
                case 1:
                    columnNumb = 8;
                    break;
                case 2:
                    columnNumb = 11;
                    break;
                case 3:
                    columnNumb = 14;
                    break;
                default:
                    console.log('Not valid position in column');
            }

            createCube(lineNumb, columnNumb, cutDirection);
            //console.log('Timeout: '+ timeout);
            noteFlag = true;
            noteIndex++;

        }, timeout);
    }else if(noteIndex >= song.notes.length && finishFlag == false){
        //finishFlag = true;
        //setTimeout(()=>{
            //window.location = '/Juego/ScoreScreen.html?score='+ score;
        //}, 3000)
    }
}


function createScene(canvas) {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false });
    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, .5, 4000);
    camera.position.set(0, 10, 110);
    //camera.position.set(0, 10, 150);

    scene.add(camera);

    ///BLOOM

    let width = window.innerWidth;
    let height = window.innerHeight;



    bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    document.body.appendChild(renderer.domElement);
    bloomComposer = new EffectComposer(renderer);

    bloomComposer.setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
    );
    const renderPass = new RenderPass(scene, camera);
    bloomComposer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
    bloomPass.radius = params.bloomRadius;


    console.log("BLOOOOOOOOOOOOMMMMMMMMMMM")
    console.log(bloomPass);

    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(bloomPass);


    const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            defines: {}
        }), "baseTexture"
    );
    finalPass.needsSwap = true;
    finalComposer = new EffectComposer(renderer);
    finalComposer.addPass(renderPass);
    finalComposer.setSize(width, height);
    finalComposer.addPass(finalPass);
    ///TERMINA BLOOM



    root = new THREE.Object3D;

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(0, 20, 150);
    spotLight.target.position.set(0, -100, -60);
    root.add(spotLight);


    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight(0xD8BFD8, .35);
    root.add(ambientLight);


    group = new THREE.Object3D;
    root.add(group);

    cubes = new THREE.Object3D;
    root.add(cubes);

    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let texture = new THREE.TextureLoader().load('../images/companionCube.png');
    material = new THREE.MeshPhongMaterial({ map: texture });

    createEnvironment(objectList, scene)

    raycaster = new THREE.Raycaster();
    raycaster.far = 20;
    raycaster.layers.enable(BLOOM_SCENE)

    document.addEventListener('pointermove', onDocumentPointerMove);
    scoreReference = document.getElementById("scorePoints");
    comboReference = document.getElementById("streakPoints");
    
    let camera2
    camera2 = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, .5, 4000);
    camera2.position.set(0, 10, 110);



    controls = new PointerLockControls( camera2, document.body,sable );
    const blocker = document.getElementById( 'blocker' );
    const instructions = document.getElementById( 'instructions' )

    instructions.addEventListener( 'click', function () {

        controls.lock();

    } );

    controls.addEventListener( 'lock', function () {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    } );

    controls.addEventListener( 'unlock', function () {

        blocker.style.display = 'block';
        instructions.style.display = '';

    } );
    cameraVector = new THREE.Vector3( 1, 0, 1 );
    lastCameraVector = new THREE.Vector3(1,0,1);

    scene.add( controls.getObject() );

    
    
    scene.add( root );
    setupPhysicsWorld()


}


function createLine(scene){

    //let arrow = new THREE.ArrowHelper(raycaster.ray.direction, raycaster.ray.origin, 300, 0xff0000)
    //arrow.layers.enable(BLOOM_SCENE)

    //const geometry = new THREE.CylinderGeometry( .01, .01, 1, 32 );

    //const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );

    cylinder = new THREE.Mesh(new THREE.BoxBufferGeometry(), new THREE.MeshNormalMaterial());
    cylinder.scale.set(.2,.2,40)
    cylinder.position.x = 0
    cylinder.position.y = 9
    cylinder.position.z = 109

    planeDetector = new THREE.Plane(new THREE.Vector3(0, 0, 1), 8);
    //planeDetector.position.z = 90
    //planeDetector.position.y = 10
    scene.add( planeDetector );


    //cylinder.rotation.z = Math.PI;

    cylinder.layers.enable(BLOOM_SCENE)
    const shableSable = new Ammo.btBoxShape( new Ammo.btVector3(.1,.1, 20 ) );
    shableSable.setMargin( margin );
    const quat = new THREE.Quaternion();
    quat.set( 0, 0, 0, 1 );

    createRigidBodySable( cylinder, shableSable, mass * 10000, cylinder.position, quat );

    //const quat = new THREE.Quaternion();
    //quat.set( 0, 0, 0, 1 );

    //createRigidBody( cylinder, shape, mass, cylinder.position, quat );
    sableCreated = false;

    scene.add( cylinder );
    //scene.add(arrow);
}



function updateLine(){
    //console.log(raycaster.ray.direction.x * 180 /Math.PI)
    //console.log(raycaster.ray.direction.y * 180 /Math.PI)
    //console.log(raycaster.ray.direction.z * 180 /Math.PI)
    //console.log(raycaster.ray.direction)
    /*
    const canvas = document.getElementById("webglcanvas");



    var pointOfIntersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(planeDetector, pointOfIntersection);

    var velX = xCoor - pointOfIntersection.x
    var velY = yCoor - pointOfIntersection.y
    
    xCoor= pointOfIntersection.x
    yCoor= pointOfIntersection.y
*/
    //console.log(sable.getLinearVelocity())

    sable.setLinearVelocity( new Ammo.btVector3(0,0,0));
//  sable.setAngularVelocity( new Ammo.btVector3(-velY * 75.0,velX * 75.0,0) );
    //sable.applyTorque( cameraVector * 10)
    sable.setAngularVelocity( new Ammo.btVector3(velY/5  , velX/5,0));
    //sable.applyTorque(new Ammo.btVector3(velY,0,0))
    //sable.quaterniona.setFromEuler()
    
    velX = 0;
    velY = 0;
}

function animate() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;
    //console.log(cubes)
    //console.log(rigidBodies)
    /*
    for (let rig of rigidBodies){
        if (rig.position.z > 130){
            rigidBodies.remove(rig)
        }else{
            console.log(rig.position.z)
            rig.position.z += 0.3 * deltat;
            console.log(rig.position.z)

        }
    }
    */
    
    
    for (const cube of cubes.children) {
        if (cube.position.z > 130) {
            cubes.remove(cube);
            multiplier = 1;
            combo = 0;
            comboReference.innerHTML = combo + "X";
        } else {
            cube.position.z += 0.03 * deltat;
        }
    }

   /*
    for (const threeObject of rigidBodies.children){
        if (threeObject.position.z > 130){
            rigidBodies.remove(threeObject);
            //console.log(cubes.children.length);
        }else{
            threeObject.position.z += 0.03 * deltat;
        }
    }
    */

}

async function createCube(x,y, cutDirection) {
    /*
    let geometry = new THREE.BoxGeometry(2, 2, 2);

    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 30);
    cube.direction = cutDirection;
    cube.layers.enable(BLOOM_SCENE);


    const shape = new Ammo.btBoxShape( new Ammo.btVector3( 1, 1, 1 ) );
    shape.setMargin( margin );
    const quat = new THREE.Quaternion();
    quat.set( 0, 0, 0, 1 );


    createRigidBody( cube, shape, mass, cube.position, quat );

    cubes.add(cube);
    */


    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    pos.set( x, y, 30 );
    quat.set( 0, 0, 0, 1 );
    const towerMass = 1000;
    const towerHalfExtents = new THREE.Vector3( 1.5, 1.5, 1.5 );


    createObject( towerMass, towerHalfExtents, pos, quat, createMaterial(cutDirection) );
    console.log("crea cubito", cutDirection)



    /*let cubito = {obj:'../models/tree/cubito.obj'};

    const object = await new OBJLoader().loadAsync(cubito.obj, onProgress, onError);

    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            //child.material.map = texture;
            //child.material.normalMap = normalMap;
            //child.material.specularMap = specularMap;
            //console.log("Traverse")

        }
    });

    object.scale.set(.5,.5,.5);
    object.position.x = x;
    object.position.y = y;
    object.position.z = 30;

    object.name = "objCube";
    cubes.add(object);*/

}


function playAudio(){
    var audio = new Audio("../songs/Snow Halation.mp3");
    audio.play();
}

async function loadFloor(objModelUrl, objectList) {
    try {
        console.log("loading floor")
        const object = await new OBJLoader().loadAsync(objModelUrl.obj, onProgress, onError);
        //let texture = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.map) : null;
        //let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        ///let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log("object: ", object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.map = texture;
                //child.material.normalMap = normalMap;
                //child.material.specularMap = specularMap;
                child.material.color.setHex(0x0D508B)
                console.log("Traverse")

            }
        });
        object.scale.set(30, 7, 30);
        object.position.z = -100;
        object.position.x = 0;
        object.rotation.y = 0;
        //object.translateY(-20)
        object.translateY(-20)

        object.translateZ(40)

        object.name = "objObject";
        objectList.push(object);
        scene.add(object);
    }
    catch (err) {
        onError(err);
    }


}

async function loadObjMtl(objModelUrl, objectList, x, y, z) {
    try {
        const mtlLoader = new MTLLoader();

        const materials = await mtlLoader.loadAsync(objModelUrl.mtl, onProgress, onError);

        materials.preload();

        const objLoader = new OBJLoader();

        objLoader.setMaterials(materials);
        const object = await objLoader.loadAsync(objModelUrl.obj, onProgress, onError);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        object.position.x = x;
        object.rotation.y = y;
        object.position.z = z;
        object.scale.set(10, 10, 10);

        objectList.push(object);
        scene.add(object);
    }
    catch (err) {
        onError(err);
    }
}

function onError(err) { console.error(err); };
function onProgress(xhr) {

    if (xhr.lengthComputable) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log(xhr.target.responseURL, Math.round(percentComplete, 2) + '% downloaded');
    }
}

function onDocumentPointerMove(event) {

    //console.log("mousemove")
   
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    
    const movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
	const movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

    velX = lastPositionx - movementX
    velY = lastPositiony - movementY

    lastPositionx = mouse.x
    lastPositiony = mouse.y
    //updateLine()
}

function renderBloom(mask) {

    if (mask === true) {
        scene.traverse(darkenNonBloomed);
        bloomComposer.render();
        scene.traverse(restoreMaterial);

    } else {

        camera.layers.set(BLOOM_SCENE);
        bloomComposer.render();
        camera.layers.set(ENTIRE_SCENE);

    }

}

function darkenNonBloomed(obj) {

    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {

        materials[obj.uuid] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial(obj) {

    if (materials[obj.uuid]) {

        obj.material = materials[obj.uuid];
        delete materials[obj.uuid];

    }

}
function disposeMaterial(obj) {

    if (obj.material) {

        obj.material.dispose();

    }

}

function setupPhysicsWorld(){

    Ammo().then( function ( AmmoLib ) {

        Ammo = AmmoLib;
	// Physics configuration

    collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
    dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
    broadphase = new Ammo.btDbvtBroadphase();
    solver = new Ammo.btSequentialImpulseConstraintSolver();
    softBodySolver = new Ammo.btDefaultSoftBodySolver();
    physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
    physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
    physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
    tempBtVec3_1 = new Ammo.btVector3( 0, 0, 0 );

    transformAux1 = new Ammo.btTransform();

    } );


}
function createRigidBody( threeObject, physicsShape, mass, pos, quat, vel, angVel ) {

    threeObject.position.copy( pos );
    threeObject.quaternion.copy( quat );

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    const motionState = new Ammo.btDefaultMotionState( transform );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    const body = new Ammo.btRigidBody( rbInfo );

    threeObject.userData.physicsBody = body;

    scene.add( threeObject );

    if ( mass > 0 ) {

        rigidBodies.push( threeObject );

        // Disable deactivation
        body.setActivationState( 4 );
        body.setLinearVelocity( new Ammo.btVector3(0,0,30) );

    }
    if ( vel ) {

        body.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) );

    }

			if ( angVel ) {

				body.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );

			}

    threeObject.userData.physicsBody = body;
    threeObject.userData.collided = false;

    physicsWorld.addRigidBody( body );
    convexBreaker.prepareBreakableObject( threeObject, mass, new THREE.Vector3(), new THREE.Vector3(), true );
    createDebrisFromBreakableObject( threeObject );


}
function createRigidBodySable( threeObject, physicsShape, mass, pos, quat ) {

    threeObject.position.copy( pos );
    threeObject.quaternion.copy( quat );

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    const motionState = new Ammo.btDefaultMotionState( transform );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    sable = new Ammo.btRigidBody( rbInfo );

    threeObject.userData.physicsBody = sable;

    scene.add( threeObject );

    if ( mass > 0 ) {

        rigidBodies.push( threeObject );

        // Disable deactivation
        sable.setActivationState( 4 );

    }

    physicsWorld.addRigidBody( sable );

}

function createRigidBody2( object, physicsShape, mass, pos, quat, vel, angVel ) {

    if ( pos ) {

        object.position.copy( pos );

    } else {

        pos = object.position;

    }

    if ( quat ) {

        object.quaternion.copy( quat );

    } else {

        quat = object.quaternion;

    }

    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
    transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
    const motionState = new Ammo.btDefaultMotionState( transform );

    const localInertia = new Ammo.btVector3( 0, 0, 0 );
    physicsShape.calculateLocalInertia( mass, localInertia );

    const rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
    const body = new Ammo.btRigidBody( rbInfo );

    body.setFriction( 0.5 );

    if ( vel ) {

        body.setLinearVelocity( new Ammo.btVector3( vel.x, vel.y, vel.z ) );

    }

    if ( angVel ) {

        body.setAngularVelocity( new Ammo.btVector3( angVel.x, angVel.y, angVel.z ) );

    }

    object.userData.physicsBody = body;
    object.userData.collided = false;
    object.layers.enable(BLOOM_SCENE)
    scene.add( object );

    if ( mass > 0 ) {

        rigidBodies.push( object );

        // Disable deactivation
        body.setActivationState( 4 );

    }
    body.setLinearVelocity( new Ammo.btVector3(0,0,30) );

    physicsWorld.addRigidBody( body );

    return body;

}

function createRandomColor() {

    return Math.floor( Math.random() * ( 1 << 24 ) );

}

function createMaterial(cutDirection) {

    switch (cutDirection) {
        case 0:
            //green
            return new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(0, 255, 0)") } );
        case 1:
            //yellow
            return new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(255, 255, 0)") } );
        case 2:
            //purple
            return new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(128,0, 128)") } );
        case 3:
            //orange
            return new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(255, 69, 0)") } );
    }


}


function updatePhysics( deltaTime ) {
    /*
    // Hinge control
    hinge.enableAngularMotor( true, 1.5 * armMovement, 50 );

    // Step world

    // Update rope
    const softBody = rope.userData.physicsBody;
    const ropePositions = rope.geometry.attributes.position.array;
    const numVerts = ropePositions.length / 3;
    const nodes = softBody.get_m_nodes();
    let indexFloat = 0;

    for ( let i = 0; i < numVerts; i ++ ) {

        const node = nodes.at( i );
        const nodePos = node.get_m_x();
        ropePositions[ indexFloat ++ ] = nodePos.x();
        ropePositions[ indexFloat ++ ] = nodePos.y();
        ropePositions[ indexFloat ++ ] = nodePos.z();

    }

    rope.geometry.attributes.position.needsUpdate = true;
    */
    // Update rigid bodies
    physicsWorld.stepSimulation( deltaTime, 10 );

    for ( let i = 0, il = rigidBodies.length; i < il; i ++ ) {

        const objThree = rigidBodies[ i ];
        const objPhys = objThree.userData.physicsBody;
        const ms = objPhys.getMotionState();
        if ( ms ) {
            //console.log(objThree)
            ms.getWorldTransform( transformAux1 );
            const p = transformAux1.getOrigin();
            const q = transformAux1.getRotation();
            objThree.position.set( p.x(), p.y(), p.z());
            objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
            objThree.userData.collided = false;
            //console.log(objThree.userData.collided)
        }
    }
    //console.log(dispatcher.getNumManifolds())
    for ( let i = 0, il = dispatcher.getNumManifolds(); i < il; i ++ ) {

        const contactManifold = dispatcher.getManifoldByIndexInternal( i );
        const rb0 = Ammo.castObject( contactManifold.getBody0(), Ammo.btRigidBody );
        const rb1 = Ammo.castObject( contactManifold.getBody1(), Ammo.btRigidBody );

        const threeObject0 = Ammo.castObject( rb0.getUserPointer(), Ammo.btVector3 ).threeObject;
        const threeObject1 = Ammo.castObject( rb1.getUserPointer(), Ammo.btVector3 ).threeObject;

        if ( ! threeObject0 && ! threeObject1 ) {
            //console.log("continue")
            continue;

        }const userData0 = threeObject0 ? threeObject0.userData : null;
        const userData1 = threeObject1 ? threeObject1.userData : null;

        const breakable0 = userData0 ? userData0.breakable : false;
        const breakable1 = userData1 ? userData1.breakable : false;

        const collided0 = userData0 ? userData0.collided : false;
        const collided1 = userData1 ? userData1.collided : false;

        if ( ( ! breakable0 && ! breakable1 ) || ( collided0 && collided1 ) ) {
            //console.log("continue")
            continue;

        }

        let contact = false;
        let maxImpulse = 0;
        
        for ( let j = 0, jl = contactManifold.getNumContacts(); j < jl; j ++ ) {

            const contactPoint = contactManifold.getContactPoint( j );

            if ( contactPoint.getDistance() < 0 ) {

                contact = true;
                const impulse = contactPoint.getAppliedImpulse();

                if ( impulse > maxImpulse ) {

                    maxImpulse = impulse;
                    const pos = contactPoint.get_m_positionWorldOnB();
                    const normal = contactPoint.get_m_normalWorldOnB();
                    impactPoint.set( pos.x(), pos.y(), pos.z() );
                    impactNormal.set( normal.x(), normal.y(), normal.z() );

                }

                break;

            }

        }

        // If no point has contact, abort
        if ( ! contact ) continue;

        // Subdivision

        const fractureImpulse = 250;

        if ( breakable0 && ! collided0 && maxImpulse > fractureImpulse ) {

            const debris = convexBreaker.subdivideByImpact( threeObject0, impactPoint, impactNormal, 1, 2, 1.5 );
            const numObjects = debris.length;
            
          
            for ( let j = 0; j < numObjects; j ++ ) {

                const vel = rb0.getLinearVelocity();
                const angVel = rb0.getAngularVelocity();
                const fragment = debris[ j ];
                fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
                fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );
               
                createDebrisFromBreakableObjectDebris( fragment );

            }

            objectsToRemove[ numObjectsToRemove ++ ] = threeObject0;
           
            userData0.collided = true;

        }

        if ( breakable1 && ! collided1 && maxImpulse > fractureImpulse ) {

            const debris = convexBreaker.subdivideByImpact( threeObject1, impactPoint, impactNormal, 1, 2, 1.5 );
            const numObjects = debris.length;
           
            for ( let j = 0; j < numObjects; j ++ ) {

                const vel = rb1.getLinearVelocity();
                const angVel = rb1.getAngularVelocity();
                const fragment = debris[ j ];
                fragment.userData.velocity.set( vel.x(), vel.y(), vel.z() );
                fragment.userData.angularVelocity.set( angVel.x(), angVel.y(), angVel.z() );
               
                createDebrisFromBreakableObjectDebris( fragment );

            }

            objectsToRemove[ numObjectsToRemove ++ ] = threeObject1;
           
            userData1.collided = true;

        }

    }

    for ( let i = 0; i < numObjectsToRemove; i ++ ) {
        
        removeDebris( objectsToRemove[ i ] );

    }

    numObjectsToRemove = 0;

}
function createObject( mass, halfExtents, pos, quat, material ) {
    let object = new THREE.Mesh( new THREE.BoxGeometry( halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2 ), material );
    object.position.copy( pos );
    object.quaternion.copy( quat );
    convexBreaker.prepareBreakableObject( object, mass, new THREE.Vector3(), new THREE.Vector3(), true );
    createDebrisFromBreakableObject( object );


}


function createDebrisFromBreakableObject( object ) {
    //object.material = material;
    object.castShadow = true;
    object.receiveShadow = true;
    const shape = createConvexHullPhysicsShape( object.geometry.attributes.position.array );
    shape.setMargin( margin );
    const body = createRigidBody2( object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity );
    // Set pointer back to the three object only in the debris objects
    const btVecUserData = new Ammo.btVector3( 0, 0, 0 );
    btVecUserData.threeObject = object;
    body.setUserPointer( btVecUserData );

}

function createDebrisFromBreakableObjectDebris( object ) {
    score++
    scoreReference.innerHTML = score
    const color2 = new THREE.Color( 1, 0, 0 );
   // material = new THREE.MeshPhongMaterial( {#} );

    const green =  new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(0, 255, 0)")});
    const yellow = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(255 , 255 , 0)")});
    const purple = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(128 , 0 , 128)")});
    const orange = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(255 , 69 , 0)")});

    const red = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(255 , 0 , 0)")});
    const blue = new THREE.MeshPhongMaterial( {color: new THREE.Color("rgb(0 , 0 , 255)")});


    let direction;
    
    let absX = Math.abs(velX)
    let absY = Math.abs(velY)
    

    if (absX > absY){
        if (velX > 0) {
            direction = "right"
        }else{
            direction = "left"
        }
    }else{
        if (velY > 0){
            direction = "up"
        }else{
            direction = "down"
        }
    }
    //console.log(direction, velX, velY)
    //console.log(object.material.color)
    let r = object.material.color.r;
    let g = object.material.color.g;
    let b = object.material.color.b
    switch (direction){
        case "right":
           
            //console.log("rgb")
            //console.log(r,g,b)   
            //console.log(green.color.r, green.color.g, green.color.b)
            //console.log(object.material.color)
            if (r == green.color.r && g == green.color.g && b == green.color.b){
                console.log("PRIMERO", direction)
                combo++
                comboReference.innerHTML = combo
                object.material.color.setHex(0x0000FF);
            } 
            
        case "left":
            //console.log("rgb")
            //console.log(r,g,b)   
            //console.log(green.color.r, green.color.g, green.color.b)
            //console.log(object.material.color)
            if (r == yellow.color.r && g == yellow.color.g && b == yellow.color.b){
                console.log("PRIMERO", direction)
                combo++
                comboReference.innerHTML = combo
                object.material.color.setHex(0x0000FF);
            }
        
        case "up":
            if (r == purple.color.r && g == purple.color.g && b == purple.color.b){
                console.log("PRIMERO", direction)
                combo++
                comboReference.innerHTML = combo
                object.material.color.setHex(0x0000FF);
            }
        case "down":
            if (r == orange.color.r && g == orange.color.g && b == orange.color.b){
                console.log("PRIMERO", direction)
                combo++
                comboReference.innerHTML = combo
                object.material.color.setHex(0x0000FF);
            }


    }

    



    object.castShadow = true;
    object.receiveShadow = true;
    const shape = createConvexHullPhysicsShape( object.geometry.attributes.position.array );
    shape.setMargin( margin );
    const body = createRigidBody2( object, shape, object.userData.mass, null, null, object.userData.velocity, object.userData.angularVelocity );
    // Set pointer back to the three object only in the debris objects
    const btVecUserData = new Ammo.btVector3( 0, 0, 0 );
    btVecUserData.threeObject = object;
    body.setUserPointer( btVecUserData );

}


function removeDebris( object ) {

    scene.remove( object );

    physicsWorld.removeRigidBody( object.userData.physicsBody );

}

function createConvexHullPhysicsShape( coords ) {

    const shape = new Ammo.btConvexHullShape();

    for ( let i = 0, il = coords.length; i < il; i += 3 ) {

        tempBtVec3_1.setValue( coords[ i ], coords[ i + 1 ], coords[ i + 2 ] );
        const lastOne = ( i >= ( il - 3 ) );
        shape.addPoint( tempBtVec3_1, lastOne );

    }

    return shape;

}






function resize()
{
    const canvas = document.getElementById("webglcanvas");

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    camera.aspect = canvas.width / canvas.height;

    camera.updateProjectionMatrix();
    renderer.setSize(canvas.width, canvas.height);
}

window.onload = () => {
    main()
    resize();
};

window.addEventListener('resize', resize, false);

