// Spin: keys
// --------------------------------------------------

function keypressed(keys, player) {
	var key_LEFT = 37;
	var key_UP = 38;
	var key_RIGHT = 39;
	var key_DOWN = 40;

	// Turn left
	if (keys[key_LEFT]) {
		player.angle -= server.settings.turnSpeed;
		player.body.SetAngle(player.angle);
	}

	// Turn right
	if (keys[key_RIGHT]) {
		player.angle += server.settings.turnSpeed;
		player.body.SetAngle(player.angle);
	}

	// Thrust
	if (keys[key_UP]) {
		player.body.ApplyImpulse(new b2Vec2(Math.cos(player.angle) * server.settings.thrustSpeed, Math.sin(player.angle) * server.settings.thrustSpeed), player.body.GetWorldCenter());
	}

	// Maybe add brakes later?
	if (keys[key_DOWN]) {
		return false;
	}
}
