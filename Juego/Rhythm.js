import * as THREE from '../libs/three.js/r125/three.module.js'
//import { GLTFLoader } from '../libs/three.js/loaders/GLTFLoader.js'
//import { OrbitControls } from '../libs/three.js/controls/OrbitControls.js';

let renderer = null, scene = null, camera = null, root = null, group = null;

let objects = [];
let currentTime = Date.now();
let spotLight = null, ambientLight = null;

//Change this to our floor
let mapUrl = "../images/spruce.png";

let SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

//let modelUrls = ["../models/gltf/Horse.glb", "../models/gltf/Parrot.glb", "../models/gltf/Stork.glb", "../models/gltf/Flamingo.glb"];

var song = {
    events:[],
    notes:[{"_time":3.9270829999999997,"_lineIndex":2,"_lineLayer":2,"_type":1,"_cutDirection":0},
    {"_time":5.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":3},
    {"_time":7.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":9.927083,"_lineIndex":0,"_lineLayer":1,"_type":0,"_cutDirection":3},
    {"_time":9.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":2},
    {"_time":11.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":6},
    {"_time":13.927083,"_lineIndex":1,"_lineLayer":1,"_type":0,"_cutDirection":8},
    {"_time":13.927083,"_lineIndex":2,"_lineLayer":2,"_type":1,"_cutDirection":0},
    {"_time":15.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":17.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":18.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":19.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":3},
    {"_time":19.927083,"_lineIndex":3,"_lineLayer":2,"_type":3,"_cutDirection":8},
    {"_time":21.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":23.927083,"_lineIndex":1,"_lineLayer":1,"_type":1,"_cutDirection":2},
    {"_time":24.098958,"_lineIndex":1,"_lineLayer":2,"_type":3,"_cutDirection":8},
    {"_time":25.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":27.927083,"_lineIndex":0,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":27.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":27.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":29.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":31.927083,"_lineIndex":0,"_lineLayer":1,"_type":1,"_cutDirection":2},
    {"_time":31.927083,"_lineIndex":0,"_lineLayer":2,"_type":3,"_cutDirection":8},
    {"_time":37.927082999999996,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":39.927082999999996,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":2},
    {"_time":41.927082999999996,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":5},
    {"_time":43.927082999999996,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":45.927082999999996,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":47.927082999999996,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":49.927082999999996,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":50.927082999999996,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":51.927082999999996,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":53.927082999999996,"_lineIndex":0,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":53.927082999999996,"_lineIndex":0,"_lineLayer":1,"_type":0,"_cutDirection":2},
    {"_time":55.927082999999996,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":57.927082999999996,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":3},
    {"_time":57.927082999999996,"_lineIndex":2,"_lineLayer":1,"_type":3,"_cutDirection":8},
    {"_time":59.927082999999996,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":61.927082999999996,"_lineIndex":0,"_lineLayer":2,"_type":3,"_cutDirection":8},
    {"_time":61.927082999999996,"_lineIndex":1,"_lineLayer":2,"_type":0,"_cutDirection":0},
    {"_time":62.927082999999996,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":63.927082999999996,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":64.927083,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":65.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":66.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":67.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":67.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":69.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":69.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":71.927083,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":71.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":73.927083,"_lineIndex":0,"_lineLayer":1,"_type":0,"_cutDirection":4},
    {"_time":73.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":5},
    {"_time":75.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":76.927083,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":77.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":78.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":79.927083,"_lineIndex":2,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":80.927083,"_lineIndex":3,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":81.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":83.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":84.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":85.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":86.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":87.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":88.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":89.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":90.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":91.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":3},
    {"_time":93.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":94.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":95.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":99.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":101.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":7},
    {"_time":102.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":103.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":105.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":107.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":107.927083,"_lineIndex":1,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":107.927083,"_lineIndex":2,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":109.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":7},
    {"_time":110.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":111.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":111.927083,"_lineIndex":1,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":111.927083,"_lineIndex":2,"_lineLayer":0,"_type":3,"_cutDirection":8},
    {"_time":113.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":115.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":116.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":117.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":118.927083,"_lineIndex":3,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":119.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":120.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":0},
    {"_time":121.927083,"_lineIndex":0,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":122.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":123.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":1},
    {"_time":125.927083,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":3},
    {"_time":126.927083,"_lineIndex":1,"_lineLayer":0,"_type":0,"_cutDirection":0},
    {"_time":127.927083,"_lineIndex":2,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":128.92708299999998,"_lineIndex":2,"_lineLayer":2,"_type":1,"_cutDirection":8},
    {"_time":129.92708299999998,"_lineIndex":1,"_lineLayer":0,"_type":1,"_cutDirection":1},
    {"_time":130.92708299999998,"_lineIndex":1,"_lineLayer":2,"_type":1,"_cutDirection":8},
    {"_time":131.92708299999998,"_lineIndex":0,"_lineLayer":1,"_type":0,"_cutDirection":2},
    {"_time":131.92708299999998,"_lineIndex":3,"_lineLayer":1,"_type":1,"_cutDirection":3}],
    obstacles:[{"_time":19.921875,"_duration":6,"_type":0,"_lineIndex":0,"_width":1},{"_time":27.921875,"_duration":4,"_type":0,"_lineIndex":3,"_width":1},{"_time":35.921875,"_duration":2,"_type":1,"_lineIndex":0,"_width":4},{"_time":67.921875,"_duration":0.25,"_type":1,"_lineIndex":0,"_width":4}]
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
    
    renderer.render( scene, camera );
}

function createScene(canvas) 
{    
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    renderer.setSize(canvas.width, canvas.height);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(0, 11, 110);
    scene.add(camera);

        
    root = new THREE.Object3D;
    
    spotLight = new THREE.SpotLight (0xffffff);
    spotLight.position.set(0, 20, -10);
    spotLight.target.position.set(0, 0, -2);
    root.add(spotLight);

    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 1;
    spotLight.shadow.camera.far = 200;
    spotLight.shadow.camera.fov = 45;
    
    spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    ambientLight = new THREE.AmbientLight ( 0x888888 );
    root.add(ambientLight);
    
    //loadGLTF();

    group = new THREE.Object3D;
    root.add(group);

    const map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    const planeGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    const floor = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial({map:map, side:THREE.DoubleSide}));

    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -4.02;
    
    group.add( floor );
    floor.castShadow = false;
    floor.receiveShadow = true;
    
    scene.add( root );

    createCube();
    console.log(song.notes[0]._time);
    console.log(currentTime);
}


function createCube(){
    let texture = new THREE.TextureLoader().load('../images/companionCube.png');
    let material = new THREE.MeshPhongMaterial({ map: texture });
    let geometry = new THREE.BoxGeometry(4, 4, 4);
    let cube1 = new THREE.Mesh(geometry, material);
    cube1.position.set(0,10,70)
    group.add(cube1);
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