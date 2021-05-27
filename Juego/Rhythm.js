//import * as THREE from '../libs/three.js/r125/three.module.js'
import * as THREE from '../three.js/build/three.module.js';

//import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { OBJLoader } from '../three.js/examples/jsm/loaders/OBJLoader.js';

//import { MTLLoader } from '../libs/three.js/r125/loaders/MTLLoader.js';

import { createEnvironment } from './createMap.js';

import { EffectComposer } from '../three.js/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '../three.js/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from '../three.js/examples/jsm/postprocessing/GlitchPass.js';
import { ShaderPass } from '../three.js/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from '../three.js/examples/jsm/postprocessing/UnrealBloomPass.js'



///https://github.com/mrdoob/three.js/blob/master/examples/jsm/postprocessing/UnrealBloomPass.js


let renderer = null, scene = null, camera = null, root = null, group = null, water = null, cubes = null, material = null;

let raycaster = null, mouse = new THREE.Vector2(), intersected, clicked;

let lastPositionx = 0;
let lastPositiony = 0;

let startTime = Date.now();
let lastTimeout = 0;

let noteIndex = 0;
let noteFlag = true;

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

const params = {
    exposure: 3,
    bloomStrength: .5,
    bloomThreshold: 0,
    bloomRadius: 1,
    scene: "Scene with Glow"
};




var song = {
    events: [],
    notes: [{ "_time": 3.9270829999999997, "_lineIndex": 2, "_lineLayer": 2, "_type": 1, "_cutDirection": 0 },
    { "_time": 5.927083, "_lineIndex": 3, "_lineLayer": 1, "_type": 1, "_cutDirection": 3 },
    { "_time": 7.927083, "_lineIndex": 2, "_lineLayer": 0, "_type": 0, "_cutDirection": 0 },
    { "_time": 9.927083, "_lineIndex": 0, "_lineLayer": 1, "_type": 0, "_cutDirection": 3 },
    { "_time": 11.927083, "_lineIndex": 0, "_lineLayer": 0, "_type": 0, "_cutDirection": 1 }],
    obstacles: [{ "_time": 19.921875, "_duration": 6, "_type": 0, "_lineIndex": 0, "_width": 1 }, { "_time": 27.921875, "_duration": 4, "_type": 0, "_lineIndex": 3, "_width": 1 }, { "_time": 35.921875, "_duration": 2, "_type": 1, "_lineIndex": 0, "_width": 4 }, { "_time": 67.921875, "_duration": 0.25, "_type": 1, "_lineIndex": 0, "_width": 4 }]
}

function main() {
    const canvas = document.getElementById("webglcanvas");

    createScene(canvas);

    //playAudio();

    update();
}


function update() {
    requestAnimationFrame(function () { update(); });

    followRythm();
    animate();

    //renderer.render( scene, camera );
    renderBloom(true);

    // render the entire scene, then render bloom scene on top
    finalComposer.render();
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
            let cutDirection = song.notes[noteIndex]._cutDirection;
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

    document.addEventListener('pointermove', onDocumentPointerMove);
    scoreReference = document.getElementById("scorePoints");
    comboReference = document.getElementById("streakPoints");


    scene.add(root);

}

function animate() {
    const now = Date.now();
    const deltat = now - currentTime;
    currentTime = now;

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
}


async function createCube(x, y, cutDirection) {

    let geometry = new THREE.BoxGeometry(2, 2, 2);

    let cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, 30);
    cube.direction = cutDirection;
    cube.layers.enable(BLOOM_SCENE);

    cubes.add(cube);

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
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(cubes.children, true);

    let positionX = null;
    let positionY = null

    if (mouse.x <= lastPositionx) {
        positionX = 0;
    } else {
        positionX = 1;
    }

    if (mouse.y <= lastPositiony) {
        positionY = 2;
    } else {
        positionY = 3;
    }

    if (intersects.length > 0) {
        console.log(intersects.length);
        if (intersected != intersects[0].object) {
            if (intersected)
                console.log("Circumscision");

            intersected = intersects[0].object;
            console.log(intersected);
            if (intersected.direction < 2) {
                if (intersected.direction == positionX) {
                    console.log("Good job");
                    combo ++;
                    if (comboThreshold.includes(combo)){
                        multiplier *= 2;
                    }
                    score += 1 * multiplier;
                    comboReference.innerHTML = combo + "X";
                    scoreReference.innerHTML = score;
                } else {
                    console.log("Wrong direction");
                    multiplier = 1;
                    combo = 0;
                    comboReference.innerHTML = combo + "X";
                }
            } else {
                if (intersected.direction == positionY) {
                    console.log("Good job");
                    combo ++;
                    if (comboThreshold.includes(combo)){
                        multiplier *= 2;
                    }
                    score += 1 * multiplier;
                    comboReference.innerHTML = combo + "X";
                    scoreReference.innerHTML = score;
                } else {
                    console.log("Wrong direction");
                    multiplier = 1;
                    combo = 0;
                    comboReference.innerHTML = combo + "X";
                }
            }
            cubes.remove(intersected);
        }
    }
    else {
        if (intersected)
            //intersected.material.emissive.set( intersected.currentHex );
            console.log("Entre");

        intersected = null;
    }

    lastPositionx = mouse.x;
    lastPositiony = mouse.y;
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

function resize() {
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