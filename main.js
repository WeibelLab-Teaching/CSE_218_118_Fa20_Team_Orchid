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

    var laneMaterial = new BABYLON.StandardMaterial("laneMaterial", scene);
    laneMaterial.ambientColor = new BABYLON.Color3(0.9, 0.9, 0.1);
    laneMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    laneMaterial.specularColor = new BABYLON.Color3(0.2, 0.1, 0.79);

    var daw = BABYLON.MeshBuilder.CreatePlane("daw", {width: 13.8, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    daw.position = new BABYLON.Vector3(0, -1, -4);
    daw.material = dawMaterial;

    // Tab to represent initial project (more tabs in future)
    var dawtab = BABYLON.MeshBuilder.CreatePlane("tab", {width: 3, height: 3, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene, true);
    dawtab.position = new BABYLON.Vector3(-5.4, .5, -4);
    dawtab.material = dawMaterial;

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
            // I will edit this later... 
            else if (pickResult.pickedMesh.name == "laneAdd") {
                console.log("torus clicked and lane added");
                var lane1 = BABYLON.MeshBuilder.CreatePlane("lane1", {width: 9.8, height: 1}, scene);
                lane1.position = new BABYLON.Vector3(1.3, .2, -4.4);
                lane1.material = laneMaterial;
                lane1.setEnabled(true);
                dawFiles.push(lane1);
                console.log(lane1);
                if (lane1.isEnabled(false) == true ) {
                    var lane2 = BABYLON.MeshBuilder.CreatePlane("lane2", {width: 9.8, height: 1}, scene);
                    lane2.position = new BABYLON.Vector3(1.3, -1.4, -4.4);
                    lane2.material = laneMaterial;
                    lane2.setEnabled(true);
                    dawFiles.push(lane2);
                    console.log(lane2);
                }
            }
            else if (pickResult.pickedMesh.name.startsWith("dawFile")) {
                console.log("the " + pickResult.pickedMesh.name + " was selected.");
                if (pickResult.pickedMesh.parent == camera) {
                    pickResult.pickedMesh.setParent(null);
                } else {
                    pickResult.pickedMesh.setParent(camera);
                }
            }
            else if (pickResult.pickedMesh.name == "cube") {
                console.log("cube clicked and daw enabled is ", daw.isEnabled(false), dawtab.isEnabled(false));
                if(daw.isEnabled(false), dawtab.isEnabled(false) == true) {
                    daw.setEnabled(false), dawtab.setEnabled(false);
                }
                else {
                    daw.setEnabled(true), dawtab.setEnabled(true);
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