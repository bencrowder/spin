// Spin: utility functions
// --------------------------------------------------

// Some Box2D shortcuts
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2Color = Box2D.Common.b2Color;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
var b2ContactListener = Box2D.Dynamics.b2ContactListener;


// requestAnimFrame
window.requestAnimFrame = (function() {
	return	window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
})();


// Box2d utility stuff
var Utils = function() {
	this.findCentroid = function(vs, count) {
		var c = new b2Vec2();
		var area = 0.0;
		var p1X = 0.0;
		var p1Y = 0.0;
		var inv3 = 1.0/3.0;

		for (i=0; i<count; ++i) {
			var p2 = vs[i];
			var p3 = i + 1 < count ? vs[parseInt(i+1)] : vs[0];
			var e1X = p2.x - p1X;
			var e1Y = p2.y - p1Y;
			var e2X = p3.x - p1X;
			var e2Y = p3.y - p1Y;

			var D = (e1X * e2Y - e1Y * e2X);
			var triangleArea = 0.5 * D;
			area += triangleArea;

			c.x += triangleArea * inv3 * (p1X + p2.x + p3.x);
			c.y += triangleArea * inv3 * (p1Y + p2.y + p3.y);
		}

		c.x *= 1.0/area;
		c.y *= 1.0/area;

		return c;
	};
};
