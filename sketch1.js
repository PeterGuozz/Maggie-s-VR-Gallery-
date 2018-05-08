// variable to hold a reference to our A-Frame world
var world;
var sound;
var container;

// array to hold some particles
var particles = [];

// // which images should we use as our background?
// var allImages = ['#sky1', '#sky2', '#sky3'];
//
// // which image are we currently using?
// var currentImage = 0;



function preload(){
	    sound = loadSound('sound1.mp3');
}


function setup() {
	// no canvas needed


	noCanvas();

	sound.play();
	// construct the A-Frame world
	// this function requires a reference to the ID of the 'a-scene' tag in our HTML document
	world = new World('VRScene');

	container = new Container3D({x:0, y:1, z:-5});

	world.add(container);
	// now that we have a world we can add elements to it using a series of wrapper classes
	// these classes are discussed in greater detail on the A-Frame P5 documentation site
	// http://cs.nyu.edu/~kapp/courses/cs0380fall2017/aframep5.php

	// what textures can we choose from?
	var textures = ['iron', 'gold', 'stone','iron1','stone1','gold1','iron2','stone2','gold2','gold3','stone3','stone4','stone5','stone6','stone7','stone8','stone9','stone10','stone11'];

	// var r = new Ring({
	// 				x: 8 , y:1, z:0,
	// 				radiusInner:0.5,
	// 				radiusOuter: 1,
	// 				side: 'double',
	// 				red:255, green:0, blue:0,
	// 			});
	// 			// world.add(r);
	// 			container.addChild(r);
  // //
	// var to = new Torus({
	// 						x: 10 , y:2, z:0,
	// 						radius:0.5,
	// 						radiusTubular: 0.05,
	// 						red:0, green:255, blue:0,
	// 					});
	// 	// world.add(to);
	// 		container.addChild(to);

	// create lots of boxes
	for (var i = 0; i < 40; i++) {
		// pick a location
		var x = random(-50, 50);
		var z = random(-50, 50);

		// pick a random texture
		var t = textures[ int(random(textures.length)) ];

		// create a box here
		var b = new Box({
							x:x,
							y:0.5,
							z:z,
							width: 6,
							depth: 6,
							height: 6,
							asset:t,
							clickFunction: function(theBox) {
								// update this cube's color to something random!
								theBox.setColor( random(255), random(255), random(255) );
							}
		});

		// add the box to the world
		world.add(b);
	}



	// create a plane to serve as our "ground"
	var g = new Plane({
						x:0, y:0, z:0,
						width:100, height:100,
						asset: 'sky1',
						repeatX: 100,
						repeatY: 100,
						rotationX:-90, metalness:0.25
					   });

	// add the plane to our world
	world.add(g);
}

function draw() {
	// always move the player forward a little bit - their movement vector
	// is determined based on what they are looking at
  //	world.moveUserForward(0.05);

	// note that you can also only trigger movement when the mouse is down or the user
	// is touching the screen

	if (mouseIsPressed) {
		world.moveUserForward(0.05);
	}
	container.spinY(1);
	// wrap around!

	// step 1: get the user's position
	// this is an object with three properties (x, y and z)
	var pos = world.getUserPosition();

	// now evaluate
	if (pos.x > 50) {
		world.setUserPosition(-50, pos.y, pos.z);
	}
	else if (pos.x < -50) {
		world.setUserPosition(50, pos.y, pos.z);
	}
	if (pos.z > 50) {
		world.setUserPosition(pos.x, pos.y, -50);
	}
	else if (pos.z < -50) {
		world.setUserPosition(pos.x, pos.y, 50);
	}


	//particles
	// always create a new particle
	var temp = new Particle(0, 0, -5);

	// add to array
	particles.push( temp );

	// draw all particles
	for (var i = 0; i < particles.length; i++) {
		var result = particles[i].move();
		if (result == "gone") {
			particles.splice(i, 1);
			i-=1;
		}
	}

	// move to the next sky image periodically
	// if (frameCount % 600 == 0) {
	// 	// move to the next image in our array
	// 	currentImage += 1;
	// 	if (currentImage == allImages.length) {
	// 		currentImage = 0;
	// 	}
	//
	// 	// set our sky to the newly selected image
	//
	// 	// grab a reference to our sky sphere
	// 	// var sky = select('#theSky');
	// 	// sky.attribute('src', allImages[currentImage]);
	// }

}

function Particle(x,y,z) {
	// construct a new Box that lives at this position
	this.myBox = new Sphere({
							x:x, y:y, z:z,
							red: random(255), green:random(255), blue:random(255),
							radius: 0.5
	});

	// add the box to the world
	world.add(this.myBox);

	// keep track of an offset in Perlin noise space
	this.xOffset = random(1000);
	this.zOffset = random(2000, 3000);

	// function to move our box
	this.move = function() {
		// compute how the particle should move
		// the particle should always move up by a small amount
		var yMovement = 0.01;

		// the particle should randomly move in the x & z directions
		var xMovement = map( noise(this.xOffset), 0, 1, -0.05, 0.05);
		var zMovement = map( noise(this.zOffset), 0, 1, -0.05, 0.05);

		// update our poistions in perlin noise space
		this.xOffset += 0.01;
		this.yOffset += 0.01;

		// set the position of our box (using the 'nudge' method)
		this.myBox.nudge(xMovement, yMovement, zMovement);

		// // make the boxes shrink a little bit
		// var boxScale = this.myBox.getScale();
		// this.myBox.setScale( boxScale.x-0.005, boxScale.y-0.005, boxScale.z-0.005);

		// if we get too small we need to indicate that this box is now no longer viable
		if (boxScale.x <= 0) {
			// remove the box from the world
			world.remove(this.myBox);
			return "gone";
		}
		else {
			return "ok";
		}

	}
}
