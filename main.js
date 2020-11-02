var canvas = document.getElementById("renderCanvas");

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    // Lights
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, -5, 2), scene);
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);

    // Need a free camera for collisions
    var camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 5, -20), scene);
    camera.minZ = .01;
    camera.attachControl(canvas, true);


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
    var isMusicPlaying = false;
    var music = new BABYLON.Sound("music", "guitar.mp3", scene, soundReady, { loop: true });

    console.log("can print things on here");

    function soundReady() {
        if (isMusicPlaying) {
            console.log("Sound is being paused");
            music.pause();
            isMusicPlaying = false;
        }
        else {
            console.log("Sound is being played");
            music.play();
            isMusicPlaying = true;
        }
    }
    // Audio Toggle on Spacebar (Convert later to WebVR button when interacting with object)
    window.addEventListener("keydown", function (evt) {
        // Press space key to toggle music
        if (evt.keyCode === 32) {
            soundReady();
        }
    });
    var audioBox = BABYLON.Mesh.CreateBox("crate", 2, scene);
    audioBox.material = new BABYLON.StandardMaterial("Mat", scene);
    audioBox.position = new BABYLON.Vector3(0, -3, -7);
    music.attachToMesh(audioBox);
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