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
		
		[ -4, 4, 6, .25 ],			// obstacle holders
		[ -4, 6, 2, .25 ],
		[ 3, 8, 2, .25 ],

		// Second box
		[ -10, -8, 20, 1 ],			// top

		[ -10, 14, 9, 1 ],			// bottom left
		[ 1, 14, 9, 1 ],			// bottom right

		[ -10, -7, 1, 21 ],			// left
		[ 9, -7, 1, 21 ],			// right

		[ -0.75, -2, .25, 2 ],		// top thin wall
		[ 1.5, -7, .25, 5.5 ],		// top thin wall
		[ -9, -4.5, 6, .25 ],		// top thin wall from left
		[ 5.75, -4, .25, 4.5 ],		// top thin wall in upper right TODO: touchup

		[ 8, 0, 2, .25 ],			// top thin wall on right side
		[ 5, 5, 2, .25 ],			// top thin wall on right side
		[ 8, 10, 2, .25 ],			// top thin wall on right side

		// Third box, below second one
		[ -10, 30, 3, 1 ],			// bottom left
		[ -5, 30, 15, 1 ],			// bottom right

		[ -10, 15, 1, 2 ],			// left (with gap)
		[ -10, 20, 1, 11 ],			// left

		[ 9, 15, 1, 12 ],			// right
		[ 9, 29, 1, 2 ],			// right

		[ -5, 20, 10, .25 ],		// thin wall in center (capital I)
		[ -5, 25, 10, .25 ],		// thin wall in center
		[ 0, 20.25, .25, 4.75 ],			// top thin wall

		// Fourth box, to right of box 3
		[ 15, -25, 1, 70 ],			// right side

		[ 7, 30, 1, 20 ],			// left side

		[ 7, 50, 50, 1 ],			// bottom

		[ 22, 35, 1, 15 ],			// prongs
		[ 32, 35, 1, 15 ],			// prongs
		[ 42, 30, 1, 15 ],			// prongs

		[ 18, 29, 30, 1 ],			// top of bottom part

		[ 57, -20, 1, 70 ],			// right side

		// Fifth box, above bottom part of fourth box
		[ 18, 20, 10, 5 ],			// cubes
		[ 30, 20, 5, 5 ],			// cubes
		[ 38, 20, 5, 5 ],			// cubes
		[ 46, 20, 5, 5 ],			// cubes

		[ 24, 12, 5, 5 ],			// cubes
		[ 32, 12, 5, 5 ],			// cubes
		[ 40, 12, 5, 5 ],			// cubes
		[ 48, 12, 9, 5 ],			// cubes

		[ 18, 4, 10, 5 ],			// cubes
		[ 30, 4, 5, 5 ],			// cubes
		[ 38, 4, 5, 5 ],			// cubes
		[ 46, 4, 5, 5 ],			// cubes

		[ 24, -4, 5, 5 ],			// cubes
		[ 32, -4, 5, 5 ],			// cubes
		[ 40, -4, 5, 5 ],			// cubes
		[ 48, -4, 9, 5 ],			// cubes

		[ 20, -10, 38, 1 ],			// top of bottom part

		// Sixth box, above fifth box
		[ 18, -25, 48, 1 ],			// top

		[ 22, -20, .25, 5 ],		// prongs
		[ 26, -18, .25, 5 ],		// prongs
		[ 30, -24, .25, 5 ],		// prongs
		[ 33, -15, .25, 5 ],		// prongs
		[ 37, -24, .25, 9 ],		// prongs
		[ 40, -18, .25, 5 ],		// prongs

		[ 42, -20, 5, .25 ],		// prongs
		[ 40.25, -15, 5, .25 ],		// prongs

		[ 49, -24, .25, 9 ],		// prongs
		[ 49.25, -20, 5, .25 ],		// prongs

		// Seventh box, to the right of sixth box
		[ 70, -50, 1, 50 ],			// right side
		[ 58, 0, 13, 1 ],			// bottom
		[ 58, -5, 10, 1 ],			// prongs
		[ 58, -10, 10, 1 ],			// prongs
		[ 58, -15, 10, 1 ],			// prongs

		// Box 8, above box 7
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

