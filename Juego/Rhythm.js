import * as THREE from '../libs/three.js/r125/three.module.js'
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

import {createEnvironment} from '../juego/createMap.js';

//import { EffectComposer } from './jsm/postprocessing/EffectComposer.js';
//import { RenderPass } from './jsm/postprocessing/RenderPass.js';
//import { ShaderPass } from './jsm/postprocessing/ShaderPass.js';
//import { UnrealBloomPass } from './jsm/postprocessing/UnrealBloomPass.js';

///https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/UnrealBloomPass.js


let renderer = null, scene = null, camera = null, root = null, group = null, water = null, cubes = null, material = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let lastPosition = null;

let startTime = Date.now();
let lastTimeout = 0;

let noteIndex = 0;
let noteFlag = true;

let currentTime = Date.now();
let spotLight = null, ambientLight = null;
let objectList = []

//Change this to our floor
let mapUrl = "../images/spruce.png";
let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

//let modelUrls = ["../models/gltf/Horse.glb", "../models/gltf/Parrot.glb", "../models/gltf/Stork.glb", "../models/gltf/Flamingo.glb"];

var song = {
    events: [],
    notes: [{ "_time": 3.9270829999999997, "_lineIndex": 2, "_lineLayer": 2, "_type": 1, "_cutDirection": 0 },
    { "_time": 5.927083, "_lineIndex": 3, "_lineLayer": 1, "_type": 1, "_cutDirection": 3 },
    { "_time": 7.927083, "_lineIndex": 2, "_lineLayer": 0, "_type": 0, "_cutDirection": 0 },
    { "_time": 9.927083, "_lineIndex": 0, "_lineLayer": 1, "_type": 0, "_cutDirection": 3 },
    { "_time": 11.927083, "_lineIndex": 0, "_lineLayer": 0, "_type": 0, "_cutDirection": 6 }],
    obstacles: [{ "_time": 19.921875, "_duration": 6, "_type": 0, "_lineIndex": 0, "_width": 1 }, { "_time": 27.921875, "_duration": 4, "_type": 0, "_lineIndex": 3, "_width": 1 }, { "_time": 35.921875, "_duration": 2, "_type": 1, "_lineIndex": 0, "_width": 4 }, { "_time": 67.921875, "_duration": 0.25, "_type": 1, "_lineIndex": 0, "_width": 4 }]
}

function main() 
{
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);
    
    update();
}


function update() 
{
    requestAnimationFrame(function() { update(); });

    followRythm();
    
    renderer.render( scene, camera );

    animate();
}


function followRythm(){
    
    if (noteFlag && noteIndex < song.notes.length){
        let momentTime = Date.now()
        let nextNote = song.notes[noteIndex]._time*1000;
        let timeout = (startTime + nextNote - momentTime - lastTimeout);
        noteFlag = false;
        setTimeout(() => {
            let line = song.notes[noteIndex]._lineIndex;
            let column = song.notes[noteIndex]._lineLayer;
            let lineNumb = 0;
            let columnNumb = 0;

            switch(line){
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

            switch(column){
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
            
            createCube(lineNumb, columnNumb);
            console.log('Timeout: '+ timeout);
            noteFlag = true;
            noteIndex++;
            
        }, timeout);
    }   
}


function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true, alpha: true } );

    

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, .5, 4000 );
    camera.position.set(0, 10, 110);
    scene.add(camera);


    root = new THREE.Object3D;

    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 20, -10);
    spotLight.target.position.set(0, -200, -20);
    root.add(spotLight);

    
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;

    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0xffffff, .5);
    root.add(ambientLight);
    
    //loadGLTF();

    group = new THREE.Object3D;
    root.add(group);

    cubes = new THREE.Object3D;
    root.add(cubes);

    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

   
    /*
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;
    
    group.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;
    */
    let floorOBJ = {obj:'../models/floor/pisoLowPol.obj'};
    //loadFloor(floorOBJ, objectList);
    let tree1 = {obj:'../models/tree/individualTrees/_1_tree.obj', map: '../models/tree/individualTrees/_1_tree.png'};
   
    //loadTree1(tree1,objectList, -30,0,-100, tree1);
    /*
   
*/
    let texture = new THREE.TextureLoader().load('../images/companionCube.png');
    material = new THREE.MeshPhongMaterial({ map: texture });
    
    createEnvironment(objectList,scene)

    raycaster = new THREE.Raycaster();

    document.addEventListener('pointermove', onDocumentPointerMove);

    
    scene.add( root );

}

function animate(){
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

    for (const cube of cubes.children){
        if (cube.position.z > 130){
            cubes.remove(cube);
            console.log(cubes.children.length);
        }else{
            cube.position.z += 0.03 * deltat;
        }
    }
}

async function createCube(x,y) {
    let geometry = new THREE.BoxGeometry(2, 2, 2);
    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 30)
    //cubes.add(cube);
    

    let cubito = {obj:'../models/tree/cubito.obj'};

    //var loader = new OBJLoader();
    const object = await new OBJLoader().loadAsync(cubito.obj, onProgress, onError);

    //console.log("object: ", object);

    //cube2.position.set(0,0,0)
    //scene.add(cube2)
    //cubes.add(cube2)
    object.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            //child.material.map = texture;
            //child.material.normalMap = normalMap;
            //child.material.specularMap = specularMap;
            child.material.color.setHex(0x0D508B)
            //console.log("Traverse")

        }
    });

    object.scale.set(.5,.5,.5);
    object.position.x = x;
    object.position.y = y;
    object.position.z = 30;
   
    object.name = "objCube";
    cubes.add(object);
    //objectList.push(object);
    //scene.add(object);
   
}

async function loadFloor(objModelUrl, objectList)
{
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
        object.scale.set(30,7, 30);
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

async function loadObjMtl(objModelUrl, objectList,x,y,z)
{
    try
    {
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
        object.scale.set(10,10, 10);

        objectList.push(object);
        scene.add(object);
    }
    catch (err){
        onError(err);
    }
}

function onError ( err ){ console.error( err ); };
function onProgress( xhr ) {

    if ( xhr.lengthComputable ) {

        const percentComplete = xhr.loaded / xhr.total * 100;
        console.log( xhr.target.responseURL, Math.round( percentComplete, 2 ) + '% downloaded' );
    }
}

function onDocumentPointerMove( event ) 
{
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    if ( intersects.length > 0 ) 
    {
        if ( intersected != intersects[ 0 ].object ) 
        {
            if ( intersected )
                intersected.material.emissive.set( intersected.currentHex );

            intersected = intersects[ 0 ].object;
            intersected.currentHex = intersected.material.emissive.getHex();
            intersected.material.emissive.set( 0xff0000 );
        }
    } 
    else 
    {
        if ( intersected ) 
            intersected.material.emissive.set( intersected.currentHex );

        intersected = null;
    }
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