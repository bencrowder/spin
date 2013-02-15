// Spin
// --------------------------------------------------

var server;

$(document).ready(function() {
	server = new Server();	

	server.canvas = document.getElementById("debug");
	server.c = server.canvas.getContext("2d");

	if (server.debug) {
		$("#debug").show();
	}

	// Instance objects
	server.player = new Player();
	server.world = new World();
	server.utils = new Utils();
	server.display = new Display();

	// Set up the Box2D world	
	var gravity = (server.firstPerson) ? 0 : server.settings.world.gravity;
	server.b2world = new b2World(new b2Vec2(0, gravity), true);
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

	// Set up counter
	server.timeLeft = server.settings.game.timeLeft;

	// Keyboard stuff
	$(document).keydown(function(e) {
		server.keys[e.which] = true;
		return server.player.keypressed();
	});

	$(document).keyup(function(e) {
		delete server.keys[e.which];
	});

	// Start the game
	requestAnimFrame(server.update);
});
