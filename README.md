## Spin

A game hastily thrown together for a game jam with some coworkers. Uses WebGL (THREE.js) and Box2D.

* [Home page](http://bencrowder.net/coding/spin)
* [Release blog post](http://bencrowder.net/blog/2013/02/spin)

### How to Play

Up to go forward, left and right to turn. The goal is to get to the exit before the timer runs out without dying (touching the walls or obstacles hurts you). Also, the world rotates by 90° every few seconds.

### Config

In `js/server.js`, you can change the following properties to tweak what happens in the game:

* `server.lightsOn`: shows the game from a zoomed out perspective with some ambient light so you can see more of the maze.
* `server.firstPerson`: switches the game to first-person mode. (Gravity is off and the world doesn't rotate.) In first-person mode, you can hit the 's' key to toggle swoop mode, which moves the camera up and down (alternating between the 2D top-down view and the 3D first-person view). Warning, it gets annoying after five or six seconds.
