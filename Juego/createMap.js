import * as THREE from '../libs/three.js/r125/three.module.js'
import { OBJLoader } from '../libs/three.js/r125/loaders/OBJLoader.js';
import { Reflector } from '../helperObjects/Reflector.js';

export function createEnvironment(objectList,scene){
    console.log("Creating environment")
    let tree1 = {obj:'../models/tree/individualTrees/_1_tree.obj', map: '../models/tree/individualTrees/_1_tree.png'};
     //let tree2 = {obj:'../models/tree/individualTrees/_2_tree.obj', map: '../models/tree/individualTrees/_2_tree.png'};
     let tree3 = {obj:'../models/tree/individualTrees/_3_tree.obj', map: '../models/tree/individualTrees/_3_tree.png'};
     let tree4 = {obj:'../models/tree/individualTrees/_4_tree.obj', map: '../models/tree/individualTrees/_4_tree.png'};
     let tree5 = {obj:'../models/tree/individualTrees/_5_tree.obj', map: '../models/tree/individualTrees/_5_tree.png'};
     let tree6 = {obj:'../models/tree/individualTrees/_6_tree.obj', map: '../models/tree/individualTrees/_6_tree.png'};
     let tree7 = {obj:'../models/tree/individualTrees/_7_tree.obj', map: '../models/tree/individualTrees/_7_tree.png'};
     let tree8 = {obj:'../models/tree/individualTrees/_8_tree.obj', map: '../models/tree/individualTrees/_8_tree.png'};
     let tree9 = {obj:'../models/tree/individualTrees/_9_tree.obj', map: '../models/tree/individualTrees/_9_tree.png'};
     let tree10 = {obj:'../models/tree/individualTrees/_10_tree.obj', map: '../models/tree/individualTrees/_10_tree.png'};
     let tree11 = {obj:'../models/tree/individualTrees/_11_tree.obj', map: '../models/tree/individualTrees/_11_tree.png'};
     let tree12 = {obj:'../models/tree/individualTrees/_12_tree.obj', map: '../models/tree/individualTrees/_12_tree.png'};
     let rock = {obj:'../models/tree/individualTrees/_13_rock.obj', map: '../models/tree/individualTrees/Rock_1_.png'};
     
     let rockWinter = {obj:'../models/iceTexture/rocks/Rock.obj', 
     map:'../models/iceTexture/rocks/Rock_Winter.png', occlusion:'../models/iceTexture/rocks/Rock_Occlusion.png'}

     let rockWinter1 = {obj:'../models/iceTexture/rocks/Rocks_1.obj', 
     map:'../models/iceTexture/rocks/Rocks_1_Winter.png', occlusion:'../models/iceTexture/rocks/Rocks_1_Occlusion.png'}

     let rockWinter2 = {obj:'../models/iceTexture/rocks/Rocks_2.obj', 
     map:'../models/iceTexture/rocks/Rocks_2_Winter.png', occlusion:'../models/iceTexture/rocks/Rocks_1_Occlusion.png'}

     let rockWinter3 = {obj:'../models/iceTexture/rocks/Rocks_3.obj', 
     map:'../models/iceTexture/rocks/Rocks_3_Winter.png', occlusion:'../models/iceTexture/rocks/Rocks_3_Occlusion.png'}

     let Stone = {obj:'../models/iceTexture/rocks/Stone.obj', 
     map:'../models/iceTexture/rocks/Stone_Winter.png', occlusion:'../models/iceTexture/rocks/Stone_Occlusion.png'}
    
     let Stone1 = {obj:'../models/iceTexture/rocks/Stones_1.obj', 
     map:'../models/iceTexture/rocks/Stones_1_Winter.png', occlusion:'../models/iceTexture/rocks/Stones_1_Occlusion.png'}
    
     let Stone2 = {obj:'../models/iceTexture/rocks/Stones_2.obj', 
     map:'../models/iceTexture/rocks/Stones_2_Winter.png', occlusion:'../models/iceTexture/rocks/Stones_2_Occlusion.png'}
    
     let wood = {obj: '../models/iceTexture/wood/EnvBranch_1.obj'}
     let wood2 = {obj: '../models/iceTexture/wood/EnvBranch_2.obj'}
     let wood3 = {obj: '../models/iceTexture/wood/EnvBranch_3.obj'}

    //loadRock(objectList, scene,-15,0,70, rock);
    
   
    /*
    loadTree1(objectList, scene,15,0,-100, tree3);
    loadTree1(objectList, scene,20,21,-100, tree4);
    loadTree1(objectList, scene,-50,20,-100, tree5);
    loadTree1(objectList, scene,50,50,-100, tree6);
    loadTree1(objectList, scene,-40,50,-100, tree7);
    loadTree1(objectList, scene,-20,50,-100, tree8);
    loadTree1(objectList, scene,60,-50,-100, tree9);
    loadTree1(objectList, scene,15,50,-100, tree10);
    loadTree1(objectList, scene,-60,30,-100, tree11);
    loadTree1(objectList, scene,70,35,-100, tree12);
    */

    //loadTree1(objectList, scene,-20,0,80, tree1);
    //ARBOLES IZQUIERDA
    loadTree1(objectList,scene, -25,.7,90,tree1);
    loadTree1(objectList,scene, -25,1,80,tree8);
    loadTree1(objectList,scene, -25,1.3,70,tree9);
    loadTree1(objectList,scene, -25,1,60,tree9);
    loadTree1(objectList,scene, -22,1.6,40,tree8);
    loadTree1(objectList,scene, -30,1,60,tree9);
    loadTree1(objectList,scene, -40,1,69,tree9);


    //ARBOLES DERECHA
    loadTree1(objectList,scene, 22,.6,90,tree1);
    loadTree1(objectList,scene, 23,1,80,tree8);
    loadTree1(objectList,scene, 29,1,70,tree9);
    loadTree1(objectList,scene, 27,1,60,tree9);
    loadTree1(objectList,scene, 19,1,40,tree8);
    loadTree1(objectList,scene, 32,1.5,60,tree9);
    loadTree1(objectList,scene, 42,.5,65,tree8);



    //rocas izquierda
    loadRock(objectList, scene,-19,1,80, rockWinter);
    loadRock(objectList, scene,-22,2,90, rockWinter2);
    loadRock(objectList, scene,-25,2,60, rockWinter3);
    loadRock(objectList, scene,-20,2,70, rockWinter2);
    loadRock(objectList, scene,-20,2,50, rockWinter3);
    loadRock(objectList, scene,-14,1,40, rockWinter);
    loadRock(objectList, scene,-19,1,30, rockWinter3);
    loadRock(objectList, scene,-23,1,20, rockWinter);
    loadRock(objectList, scene,-20,1,15, rockWinter2);
    loadRock(objectList, scene,-22,1,5, rockWinter3);
    loadRock(objectList, scene,-21,1,0, rockWinter);


    ///fondo
    loadRock(objectList, scene,0,1,-20, rockWinter);
    loadRock(objectList, scene,10,1,-20, rockWinter2);
    loadRock(objectList, scene,-10,1,-20, rockWinter1);
    loadRock(objectList, scene,0,1,-20, rockWinter);



    //piedritas chiquitas izquierda
    loadRock(objectList, scene,-10, 1,90, Stone2);
    loadRock(objectList, scene,-10,1,80, Stone);
    loadRock(objectList, scene,-10, 1,70, Stone2);
    loadRock(objectList, scene,-10, 1,65, Stone1);
    loadRock(objectList, scene,-10, 1,60, Stone);
    loadRock(objectList, scene,-10, 1,50, Stone2);
    loadRock(objectList, scene,-6, 1,50, Stone2);
    loadRock(objectList, scene,-10, 1,40, Stone1);
    loadRock(objectList, scene,-10, 1,30, Stone1);
    loadRock(objectList, scene,-10, 1,25, Stone);
    loadRock(objectList, scene,-10, 1,20, Stone2);
    loadRock(objectList, scene,-10, 1,10, Stone1);
    
    ///piedritas chiquitas derecha
    loadRock(objectList, scene,10,1,90, Stone1);
    loadRock(objectList, scene,10,1,80, Stone2);
    loadRock(objectList, scene,10, 1,75, Stone);
    loadRock(objectList, scene,10, 1,70, Stone);
    loadRock(objectList, scene,10, 1,65, Stone1);
    loadRock(objectList, scene,10, 1,55, Stone);
    loadRock(objectList, scene,10, 1,45, Stone2);
    loadRock(objectList, scene,10, 1,40, Stone);
    loadRock(objectList, scene,10, 1,30, Stone2);
    loadRock(objectList, scene,10, 1,20, Stone1);
    loadRock(objectList, scene,10, 1,14, Stone);
    loadRock(objectList, scene,10, 1,5, Stone2);


    ///rocas derecha
    loadRock(objectList, scene,20,4,90, rockWinter1);
    loadRock(objectList, scene,19,1,85, rockWinter3);
    loadRock(objectList, scene,19,1,75, rockWinter2);
    loadRock(objectList, scene,19,1,65, rockWinter1);
    loadRock(objectList, scene,23,1,60, rockWinter);
    loadRock(objectList, scene,17,1,50, rockWinter3);
    loadRock(objectList, scene,22,1,55, rockWinter2);
    loadRock(objectList, scene,18,1,30, rockWinter3);
    loadRock(objectList, scene,22,1,40, rockWinter2);
    loadRock(objectList, scene,22,1,25, rockWinter1);
    loadRock(objectList, scene,20,1,15, rockWinter);
    loadRock(objectList, scene,17,1,10, rockWinter1);
    loadRock(objectList, scene,21,1,5, rockWinter2);
    loadRock(objectList, scene,24,1,0, rockWinter3);

    ///RAMITAS
    loadWood(objectList, scene, -14, 1 , 80, wood, 0,-45,0)
    loadWood(objectList, scene, 0, 1 , 90, wood2 ,0,-45,0)
    loadWood(objectList, scene, 10, .5 , 80, wood3, 0,45,0)
    loadWood(objectList, scene, 10, .5 , 65, wood3, 0,-45,0)
    loadWood(objectList, scene, -5, .5 , 60, wood, 0,-60,0)
    loadWood(objectList, scene, -8, .5 , 80, wood3, 0,-50,0)
    loadWood(objectList, scene, 0, .5 , 50, wood, 0,90,0)
    loadWood(objectList, scene, 0, .5 , 55, wood2, 0,90,0)
    loadWood(objectList, scene, 0, .5 , 45, wood3, 0,90,0)
    loadWood(objectList, scene, -15, 4 , 65, wood3, -35,-45,0)
    loadWood(objectList, scene, 15, 4 , 80, wood3, 25,45,0)



    //loadRock(objectList, scene,0,1,85, Stone1);

    //loadRock(objectList, scene,0,1,85, Stone2);


    createIce(objectList, scene)

}

async function loadTree1(objectList,scene ,x,y,z,tree){

    try{
        console.log("creando arbolitos")
        const object = await new OBJLoader().loadAsync(tree.obj, onProgress, onError);
        //let texture = tree1.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(tree1.map) : null;
        let texture = new THREE.TextureLoader().load(tree.map) ;
        //console.log("texture: ", texture)
        //let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        ///let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log("object: ", object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.map = texture;
                //child.material.normalMap = normalMap;
                //child.material.specularMap = specularMap;
                //child.material.color.setHex(0x0D508B)
                console.log("Traverse")

            }
        });
        object.scale.set(10,10, 10);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;
        //object.translateY(-20)

        object.name = "objObject";
        objectList.push(object);
        scene.add(object);
    }catch(err){ 
        onError(err);
    }
    
}


async function loadRock(objectList,scene ,x,y,z,tree){

    try{
        console.log("creando arbolitos")
        const object = await new OBJLoader().loadAsync(tree.obj, onProgress, onError);
        //let texture = tree1.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(tree1.map) : null;
        let texture = new THREE.TextureLoader().load(tree.map) ;
        let textureOcclusion = new THREE.TextureLoader().load(tree.occlusion) ;

        //console.log("texture: ", texture)
        //let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        ///let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log("object: ", object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                //child.material.color = 0xFFFFFF;
                child.material.map = texture;
                child.material.occlusion = textureOcclusion;
                //child.material.normalMap = normalMap;
                //child.material.specularMap = specularMap;
                console.log("Traverse")

            }
        });
        object.scale.set(5,5, 5);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;

        object.rotation.y = -54;
        //object.translateY(-20)

        object.name = "objObject";
        objectList.push(object);
        scene.add(object);
    }catch(err){ 
        onError(err);
    }
    
}

async function loadWood(objectList,scene ,x,y,z,tree,xr,yr,zr){

    try{
        console.log("creando arbolitos")
        const object = await new OBJLoader().loadAsync(tree.obj, onProgress, onError);
        //let texture = tree1.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(tree1.map) : null;
        ///let texture = new THREE.TextureLoader().load(tree.map) ;
       // let textureOcclusion = new THREE.TextureLoader().load(tree.occlusion) ;

        //console.log("texture: ", texture)
        //let normalMap = objModelUrl.hasOwnProperty('normalMap') ? new THREE.TextureLoader().load(objModelUrl.normalMap) : null;
        ///let specularMap = objModelUrl.hasOwnProperty('specularMap') ? new THREE.TextureLoader().load(objModelUrl.specularMap) : null;

        console.log("object: ", object);

        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.color.setHex(0x927B58)
                //child.material.color = 0xFFFFFF;
                //child.material.map = texture;
                //child.material.color = 0x927B58;
                //child.material.occlusion = textureOcclusion;
                //child.material.normalMap = normalMap;
                //child.material.specularMap = specularMap;
                console.log("Traverse")

            }
        });
        object.scale.set(5,5, 5);
        object.position.x = x;
        object.position.y = y;
        object.position.z = z;

        object.rotation.x = xr;
        object.rotation.y = yr;
        object.rotation.z = zr;

        //object.rotation.y = -54;
        //object.translateY(-20)

        object.name = "objObject";
        objectList.push(object);
        scene.add(object);
    }catch(err){ 
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

function createIce(objectList, scene){
    console.log("Creating Ice")
    let textureDir = '../models/iceTexture/ice.jpg'
    let texture = new  THREE.TextureLoader().load(textureDir)
    const geometry = new THREE.PlaneGeometry( 60, 60,20, 32 );
    const material = new THREE.MeshPhongMaterial( {map: texture, side: THREE.DoubleSide
    ,envMap: scene.background, combine: THREE.MixOperation,reflectivity: 1, opacity:.9, 
    transparent:true,} );
    
    
    console.log(material)
    const plane = new THREE.Mesh( geometry, material );
    
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 70

    plane.rotation.x = Math.PI /2; 
    plane.rotation.y = 0
    plane.rotation.z = 0

    plane.name = "objObject";
    objectList.push(plane);
    scene.add( plane )

    const plane2 = new THREE.Mesh( geometry, material );
    plane2.position.x = 0
    plane2.position.y = 0
    plane2.position.z = 10

    plane2.rotation.x = Math.PI /2; 
    plane2.rotation.y = 0
    plane2.rotation.z = 0

    plane2.name = "objObject";
    objectList.push(plane2);
    scene.add( plane2 )


    let planeGeometry = new THREE.PlaneBufferGeometry(40, 40);
    /*
    let options = {
     
        clipBias: 0.03,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x889999,
        recursion: 1,

    
    };
    */
    const textureWidth = window.innerWidth * window.devicePixelRatio;
    const textureHeight = window.innerHeight * window.devicePixelRatio;
    let mirror = new Reflector(geometry,  {
        textureWidth: textureWidth,
        textureHeight: textureHeight,
        clipBias: 0.03,
        encoding: THREE.LinearEncoding,
        //color: THREE.Color(0x7F7F7F)
        //transparent: true
    });
    mirror.position.x = 0
    mirror.position.y = 0.1
    mirror.position.z = 70

    mirror.rotation.x = -Math.PI/2
    //mirror.rotation.y = Math.PI /2
    //mirror.rotation.z = Math.PI /2

    scene.add(mirror);


    let mirror2 = new Reflector(geometry,  {
        textureWidth: textureWidth,
        textureHeight: textureHeight,
        clipBias: 0.03,
        encoding: THREE.LinearEncoding,
        //color: THREE.Color(0x7F7F7F)
        //transparent: true
    });
    mirror2.position.x = 0
    mirror2.position.y = 0.1
    mirror2.position.z = 10

    mirror2.rotation.x = -Math.PI/2
    //mirror.rotation.y = Math.PI /2
    //mirror.rotation.z = Math.PI /2

    scene.add(mirror2);
}