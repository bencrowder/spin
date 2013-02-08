// Spin
// --------------------------------------------------

// Global variables

var Server = function() {
	this.clicks = 1;			// timer
	this.debug = false;
	this.paused = false;

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
		'screen': {
			'width': 900,
			'height': 600,
			'fov': 40,
			'aspect': 900 / 600,
			'near': 0.1,
			'far': 50,
		},
		'world': {
			'gravity': 1.3,
			'scale': 25,
		},
		'camera': {
			'step': 0.1,
		},
		'wall': {
			'depth': 5,
			'density': 1,
			'friction': 0,
			'restitution': 0.9,
		},
		'obstacle': {
			'size': .4,
			'width': .85,
			'height': .85,
			'depth': 5,
			'density': 1,
			'friction': 0,
			'restitution': 0.9,
		},
		'damage': {
			'wall': 3,
			'floater': 5,
		},
		'player': {
			'initialX': 0,
			'initialY': 5.5,
			'initialAngle': 0,
			'size': 0.5,
			'maxHealth': 1000,
			'density': 10,
			'friction': 0.5,
			'restitution': 0.1,
			'angularDamping': 4.0,
			'maxAngularVelocity': 2,
			'turnSpeed': 150,
			'thrustAmount': 10,
			'maxVelocity': 15,
		},
		'exit': {
			'size': 0.25,
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

	this.update = function() {
		if (!server.paused) {
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

			// Draw
			server.b2world.DrawDebugData();
			server.display.render();

			// Clear
			server.b2world.ClearForces();

			// Update clicks
			server.clicks++;
		}

		requestAnimFrame(server.update);
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
					console.log("Health:", server.player.health);
				} else if (otherBody.type == 'exit') {
					console.log("Exit!");
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
};
