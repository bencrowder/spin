// Spin: world generation code
// --------------------------------------------------

var World = function() {
	// X, Y, width, height
	this.walls = [
		// First box
		[ -5, 0, 4.5, 1 ],			// left top
		[ 1.5, 0, 4.5, 1 ],			// right top
		[ -5, 1, 1, 9 ],			// left
		[ 5, 1, 1, 9 ],				// right
		[ -5, 10, 11, 1 ],			// bottom
		
		[ -5, 4, 7, .25 ],			// obstacle holders
		[ -5, 6, 3, .25 ],
		[ 3, 8, 3, .25 ],

		// Second box
		[ -10, -8, 20, 1 ],			// top

		[ -10, 14, 9, 1 ],			// bottom left
		[ 1, 14, 9, 1 ],			// bottom right

		[ -10, -7, 1, 21 ],			// left
		[ 9, -7, 1, 21 ],			// right

		[ -0.75, -2, .25, 2 ],			// top thin wall
		[ 1.5, -8, .25, 5.5 ],			// top thin wall
		[ -10, -4.5, 7, .25 ],			// top
	];

	this.obstacles = [
		// First box
		[ -3, 3 ],
		[ -3, 5 ],
		[ 3, 9 ],

		// Second box
		[ -9, -7 ],
		[ -2, -3 ],
		[ -7, 5 ],
	];

	// Generate Box2D vectors for the wallssss
	this.generate = function() {
		// Create the walls
		for (var i=0; i<this.walls.length; i++) {
			var wall = this.walls[i];
			var x = wall[0];
			var y = wall[1];
			var w = wall[2];
			var h = wall[3];
			var wallArray = [];

			wallArray.push(new b2Vec2(0, 0));
			wallArray.push(new b2Vec2(w, 0));
			wallArray.push(new b2Vec2(w, h));
			wallArray.push(new b2Vec2(0, h));

			this.addWall(wall, wallArray);
		}

		// Create the obstacles
		server.obstacles = [];
		for (var i=0; i<this.obstacles.length; i++) {
			var obstacle = this.obstacles[i];
			this.addObstacle(new b2Vec2(obstacle[0], obstacle[1]));
		}
	}

	// Add a wall box to the Box2D world
	this.addWall = function(wall, wallArray) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.angularDamping = 1;

		bodyDef.position.Set(wall[0], wall[1]);
		bodyDef.userData = { type: 'wall' };

		// Create the shape and assign the vector to it
		var wallPoly = new b2PolygonShape();
		wallPoly.SetAsArray(wallArray, wallArray.length);

		// Create the fixturedef
		var fixDef = new b2FixtureDef();
		fixDef.shape = wallPoly;
		fixDef.density = server.settings.wall.density;
		fixDef.friction = server.settings.wall.friction;
		fixDef.restitution = server.settings.wall.restitution;

		var wallBody = server.b2world.CreateBody(bodyDef);
		wallBody.CreateFixture(fixDef);
	};

	// Add an obstacle to the Box2D world
	this.addObstacle = function(position) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;

		bodyDef.position.Set(position.x, position.y);
		bodyDef.userData = { type: 'obstacle' };

		// Create the fixturedef
		var fixDef = new b2FixtureDef();
		fixDef.shape = new b2CircleShape(server.settings.obstacle.size);
		fixDef.density = server.settings.obstacle.density;
		fixDef.friction = server.settings.obstacle.friction;
		fixDef.restitution = server.settings.obstacle.restitution;

		var body = server.b2world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		server.obstacles.push({ x: position.x, y: position.y, angle: 0, body: body });
	};
};

