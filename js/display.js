// Spin
// --------------------------------------------------

var Display = function() {
	this.player;
	this.obstacles = [];
	this.light;
	this.spotlight;

	this.playerMat;
	this.hurtPlayerMat;

	this.dir = 1;

	this.init = function() {
		// Resize page
		$("#page").width(server.settings.screen.width);

		// Set up THREE.js
		server.renderer = new THREE.WebGLRenderer({ antialias: true });

		if (server.lightsOn) {
			server.settings.screen.fov = 110;
		}

		server.camera = new THREE.PerspectiveCamera(server.settings.screen.fov, server.settings.screen.aspect, server.settings.screen.near, server.settings.screen.far);
		server.camera.up = new THREE.Vector3(0, 0, 1);

		server.scene = new THREE.Scene();

		if (server.lightsOn) {
			server.camera.position.z = 39;
		} else {
			server.camera.position.z = (server.firstPerson) ? server.settings.player.initialZ : 20;
		}

		server.scene.add(server.camera);

		server.renderer.setSize(server.settings.screen.width, server.settings.screen.height);
		server.renderer.setClearColorHex(0x000000, 1);
		server.renderer.shadowMapEnabled = true;
		server.renderer.shadowMapSoft = true;

		if ($("#container canvas")) {
			$("#container canvas").remove();
		}
		$("#container").append(server.renderer.domElement);

		this.initPostProcessing();

		this.initBackgroundPlane();

		this.initPlayer();

		this.initWalls();

		this.initObstacles();

		this.initExit();

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

		var bgMat = new THREE.MeshPhongMaterial({ map: bgTexture });

		server.plane = new THREE.Mesh(new THREE.PlaneGeometry(10000, 10000, 10, 10), bgMat);

		server.plane.receiveShadow = true;
		server.plane.position.z = 0;

		server.scene.add(server.plane);
	};

	// Set up player
	this.initPlayer = function() {
		this.playerMat = new THREE.MeshLambertMaterial({ color: 0x345678 });
		this.hurtPlayerMat = new THREE.MeshLambertMaterial({ color: 0xac2323 });
		this.hurtPlayerMat.transparent = true;
		this.hurtPlayerMat.opacity = 0.2;

		var playerShape = new THREE.Shape();
		playerShape.moveTo(0, .25);
		playerShape.lineTo(.55, 0);
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
			var widthSegments = Math.max(Math.ceil(width), 1);
			var heightSegments = Math.max(Math.ceil(height), 1);

			var newWall = new THREE.Mesh(new THREE.CubeGeometry(width, height, server.settings.wall.depth - .25, widthSegments, heightSegments), wallMat);
			newWall.position.x = x + (width / 2);
			newWall.position.y = -(y + (height / 2));
			newWall.castShadow = true;
			newWall.receiveShadow = true;

			server.scene.add(newWall);

			var newTop = new THREE.Mesh(new THREE.CubeGeometry(width, height, .25, widthSegments, heightSegments), wallTopMat);
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
		var obstacleMat = new THREE.MeshPhongMaterial({ color: 0x661111 });

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

	// Set up exit
	this.initExit = function() {
		var exitPos = server.world.exit;

		var x = exitPos[0];
		var y = exitPos[1];

		var exitMat = new THREE.MeshLambertMaterial({ color: 0x000000, emissive: 0x88ff33 });

		var exit = new THREE.Mesh(new THREE.CylinderGeometry(1.25, 1.75, 0.25, 32, 4, false), exitMat);
		exit.position.x = x + (1.75 / 2);
		exit.position.y = -(y + (1.75 / 2));
		exit.rotation.x = Math.PI / 2;
		exit.castShadow = true;

		server.scene.add(exit);
	};

	// Set up lights
	this.initLights = function() {
		// Player light
		this.light = new THREE.PointLight(0xffffff);
		this.light.position.x = server.settings.player.initialX;
		this.light.position.y = server.settings.player.initialY;
		this.light.position.z = 1;
		this.light.intensity = 10;
		this.light.distance = 10;
		server.scene.add(this.light);

		this.spotlight = new THREE.SpotLight(0xffffff);
		this.spotlight.position.x = 0;
		this.spotlight.position.y = 5;
		this.spotlight.position.z = 3;
		this.spotlight.target.position.x = 1;
		this.spotlight.target.position.y = 0;
		this.spotlight.target.position.z = 2;
		this.spotlight.castShadow = true;
		this.spotlight.shadowDarkness = 0.8;
		this.spotlight.shadowMapWidth = 2048;
		this.spotlight.shadowMapHeight = 2048;
		this.spotlight.shadowCameraFov = 3;
		this.spotlight.intensity = (server.firstPerson) ? 0.5 : 4;
		this.spotlight.distance = 15;
		server.scene.add(this.spotlight);

		if (server.lightsOn) {
			var ambLight = new THREE.AmbientLight(0x999999);
			server.scene.add(ambLight);
		}
	};

	this.render = function() {
		if (!server.paused) {
			var x = server.player.x;
			var y = -server.player.y;
			var angle = -server.player.angle;
			var target_x = x + 5 * Math.cos(angle);
			var target_y = y + 5 * Math.sin(angle);

			// Update player location
			this.player.position.x = x;
			this.player.position.y = y;
			this.player.rotation.z = angle;

			// Update light locations
			this.light.position.x = x;
			this.light.position.y = y;
			this.spotlight.position.x = x;
			this.spotlight.position.y = y;
			this.spotlight.target.position.x = target_x;
			this.spotlight.target.position.y = target_y;

			// Move the camera to follow the player
			server.camera.position.x = x;
			server.camera.position.y = y;
			if (server.firstPerson) {
				// Look the way the player is pointing
				if (server.swoopMode) {
					server.camera.position.z += 0.1 * this.dir;

					if (server.camera.position.z > 15 || server.camera.position.z < 1) {
						this.dir *= -1;
					}
				}

				server.camera.lookAt(new THREE.Vector3(target_x, target_y, server.settings.player.initialZ));
			} else {
				server.camera.lookAt(new THREE.Vector3(x, y, 0));
			}

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

			// Rotate the camera
			if (!server.firstPerson) {
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
			}

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
		$("body").prepend("<h1 id='gamescreen'>You won!</h1><div id='winscreen' class='gamescreen'></div>");
	};
};
