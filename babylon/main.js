var username = "default";

var setUsername = function (text) {
    username = text;
    console.log(username);
    closeForm();
}

var canvas = document.getElementById("renderCanvas");

var createScene = async function () {
    var scene = new BABYLON.Scene(engine);

    var dawFiles = [];
    var lanes = [];
    var laneBoxes = [];
    var music = [];
    var lane1Offset = [];
    var lane2Offset = [];

    // Lights
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-10, -5, 10), scene);
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
    var hemisphericLight = new BABYLON.HemisphericLight("Omni", new BABYLON.Vector3(0, 1, -20), scene);

    // Need a free camera for collisions
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -20), scene);
    camera.minZ = .01;
    camera.attachControl(canvas, true);
    camera.speed = .25;


    //Simple crate environment
    var box = new BABYLON.MeshBuilder.CreateBox("crate", {
        width: 20,
        height: 7,
        depth: 20,
        sideOrientation: 1
    }, scene);

    box.material = new BABYLON.StandardMaterial("Mat", scene);
    box.material.diffuseTexture = new BABYLON.Texture("textures/nice_flooring.jpg", scene);
    box.material.specularColor = new BABYLON.Color3.Black();
    box.position = new BABYLON.Vector3(0, 1, -20);

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;
    box.checkCollisions = true;
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera._needMoveForGravity = true;

    // Enable VR
    var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
    vrHelper.enableInteractions();
    //vrHelper.enableTeleportation({floorMeshes: [box]});

    // Audio Creation
    var isMusicPlaying = true;
    //var music = new BABYLON.Sound("music", "guitar.mp3", scene, soundReady, { loop: true });
    var music1 = new BABYLON.Sound("rolling_A1", "Dona Nobis 1.mp3", scene, soundReady, {loop: false});
    var music2 = new BABYLON.Sound("rolling_A2", "Dona Nobis 2.mp3", scene, soundReady, {loop: false});
    var music3 = new BABYLON.Sound("rolling_S1", "Dona Nobis 3.mp3", scene, soundReady, {loop: false});
    var music4 = new BABYLON.Sound("rolling_S2", "rolling_S2.mp3", scene, soundReady, {loop: false});
    var music5 = new BABYLON.Sound("rolling_S3", "rolling_S3.mp3", scene, soundReady, {loop: false});

    music1.setVolume(0.5);
    music2.setVolume(0.5);
    music3.setVolume(0.5);
    music4.setVolume(0.5);
    music5.setVolume(0.5);

    //set this as the default lane volume for now
    lane1Vol = 0.5;
    lane2Vol = 0.5;
    var queue = new BABYLON.Sound("quack", "quack.mp3", scene);
    function adjustVolume(number, upOrDown){
        console.log("adjusting volume of lane ", number);
        for( var fileIdx = 0; fileIdx < dawFiles.length; fileIdx++) {
            //console.log("goes in for ", fileIdx);
            if( number !== 2 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                //music[fileIdx].pause();
                //test for now
                console.log("lane 1 volume currently at ", lane1Vol);
                if(upOrDown == 1){
                    if(lane1Vol >= 1.0){
                        console.log("max volume at 1");
                        queue.play();
                        break;
                    }
                    lane1Vol += 0.1;
                    music[fileIdx].setVolume(lane1Vol);  
                    console.log("Lane 1 vol is now ", music[fileIdx].getVolume());       
                }
                else if(upOrDown == 0){
                    if(lane1Vol <= 0.1){
                        console.log("min volume at 0");
                        lane1Vol = 0;
                        queue.play();   
                        music[fileIdx].setVolume(lane1Vol); 
                        break;
                    }
                    else{
                        lane1Vol -= 0.1;
                        music[fileIdx].setVolume(lane1Vol); 
                        console.log("Lane 1 vol is now ", music[fileIdx].getVolume());            
                    }
                }
 
            }
            if(number !== 1 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                console.log("lane 2 volume currently at ", lane2Vol);
                if(upOrDown == 1){
                    if(lane2Vol >= 1.0){
                        console.log("max volume at 1");
                        queue.play();
                        break;
                    }
                    lane2Vol += 0.1;
                    music[fileIdx].setVolume(lane2Vol);  
                    console.log("Lane 2 vol is now ", music[fileIdx].getVolume());       
                }
                else if(upOrDown == 0){
                    if(lane2Vol <= 0.1){
                        console.log("min volume at 0");
                        lane2Vol = 0;
                        music[fileIdx].setVolume(lane2Vol); 
                        queue.play();
                        break;
                    }
                    else{
                        lane2Vol -= 0.1;
                        music[fileIdx].setVolume(lane2Vol);    
                        console.log("Lane 2 vol is now ", music[fileIdx].getVolume());            
                    }
                }
            }
        }
    }

    var soundsReady = 0;

    function soundReady(number) {
        soundsReady++;
        if(soundsReady >= 1) {
            if (isMusicPlaying) {
                console.log("Sound is being paused");
                for( var fileIdx = 0; fileIdx < dawFiles.length; fileIdx++) {
                    console.log("goes in for ", fileIdx);
                    if( number !== 2 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                        music[fileIdx].pause();
                        //test for now
                        music[fileIdx].setVolume(lane1Vol);
                    }
                    if(number !== 1 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                        music[fileIdx].pause();
                        //test for now
                        music[fileIdx].setVolume(lane2Vol);
                        console.log("playing in lane 2 with volume ", lane2Vol);


                    }
                }
                isMusicPlaying = false;
            }
            else {
                console.log("Sound is being played");
                for( var fileIdx = 0; fileIdx < laneBoxes.length; fileIdx++) {
                    console.log("goes in for ", fileIdx);
                    if( number !== 2 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                        console.log("playing in lane 1 with volume ", lane1Vol);
                        music[fileIdx].setVolume(lane1Vol);
                        console.log("offset is ", lane1Offset[fileIdx], "with all being ", lane1Offset);
                        music[fileIdx].play(lane1Offset[fileIdx] * 3);
                    }
                    if(number !== 1 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                        console.log("playing in lane 2 with volume ", lane2Vol);
                        console.log("offset is ", lane2Offset[fileIdx], "with all being ", lane2Offset);
                        music[fileIdx].setVolume(lane2Vol);
                        music[fileIdx].play(lane2Offset[fileIdx] * 3);
                    }
                }
                // music1.play();
                // music2.play();
                // music3.play();
                // music4.play();
                // music5.play();
                isMusicPlaying = true;
            }
        }
    }

    // Audio Toggle on Spacebar (Convert later to WebVR button when interacting with object)
    window.addEventListener("keydown", function (evt) {
        // Press space key to toggle music
        if (evt.keyCode === 32) {
            soundReady();
        }
    });

    var desk;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "computer_desk.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        desk = newMeshes[0];
        console.log("Loaded Mesh");
        desk.scaling.x = .01;
        desk.scaling.y = .01;
        desk.scaling.z = .01;
        desk.position = new BABYLON.Vector3(-8.5, -2.5, -18);
        desk.rotation = new BABYLON.Vector3(0,0,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var guitar;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "guitar.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        guitar = newMeshes[0];
        console.log("Loaded guitar");
        guitar.scaling = new BABYLON.Vector3(.4, .4, .4);
        guitar.position = new BABYLON.Vector3(9.9, 1.5, -15.5);
        guitar.rotation = new BABYLON.Vector3(Math.PI/2,Math.PI *3/2, Math.PI/2);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var amp;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "amp.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        amp = newMeshes[0];
        console.log("Loaded amp");
       // amp.scaling = new BABYLON.Vector3(.75, .75, .75);
        amp.position = new BABYLON.Vector3(9.7, -1.5, -15.5);
        amp.rotation = new BABYLON.Vector3(0,Math.PI/2, 0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var piano;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "piano.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        piano = newMeshes[0];
        console.log("Loaded Mesh2");
        piano.scaling.x = 3.5;
        piano.scaling.y = 3.5;
        piano.scaling.z = 3.5;
        piano.position = new BABYLON.Vector3(9.5, -2.5, -20);
        //desk.rotation = new BABYLON.Vector3(0,Math.PI/2,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var drums;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "drums.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        drums = newMeshes[0];
        console.log("Loaded drums");
        drums.scaling = new BABYLON.Vector3(.0017, .0017, .0017)
        drums.position = new BABYLON.Vector3(8, -2.5, -27);
        drums.rotation = new BABYLON.Vector3(0,Math.PI/2,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var couch;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "couch.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        couch = newMeshes[0];
        console.log("Loaded Mesh2");
        couch.scaling.x = .03;
        couch.scaling.y = .03;
        couch.scaling.z = .03;
        couch.position = new BABYLON.Vector3(-6.55, -2.52, -25.5);
        couch.rotation = new BABYLON.Vector3(0,0,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var table;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "table.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        table = newMeshes[0];
        console.log("Loaded table");
        table.position = new BABYLON.Vector3(-6, -2, -26);
        table.scaling = new BABYLON.Vector3(3, 2.5, 3);
        table.rotation = new BABYLON.Vector3(0,Math.PI/2,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });
    var light;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "ceiling_light.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        light = newMeshes[0];
        console.log("Loaded Mesh2");
        light.scaling.x = .002;
        light.scaling.y = .0015;
        light.scaling.z = .002;
        light.position = new BABYLON.Vector3(0, 2.5, -22);
        //light.rotation = new BABYLON.Vector3(0,0,0);
        newMeshes.forEach(function(item){
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;
    
        });

    });

    var dynamicCylinder = BABYLON.Mesh.CreateCylinder("dynamicCylinder", 1, 1, 1, 24, 1, scene, true);
    dynamicCylinder.material = new BABYLON.StandardMaterial("Mat", scene);
    dynamicCylinder.position = new BABYLON.Vector3(-6.5, 1, -13);

    dynamicCylinder.isPickable = true;
    dynamicCylinder.checkCollisions = true;

    // Materials 
    var dawMaterial = new BABYLON.StandardMaterial("dawMaterial", scene);
    dawMaterial.ambientColor = new BABYLON.Color3(0.33, 0.33, 0.33);
    dawMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    dawMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    var laneMaterial = new BABYLON.StandardMaterial("laneMaterial", scene);
    laneMaterial.ambientColor = new BABYLON.Color3(0.9, 0.9, 0.1);
    laneMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    laneMaterial.specularColor = new BABYLON.Color3(0.2, 0.1, 0.79);

     // Main Rectangle of the DAW 
     //w = 13.8, height = 5
    //var daw = BABYLON.MeshBuilder.CreatePlane("daw", {width: 13.8, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    //daw.position = new BABYLON.Vector3(0, -1, -4);
    var daw = BABYLON.MeshBuilder.CreatePlane("daw", {width: 14, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    daw.position = new BABYLON.Vector3(0, 0, -10.5);
    daw.material = dawMaterial;
    daw.checkCollisions = true;

    // Tab to represent initial project (more tabs in future)
    //var dawtab = BABYLON.MeshBuilder.CreatePlane("tab", {width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    //dawtab.position = new BABYLON.Vector3(-5.4, .5, -4);
    var dawtab = BABYLON.MeshBuilder.CreatePlane("tab", {width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    dawtab.position = new BABYLON.Vector3(-5.5, 1.5, -10.5);
    dawtab.material = dawMaterial;

    var laneMaterial = new BABYLON.StandardMaterial("laneMaterial", scene);
    laneMaterial.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    laneMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    laneMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

     // Play/Pause variables 
     var mainPlay = BABYLON.MeshBuilder.CreateDisc("main play", {tessellation: 3, radius:.3}, scene);
     //mainPlay.position = new BABYLON.Vector3(0, -2.8, -4.4);
     mainPlay.position = new BABYLON.Vector3(0, -1.8, -11);
     mainPlay.material = laneMaterial;

     var p1 = BABYLON.MeshBuilder.CreatePlane(name, {width:.2,height:.5}, scene);
     p1.position = new BABYLON.Vector3(0, 0, 0);
     p1.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var p2 = BABYLON.MeshBuilder.CreatePlane(name, {width:.2,height:.5}, scene);
     p2.position = new BABYLON.Vector3(.3, 0, 0);
     p2.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var mainPause = BABYLON.Mesh.MergeMeshes([p1, p2]);
     mainPause.position = new BABYLON.Vector3(-.1, -1.8, -11);
     mainPause.material = laneMaterial;
     mainPause.name = "main pause";
     mainPause.setEnabled(false);
 
     var lane1Play = BABYLON.MeshBuilder.CreateDisc("lane1 play", {tessellation: 3, radius:.2}, scene);
     //lane1Play.position = new BABYLON.Vector3(-4.2, .2, -4.4);
     lane1Play.position = new BABYLON.Vector3(-6, 1.2, -11);
     lane1Play.material = laneMaterial;
     lane1Play.setEnabled(false);

     var pl1 = BABYLON.MeshBuilder.CreatePlane(name, {width:.17,height:.37}, scene);
     pl1.position = new BABYLON.Vector3(0, 0, 0);
     pl1.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var pl2 = BABYLON.MeshBuilder.CreatePlane(name, {width:.17,height:.37}, scene);
     pl2.position = new BABYLON.Vector3(.24, 0, 0);
     pl2.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var lane1Pause = BABYLON.Mesh.MergeMeshes([pl1, pl2]);
     lane1Pause.position = new BABYLON.Vector3(-6.1, 1.2, -11);
     lane1Pause.material = laneMaterial;
     lane1Pause.name = "lane1 pause";
     lane1Pause.setEnabled(false);
 
     var lane2Play = BABYLON.MeshBuilder.CreateDisc("lane2 play", {tessellation: 3, radius:.2}, scene);
     //lane2Play.position = new BABYLON.Vector3(-4.2, -1.4, -4.4);
     lane2Play.position = new BABYLON.Vector3(-6, -0.4, -11);
     lane2Play.material = laneMaterial;
     lane2Play.setEnabled(false);

     var pll1 = BABYLON.MeshBuilder.CreatePlane(name, {width:.17,height:.37}, scene);
     pll1.position = new BABYLON.Vector3(0, 0, 0);
     pll1.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var pll2 = BABYLON.MeshBuilder.CreatePlane(name, {width:.17,height:.37}, scene);
     pll2.position = new BABYLON.Vector3(.24, 0, 0);
     pll2.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var lane2Pause = BABYLON.Mesh.MergeMeshes([pll1, pll2]);
     lane2Pause.position = new BABYLON.Vector3(-6.1, -0.4, -11);
     lane2Pause.material = laneMaterial;
     lane2Pause.name = "lane2 pause"
     lane2Pause.setEnabled(false);

     // volume up/down per each lane 
     var vertical = BABYLON.MeshBuilder.CreatePlane(name, {width:.09,height:.25}, scene);
     vertical.position = new BABYLON.Vector3(0, 0, 0);
     vertical.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var hori = BABYLON.MeshBuilder.CreatePlane(name, {width:.25,height:.09}, scene);
     hori.position = new BABYLON.Vector3(0, 0, 0);
     hori.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var plus1 = BABYLON.Mesh.MergeMeshes([vertical, hori]);
     plus1.position = new BABYLON.Vector3(-5.8, .7, -11);
     plus1.name = "plus1";
     
     var vertical2 = BABYLON.MeshBuilder.CreatePlane(name, {width:.09,height:.25}, scene);
     vertical2.position = new BABYLON.Vector3(0, 0, 0);
     vertical2.material = new BABYLON.StandardMaterial("Mat", scene);
 
     var hori2 = BABYLON.MeshBuilder.CreatePlane(name, {width:.25,height:.09}, scene);
     hori2.position = new BABYLON.Vector3(0, 0, 0);
     hori2.material = new BABYLON.StandardMaterial("Mat", scene);

     var plus2 = BABYLON.Mesh.MergeMeshes([vertical2, hori2]);
     plus2.position = new BABYLON.Vector3(-5.8, -.9, -11);
     plus2.name = "plus2";
     
     var minus1 = BABYLON.MeshBuilder.CreatePlane("minus1", {width:.21,height:.09}, scene);
     minus1.position = new BABYLON.Vector3(-6.2, .7, -11);
     minus1.material = new BABYLON.StandardMaterial("Mat", scene);
    
     var minus2 = BABYLON.MeshBuilder.CreatePlane("minus2", {width:.21,height:.09}, scene);
     minus2.position = new BABYLON.Vector3(-6.2, -.9, -11);
     minus2.material = new BABYLON.StandardMaterial("Mat", scene);

    // material for dynamic waveform objects
    var waveformMaterial = new BABYLON.StandardMaterial("texturePlane", scene);
    waveformMaterial.diffuseTexture = new BABYLON.Texture("textures/waveformjs.png", scene);
    waveformMaterial.specularColor = new BABYLON.Color3(0, 0, 0.1);
    waveformMaterial.backFaceCulling = false;

    var lane0Material = new BABYLON.StandardMaterial("measureBar", scene);
    lane0Material.diffuseTexture = new BABYLON.Texture("textures/measurebar.png", scene);
    lane0Material.specularColor = new BABYLON.Color3(0, 0, 0.1);
    var lane0 = BABYLON.MeshBuilder.CreatePlane("lane0", {width: 11, height: 0.35}, scene)
    lane0.position = new BABYLON.Vector3(0.25, 2.15, -11);
    lane0.material = lane0Material;
    lane0.setEnabled(true);

    // lane 1 in the daw
    var lane1 = BABYLON.MeshBuilder.CreatePlane("lane1", {width: 11, height: 1}, scene);
    lane1.position = new BABYLON.Vector3(0.25, 1.2, -11);
    lane1.material = laneMaterial;
    lane1.setEnabled(true);
    lanes.push(lane1);
    var lane1box = BABYLON.MeshBuilder.CreateBox("lane1box", {width: 11, height: 1, depth: 2}, scene);
    lane1box.position = new BABYLON.Vector3(0.25, 1.2, -11.5);
    lane1box.isVisible = false;
    laneBoxes.push(lane1box);

    // lane 2 in the daw
    var lane2 = BABYLON.MeshBuilder.CreatePlane("lane2", {width: 11.25, height: 1}, scene);
    lane2.position = new BABYLON.Vector3(0.25, -0.4, -11);
    lane2.material = laneMaterial;
    lane2.setEnabled(true);
    lanes.push(lane2);
    var lane2box = BABYLON.MeshBuilder.CreateBox("lane1box", {width: 11.25, height: 1, depth: 2}, scene);
    lane2box.position = new BABYLON.Vector3(0.25, -0.4, -11.5);
    lane2box.isVisible = false;
    laneBoxes.push(lane2box);
    
    lane1Play.setEnabled(true);
    lane2Play.setEnabled(true);

    scene.registerBeforeRender(function () {
        lane1.rotation = new BABYLON.Vector3(0,0,0);
        lane1box.rotation = new BABYLON.Vector3(0,0,0);
        lane2.rotation = new BABYLON.Vector3(0,0,0);
        lane2box.rotation = new BABYLON.Vector3(0,0,0);

    });

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var panel = new Panel(scene, advancedTexture, "80px", "400px", dawFiles, music, soundReady);
    samples = await displaySamples(panel);
    scene.onPointerDown = function (evt, pickResult) {

        if (pickResult.hit) {
            if (pickResult.pickedMesh.name == "pickupSphere") {
                if (pickupSphere.parent == camera) {
                    pickupSphere.setParent(null);
                } else {
                    pickupSphere.setParent(camera);
                }
            }
            else if (pickResult.pickedMesh.name == "dynamicCylinder") {
                var name = "dawFile".concat(dawFiles.length.toString());
                console.log("name is: " + name);
                var obj = BABYLON.MeshBuilder.CreatePlane(name, {width:8,height:.8}, scene);
                obj.position = new BABYLON.Vector3(0, 1, -13);
                obj.height = 1;
                obj.width = 2;
                obj.checkCollisions = true;
                obj.setEnabled(true);
                console.log("height of obj is " + obj.height + " and width is " + obj.width);
                obj.material = waveformMaterial;
                dawFiles.push(obj);
                lane1Offset.push(0);
                lane2Offset.push(0);
                switch(dawFiles.length) {
                    case 1:
                        console.log(music1.length);
                        music1.attachToMesh(obj);
                        music.push(music1);
                        break;
                    case 2:
                        music2.attachToMesh(obj);
                        music.push(music2);
                        break;
                    case 3:
                        music3.attachToMesh(obj);
                        music.push(music3);
                        break;
                    case 4:
                        music4.attachToMesh(obj);
                        music.push(music4);
                        break;
                    case 5:
                        music5.attachToMesh(obj);
                        music.push(music5);
                        break;
                }
                console.log(obj);
            }
            else if (pickResult.pickedMesh.name.startsWith("dawFile")) {
                console.log("the " + pickResult.pickedMesh.name + " was selected.");
                //Check if we are currently in VR Mode
                if (vrHelper.isInVRMode){
                    //If the parent of the file is the VR Camera, set it to null to release child
                    if(pickResult.pickedMesh.parent == vrHelper.currentVRCamera){
                        pickResult.pickedMesh.setParent(null);
                        for( var laneBoxesI = 0; laneBoxesI < laneBoxes.length; laneBoxesI++) {
                            if(pickResult.pickedMesh.intersectsMesh(laneBoxes[laneBoxesI])) {
                                console.log("parent is set to ", laneBoxes[laneBoxesI]);
                                pickResult.pickedMesh.setParent(lanes[laneBoxesI]);
                                pickResult.pickedMesh.rotation = pickResult.pickedMesh.parent.rotation;
                                pickResult.pickedMesh.position.y = 0;
                                pickResult.pickedMesh.position.z = -0.05;
                                var difference = 1.1;
                                var base = -1.50;
                                var compBase = -0.50;
                                var timeOffset = 1;
                                if (pickResult.pickedMesh.position.x < compBase) {
                                    pickResult.pickedMesh.position.x = base;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(0);
                                    } else {
                                        lane2Offset.push(0);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference) {
                                    pickResult.pickedMesh.position.x = base + difference;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset);
                                    } else {
                                        lane2Offset.push(timeOffset);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 2) {
                                    pickResult.pickedMesh.position.x = base + difference * 2;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 2);
                                    } else {
                                        lane2Offset.push(timeOffset * 2);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 3) {
                                    pickResult.pickedMesh.position.x = base + difference * 3;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 3);
                                    } else {
                                        lane2Offset.push(timeOffset * 3);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 4) {
                                    pickResult.pickedMesh.position.x = base + difference * 4;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 4);
                                    } else {
                                        lane2Offset.push(timeOffset * 4);
                                    }
                                }
                            }
                        }
                    }
                    else{
                        //console.log("Picked the daw file while in VR Mode!");
                        //console.log("parent is for the dawfile is ", pickResult.pickedMesh.parent);
                        vrHelper.currentVRCamera = camera;
                        console.log("VR camera: ", vrHelper.currentVRCamera);
                        pickResult.pickedMesh.setParent(vrHelper.currentVRCamera);
                    }

                }
                //WAS IF BEFORE
                else if (pickResult.pickedMesh.parent == camera) {
                    pickResult.pickedMesh.setParent(null);
                    for( var laneBoxesI = 0; laneBoxesI < laneBoxes.length; laneBoxesI++) {
                        if(pickResult.pickedMesh.intersectsMesh(laneBoxes[laneBoxesI])) {
                            console.log("parent is set to ", laneBoxes[laneBoxesI]);
                            pickResult.pickedMesh.setParent(lanes[laneBoxesI]);
                            pickResult.pickedMesh.rotation = pickResult.pickedMesh.parent.rotation;
                            pickResult.pickedMesh.position.y = 0;
                            pickResult.pickedMesh.position.z = -0.05;
                            var difference = 1.1;
                            var base = -1.50;
                            var compBase = -0.50;
                            var timeOffset = 1;
                            for(var n = 0; n < 10; n++) {
                                if (pickResult.pickedMesh.position.x < compBase + difference * n) {
                                    pickResult.pickedMesh.position.x = base + difference * n;
                                    var numToString = pickResult.pickedMesh.name[pickResult.pickedMesh.name.length - 1].toString();
                                    console.log("numToString is", numToString, "and lane is", laneBoxesI);
                                    if (laneBoxesI == 0) {
                                        lane1Offset[numToString] = timeOffset * n;
                                    } else {
                                        lane2Offset[numToString] = (timeOffset * n);
                                    }
                                    break;
                                }
                            }
                            console.log("lane offset is ", lane1Offset, lane2Offset, "and laneboxesi is", laneBoxesI);
                        }
                    }
                    
                    
                } else {
                    pickResult.pickedMesh.setParent(camera);
                }
            }
            // Main Play/Pause on DAW 
            else if (pickResult.pickedMesh.name == "main play") {
                console.log("main play has been clicked");
                soundReady(0);
                mainPlay.setEnabled(false);
                mainPause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "main pause") {
                console.log("main pause has been clicked");
                soundReady(0);
                mainPause.setEnabled(false);
                mainPlay.setEnabled(true);
            }

            // Lane Play/Pause
            else if (pickResult.pickedMesh.name == "lane1 play") {
                console.log("lane1 play has been clicked");
                soundReady(1);
                lane1Play.setEnabled(false);
                lane1Pause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane1 pause") {
                console.log("lane1 pause has been clicked");
                soundReady(1);
                lane1Pause.setEnabled(false);
                lane1Play.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane2 play") {
                console.log("lane2 play has been clicked");
                soundReady(2);
                lane2Play.setEnabled(false);
                lane2Pause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane2 pause") {
                console.log("lane2 pause has been clicked");
                soundReady(2);
                lane2Pause.setEnabled(false);
                lane2Play.setEnabled(true);
            }
            
            // Adjusting lane volume
            else if (pickResult.pickedMesh.name == "plus1"){
                console.log("lane1 volume up has been pressed");
                adjustVolume(1,1);

            }
            else if (pickResult.pickedMesh.name == "plus2"){
                console.log("lane2 volume up has been pressed");
                adjustVolume(2,1);
            }
            else if (pickResult.pickedMesh.name == "minus1"){
                console.log("lane1 volume down has been pressed");
                adjustVolume(1,0);
            }
            else if (pickResult.pickedMesh.name == "minus2"){
                console.log("lane2 volume down has been pressed");
                adjustVolume(0,0);
            }

            // Cube that turns the DAW on and off 
            else if (pickResult.pickedMesh.name == "cube") {
                console.log("cube clicked and daw enabled is ", daw.isEnabled(false), dawtab.isEnabled(false), mainPlay.isEnabled(false), mainPause.isEnabled(false));
                if(daw.isEnabled(false), dawtab.isEnabled(false), mainPlay.isEnabled(false), mainPause.isEnabled(false) == true) {
                    daw.setEnabled(false), dawtab.setEnabled(false), mainPlay.setEnabled(false), mainPause.setEnabled(false);
                }
                else {
                    daw.setEnabled(true), dawtab.setEnabled(true), mainPlay.setEnabled(true), mainPause.setEnabled(true);
                }
            }
            // click on nothing to close the library panel
            else {
                panel.options.isVisible = false;
            }
            if (pickResult.pickedMesh.name == "daw") {
                console.log("daw is clicked");

            }
            if (pickResult.pickedMesh.name == "tab") {
                console.log("tab is clicked");

            }
            // click on the desk to show the music library
            if (pickResult.pickedMesh.name == "Desk_Desk_0") {
                panel.options.isVisible = !panel.options.isVisible;
                console.log("THIS IS THE CURRENT VR CAMERA: ", vrHelper.currentVRCamera.name);
            }
            
        }
    }
    return scene;
};


var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });

(async () => {

    var scene = await createScene();

    engine.runRenderLoop(function () {
        if (scene) {
            scene.render();
        }
    });

    // Resize
    window.addEventListener("resize", function () {
        engine.resize();
    });

    // test upload 
    uploadAudio();

})();
