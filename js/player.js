// Spin: player code
// --------------------------------------------------

var Player = function() {
	this.x = server.settings.player.initialX;
	this.y = server.settings.player.initialY;
	this.angle = server.settings.player.initialAngle;
	this.health = server.settings.player.maxHealth;
	this.body;

	this.displayObj;

	this.generate = function() {
		var bodyDef = new b2BodyDef;
		bodyDef.position.x = this.x;
		bodyDef.position.y = this.y;
		bodyDef.position.z = 0;
		bodyDef.type = b2Body.b2_dynamicBody;
		bodyDef.angularDamping = server.settings.player.angularDamping;
		bodyDef.userData = { type: 'player', data: this };

		// Create a circle for the player
		var fixDef = new b2FixtureDef;
		fixDef.shape = new b2CircleShape(server.settings.player.size);
		fixDef.density = server.settings.player.density;
		fixDef.friction = server.settings.player.friction;
		fixDef.restitution = server.settings.player.restitution;

		// Create the Box2d body
		this.body = server.b2world.CreateBody(bodyDef);
		this.body.CreateFixture(fixDef);
	};

	this.keypressed = function() {
		var key_SPACE = 32;
		var key_LEFT = 37;
		var key_UP = 38;
		var key_RIGHT = 39;
		var key_DOWN = 40;

		// Pause
		if (server.keys[key_SPACE]) {
			server.paused = (server.paused) ? false : true;

			return false;
		}

		// Turn left
		if (server.keys[key_LEFT]) {
			if (this.body.GetAngularVelocity() > -server.settings.player.maxAngularVelocity) {
				this.body.ApplyTorque(-server.settings.player.turnSpeed);
			}
		}

		// Turn right
		if (server.keys[key_RIGHT]) {
			if (this.body.GetAngularVelocity() < server.settings.player.maxAngularVelocity) {
				this.body.ApplyTorque(server.settings.player.turnSpeed);
			}
		}

		// Thrust
		if (server.keys[key_UP]) {
			var velocity = this.body.GetLinearVelocity().Normalize();
			if (velocity < server.settings.player.maxVelocity) {
				this.body.ApplyImpulse(new b2Vec2(Math.cos(this.angle) * server.settings.player.thrustAmount, Math.sin(this.angle) * server.settings.player.thrustAmount), this.body.GetWorldCenter());
			}
		}

		// Maybe add brakes later?
		if (server.keys[key_DOWN]) {
			return false;
		}
	};
};
