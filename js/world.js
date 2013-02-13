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
		[ 15, -25, 3, 70 ],			// right side

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

		// Box 8, under box 3
		[ -10, 30, 1, 5 ],			// left

		[ -20, 40, 25, 1 ],			// bottom
		[ -22, 50, 29, 1 ],			// bottom

		[ -5, 33, 1, 5 ],			// left
		[ 2, 35, 1, 5 ],			// left

		[ -23, 21, 1, 30 ],			// left
		[ -13, 40, 1, 10 ],			// left
		[ -3, 40, 1, 10 ],			// left

		[ -23, 0, 10, 1 ],			// left
		[ -23, 20, 10, 1 ],			// left
		[ -18, 10, 8, 1 ],			// left

		[ -80, 65, 122, 1 ],			// bottom
		[ 41, 51, 1, 15 ],			// bottom
		[ -80, -20, 1, 80 ],			// bottom

		// Box 9, above box 2
		[ -25, -25, 40, 1 ],		// top

		[ -23, -21, 1, 38 ],		// left
		[ -22, -15, 10, 1 ],		// top
		[ -12, -19, 1, 5 ],		// left

		[ -30, -25, 1, 40 ],		// top

		// Trap
		[ -40, -30, 51, 1 ],			// right side
		[ 11, -70, 1, 41 ],			// right side
		[ 18, -70, 1, 41 ],			// right side
		[ 19, -30, 51, 1 ],			// right side
		[ 11, -71, 8, 1 ],			// right side

		// Fake box
		[ 19, -50, 48, 1 ],
		[ 19, -40, 10, 1 ],
		[ 25, -39, 1, 5 ],
		[ 22, -45, 1, 5 ],
		[ 35, -45, 1, 15 ],
		[ 45, -49, 1, 15 ],
		[ 46, -35, 10, 1 ],
		[ 46, -45, 5, 1 ],

		// Left corridor
		[ -60, -30, 1, 40 ],		// top
		[ -60, 10, 30, 1 ],		// top

		// Upper left expanse
		[ -100, -100, 250, 5 ],		// top
		[ -100, -95, 5, 220 ],		// top
		[ -100, 120, 250, 5 ],		// top
		[ 150, -100, 5, 225 ],		// top

		[ -30, 25, 1, 30 ],
		[ -30, 55, 50, 1 ],

		[ -40, 15, 1, 15 ],
		[ -40, 30, 10, 1 ],

		[ -45, 11, 1, 25 ],

		[ -45, 36, 15, 1 ],

		// Exit
		[ 100, 80, 50, 1 ],
		[ 100, 81, 1, 25 ],			// left opening
		[ 100, 110, 1, 10 ],		// left opening

		[ 101, 90, 13, 1 ],
		[ 101, 105, 23, 1 ],
		[ 101, 110, 13, 1 ],
		[ 123, 105, 1, 10 ],		// left opening
		[ 126, 80, 1, 30 ],		// left opening
		[ 127, 100, 5, 1 ],
		[ 127, 93, 5, 1 ],
		[ 135, 80, 1, 30 ],
		[ 143, 90, 1, 30 ],
		[ 140, 110, 1, 5 ],
		[ 130, 110, 1, 5 ],
		[ 135, 101, 5, 1 ],
		[ 135, 94, 5, 1 ],
		[ 135, 84, 5, 1 ],
		[ 144, 98, 3, .25 ],
		[ 147, 102, 3, .25 ],
		[ 144, 106, 3, .25 ],
		[ 147, 110, 3, .25 ],
		[ 144, 114, 3, .25 ],
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

		// Third box
		[ -3, 22 ],
		[ 3, 22 ],

		[ 11, 0 ],

		[ 21, 35 ],
		[ 28, 40 ],
		[ 38, 37 ],

		[ 38, 27 ],
		[ 22, 18 ],
		[ 22, 0 ],
		[ 48, 27 ],
		[ 56, 8 ],

		[ 21, -15 ],
		[ 25, -15 ],
		[ 29, -15 ],

		[ 145.5, 112 ],
		[ 145.5, 104 ],
		[ 145.5, 96 ],

		[ 148.5, 114 ],
		[ 148.5, 106 ],
		[ 148.5, 98 ],

		[ 130, 95 ],
		[ 128, 85 ],
		[ 140, 95 ],
		[ 138, 85 ],

		[ 102, 86 ],
		[ 105, 90 ],
		[ 110, 91 ],
		[ 115, 92 ],
		[ 120, 93 ],
		[ 125, 94 ],

		[ 113, 82 ],
		[ 117, 83 ],
		[ 122, 84 ],

		[ 113, 102 ],
		[ 117, 103 ],
		[ 122, 104 ],

		[ 110, 112 ],
		[ 115, 113 ],
		[ 120, 114 ],

		[ -30, 20 ],
		[ -50, 25 ],
		[ -25, 15 ],
		[ -80, -80 ],
		[ -60, -60 ],
		[ -40, -40 ],
		[ -50, -80 ],
		[ -20, -80 ],
		[ 0, -80 ],
		[ 30, -80 ],
		[ 50, -80 ],
		[ 70, -85 ],
		[ 90, -82 ],
		[ 110, -81 ],
		[ 120, -79 ],
		[ 10, -40 ],
		[ 13, -45 ],

		[ 90, -42 ],
		[ 110, -41 ],
		[ 120, -49 ],

		[ 80, -22 ],
		[ 100, -21 ],
		[ 60, -29 ],
		[ 120, -29 ],

		[ 87, 22 ],
		[ 107, 21 ],
		[ 67, 29 ],
		[ 127, 29 ],

		[ 85, 52 ],
		[ 105, 51 ],
		[ 65, 59 ],
		[ 125, 59 ],

		[ 0, 80 ],
		[ 10, 80 ],
		[ -10, 80 ],
		[ -20, 70 ],
		[ 20, 70 ],

		[ -60, 30 ],
		[ -63, 50 ],
	];

	this.exit = [ 145, 117.25 ];

	// Generate Box2D vectors for the walls, obstacles, and exit
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

		this.addExit(new b2Vec2(this.exit[0], this.exit[1]));
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

	// Add the exit to the Box2D world
	this.addExit = function(position) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;

		bodyDef.position.Set(position.x, position.y);
		bodyDef.userData = { type: 'exit' };

		// Create the fixturedef
		var fixDef = new b2FixtureDef();
		fixDef.shape = new b2CircleShape(server.settings.exit.size);
		fixDef.density = server.settings.exit.density;
		fixDef.friction = server.settings.exit.friction;
		fixDef.restitution = server.settings.exit.restitution;

		var body = server.b2world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		server.exit = { x: position.x, y: position.y, angle: 0, body: body };
	};
};

