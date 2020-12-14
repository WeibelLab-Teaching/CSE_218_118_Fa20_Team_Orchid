var username = "NONE";
var scene;
var advancedTexture;
var userbutton;
var setUsername = function (text) {
    username = text;
    if (scene && advancedTexture) {
        userbutton = new usernameButton(scene, advancedTexture, "50px", "200px", username);
    }
    console.log(username);
    closeForm();
}

var canvas = document.getElementById("renderCanvas");

var createScene = async function () {
    scene = new BABYLON.Scene(engine);

    var dawFiles = [];
    var lanes = [];
    var laneBoxes = [];
    var music = [];
    var lane1Offset = [];
    var lane2Offset = [];
    var lane3Offset = [];
    var lane4Offset = [];

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
    var vrHelper = scene.createDefaultVRExperience({ createDeviceOrientationCamera: false });
    vrHelper.enableInteractions();
    //vrHelper.enableTeleportation({floorMeshes: [box]});

    // Audio Creation
    var isMusicPlaying = false;
    // 0 for all; 1 for lane1, 2 for lane2, etc.
    var lanePlaying = 0;

    //set the default lane volume
    lane1Vol = 0.5;
    lane2Vol = 0.5;
    lane3Vol = 0.5;
    lane4Vol = 0.5;
    function adjustVolume(number, upOrDown) {
        console.log("adjusting volume of lane ", lanePlaying);
        for (var fileIdx = 0; fileIdx < dawFiles.length; fileIdx++) {
            if (number == 1 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                console.log("lane 1 volume currently at ", lane1Vol);
                if (upOrDown == 1) {
                    if (lane1Vol >= 1.0) {
                        console.log("max volume at 1");
                        break;
                    }
                    lane1Vol += 0.1;
                    music[fileIdx].setVolume(lane1Vol);
                    console.log("Lane 1 vol is now ", music[fileIdx].getVolume());
                }
                else if (upOrDown == 0) {
                    if (lane1Vol <= 0.1) {
                        console.log("min volume at 0");
                        lane1Vol = 0;
                        music[fileIdx].setVolume(lane1Vol);
                        break;
                    }
                    else {
                        lane1Vol -= 0.1;
                        music[fileIdx].setVolume(lane1Vol);
                        console.log("Lane 1 vol is now ", music[fileIdx].getVolume());
                    }
                }

            }
            if (number == 2 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                console.log("lane 2 volume currently at ", lane2Vol);
                if (upOrDown == 1) {
                    if (lane2Vol >= 1.0) {
                        console.log("max volume at 1");
                        break;
                    }
                    lane2Vol += 0.1;
                    music[fileIdx].setVolume(lane2Vol);
                    console.log("Lane 2 vol is now ", music[fileIdx].getVolume());
                }
                else if (upOrDown == 0) {
                    if (lane2Vol <= 0.1) {
                        console.log("min volume at 0");
                        lane2Vol = 0;
                        music[fileIdx].setVolume(lane2Vol);
                        break;
                    }
                    else {
                        lane2Vol -= 0.1;
                        music[fileIdx].setVolume(lane2Vol);
                        console.log("Lane 2 vol is now ", music[fileIdx].getVolume());
                    }
                }
            }
            if (number == 3 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane3) {
                console.log("lane 3 volume currently at ", lane3Vol);
                if (upOrDown == 1) {
                    if (lane3Vol >= 1.0) {
                        console.log("max volume at 1");
                        break;
                    }
                    lane3Vol += 0.1;
                    music[fileIdx].setVolume(lane3Vol);
                    console.log("Lane 3 vol is now ", music[fileIdx].getVolume());
                }
                else if (upOrDown == 0) {
                    if (lane3Vol <= 0.1) {
                        console.log("min volume at 0");
                        lane3Vol = 0;
                        music[fileIdx].setVolume(lane3Vol);
                        break;
                    }
                    else {
                        lane3Vol -= 0.1;
                        music[fileIdx].setVolume(lane3Vol);
                        console.log("Lane 3 vol is now ", music[fileIdx].getVolume());
                    }
                }
            }
            if (number == 4 && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane4) {
                console.log("lane 4 volume currently at ", lane4Vol);
                if (upOrDown == 1) {
                    if (lane4Vol >= 1.0) {
                        console.log("max volume at 1");
                        break;
                    }
                    lane4Vol += 0.1;
                    music[fileIdx].setVolume(lane4Vol);
                    console.log("Lane 4 vol is now ", music[fileIdx].getVolume());
                }
                else if (upOrDown == 0) {
                    if (lane4Vol <= 0.1) {
                        console.log("min volume at 0");
                        lane4Vol = 0;
                        music[fileIdx].setVolume(lane4Vol);
                        break;
                    }
                    else {
                        lane4Vol -= 0.1;
                        music[fileIdx].setVolume(lane4Vol);
                        console.log("Lane 4 vol is now ", music[fileIdx].getVolume());
                    }
                }
            }
        }
    }

 
    // Indicates time signature of measures (currently 3 beats per measure)
    var timeSignature = 3;
    function audioToggle() {
        if (isMusicPlaying) {
            console.log("Sound is being paused");
            for (var fileIdx = 0; fileIdx < dawFiles.length; fileIdx++) {
                console.log("goes in for ", fileIdx);
                if ((lanePlaying == 0 || lanePlaying == 1) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                    music[fileIdx].pause();
                    music[fileIdx].setVolume(lane1Vol);
                    console.log("paused in lane 1 with volume ", lane1Vol);
                }
                if ((lanePlaying == 0 || lanePlaying == 2) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                    music[fileIdx].pause();
                    music[fileIdx].setVolume(lane2Vol);
                    console.log("paused in lane 2 with volume ", lane2Vol);
                }
                if ((lanePlaying == 0 || lanePlaying == 3) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane3) {
                    music[fileIdx].pause();
                    music[fileIdx].setVolume(lane3Vol);
                    console.log("playing in lane 3 with volume ", lane3Vol);
                }
                if ((lanePlaying == 0 || lanePlaying == 4) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane4) {
                    music[fileIdx].pause();
                    music[fileIdx].setVolume(lane4Vol);
                    console.log("playing in lane 4 with volume ", lane4Vol);
                }
            }
            isMusicPlaying = false;
            mainPlay.setEnabled(true);
            mainPause.setEnabled(false);
            lane1Play.setEnabled(true);
            lane1Pause.setEnabled(false);
            lane2Play.setEnabled(true);
            lane2Pause.setEnabled(false);
            lane3Play.setEnabled(true);
            lane3Pause.setEnabled(false);
            lane4Play.setEnabled(true);
            lane4Pause.setEnabled(false);
        }
        else {
            console.log("Sound is being played");
            for (var fileIdx = 0; fileIdx < laneBoxes.length; fileIdx++) {
                console.log("goes in for ", fileIdx);
                if ((lanePlaying == 0 || lanePlaying == 1) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                    console.log("playing in lane 1 with volume ", lane1Vol, " file index ", fileIdx, " music ", music);
                    console.log("offset is ", lane1Offset[fileIdx], "with all being ", lane1Offset);
                    music[fileIdx].play(lane1Offset[fileIdx] * timeSignature);
                }
                if ((lanePlaying == 0 || lanePlaying == 2) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                    console.log("playing in lane 2 with volume ", lane2Vol);
                    music[fileIdx].setVolume(lane2Vol);
                    music[fileIdx].play(lane2Offset[fileIdx] * timeSignature);
                }
                if ((lanePlaying == 0 || lanePlaying == 3) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane3) {
                    console.log("playing in lane 3 with volume ", lane3Vol);
                    music[fileIdx].setVolume(lane3Vol);
                    music[fileIdx].play(lane3Offset[fileIdx] * timeSignature);
                }
                if ((lanePlaying == 0 || lanePlaying == 4) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane4) {
                    console.log("playing in lane 4 with volume ", lane4Vol);
                    music[fileIdx].setVolume(lane4Vol);
                    music[fileIdx].play(lane4Offset[fileIdx] * timeSignature);
                }
            }
            isMusicPlaying = true;
            mainPlay.setEnabled(false);
            mainPause.setEnabled(true);
            lane1Play.setEnabled(false);
            lane1Pause.setEnabled(true);
            lane2Play.setEnabled(false);
            lane2Pause.setEnabled(true);
            lane3Play.setEnabled(false);
            lane3Pause.setEnabled(true);
            lane4Play.setEnabled(false);
            lane4Pause.setEnabled(true);
        }
    }
       // Resets tracks
       function resetTracks(){ 
        for (var fileIdx = 0; fileIdx < dawFiles.length; fileIdx++) {

            if ((lanePlaying == 0 || lanePlaying == 1) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane1) {
                music[fileIdx].pause();
                music[fileIdx].play(lane1Offset[fileIdx] * timeSignature);
                music[fileIdx].stop()
                music[fileIdx].setVolume(lane1Vol);
            }
            if ((lanePlaying == 0 || lanePlaying == 2) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane2) {
                music[fileIdx].pause();
                music[fileIdx].play(lane2Offset[fileIdx] * timeSignature);
                music[fileIdx].stop()
                music[fileIdx].setVolume(lane2Vol);
            }
            if ((lanePlaying == 0 || lanePlaying == 3) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane3) {
                music[fileIdx].pause();
                music[fileIdx].play(lane3Offset[fileIdx] * timeSignature);
                music[fileIdx].stop()
                music[fileIdx].setVolume(lane3Vol);
            }
            if ((lanePlaying == 0 || lanePlaying == 4) && typeof dawFiles[fileIdx] != 'undefined' && typeof dawFiles[fileIdx].parent !== 'undefined' && dawFiles[fileIdx].parent == lane4) {
                music[fileIdx].pause();
                music[fileIdx].play(lane4Offset[fileIdx] * timeSignature);
                music[fileIdx].stop()
                music[fileIdx].setVolume(lane4Vol);
            }
            
        }
        isMusicPlaying = false;
        mainPlay.setEnabled(true);
        mainPause.setEnabled(false);
        lane1Play.setEnabled(true);
        lane1Pause.setEnabled(false);
        lane2Play.setEnabled(true);
        lane2Pause.setEnabled(false);
        lane3Play.setEnabled(true);
        lane3Pause.setEnabled(false);
        lane4Play.setEnabled(true);
        lane4Pause.setEnabled(false);
    }


    // Audio Toggle on Spacebar (Convert later to WebVR button when interacting with object)
    window.addEventListener("keydown", function (evt) {
        // Press space key to toggle music
        if (evt.keyCode === 32) {
            audioToggle();
        }
    });

    var desk;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "computer_desk.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        desk = newMeshes[0];
        console.log("Loaded Mesh");
        desk.scaling.x = .01;
        desk.scaling.y = .01;
        desk.scaling.z = .01;
        desk.position = new BABYLON.Vector3(-8.5, -2.5, -18);
        desk.rotation = new BABYLON.Vector3(0, 0, 0);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var guitar;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "guitar.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        guitar = newMeshes[0];
        console.log("Loaded guitar");
        guitar.scaling = new BABYLON.Vector3(.4, .4, .4);
        guitar.position = new BABYLON.Vector3(9.9, 1.5, -15.5);
        guitar.rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI * 3 / 2, Math.PI / 2);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var amp;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "amp.glb", scene, function (newMeshes) {
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
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "piano.glb", scene, function (newMeshes) {
        piano = newMeshes[0];
        console.log("Loaded Mesh2");
        piano.scaling.x = 3.5;
        piano.scaling.y = 3.5;
        piano.scaling.z = 3.5;
        piano.position = new BABYLON.Vector3(9.5, -2.5, -20);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var drums;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "drums.glb", scene, function (newMeshes) {
        drums = newMeshes[0];
        console.log("Loaded drums");
        drums.scaling = new BABYLON.Vector3(.0017, .0017, .0017)
        drums.position = new BABYLON.Vector3(8, -2.5, -27);
        drums.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var couch;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "couch.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        couch = newMeshes[0];
        console.log("Loaded Mesh2");
        couch.scaling.x = .03;
        couch.scaling.y = .03;
        couch.scaling.z = .03;
        couch.position = new BABYLON.Vector3(-6.55, -2.52, -25.5);
        couch.rotation = new BABYLON.Vector3(0, 0, 0);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var table;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "table.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        table = newMeshes[0];
        console.log("Loaded table");
        table.position = new BABYLON.Vector3(-6, -2, -26);
        table.scaling = new BABYLON.Vector3(3, 2.5, 3);
        table.rotation = new BABYLON.Vector3(0, Math.PI / 2, 0);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });
    var light;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "assets/", "ceiling_light.glb", scene, function (newMeshes) {
        light = newMeshes[0];
        console.log("Loaded Mesh2");
        light.scaling.x = .002;
        light.scaling.y = .0015;
        light.scaling.z = .002;
        light.position = new BABYLON.Vector3(0, 2.5, -22);
        newMeshes.forEach(function (item) {
            item.isPickable = true;
            item.collisionsEnabled = true;
            item.checkCollisions = true;

        });

    });

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
    var daw = BABYLON.MeshBuilder.CreatePlane("daw", { width: 14, height: 7, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene, true);
    daw.position = new BABYLON.Vector3(0, 0, -10.5);
    daw.material = dawMaterial;
    daw.checkCollisions = true;

    // Tab to represent initial project (more tabs in future)
    var dawtab = BABYLON.MeshBuilder.CreatePlane("tab", { width: 3, height: 5, sideOrientation: BABYLON.Mesh.DOUBLESIDE }, scene, true);
    dawtab.position = new BABYLON.Vector3(-5.5, 1.5, -10.5);
    dawtab.material = dawMaterial;

    var laneMaterial = new BABYLON.StandardMaterial("laneMaterial", scene);
    laneMaterial.ambientColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    laneMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    laneMaterial.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2);

    //Stop button
    var stop = BABYLON.MeshBuilder.CreatePlane("stop button", { width: .4, height: .4 }, scene);
    stop.position = new BABYLON.Vector3(2, -1.85, -11);
    stop.material = new BABYLON.StandardMaterial("Mat", scene);

    // Play/Pause variables 
    var mainPlay = BABYLON.MeshBuilder.CreateDisc("main play", { tessellation: 3, radius: .3 }, scene);
    mainPlay.position = new BABYLON.Vector3(0, -1.85, -11);
    mainPlay.material = laneMaterial;

    var p1 = BABYLON.MeshBuilder.CreatePlane(name, { width: .2, height: .5 }, scene);
    p1.position = new BABYLON.Vector3(0, 0, 0);
    p1.material = new BABYLON.StandardMaterial("Mat", scene);

    var p2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .2, height: .5 }, scene);
    p2.position = new BABYLON.Vector3(.3, 0, 0);
    p2.material = new BABYLON.StandardMaterial("Mat", scene);

    var mainPause = BABYLON.Mesh.MergeMeshes([p1, p2]);
    mainPause.position = new BABYLON.Vector3(0, -1.85, -11);
    mainPause.material = laneMaterial;
    mainPause.name = "main pause";
    mainPause.setEnabled(false);

    var lane1Play = BABYLON.MeshBuilder.CreateDisc("lane1 play", { tessellation: 3, radius: .2 }, scene);
    //lane1Play.position = new BABYLON.Vector3(-4.2, .2, -4.4);
    lane1Play.position = new BABYLON.Vector3(-6, 2.35, -11);
    lane1Play.material = laneMaterial;
    lane1Play.setEnabled(false);

    var pl1 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pl1.position = new BABYLON.Vector3(0, 0, 0);
    pl1.material = new BABYLON.StandardMaterial("Mat", scene);

    var pl2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pl2.position = new BABYLON.Vector3(.24, 0, 0);
    pl2.material = new BABYLON.StandardMaterial("Mat", scene);

    var lane1Pause = BABYLON.Mesh.MergeMeshes([pl1, pl2]);
    lane1Pause.position = new BABYLON.Vector3(-6.1, 2.35, -11);
    lane1Pause.material = laneMaterial;
    lane1Pause.name = "lane1 pause";
    lane1Pause.setEnabled(false);

    var lane2Play = BABYLON.MeshBuilder.CreateDisc("lane2 play", { tessellation: 3, radius: .2 }, scene);
    //lane2Play.position = new BABYLON.Vector3(-4.2, -1.4, -4.4);
    lane2Play.position = new BABYLON.Vector3(-6, 1.35, -11);
    lane2Play.material = laneMaterial;
    lane2Play.setEnabled(false);

    var pll1 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pll1.position = new BABYLON.Vector3(0, 0, 0);
    pll1.material = new BABYLON.StandardMaterial("Mat", scene);

    var pll2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pll2.position = new BABYLON.Vector3(.24, 0, 0);
    pll2.material = new BABYLON.StandardMaterial("Mat", scene);

    var lane2Pause = BABYLON.Mesh.MergeMeshes([pll1, pll2]);
    lane2Pause.position = new BABYLON.Vector3(-6.1, 1.35, -11);
    lane2Pause.material = laneMaterial;
    lane2Pause.name = "lane2 pause"
    lane2Pause.setEnabled(false);

    //lane3
    var lane3Play = BABYLON.MeshBuilder.CreateDisc("lane3 play", { tessellation: 3, radius: .2 }, scene);
    lane3Play.position = new BABYLON.Vector3(-6, 0.3, -11);
    lane3Play.material = laneMaterial;
    lane3Play.setEnabled(false);

    var plll1 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    plll1.position = new BABYLON.Vector3(0, 0, 0);
    plll1.material = new BABYLON.StandardMaterial("Mat", scene);

    var plll2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    plll2.position = new BABYLON.Vector3(.24, 0, 0);
    plll2.material = new BABYLON.StandardMaterial("Mat", scene);

    var lane3Pause = BABYLON.Mesh.MergeMeshes([plll1, plll2]);
    lane3Pause.position = new BABYLON.Vector3(-6.1, 0.3, -11);
    lane3Pause.material = laneMaterial;
    lane3Pause.name = "lane3 pause"
    lane3Pause.setEnabled(false);
    //lane4
    var lane4Play = BABYLON.MeshBuilder.CreateDisc("lane4 play", { tessellation: 3, radius: .2 }, scene);
    lane4Play.position = new BABYLON.Vector3(-6, -0.7, -11);
    lane4Play.material = laneMaterial;
    lane4Play.setEnabled(false);

    var pllll1 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pllll1.position = new BABYLON.Vector3(0, 0, 0);
    pllll1.material = new BABYLON.StandardMaterial("Mat", scene);

    var pllll2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .17, height: .37 }, scene);
    pllll2.position = new BABYLON.Vector3(.24, 0, 0);
    pllll2.material = new BABYLON.StandardMaterial("Mat", scene);

    var lane4Pause = BABYLON.Mesh.MergeMeshes([pllll1, pllll2]);
    lane4Pause.position = new BABYLON.Vector3(-6.1, -0.7, -11);
    lane4Pause.material = laneMaterial;
    lane4Pause.name = "lane4 pause"
    lane4Pause.setEnabled(false);

    // volume up/down per each lane 
    var vertical = BABYLON.MeshBuilder.CreatePlane(name, { width: .09, height: .25 }, scene);
    vertical.position = new BABYLON.Vector3(0, 0, 0);
    vertical.material = new BABYLON.StandardMaterial("Mat", scene);

    var hori = BABYLON.MeshBuilder.CreatePlane(name, { width: .25, height: .09 }, scene);
    hori.position = new BABYLON.Vector3(0, 0, 0);
    hori.material = new BABYLON.StandardMaterial("Mat", scene);

    var plus1 = BABYLON.Mesh.MergeMeshes([vertical, hori]);
    plus1.position = new BABYLON.Vector3(-5.8, 1.95, -11);
    plus1.name = "plus1";

    var vertical2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .09, height: .25 }, scene);
    vertical2.position = new BABYLON.Vector3(0, 0, 0);
    vertical2.material = new BABYLON.StandardMaterial("Mat", scene);

    var hori2 = BABYLON.MeshBuilder.CreatePlane(name, { width: .25, height: .09 }, scene);
    hori2.position = new BABYLON.Vector3(0, 0, 0);
    hori2.material = new BABYLON.StandardMaterial("Mat", scene);

    var plus2 = BABYLON.Mesh.MergeMeshes([vertical2, hori2]);
    plus2.position = new BABYLON.Vector3(-5.8, 0.95, -11);
    plus2.name = "plus2";

    var vertical3 = BABYLON.MeshBuilder.CreatePlane(name, { width: .09, height: .25 }, scene);
    vertical3.position = new BABYLON.Vector3(0, 0, 0);
    vertical3.material = new BABYLON.StandardMaterial("Mat", scene);

    var hori3 = BABYLON.MeshBuilder.CreatePlane(name, { width: .25, height: .09 }, scene);
    hori3.position = new BABYLON.Vector3(0, 0, 0);
    hori3.material = new BABYLON.StandardMaterial("Mat", scene);

    var plus3 = BABYLON.Mesh.MergeMeshes([vertical3, hori3]);
    plus3.position = new BABYLON.Vector3(-5.8, -0.1, -11);
    plus3.name = "plus3";


    var vertical4 = BABYLON.MeshBuilder.CreatePlane(name, { width: .09, height: .25 }, scene);
    vertical4.position = new BABYLON.Vector3(0, 0, 0);
    vertical4.material = new BABYLON.StandardMaterial("Mat", scene);

    var hori4 = BABYLON.MeshBuilder.CreatePlane(name, { width: .25, height: .09 }, scene);
    hori4.position = new BABYLON.Vector3(0, 0, 0);
    hori4.material = new BABYLON.StandardMaterial("Mat", scene);

    var plus4 = BABYLON.Mesh.MergeMeshes([vertical4, hori4]);
    plus4.position = new BABYLON.Vector3(-5.8, -1.1, -11);
    plus4.name = "plus4";

    var minus1 = BABYLON.MeshBuilder.CreatePlane("minus1", { width: .21, height: .09 }, scene);
    minus1.position = new BABYLON.Vector3(-6.2, 1.95, -11);
    minus1.material = new BABYLON.StandardMaterial("Mat", scene);

    var minus2 = BABYLON.MeshBuilder.CreatePlane("minus2", { width: .21, height: .09 }, scene);
    minus2.position = new BABYLON.Vector3(-6.2, 0.95, -11);
    minus2.material = new BABYLON.StandardMaterial("Mat", scene);

    var minus3 = BABYLON.MeshBuilder.CreatePlane("minus3", { width: .21, height: .09 }, scene);
    minus3.position = new BABYLON.Vector3(-6.2, -0.1, -11);
    minus3.material = new BABYLON.StandardMaterial("Mat", scene);

    var minus4 = BABYLON.MeshBuilder.CreatePlane("minus4", { width: .21, height: .09 }, scene);
    minus4.position = new BABYLON.Vector3(-6.2, -1.1, -11);
    minus4.material = new BABYLON.StandardMaterial("Mat", scene);

    // material for dynamic waveform objects
    var waveformMaterial = new BABYLON.StandardMaterial("texturePlane", scene);
    waveformMaterial.diffuseTexture = new BABYLON.Texture("textures/waveformjs.png", scene);
    waveformMaterial.specularColor = new BABYLON.Color3(0, 0, 0.1);
    waveformMaterial.backFaceCulling = false;

    var lane0Material = new BABYLON.StandardMaterial("measureBar", scene);
    lane0Material.diffuseTexture = new BABYLON.Texture("textures/measurebar.png", scene);
    lane0Material.specularColor = new BABYLON.Color3(0, 0, 0.1);
    var lane0 = BABYLON.MeshBuilder.CreatePlane("lane0", { width: 11, height: 0.35 }, scene)
    lane0.position = new BABYLON.Vector3(0.25, 3, -11);
    lane0.material = lane0Material;
    lane0.setEnabled(true);

    // lane 1 in the daw
    var lane1 = BABYLON.MeshBuilder.CreatePlane("lane1", { width: 11, height: .9 }, scene);
    lane1.position = new BABYLON.Vector3(0.25, 2.2, -11);
    lane1.material = laneMaterial;
    lane1.setEnabled(true);
    lanes.push(lane1);
    var lane1box = BABYLON.MeshBuilder.CreateBox("lane1box", { width: 11, height: .9, depth: 2 }, scene);
    lane1box.position = new BABYLON.Vector3(0.25, 2.2, -11.5);
    lane1box.isVisible = false;
    laneBoxes.push(lane1box);

    // lane 2 in the daw
    var lane2 = BABYLON.MeshBuilder.CreatePlane("lane2", { width: 11, height: .9 }, scene);
    lane2.position = new BABYLON.Vector3(0.25, 1.175, -11);
    lane2.material = laneMaterial;
    lane2.setEnabled(true);
    lanes.push(lane2);
    var lane2box = BABYLON.MeshBuilder.CreateBox("lane2box", { width: 11, height: .9, depth: 2 }, scene);
    lane2box.position = new BABYLON.Vector3(0.25, 1.175, -11.5);
    lane2box.isVisible = false;
    laneBoxes.push(lane2box);

    // lane 3 in the daw
    var lane3 = BABYLON.MeshBuilder.CreatePlane("lane3", { width: 11, height: .9 }, scene);
    lane3.position = new BABYLON.Vector3(0.25, 0.15, -11);
    lane3.material = laneMaterial;
    lane3.setEnabled(true);
    lanes.push(lane3);
    var lane3box = BABYLON.MeshBuilder.CreateBox("lane3box", { width: 11, height: .9, depth: 2 }, scene);
    lane3box.position = new BABYLON.Vector3(0.25, 0.15, -11.5);
    lane3box.isVisible = false;
    laneBoxes.push(lane3box);
    // lane 4 in the daw
    var lane4 = BABYLON.MeshBuilder.CreatePlane("lane4", { width: 11, height: .9 }, scene);
    lane4.position = new BABYLON.Vector3(0.25, -0.875, -11);
    lane4.material = laneMaterial;
    lane4.setEnabled(true);
    lanes.push(lane4);
    var lane4box = BABYLON.MeshBuilder.CreateBox("lane4box", { width: 11, height: .9, depth: 2 }, scene);
    lane4box.position = new BABYLON.Vector3(0.25, -0.875, -11.5);
    lane4box.isVisible = false;
    laneBoxes.push(lane4box);

    lane1Play.setEnabled(true);
    lane2Play.setEnabled(true);
    lane3Play.setEnabled(true);
    lane4Play.setEnabled(true);

    scene.registerBeforeRender(function () {
        lane1.rotation = new BABYLON.Vector3(0, 0, 0);
        lane1box.rotation = new BABYLON.Vector3(0, 0, 0);
        lane2.rotation = new BABYLON.Vector3(0, 0, 0);
        lane2box.rotation = new BABYLON.Vector3(0, 0, 0);
        lane3.rotation = new BABYLON.Vector3(0, 0, 0);
        lane3box.rotation = new BABYLON.Vector3(0, 0, 0);
        lane4.rotation = new BABYLON.Vector3(0, 0, 0);
        lane4box.rotation = new BABYLON.Vector3(0, 0, 0);

    });


    advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var panel = new Panel(scene, advancedTexture, "80px", "400px", dawFiles, music);
    samples = await displaySamples(panel, "public");
    var userPanel = new Panel(scene, advancedTexture, "80px", "400px", dawFiles, music);
    userSamples = await displaySamples(userPanel, username);

    scene.onPointerDown = async function (evt, pickResult) {
        if (pickResult.hit) {
            if (pickResult.pickedMesh.name.startsWith("dawFile")) {
                console.log("the " + pickResult.pickedMesh.name + " was selected.");
                //Check if we are currently in VR Mode
                if (vrHelper.isInVRMode) {
                    //If the parent of the file is the VR Camera, set it to null to release child
                    if (pickResult.pickedMesh.parent == vrHelper.currentVRCamera) {
                        pickResult.pickedMesh.setParent(null);
                        for (var laneBoxesI = 0; laneBoxesI < laneBoxes.length; laneBoxesI++) {
                            if (pickResult.pickedMesh.intersectsMesh(laneBoxes[laneBoxesI])) {
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
                                    }
                                    else if (laneBoxesI == 1) {
                                        lane2Offset.push(0);
                                    }
                                    else if (laneBoxesI == 2) {
                                        lane3Offset.push(0);
                                    }
                                    else {
                                        lane4Offset.push(0);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference) {
                                    pickResult.pickedMesh.position.x = base + difference;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset);
                                    }
                                    else if (laneBoxesI == 1) {
                                        lane2Offset.push(timeOffset);
                                    }
                                    else if (laneBoxesI == 2) {
                                        lane3Offset.push(timeOffset);
                                    }
                                    else {
                                        lane4Offset.push(timeOffset);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 2) {
                                    pickResult.pickedMesh.position.x = base + difference * 2;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 2);
                                    }
                                    else if (laneBoxesI == 1) {
                                        lane2Offset.push(timeOffset * 2);
                                    }
                                    else if (laneBoxesI == 2) {
                                        lane3Offset.push(timeOffset * 2);
                                    }
                                    else {
                                        lane4Offset.push(timeOffset * 2);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 3) {
                                    pickResult.pickedMesh.position.x = base + difference * 3;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 3);
                                    }
                                    else if (laneBoxesI == 1) {
                                        lane2Offset.push(timeOffset * 3);
                                    }
                                    else if (laneBoxesI == 2) {
                                        lane3Offset.push(timeOffset * 3);
                                    }
                                    else {
                                        lane4Offset.push(timeOffset * 3);
                                    }
                                } else if (pickResult.pickedMesh.position.x < compBase + difference * 4) {
                                    pickResult.pickedMesh.position.x = base + difference * 4;
                                    if (laneBoxesI == 0) {
                                        lane1Offset.push(timeOffset * 4);
                                    }
                                    else if (laneBoxesI == 1) {
                                        lane2Offset.push(timeOffset * 4);
                                    }
                                    else if (laneBoxesI == 2) {
                                        lane3Offset.push(timeOffset * 4);
                                    }
                                    else {
                                        lane4Offset.push(timeOffset * 4);
                                    }
                                }
                            }
                        }
                    }
                    else {
                        vrHelper.currentVRCamera = camera;
                        console.log("VR camera: ", vrHelper.currentVRCamera);
                        pickResult.pickedMesh.setParent(vrHelper.currentVRCamera);
                    }

                }

                else if (pickResult.pickedMesh.parent == camera) {
                    pickResult.pickedMesh.setParent(null);
                    for (var laneBoxesI = 0; laneBoxesI < laneBoxes.length; laneBoxesI++) {
                        if (pickResult.pickedMesh.intersectsMesh(laneBoxes[laneBoxesI])) {
                            console.log("parent is set to ", laneBoxes[laneBoxesI]);
                            pickResult.pickedMesh.setParent(lanes[laneBoxesI]);
                            pickResult.pickedMesh.rotation = pickResult.pickedMesh.parent.rotation;
                            pickResult.pickedMesh.position.y = 0;
                            pickResult.pickedMesh.position.z = -0.05;
                            var difference = 1.1;
                            var base = -1.50;
                            var compBase = -0.50;
                            var timeOffset = 1;


                            for (var n = 0; n < 10; n++) {
                                if (pickResult.pickedMesh.position.x < compBase + difference * n) {
                                    pickResult.pickedMesh.position.x = base + difference * n;
                                    for (var idxOfFile = 0; idxOfFile < dawFiles.length; idxOfFile++) {
                                        if (dawFiles[idxOfFile].name == pickResult.pickedMesh.name) {
                                            if (laneBoxesI == 0) {
                                                lane1Offset[idxOfFile] = timeOffset * n;
                                            }
                                            else if (laneBoxesI == 1) {
                                                lane2Offset[idxOfFile] = timeOffset * n;
                                            }
                                            else if (laneBoxesI == 2) {
                                                lane3Offset[idxOfFile] = timeOffset * n;
                                            }
                                            else {
                                                lane4Offset[idxOfFile] = (timeOffset * n);
                                            }
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            console.log("lane1Offset is: ", lane1Offset, "\nlane2Offset is: ", lane2Offset, "\nlane3Offset is: ", lane3Offset, "\nlane4Offset is: ", lane4Offset, "\nand laneBoxesI is", laneBoxesI);
                        }
                    }
                } else {
                    pickResult.pickedMesh.setParent(camera);
                }

            }

            // Main Play/Pause on DAW 
            else if (pickResult.pickedMesh.name == "main play") {
                console.log("main play has been clicked");
                lanePlaying = 0;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "main pause") {
                console.log("main pause has been clicked");
                lanePlaying = 0;
                audioToggle();
            }
            // Stop button
            else if (pickResult.pickedMesh.name == "stop button"){
                console.log("Stop button has been clicked");
                resetTracks();


            }
            // Lane Play/Pause
            else if (pickResult.pickedMesh.name == "lane1 play") {
                console.log("lane1 play has been clicked");
                lanePlaying = 1;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane1 pause") {
                console.log("lane1 pause has been clicked");
                lanePlaying = 1;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane2 play") {
                console.log("lane2 play has been clicked");
                lanePlaying = 2;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane2 pause") {
                console.log("lane2 pause has been clicked");
                lanePlaying = 2;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane3 play") {
                console.log("lane3 play has been clicked");
                lanePlaying = 3;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane3 pause") {
                console.log("lane3 pause has been clicked");
                lanePlaying = 3;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane4 play") {
                console.log("lane4 play has been clicked");
                lanePlaying = 4;
                audioToggle();
            }
            else if (pickResult.pickedMesh.name == "lane4 pause") {
                console.log("lane4 pause has been clicked");
                lanePlaying = 4;
                audioToggle();
            }


            // Adjusting lane volume
            else if (pickResult.pickedMesh.name == "plus1") {
                console.log("lane1 volume up has been pressed");
                adjustVolume(1, 1);
            }
            else if (pickResult.pickedMesh.name == "plus2") {
                console.log("lane2 volume up has been pressed");
                adjustVolume(2, 1);
            }
            else if (pickResult.pickedMesh.name == "plus3") {
                console.log("lane3 volume up has been pressed");
                adjustVolume(3, 1);

            }
            else if (pickResult.pickedMesh.name == "plus4") {
                console.log("lane4 volume up has been pressed");
                adjustVolume(4, 1);
            }
            else if (pickResult.pickedMesh.name == "minus1") {
                console.log("lane1 volume down has been pressed");
                adjustVolume(1, 0);
            }
            else if (pickResult.pickedMesh.name == "minus2") {
                console.log("lane2 volume down has been pressed");
                adjustVolume(2, 0);
            }
            else if (pickResult.pickedMesh.name == "minus3") {
                console.log("lane3 volume down has been pressed");
                adjustVolume(3, 0);
            }
            else if (pickResult.pickedMesh.name == "minus4") {
                console.log("lane4 volume down has been pressed");
                adjustVolume(4, 0);
            }
            // click on nothing to close the library panel
            else {
                panel.options.isVisible = false;
                userPanel.options.isVisible = false;
            }
            // click on the desk to show the music library
            if (pickResult.pickedMesh.name == "Desk_Desk_0") {
                console.log("opening default library");
                panel = new Panel(scene, advancedTexture, "80px", "400px", dawFiles, music);
                samples = await displaySamples(panel, "public");
                panel.options.isVisible = !panel.options.isVisible;
                console.log("THIS IS THE CURRENT VR CAMERA: ", vrHelper.currentVRCamera.name);
            }
            if (pickResult.pickedMesh.name == "Gitarre higher test15_01 - Default_0") {
                console.log(`opening ${username}'s library`);
                userPanel = new Panel(scene, advancedTexture, "80px", "400px", dawFiles, music);
                userSamples = await displaySamples(userPanel, username);
                userPanel.options.isVisible = !userPanel.options.isVisible;
            }
        }
    }

    userbutton = new usernameButton(scene, advancedTexture, "50px", "200px", username);
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
    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    fileButton.addEventListener('change', function () { uploadAudio(username) });
    // fileInput.onchange
    // uploadAudio(username);

})();
