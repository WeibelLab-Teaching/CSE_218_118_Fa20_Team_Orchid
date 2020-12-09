var uploadAudio = function (username) {
    var fileButton = document.getElementById('fileButton');
    var file = fileButton.files[0];
    console.log("uploading with username: ", username);
    console.log(file);
    var storageRef = firebase.storage().ref(file.name);
    var task = storageRef.put(file);
    task.on('state_changed', function progress(snapshot) {
        var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    }, function error(err) {
        console.log(error.code);
    }, function complete() {
        // Upload completed successfully, now we can get the download URL
        task.snapshot.ref.getDownloadURL()
            .then(function (url) {
                downloadURL = url;

                const newMusic = {
                    userHandle: username ? username : "public",
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
};  

var loadMusic = async function (fileName, scene, soundReady, mesh) {
    const storageRef = firebase.storage().ref();
    return storageRef.child(fileName).getDownloadURL().then(url => {
        return axios({
            method: 'get',
            url: url,
            responseType: 'blob'
        })
    }).then(blob => {
        return blob.data.arrayBuffer();
    }).then(buffer => {
        music = new BABYLON.Sound(fileName, buffer, scene, soundReady, { 
            loop: true,
        });
        music.attachToMesh(mesh);
        console.log(music)
        return music;
    }).catch(function (error) {
        console.error(error);
    });
  }

var displaySamples = async function (Panel, username) {
  return db
      .collection('musics')
      .get()
      .then((data) => {
          let samples = [];
          data.forEach((doc) => {
              if(doc.data().userHandle === username){
                samples.push({
                    userHandle: doc.data().userHandle,
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    audioUrl: doc.data().audioUrl
                });
                Panel.addOption(doc.data().name);
              }
          });
          return samples;
      })
      .catch((err) => {
          console.error(err);
          res.status(500).json({ error: err.code });
      });
}

function openForm() {
    document.getElementById("myForm").style.display = "block";
  }
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

class usernameButton
{
    constructor(scene, advancedTexture, height, width, username)
	{
        // Members
        this.username = username;
        this.height = height;
        this.width = width;
        this.color = "black";
        this.background = "white";
        this.scene = scene;
        this.advancedTexture = advancedTexture;

        // Container
		this.container = new BABYLON.GUI.Container();
        this.container.width = this.width;
        this.container.top = "15px";
        this.container.left = "5px";
        this.container.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.container.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.container.isHitTestVisible = false;
    

        // Options panel
        this.options = new BABYLON.GUI.StackPanel();
        this.options.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        this.options.isVisible = true;
        this.options.isVertical = true;

        this.advancedTexture.addControl(this.container);
        this.container.addControl(this.options);       

        this.button = BABYLON.GUI.Button.CreateSimpleButton('name', `User: ${username}`);
        this.button.height = this.height;
        this.button.width = this.width;
        this.button.background = this.background;
        this.button.color = this.color;
        this.button.alpha = 1.0;
        this.button.cornerRadius = 10;
        this.options.addControl(this.button);

    }
}

class Panel
{
	constructor(scene, advancedTexture, height, width, dawFiles, music, soundReady)
	{
		// Members
        this.height = height;
        this.width = width;
        this.color = "black";
        this.background = "white";
        this.scene = scene;
        this.advancedTexture = advancedTexture;
        this.dawFiles = dawFiles;
        this.music = music;
        this.soundReady = soundReady;

        // Container
		this.container = new BABYLON.GUI.Container();
        this.container.width = this.width;
        this.container.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.container.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.container.isHitTestVisible = false;
    

        // Options panel
        this.options = new BABYLON.GUI.StackPanel();
        this.options.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.options.top = this.height;
        this.options.isVisible = false;
        this.options.isVertical = true;

        var _this = this;

        //custom hack to make dropdown visible;
        this.container.onPointerEnterObservable.add(function(){
            _this.container.zIndex = 555; //some big value            
        });

        this.container.onPointerOutObservable.add(function(){
            _this.container.zIndex = 0; //back to original            
        });

        // add controls
        this.advancedTexture.addControl(this.container);
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
	
    addOption(text) {
        var button = BABYLON.GUI.Button.CreateSimpleButton(text, text);
        button.height = this.height;
        button.paddingTop = "-1px";
        button.background = this.background;
        button.color = this.color;
        button.alpha = 0.9;
        button.onPointerUpObservable.add(() => {
            this.options.isVisible = false;
        });
        button.onPointerClickObservable.add(async () => {
            var name = "dawFile_".concat(text);
            console.log("name is: " + name);
            var obj = BABYLON.MeshBuilder.CreatePlane(name, { width: 8, height: .8 }, this.scene);
            obj.position = new BABYLON.Vector3(0, 1, -13);
            obj.height = 1;
            obj.width = 2;
            obj.checkCollisions = true;
            obj.setEnabled(true);
            console.log("height of obj is " + obj.height + " and width is " + obj.width);
            var waveformMaterial = new BABYLON.StandardMaterial("texturePlane", this.scene);
            waveformMaterial.diffuseTexture = new BABYLON.Texture("textures/waveformjs.png", this.scene);
            waveformMaterial.specularColor = new BABYLON.Color3(0, 0, 0.1);
            waveformMaterial.backFaceCulling = false;
            obj.material = waveformMaterial;
            var audio = await loadMusic(text, this.scene, this.soundReady, obj);
            audio.setVolume(0.5);
            this.dawFiles.push(obj);
            this.music.push(audio);
            console.log(this.music);
            console.log(this.dawFiles);
        });
        this.options.addControl(button);
    }
};