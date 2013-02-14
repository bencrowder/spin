// Spin
// --------------------------------------------------

// Global variables

var Server = function() {
	this.clicks = 1;			// timer
	this.debug = false;
	this.paused = false;
	this.gameOver = false;
	this.win = false;
	this.timeLeft;
	this.lightsOn = false;

	this.b2world;				// Box2d world
	this.canvas;				// HTML canvas
	this.c;						// Context

	this.renderer;				// THREE.js
	this.camera;
	this.scene;

	this.player;
	this.obstacles;
	this.world;
	this.utils;
	this.cameraRotation = 0;
	this.targetRotation = 0;
	
	this.settings = {
		'player': {
			'initialX': 0,		// 0
			'initialY': 5.5,	// 5.5
			'initialAngle': 0,
			'size': 0.5,
			'maxHealth': 1000,
			'density': 8,
			'friction': 0.1,
			'restitution': 0.1,
			'angularDamping': 4.0,
			'maxAngularVelocity': 2,
			'turnSpeed': 150,
			'thrustAmount': 10,
			'maxVelocity': 5,
		},
		'game': {
			'timeLeft': 600,			// in seconds (10 minutes)
		},
		'screen': {
			'width': 700,
			'height': 600,
			'fov': 45,
			'aspect': 700 / 600,
			'near': 0.1,
			'far': 40,
		},
		'world': {
			'gravity': 2,
			'scale': 25,
		},
		'camera': {
			'step': 0.1,
		},
		'wall': {
			'depth': 7,
			'density': 1,
			'friction': 0,
			'restitution': 0.9,
		},
		'obstacle': {
			'size': .4,
			'width': .85,
			'height': .85,
			'depth': 2,
			'density': 1,
			'friction': 0,
			'restitution': 1,
		},
		'damage': {
			'hitLength': 15,
			'wall': 3,
			'floater': 5,
			'obstacle': 10,
		},
		'exit': {
			'size': 1.5,
			'topradius': 1.25,
			'bottomradius': 1.75,
			'height': .25,
			'density': 5,
			'friction': 1,
			'restitution': 0,
		},
	};

	this.keys = {};
	this.debugDraw;

	this.gravities = [
		[ 0, this.settings.world.gravity ],
		[ this.settings.world.gravity, 0 ],
		[ 0, -this.settings.world.gravity ],
		[ -this.settings.world.gravity, 0 ]
	];
	this.rotations = [ 0, Math.PI / 2, Math.PI, 3 * Math.PI / 2 ];
	this.rotIndex = 0;

	this.resetGame = function() {
		// Instance objects
		server.player = new Player();
		server.world = new World();
		server.utils = new Utils();
		server.display = new Display();

		// Set up the Box2D world	
		server.b2world = new b2World(new b2Vec2(0, server.settings.world.gravity), true);
		server.b2scale = server.settings.world.scale;
		server.b2stepAmount = 1/60;

		// Create the world
		server.world.generate();

		// Create the player
		server.player.generate();

		// Set up THREE.js, etc.
		server.display.init();

		// Set up collision detection
		server.collision();
	
		// Start the game loop again
		requestAnimFrame(server.update);
	};

	this.update = function() {
		if (!server.paused && !server.gameOver && !server.win) {
			// Run physics
			server.b2world.Step(server.b2stepAmount, 10, 10);

			// Update player location
			server.player.x = server.player.body.GetPosition().x;
			server.player.y = server.player.body.GetPosition().y;
			server.player.angle = server.player.body.GetAngle();

			// Update obstacle locations
			for (var i=0; i<server.obstacles.length; i++) {
				var o = server.obstacles[i];

				o.x = o.body.GetPosition().x;
				o.y = o.body.GetPosition().y;
				o.angle = o.body.GetAngle();
			}

			// Every so often, rotate the world
			if (server.clicks % 300 == 0) {
				server.rotateWorld();
			}

			// Drop the player's hit counter
			if (server.player.lastHitCounter > 0) {
				server.player.lastHitCounter--;
			}

			// Drop the time left counter
			if (server.clicks % 60 == 0) {
				server.timeLeft--;
			}

			// Draw
			if (server.debug) {
				server.b2world.DrawDebugData();
			}
			server.display.render();

			// Clear
			server.b2world.ClearForces();

			// Update clicks
			server.clicks++;

			// If player health is 0 or time has run out, game over
			if (server.player.health <= 0 || server.timeLeft <= 0) {
				server.gameOver = true;
			}
		}

		// Game over
		if (server.gameOver) {
			server.display.gameOver();

			/*
			setTimeout(function() {
				// Remove the gamescreen stuff
				$("#gamescreen, #gameoverscreen").remove();

				// Take off the game over flag
				server.gameOver = false;

				// Reset the game
				server.resetGame();
			}, server.settings.gameOverDelay);
			*/
		}

		// Win
		if (server.win) {
			server.display.win();
		}

		if (!server.gameOver && !server.win) {
			requestAnimFrame(server.update);
		}
	};

	this.collision = function() {
		this.listener = new b2ContactListener();

		this.listener.PostSolve = function(contact, impulse) {
			var bodyA = contact.GetFixtureA().GetBody().GetUserData();
			var bodyB = contact.GetFixtureB().GetBody().GetUserData();

			// Player collisions
			if (bodyA.type == 'player' || bodyB.type == 'player') {
				var playerBody = (bodyA.type == 'player') ? bodyA : bodyB;
				var otherBody = (bodyA.type == 'player') ? bodyB : bodyA;

				if (otherBody.type == 'wall') {
					server.player.health -= server.settings.damage.wall;
					
					server.updateHealthDisplay();
					server.player.lastHitCounter += server.settings.damage.hitLength;
				} else if (otherBody.type == 'obstacle') {
					server.player.health -= server.settings.damage.obstacle;

					server.updateHealthDisplay();
					server.player.lastHitCounter += server.settings.damage.hitLength;
				} else if (otherBody.type == 'exit') {
					server.win = true;
				}
			} else {
				// Other collisions
			}
		};

		this.b2world.SetContactListener(this.listener);
	};

	this.rotateWorld = function() {
		this.rotIndex++;
		if (this.rotIndex > this.gravities.length - 1) this.rotIndex = 0;
		var grav = this.gravities[this.rotIndex];

		// Change gravity
		server.b2world.SetGravity(new b2Vec2(grav[0], grav[1]));

		// And set the target rotation	
		server.targetRotation = this.rotations[this.rotIndex];
	};

	this.updateHealthDisplay = function() {
		var healthWidth = Math.floor((server.player.health / 1000) * 680);

		$("#status .health").width(healthWidth);
	};
};
