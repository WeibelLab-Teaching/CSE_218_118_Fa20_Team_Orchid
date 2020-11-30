class Dropdown
{
	constructor(advancedTexture, height, width)
	{
		// Members
        this.height = height;
        this.width = width;
        this.color = "black";
        this.background = "white";

        this.advancedTexture = advancedTexture;

        // Container
		this.container = new BABYLON.GUI.Container();
        this.container.width = this.width;
        this.container.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.container.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        this.container.isHitTestVisible = false;
        
        // Primary button
        this.button = BABYLON.GUI.Button.CreateSimpleButton(null, "Please Select");
        this.button.height = this.height;
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        // Options panel
        this.options = new BABYLON.GUI.StackPanel();
        this.options.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.options.top = this.height;
        this.options.isVisible = false;
        this.options.isVertical = true;

        var _this = this;
        this.button.onPointerUpObservable.add(function() {
            _this.options.isVisible = !_this.options.isVisible;
        });

        //custom hack to make dropdown visible;
        this.container.onPointerEnterObservable.add(function(){
            _this.container.zIndex = 555; //some big value            
        });

        this.container.onPointerOutObservable.add(function(){
            _this.container.zIndex = 0; //back to original            
        });

        // add controls
        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.button);
        this.container.addControl(this.options);        
	}

    get top() {
        return this.container.top;
    }

    set top(value) {
       this.container.top = value;     
    }

    get left() {
        return this.container.left;
    }

    set left(value) {
       this.container.left = value;     
    } 
	
    addOption(text, callback)
	{
        var button = BABYLON.GUI.Button.CreateSimpleButton(text, text);
        button.height = this.height;
        button.paddingTop = "-1px";
        button.background = this.background;
        button.color = this.color;
        button.alpha = 1.0;
        button.onPointerUpObservable.add(() => {
            this.options.isVisible = false;            
        });        
        button.onPointerClickObservable.add(callback); 
        this.options.addControl(button);
    }

    clearOptions(){
        this.options = new BABYLON.GUI.StackPanel();
        this.options.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.options.top = this.height;
        this.options.isVisible = false;
        this.options.isVertical = true;
    }
	
};



var canvas = document.getElementById("renderCanvas");

var uploadAudio = function () {
    const storageRef = firebase.storage().ref();

    var uploader = document.getElementById('uploader');
    var fileButton = document.getElementById('fileButton');
    fileButton.addEventListener('change', function (e) {
        var file = e.target.files[0];
        var storageRef = firebase.storage().ref(file.name);
        var task = storageRef.put(file);
        task.on('state_changed', function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            uploader.value = percentage;
        }, function error(err) {
            console.log(error.code);
        }, function complete() {
            // Upload completed successfully, now we can get the download URL
            task.snapshot.ref.getDownloadURL()
                .then(function (url) {
                    downloadURL = url;

                    const newMusic = {
                        userHandle: "public",
                        name: file.name,
                        createdAt: new Date().toISOString(),
                        audioUrl: downloadURL
                    };

                    db.collection('musics')
                        .add(newMusic)
                        .then(doc => { })
                        .catch(err => {
                            res.status(500).json({ error: `something went wrong` });
                            console.error(err);
                        })

                    console.log('File available at', downloadURL);
                });
        });
    });  
}

var loadMusic = async function (fileName, scene, soundReady, audioBox) {
    const storageRef = firebase.storage().ref();
    storageRef.child(fileName).getDownloadURL().then(url => {
        return axios({
            method: 'get',
            url: url,
            responseType: 'blob'
        })
    }).then(blob => {
        return blob.data.arrayBuffer();
    }).then(buffer => {
        music = new BABYLON.Sound("FromArrayBuffer", buffer, scene, soundReady, { 
            loop: true,
            autoplay: false
        });
        music.attachToMesh(audioBox);
    }).catch(function (error) {
        console.error(error);
    });
}

var displaySamples = async function (dropdown) {
    return db
        .collection('musics')
        .get()
        .then((data) => {
            let samples = [];
            data.forEach((doc) => {
                samples.push({
                    userHandle: doc.data().userHandle,
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    audioUrl: doc.data().audioUrl
                });
                dropdown.addOption(doc.data().name);
            });
            return samples;
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
        });
}


var createScene = async function () {
    var scene = new BABYLON.Scene(engine);

    // Lights
    var light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-10, -5, 10), scene);
    var light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, -5, -2), scene);
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


    //WILL CREATE FUNCTION TO REDUCE REDUDANT CODE
    //Create Plane For Ceiling
    // var ceiling = BABYLON.MeshBuilder.CreatePlane("plane", {height:40, width: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    // var ceilingMaterial = new BABYLON.StandardMaterial("ceilingColor", scene);
    
    // //Postioning plane to the middle of the room
    // ceiling.position = new BABYLON.Vector3(0, 5, -20);
    // ceilingMaterial.diffuseColor = new BABYLON.Color3(0,0,0);

    // //Rotating plane to fit in ceiling
    // ceiling.rotation.x = Math.PI / 2;
    // ceiling.material = ceilingMaterial;

    // /******************** Create Plane For Wall 1 (front) *********************/
    // var wall1 = BABYLON.MeshBuilder.CreatePlane("wall1", {height:10, width: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    // var wallMaterial = new BABYLON.StandardMaterial("wallColor", scene);
    
    // //Postioning plane to the middle of the room
    // wall1.position = new BABYLON.Vector3(0, 0, -1);
    // wallMaterial.diffuseColor = new BABYLON.Color3(1,0,1);

    // //Rotating plane to fit in wall
    // //ceiling.rotation.x = Math.PI / 2;
    // wall1.material = wallMaterial;

    // /******************** Create Plane For Wall 2 (left) *********************/
    // var wall2 = BABYLON.MeshBuilder.CreatePlane("wall2", {height:10, width: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    // var wallMaterial = new BABYLON.StandardMaterial("wallColor", scene);
    
    // //Postioning plane to the middle of the room
    // wall2.position = new BABYLON.Vector3(-19.5, 0, -20);
    // wallMaterial.diffuseColor = new BABYLON.Color3(1,0,1);

    // //Rotating plane to fit in wall
    // wall2.rotation.y = -(Math.PI / 2);
    // wall2.material = wallMaterial;

    // /******************** Create Plane For Wall 3 (right) *********************/
    // var wall3 = BABYLON.MeshBuilder.CreatePlane("wall3", {height:10, width: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    // var wallMaterial = new BABYLON.StandardMaterial("wallColor", scene);
    
    // //Postioning plane to the middle of the room
    // wall3.position = new BABYLON.Vector3(19.5, 0, -20);
    // wallMaterial.diffuseColor = new BABYLON.Color3(1,0,1);

    // //Rotating plane to fit in wall
    // wall3.rotation.y = (Math.PI / 2);
    // wall3.material = wallMaterial;

    //  /******************** Create Plane For Wall 4 (back) *********************/
    //  var wall4 = BABYLON.MeshBuilder.CreatePlane("wall3", {height:10, width: 40, sideOrientation: BABYLON.Mesh.DOUBLESIDE}, scene);
    //  var wallMaterial = new BABYLON.StandardMaterial("wallColor", scene);
     
    //  //Postioning plane to the middle of the room
    //  wall4.position = new BABYLON.Vector3(0, 0, -39.5);
    //  wallMaterial.diffuseColor = new BABYLON.Color3(1,0,1);
 
    //  //Rotating plane to fit in wall
    //  wall4.rotation.y = -(Math.PI);
    //  wall4.material = wallMaterial;

    box.material = new BABYLON.StandardMaterial("Mat", scene);
    box.material.diffuseTexture = new BABYLON.Texture("textures/wood.jpg", scene);
    box.material.specularColor = new BABYLON.Color3.Black();
    box.position = new BABYLON.Vector3(0, 1, -20);

    //Set gravity for the scene (G force like, on Y-axis)
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

    // Enable Collisions
    scene.collisionsEnabled = true;
    box.checkCollisions = true;
    // wall1.checkCollisions = true;
    // wall2.checkCollisions = true;
    // wall3.checkCollisions = true;
    // wall4.checkCollisions = true;
    //Then apply collisions and gravity to the active camera
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera._needMoveForGravity = true;

    // Enable VR
    var vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false});
    //vrHelper.enableTeleportation({floorMeshes: [box]});

    // Audio Creation
    var isMusicPlaying = true;
    //var music = new BABYLON.Sound("music", "guitar.mp3", scene, soundReady, { loop: true });
    var music1 = new BABYLON.Sound("rolling_A1", "rolling_A1.mp3", scene, soundReady, {loop: false});
    var music2 = new BABYLON.Sound("rolling_A2", "rolling_A2.mp3", scene, soundReady, {loop: false});
    var music3 = new BABYLON.Sound("rolling_S1", "rolling_S1.mp3", scene, soundReady, {loop: false});
    var music4 = new BABYLON.Sound("rolling_S2", "rolling_S2.mp3", scene, soundReady, {loop: false});
    var music5 = new BABYLON.Sound("rolling_S3", "rolling_S3.mp3", scene, soundReady, {loop: false});

    music1.setVolume(0.5)
    music2.setVolume(0.5)
    music3.setVolume(0.5)
    music4.setVolume(0.5)
    music5.setVolume(0.5)

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

    var desk;
    meshisin = BABYLON.SceneLoader.ImportMesh("", "./", "computer_desk.glb", scene, function (newMeshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        desk = newMeshes[0];
        console.log("Loaded Mesh");
        desk.scaling.x = .01;
        desk.scaling.y = .01;
        desk.scaling.z = .01;
        desk.position = new BABYLON.Vector3(-6.5, -3, -7);
        desk.rotation.y = 90;
    });

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

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var dropdownA = new Dropdown(advancedTexture, "40px", "250px");
    dropdownA.button.children[0].text = "My Library";
    dropdownA.top = "10px";
    dropdownA.right = "10px";
    samples = await displaySamples(dropdownA);

    // button = BABYLON.GUI.Button.CreateSimpleButton(null, "Reload");
    // button.width = "48px";
    // button.height = "86px";
    // button.thickness = 0;
    // button.verticalAlignment = 0;
    // button.horizontalAlignment = 1;
    // button.top = "60px";
    // advancedTexture.addControl(button);

    // const playerUI = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    // samplePanel = createSamplePanel(playerUI);
    // playerUI.idealHeight = 720; //fit our fullscreen ui to this height
    // //create a simple button
    // const pauseBtn = BABYLON.GUI.Button.CreateSimpleButton("start", "SAMPLES");
    // pauseBtn.width = "48px";
    // pauseBtn.height = "86px";
    // pauseBtn.thickness = 0;
    // pauseBtn.verticalAlignment = 0;
    // pauseBtn.horizontalAlignment = 1;
    // pauseBtn.top = "-16px";
    // playerUI.addControl(pauseBtn);
    // pauseBtn.zIndex = 10;
    // this.pauseBtn = pauseBtn;
    // //this handles interactions with the start button attached to the scene
    // pauseBtn.onPointerClickObservable.add(async () => {
    //     var samples = await displaySamples();
    //     console.log(samples)
    //     samplePanel.isVisible = true;
    //     samplePanel.textBlock
    //     playerUI.addControl(samplePanel);
    // });

    return scene;
};

createSamplePanel = (playerUI) => {
    const samplePanel = new BABYLON.GUI.Rectangle();
    samplePanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    samplePanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    samplePanel.height = 0.8;
    samplePanel.width = 0.5;
    samplePanel.thickness = 1;
    samplePanel.background = "blue";
    samplePanel.cornerRadius = 20;
    samplePanel.isVisible = false;

    //stack panel for the buttons
    const stackPanel = new BABYLON.GUI.StackPanel();
    stackPanel.width = .83;
    samplePanel.addControl(stackPanel);

    const resumeBtn = BABYLON.GUI.Button.CreateSimpleButton("resume", "RESUME");
    resumeBtn.width = 0.18;
    resumeBtn.height = "44px";
    resumeBtn.color = "white";
    // resumeBtn.fontFamily = "Viga";
    resumeBtn.paddingBottom = "14px";
    resumeBtn.cornerRadius = 14;
    resumeBtn.fontSize = "12px";
    resumeBtn.textBlock.resizeToFit = true;
    resumeBtn.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    resumeBtn.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    stackPanel.addControl(resumeBtn);

    resumeBtn.onPointerDownObservable.add(() => {
        samplePanel.isVisible = false;
        playerUI.removeControl(samplePanel);
    });
    
    
    return samplePanel;
}

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
