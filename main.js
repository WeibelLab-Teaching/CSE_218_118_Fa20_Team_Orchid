var canvas = document.getElementById("renderCanvas");

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Lights
    //var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-10, -5, 10), scene);
    //var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
    var hemisphericLight = new BABYLON.HemisphericLight("Omni", new BABYLON.Vector3(0, 10, -20), scene);

    // Need a free camera for collisions
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -20), scene);
    camera.minZ = .01;
    camera.attachControl(canvas, true);
    camera.speed = .75;  


    //Simple crate
    var box = new BABYLON.MeshBuilder.CreateBox("crate", {
        width: 40,
        height: 10,
        depth: 40,
        sideOrientation: 1
    }, scene);

    box.material = new BABYLON.StandardMaterial("Mat", scene);
    box.material.diffuseTexture = new BABYLON.Texture("textures/wood.jpg", scene);
    box.material.specularColor = new BABYLON.Color3.Black();
    box.position = new BABYLON.Vector3(0, 1, -20);

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;
    box.checkCollisions = true;

    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera._needMoveForGravity = true;

    // Enable VR
    var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
    //vrHelper.enableTeleportation({floorMeshes: [environment.ground]});

    // Audio Creation
    var isMusicPlaying = true;
    //var music = new BABYLON.Sound("music", "guitar.mp3", scene, soundReady, { loop: true });

    var music1 = new BABYLON.Sound("rolling_A1", "rolling_A1.mp3", scene, soundReady, {loop: false});
    var music2 = new BABYLON.Sound("rolling_A2", "rolling_A2.mp3", scene, soundReady, {loop: false});
    var music3 = new BABYLON.Sound("rolling_S1", "rolling_S1.mp3", scene, soundReady, {loop: false});
    var music4 = new BABYLON.Sound("rolling_S2", "rolling_S2.mp3", scene, soundReady, {loop: false});
    var music5 = new BABYLON.Sound("rolling_S3", "rolling_S3.mp3", scene, soundReady, {loop: false});

    var soundsReady = 0;

    function soundReady() {
        soundsReady++;
        if(soundsReady >= 1) {
            if (isMusicPlaying) {
                console.log("Sound is being paused");
                music1.pause();
                music2.pause();
                music3.pause();
                music4.pause();
                music5.pause();
                isMusicPlaying = false;
            }
            else {
                console.log("Sound is being played");
                music1.play();
                music2.play();
                music3.play();
                music4.play();
                music5.play();
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

     // Box in center of room: on spacebar will pause/play music
    var audioBox = BABYLON.Mesh.CreateBox("cube", 1, scene);
    audioBox.material = new BABYLON.StandardMaterial("Mat", scene);
    audioBox.position = new BABYLON.Vector3(-6.5, -3, -7);
    audioBox.isPickable = true;
    /*music1.attachToMesh(audioBox); 
    music2.attachToMesh(audioBox);
    music3.attachToMesh(audioBox);
    music4.attachToMesh(audioBox);
    music5.attachToMesh(audioBox);*/

    var dynamicCylinder = BABYLON.Mesh.CreateCylinder("dynamicCylinder", 1, 1, 1, 24, 1, scene, true);
    dynamicCylinder.material = new BABYLON.StandardMaterial("Mat", scene);
    dynamicCylinder.position = new BABYLON.Vector3(-6.5, -0, -7);
    dynamicCylinder.isPickable = true;

    // Sphere to pick up/place down
    var pickupSphere = BABYLON.Mesh.CreateSphere("pickupSphere", 32, 1, scene);
    pickupSphere.position = new BABYLON.Vector3(-8, -3, -21);
    pickupSphere.isPickable = true;

    // Donut shape on top of audio box 
    var laneTorus = BABYLON.MeshBuilder.CreateTorus("laneAdd", {});
    laneTorus.material = new BABYLON.StandardMaterial("Mat", scene);
    laneTorus.position = new BABYLON.Vector3(-6.5, -2, -7);

    // Materials 
    var dawMaterial = new BABYLON.StandardMaterial("dawMaterial", scene);
    dawMaterial.ambientColor = new BABYLON.Color3(0.9, 0.9, 0.9);
    dawMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    dawMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    // Main Rectangle of the DAW 
    var daw = BABYLON.MeshBuilder.CreatePlane("daw", {width: 13.8, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    daw.position = new BABYLON.Vector3(0, -1, -4);
    daw.material = dawMaterial;

    // Tab to represent initial project (more tabs in future)
    var dawtab = BABYLON.MeshBuilder.CreatePlane("tab", {width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    dawtab.position = new BABYLON.Vector3(-5.4, .5, -4);
    dawtab.material = dawMaterial;

    // Play/Pause variables 
    var mainPlay = BABYLON.MeshBuilder.CreateDisc("main play", {tessellation: 3, radius:.3}, scene);
    mainPlay.position = new BABYLON.Vector3(0, -2.8, -4.4);
    mainPlay.material = new BABYLON.StandardMaterial("Mat", scene);

    var mainPause = BABYLON.MeshBuilder.CreateDisc("main pause", {tessellation: 8, radius:.3}, scene);
    mainPause.position = new BABYLON.Vector3(0, -2.8, -4.4);
    mainPause.material = new BABYLON.StandardMaterial("Mat", scene);
    mainPause.setEnabled(false);

    var lane1Play = BABYLON.MeshBuilder.CreateDisc("lane1 play", {tessellation: 3, radius:.2}, scene);
    lane1Play.position = new BABYLON.Vector3(-4.2, .2, -4.4);
    lane1Play.material = new BABYLON.StandardMaterial("Mat", scene);
    lane1Play.setEnabled(false);

    var lane1Pause = BABYLON.MeshBuilder.CreateDisc("lane1 pause", {tessellation: 8, radius:.3}, scene);
    lane1Pause.position = new BABYLON.Vector3(-4.2, .2, -4.4);
    lane1Pause.material = new BABYLON.StandardMaterial("Mat", scene);
    lane1Pause.setEnabled(false);

    var lane2Play = BABYLON.MeshBuilder.CreateDisc("lane2 play", {tessellation: 3, radius:.2}, scene);
    lane2Play.position = new BABYLON.Vector3(-4.2, -1.4, -4.4);
    lane2Play.material = new BABYLON.StandardMaterial("Mat", scene);
    lane2Play.setEnabled(false);

    var lane2Pause = BABYLON.MeshBuilder.CreateDisc("lane2 pause", {tessellation: 8, radius:.3}, scene);
    lane2Pause.position = new BABYLON.Vector3(-4.2, -1.4, -4.4);
    lane2Pause.material = new BABYLON.StandardMaterial("Mat", scene);
    lane2Pause.setEnabled(false);


    //var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(daw);
    //var advancedTexture = BABYLON.GUI
    /*var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "Click Me");
    button1.width = 1;
    button1.height = 0.4;
    button1.color = "white";
    button1.fontSize = 50;
    button1.background = "green";
    button1.onPointerUpObservable.add(function() {
        alert("you did it!");
    });
    advancedTexture.addControl(button1);*/

    // material for dynamic waveform objects
    var waveformMaterial = new BABYLON.StandardMaterial("texturePlane", scene);
    waveformMaterial.diffuseTexture = new BABYLON.Texture("textures/waveformjs.png", scene);
    waveformMaterial.specularColor = new BABYLON.Color3(0, 0, 0.1);
    waveformMaterial.backFaceCulling = false;

    // trying to put music analyzer into the space...  
    /*var myAnalyser = new BABYLON.Analyser(scene);
    BABYLON.Engine.audioEngine.connectToAnalyser(myAnalyser);
    myAnalyser.DEBUGCANVASSIZE.width = 5;
    myAnalyser.DEBUGCANVASSIZE.height = 1;
    myAnalyser.DEBUGCANVASPOS.x = 0;
    myAnalyser.DEBUGCANVASPOS.y = 5;
    myAnalyser.DEBUGCANVASPOS.y = -4;
    myAnalyser.drawDebugCanvas(); */

    var dawFiles = [];
    scene.onPointerDown = function (evt, pickResult) {
        if (pickResult.hit) {
            if (pickResult.pickedMesh.name == "crate") {
                console.log("room clicked");
            }
            else if (pickResult.pickedMesh.name == "pickupSphere") {
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
                obj.position = new BABYLON.Vector3(0, 0, -7);
                obj.height = 1;
                obj.width = 2;
                obj.setEnabled(true);
                console.log("height of obj is " + obj.height + " and width is " + obj.width);
                obj.material = waveformMaterial;
                switch(dawFiles.length) {
                    case 1:
                        music1.attachToMesh(obj);
                        break;
                    case 2:
                        music2.attachToMesh(obj);
                        break;
                    case 3:
                        music3.attachToMesh(obj);
                        break;
                    case 4:
                        music4.attachToMesh(obj);
                        break;
                    case 5:
                        music5.attachToMesh(obj);
                        break;
                }
                dawFiles.push(obj);
                console.log(obj);
            }
            // Lanes... WIP 
            else if (pickResult.pickedMesh.name == "laneAdd") {
                console.log("torus clicked and lane added");
                var lane1 = BABYLON.MeshBuilder.CreatePlane("lane1", {width: 9.8, height: 1}, scene);
                lane1.position = new BABYLON.Vector3(1.3, .2, -4.4);
                lane1.material = new BABYLON.StandardMaterial("Mat", scene);;
                lane1.setEnabled(true);
                dawFiles.push(lane1);
                console.log(lane1);
                var lane2 = BABYLON.MeshBuilder.CreatePlane("lane2", {width: 9.8, height: 1}, scene);
                lane2.position = new BABYLON.Vector3(1.3, -1.4, -4.4);
                lane2.material = new BABYLON.StandardMaterial("Mat", scene);;
                lane2.setEnabled(true);
                dawFiles.push(lane2);
                console.log(lane2);
                lane1Play.setEnabled(true);
                lane2Play.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name.startsWith("dawFile")) {
                console.log("the " + pickResult.pickedMesh.name + " was selected.");
                if (pickResult.pickedMesh.parent == camera) {
                    pickResult.pickedMesh.setParent(null);
                } else {
                    pickResult.pickedMesh.setParent(camera);
                }
            }
            // Main Play/Pause on DAW 
            else if (pickResult.pickedMesh.name == "main play") {
                console.log("main play has been clicked");
                mainPlay.setEnabled(false);
                mainPause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "main pause") {
                console.log("main pause has been clicked");
                mainPause.setEnabled(false);
                mainPlay.setEnabled(true);
            }

            // Lane Play/Pause
            else if (pickResult.pickedMesh.name == "lane1 play") {
                console.log("lane1 play has been clicked");
                lane1Play.setEnabled(false);
                lane1Pause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane1 pause") {
                console.log("lane1 pause has been clicked");
                lane1Pause.setEnabled(false);
                lane1Play.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane2 play") {
                console.log("lane2 play has been clicked");
                lane2Play.setEnabled(false);
                lane2Pause.setEnabled(true);
            }
            else if (pickResult.pickedMesh.name == "lane2 pause") {
                console.log("lane2 pause has been clicked");
                lane2Pause.setEnabled(false);
                lane2Play.setEnabled(true);
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
            if (pickResult.pickedMesh.name == "daw") {
                console.log("daw is clicked");

            }
            if (pickResult.pickedMesh.name == "tab") {
                console.log("tab is clicked");

            }
            
        }
    }


    return scene;
}

var engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
var scene = createScene();

engine.runRenderLoop(function () {
    if (scene) {
        scene.render();
    }
});

// Resize
window.addEventListener("resize", function () {
    engine.resize();
});