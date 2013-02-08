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
		
		[ -5, 4, 3, .25 ],
		[ -5, 6, 3, .25 ],
	];

	this.obstacles = [
		[ -3, 5 ]
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
		console.log(server.obstacles);
	}

	// Add a wall box to the Box2D world
	this.addWall = function(wall, wallArray) {
		var sliceBody = new b2BodyDef();
		sliceBody.type = b2Body.b2_staticBody;
		sliceBody.angularDamping = 1;
		//var center = server.utils.findCentroid(wallArray, wallArray.length);

		sliceBody.position.Set(wall[0], wall[1]);
		sliceBody.userData = { type: 'wall' };

		// Create the shape and assign the vector to it
		var slicePoly = new b2PolygonShape();
		slicePoly.SetAsArray(wallArray, wallArray.length);

		// Create the fixturedef
		var sliceFixture = new b2FixtureDef();
		sliceFixture.shape = slicePoly;
		sliceFixture.density = server.settings.wall.density;
		sliceFixture.friction = server.settings.wall.friction;
		sliceFixture.restitution = server.settings.wall.restitution;

		var worldSlice = server.b2world.CreateBody(sliceBody);
		worldSlice.CreateFixture(sliceFixture);
	};

	// Add an obstacle to the Box2D world
	this.addObstacle = function(position) {
		var bodyDef = new b2BodyDef();
		bodyDef.type = b2Body.b2_dynamicBody;

		bodyDef.position.Set(position.x, position.y);
		bodyDef.userData = { type: 'obstacle' };

		// Create the fixturedef
		var fixDef = new b2FixtureDef();
		fixDef.shape = new b2CircleShape(server.settings.exit.size);
		fixDef.density = server.settings.exit.density;
		fixDef.friction = server.settings.exit.friction;
		fixDef.restitution = server.settings.exit.restitution;

		var body = server.b2world.CreateBody(bodyDef);
		body.CreateFixture(fixDef);

		server.obstacles.push({ x: position.x, y: position.y, angle: 0, body: body });
	};
};

