// Spin
// --------------------------------------------------

var Display = function() {
	this.player;
	this.obstacles = [];

	this.playerMat;
	this.hurtPlayerMat;

	this.init = function() {
		// Set up THREE.js
		server.renderer = new THREE.WebGLRenderer({ antialias: true });
		server.camera = new THREE.PerspectiveCamera(server.settings.screen.fov, server.settings.screen.aspect, server.settings.screen.near, server.settings.screen.far);
		server.scene = new THREE.Scene();

		server.scene.add(server.camera);
		server.camera.position.z = 20;
		server.renderer.setSize(server.settings.screen.width, server.settings.screen.height);
		server.renderer.setClearColorHex(0x000000, 1);
		server.renderer.shadowMapEnabled = true;

		if ($("#container canvas")) {
			$("#container canvas").remove();
		}
		$("#container").append(server.renderer.domElement);

		this.initPostProcessing();

		this.initBackgroundPlane();

		this.initPlayer();

		this.initWalls();

		this.initObstacles();

		this.initLights();

		// Set up debug draw
		
		if (server.debug) {	
			debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(server.c);
			debugDraw.SetDrawScale(server.canvas.width / server.settings.world.scale);
			debugDraw.SetFillAlpha(0.1);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit);
			server.b2world.SetDebugDraw(debugDraw);
		}
	};

	// Set up post processing
	this.initPostProcessing = function() {
		this.composer = new THREE.EffectComposer(server.renderer);
		this.composer.addPass(new THREE.RenderPass(server.scene, server.camera));

		var effect = new THREE.ShaderPass(THREE.VignetteShader);
		effect.uniforms['offset'].value = 0.95;
		effect.uniforms['darkness'].value = 1.1;
		this.composer.addPass(effect);

		var effect = new THREE.ShaderPass(THREE.FilmShader);
		effect.uniforms['grayscale'].value = 0.1;
		effect.uniforms['sCount'].value = 14000;
		effect.uniforms['nIntensity'].value = 0.3;
		effect.uniforms['sIntensity'].value = 0.1;
		effect.renderToScreen = true;
		this.composer.addPass(effect);
		
		var effect = new THREE.ShaderPass(THREE.SepiaShader);
		effect.uniforms['amount'].value = 0.3;
		effect.renderToScreen = true;
		this.composer.addPass(effect);
	};

	// Set up background plane
	this.initBackgroundPlane = function() {
		var bgTexture = new THREE.ImageUtils.loadTexture('images/bg.jpg');
		bgTexture.wrapS = bgTexture.wrapT = THREE.RepeatWrapping; 
		bgTexture.repeat.set(1500, 1500);

		var bgMat = new THREE.MeshLambertMaterial({ map: bgTexture });

		var plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 10, 10), bgMat);

		plane.doubleSided = true;
		plane.receiveShadow = true;
		plane.position.z = -1;
		server.plane = plane;

		server.scene.add(plane);
	};

	// Set up player
	this.initPlayer = function() {
		this.playerMat = new THREE.MeshLambertMaterial({ color: 0x345678 });
		this.hurtPlayerMat = new THREE.MeshLambertMaterial({ color: 0xac2323 });
		this.hurtPlayerMat.transparent = true;
		this.hurtPlayerMat.opacity = 0.2;

		var playerShape = new THREE.Shape();
		playerShape.moveTo(0, .25);
		playerShape.lineTo(.5, 0);
		playerShape.lineTo(0, -.25);
		playerShape.lineTo(0, 0);
		var playerGeom = new THREE.ExtrudeGeometry(playerShape, { amount: .015 });

		this.player = new THREE.Mesh(playerGeom, this.playerMat);

		this.player.position.set(server.player.x, -server.player.y, 0);
		this.player.scale.set(.1, .1, .1);
		this.player.castShadow = true;
		this.player.receiveShadow = true;
		
		server.scene.add(this.player);
	};

	// Set up walls
	this.initWalls = function() {
		var wallTexture = new THREE.ImageUtils.loadTexture('images/wall.jpg');
		wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping; 
		wallTexture.repeat.set(1, 1);

		var wallTopTexture = new THREE.ImageUtils.loadTexture('images/walltop.jpg');
		wallTopTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping; 
		wallTopTexture.repeat.set(1, 1);

		var wallMat = new THREE.MeshLambertMaterial({ map: wallTexture });
		var wallTopMat = new THREE.MeshLambertMaterial({ map: wallTopTexture });

		for (var i=0; i<server.world.walls.length; i++) {
			var wall = server.world.walls[i];

			var x = wall[0];
			var y = wall[1];
			var width = wall[2];
			var height = wall[3];

			var newWall = new THREE.Mesh(new THREE.CubeGeometry(width, height, server.settings.wall.depth - .25), wallMat);
			newWall.position.x = x + (width / 2);
			newWall.position.y = -(y + (height / 2));
			newWall.castShadow = true;
			newWall.receiveShadow = true;

			server.scene.add(newWall);

			var newTop = new THREE.Mesh(new THREE.CubeGeometry(width, height, .25), wallTopMat);
			newTop.position.x = x + (width / 2);
			newTop.position.y = -(y + (height / 2));
			newTop.position.z = server.settings.wall.depth / 2;
			newTop.castShadow = true;
			newTop.receiveShadow = true;
			server.scene.add(newTop);
		}
	};

	// Set up obstacles
	this.initObstacles = function() {
		var obstacleMat = new THREE.MeshLambertMaterial({ color: 0x661111 });
		obstacleMat.opacity = 0.6;
		obstacleMat.transparent = true;

		this.obstacles = [];
		for (var i=0; i<server.obstacles.length; i++) {
			var obst = server.obstacles[i];

			var x = obst[0];
			var y = obst[1];

			var newObstacle = new THREE.Mesh(new THREE.CubeGeometry(server.settings.obstacle.width, server.settings.obstacle.height, server.settings.obstacle.depth), obstacleMat);
			newObstacle.position.x = x + (server.settings.obstacle.width / 2);
			newObstacle.position.y = -(y + (server.settings.obstacle.height / 2));
			newObstacle.castShadow = true;
			newObstacle.receiveShadow = true;

			this.obstacles.push(newObstacle);
			server.scene.add(newObstacle);
		}
	};

	// Set up lights
	this.initLights = function() {
		var pointLight = new THREE.PointLight(0xffffff);
		pointLight.position.x = 10;
		pointLight.position.y = -50;
		pointLight.position.z = 130;
		pointLight.intensity = 0.35;
		server.scene.add(pointLight);

		var spotLight = new THREE.SpotLight(0xffffff);
		spotLight.position.x = 50;
		spotLight.position.y = 50;
		spotLight.position.z = 50;
		spotLight.castShadow = true;
		spotLight.shadowDarkness = 0.5;
		spotLight.shadowMapWidth = 2048;
		spotLight.shadowMapHeight = 2048;
		spotLight.intensity = 2;
		server.scene.add(spotLight);
	};

	this.render = function() {
		if (!server.paused) {
			// Update player location
			this.player.position.x = server.player.x;
			this.player.position.y = -server.player.y;
			this.player.rotation.z = -server.player.angle;

			if (server.player.lastHitCounter > 0) {
				this.player.material = this.hurtPlayerMat;
			} else {
				this.player.material = this.playerMat;
			}

			// Update obstacle locations
			for (var i=0; i<server.obstacles.length; i++) {
				var obst = server.obstacles[i];

				this.obstacles[i].position.x = obst.x;
				this.obstacles[i].position.y = -obst.y;
				this.obstacles[i].rotation.z = obst.angle;
			}

			// Point the camera
			server.camera.position.x = this.player.position.x;
			server.camera.position.y = this.player.position.y;
			server.camera.lookAt(new THREE.Vector3(this.player.position.x, this.player.position.y, 0));

			// Rotate the camera
			if (server.cameraRotation != server.targetRotation) {
				server.cameraRotation += server.settings.camera.step;

				// Bounds checking
				if (server.targetRotation == 0) {
					if (server.cameraRotation > Math.PI * 2) {
						server.cameraRotation = 0;
					}
				} else {
					if (server.cameraRotation > server.targetRotation) {
						server.cameraRotation = server.targetRotation;
					}
				}
			}
			server.camera.rotation.z = server.cameraRotation;

			// Render the scene
			this.composer.render(0);

			// Time left counter
			$(".countdown h2").html(server.timeLeft);
		}
	};

	this.gameOver = function() {
		$("body").prepend("<h1 id='gamescreen'>Game over!</h1><div id='gameoverscreen' class='gamescreen'></div>");
	};

	this.win = function() {
		$("#container").prepend("<h1 id='gamescreen'>You won!</h1><div id='winscreen' class='gamescreen'></div>");
	};
};
