//SPACE INVADERS
//originally in 224*256 pixel grid,
//so I tried to emulate that using the p5 rect function as 'pixels'
//and some basic maths using width and height

//not using ECMAscript classes becaus the implementation broke for some reason,
//but does work with functions and 'this.' syntax.

//////////////////////////////////////////////////////////////
//															//
//						  TARGETS							//
//															//
//		1: Implement a score system	 done					//
//		2: Add more invader classes, use 2d arrays done		//
//		3: Implement game states with booleans	done		//
//		4: Animate the invaders maybe						//
//		5: Shields and losing. kinda done					//
//															//
//////////////////////////////////////////////////////////////


//implementing a pseudo pixel grid
var boxHeight;
var boxWidth;
var numTall = 256;
var numWide = 224;
var startPointX;
var endPointX;
var bgwidth;

var bullets = [];			//array of bullets

var invaderRowArray = [[], [], [], [], []];		//2D array of invaders to be instantiated in setup
var lastInvader = [];							//Array to contain the index of the final invader in each array of invaderRowArray

var player; //The player object

var threshold = 30; //global variables to move the invaders
var hor;
var vert = 0;
var frame = 0;
var faster = 0;

var shields = [[], [], [], []];	//another array

//scores
var score = 0;
var points = 0;

var lives = 3;

var gameState = 0;
var reset = false;

var anim = false;

function setup() {	//called at the beginning, but also when restarting the game.
	//basic setup
	noStroke();
	createCanvas(windowWidth, windowHeight);
	frameRate(30);

	//more basic pixel grid implementation
	boxHeight = height/numTall;
	boxWidth = boxHeight;
	mid = width/2;
	startPointX = mid - ((boxWidth)*(numWide/2)+boxWidth/2);
	endPointX = mid + ((boxWidth)*(numWide/2)+boxWidth/2);

	//default movement speed at the start;
	hor = boxWidth*5;

	//background width
	bgwidth = endPointX - startPointX;

	invaderRowArray = [[], [], [], [], []];
	bullets = [];
	shields = [[[], [], []], [[], [], []], [[], [], []], [[], [], []]];

	//instantiating the invaders as an array of arrays, an array per row of enemies
	for (var i = 0; i < invaderRowArray.length; i++) {
		for (var j = 0; j < 11; j++) {
			if (i < 1) {
				invaderRowArray[i][j] = new invader2(startPointX+boxWidth*20+(j*(boxWidth*15))+boxWidth*2, boxHeight*10+i*boxHeight*9);
			} else if (i < 3) {
				invaderRowArray[i][j] = new invader1(startPointX+boxWidth*20+(j*(boxWidth*15)), boxHeight*10+i*boxHeight*9);
			} else if (i < 5) {
				invaderRowArray[i][j] = new invader3(startPointX+boxWidth*20+(j*(boxWidth*15)), boxHeight*10+i*boxHeight*9);
			}
		}
	}

	//instantiate the shields
	for (var i = 0; i < shields.length; i++) {
		for (var j = 0; j < 3; j++) {
			for (var k = 0; k < 3; k++) {
				shields[i][j][k] = new shieldPart(startPointX + bgwidth/8 - 15*boxHeight +
					(i*bgwidth/4) + (k*boxHeight*10), height - boxHeight*50 + j * 5*boxHeight);
			}
		}
		shields[i][2][1] = undefined;
	}

	//instantiate the player
	player = new playerShip(mid-boxWidth*8, 230*boxHeight);
}

function draw() {
	gameStateController();
}

function invader1 (x, y) {
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = boxHeight;
	this.width = 12;

	this.draw = function () {
		push();
		fill(100, 0, 255);
		//line1
		if (anim) {
			pixel(this.x + this.bw*3, this.y);
			pixel(this.x + this.bw*9, this.y);
			//line2
			pixel(this.x + this.bw*4, this.y + this.bh*1);
			pixel(this.x + this.bw*8, this.y + this.bh*1);
			//line3
			for (var x = 3; x<=9; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*2);
			}
			//line4
			for (var x = 2; x<=3; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			for (var x = 5; x<=7; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			for (var x = 9; x<=10; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			//line5
			for (var x = 1; x<=11; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*4);
			}
			//line6
			pixel(this.x + this.bw*1, this.y + this.bh*5);
			pixel(this.x + this.bw*11, this.y + this.bh*5);
			for (var x = 3; x<=9; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*5);
			}
			//line7
			pixel(this.x + this.bw*1, this.y + this.bh*6);
			pixel(this.x + this.bw*3, this.y + this.bh*6);
			pixel(this.x + this.bw*9, this.y + this.bh*6);
			pixel(this.x + this.bw*11, this.y + this.bh*6);
			//line8
			pixel(this.x + this.bw*4, this.y + this.bh*7);
			pixel(this.x + this.bw*5, this.y + this.bh*7);
			pixel(this.x + this.bw*7, this.y + this.bh*7);
			pixel(this.x + this.bw*8, this.y + this.bh*7);	//longwinded drawing of the invader
		}
		else
		{
			//line1
			pixel(this.x + this.bw*3, this.y);
			pixel(this.x + this.bw*9, this.y);
			//line2
			pixel(this.x + this.bw*4, this.y + this.bh*1);
			pixel(this.x + this.bw*8, this.y + this.bh*1);
			pixel(this.x + this.bw*1, this.y + this.bh*1);
			pixel(this.x + this.bw*11, this.y + this.bh*1);
			//line3
			for (var x = 3; x<=9; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*2);
			}
			pixel(this.x + this.bw*1, this.y + this.bh*2);
			pixel(this.x + this.bw*11, this.y + this.bh*2);
			//line4
			for (var x = 1; x<=3; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			for (var x = 5; x<=7; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			for (var x = 9; x<=11; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*3);
			}
			//line5
			for (var x = 1; x<=11; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*4);
			}
			//line6

			for (var x = 2; x<=10; x++) {
				pixel(this.x + this.bw*x, this.y + this.bh*5);
			}
			//line7

			pixel(this.x + this.bw*3, this.y + this.bh*6);
			pixel(this.x + this.bw*9, this.y + this.bh*6);

			//line8
			pixel(this.x + this.bw*2, this.y + this.bh*7);
			pixel(this.x + this.bw*10, this.y + this.bh*7);	//longwinded animating of the invader
		}
		pop();
	}

	this.move = function () {
		this.x += hor;
		this.y += vert;		//moves the invader
	}

	this.shoot = function () {
		if (random(0, 100) > 99) {
			bullets.push(new bullet('invader', this.x+this.bw*5, this.y+this.bh*7));
		}
	}

	this.run = function () { 	//not really needed anymore
		this.draw();
	}
}

function invader2 (x, y) {
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = boxHeight;
	this.width = 8;

	this.draw = function () {
		push();
		fill(100, 255, 0);		//longwinded drawing of the invader
		//line 1
		for (let i = 3; i < 5; i++) {
			pixel(this.x + this.bw*i, this.y)
		}
		//line 2
		for (let i = 2; i < 6; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh);
		}
		//line 3
		for (let i = 1; i < 7; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh*2);
		}
		//line 4
		for (let i = 0; i < 2; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh*3);
		}
		for (let i = 3; i < 5; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh*3);
		}
		for (let i = 6; i < 8; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh*3);
		}
		//line 5
		for (let i = 0; i < 8; i++) {
			pixel(this.x + this.bw*i, this.y + this.bh*4);
		}
		if (anim) {
			//line 6
			pixel(this.x + this.bw, this.y + this.bh*5);
			for (let i = 3; i < 5; i++) {
				pixel(this.x + this.bw*i, this.y + this.bh*5);
			}
			pixel(this.x + this.bw*6, this.y + this.bh * 5);
			//line 7
			pixel(this.x, this.y + this.bh * 6);
			pixel(this.x + this.bw * 7, this.y + this.bh * 6);
			//line 8
			pixel(this.x + this.bw, this.y + this.bh * 7);
			pixel(this.x + this.bw*6, this.y + this.bh * 7);
		}
		else
		{
			//line 6
			pixel(this.x + this.bw*2, this.y + this.bh * 5);
			pixel(this.x + this.bw*5, this.y + this.bh * 5);
			//line 7
			pixel(this.x + this.bw, this.y + this.bh*6);
			for (let i = 3; i < 5; i++) {
				pixel(this.x + this.bw*i, this.y + this.bh*6);
			}
			pixel(this.x + this.bw*6, this.y + this.bh * 6);
			//line 8
			pixel(this.x, this.y + this.bh * 7);
			pixel(this.x + this.bw*2, this.y + this.bh * 7);
			pixel(this.x + this.bw*5, this.y + this.bh * 7);
			pixel(this.x + this.bw*7, this.y + this.bh * 7);
		}
		pop();
	}

	this.move = function () {
		this.x += hor;
		this.y += vert;		//moves the invader
	}

	this.shoot = function () {
		if (random(0, 100) > 99) {
			bullets.push(new bullet('invader', this.x+this.bw*5, this.y+this.bh*7));
		}
	}

	this.run = function () { 	//not really needed anymore
		this.draw();
	}
}

function invader3 (x, y) {
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = boxHeight;
	this.width = 12;

	this.draw = function () {
		push();
		fill(255, 0, 100);		//longwinded drawing of the invader
		//line 1
		for (var i = 4; i < 8; i++) {
			pixel (this.x + this.bw * i, this.y);
		}
		//line 2
		for (var i = 1; i < 11; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh);
		}
		//line 3
		for (var i = 0; i < 12; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh * 2);
		}
		//line 4
		for (var i = 0; i < 2; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh * 3);
		}
		for (var i = 4; i < 8; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh * 3);
		}
		for (var i = 10; i < 12; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh * 3);
		}
		//line 5
		for (var i = 0; i < 12; i++) {
			pixel (this.x + this.bw * i, this.y + this.bh * 4);
		}
		if (anim) {
			//line 6
			for (var i = 2; i < 5; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 5);
			}
			for (var i = 7; i < 10; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 5);
			}
			//line 7
			for (var i = 1; i < 3; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			for (var i = 5; i < 7; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			for (var i = 9; i < 11; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			//line 8
			for (var i = 2; i < 4; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 7);
			}
			for (var i = 8; i < 10; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 7);
			}
		}
		else {
			//line 6
			for (var i = 3; i < 5; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 5);
			}
			for (var i = 7; i < 9; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 5);
			}
			//line 7
			for (var i = 2; i < 4; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			for (var i = 5; i < 7; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			for (var i = 8; i < 10; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 6);
			}
			//line 8
			for (var i = 0; i < 2; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 7);
			}
			for (var i = 10; i < 12; i++) {
				pixel (this.x + this.bw * i, this.y + this.bh * 7);
			}
		}

		pop();
	}

	this.move = function () {
		this.x += hor;
		this.y += vert;		//moves the invader
	}

	this.shoot = function () {
		if (random(0, 100) > 99) {
			bullets.push(new bullet('invader', this.x+this.bw*5, this.y+this.bh*7));
		}
	}

	this.run = function () { 	//not really needed anymore
		this.draw();
	}
}

function pixel(x, y) { 		//A function to make it slightly easier to call each rect as a pseudo pixel
	rect(x, y, boxWidth, boxHeight);
}

function playerShip (x, y) {	//the PlayerShip class
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = boxHeight;
	this.speed;
	this.fr = 0;
	this.thresh = 3;
	this.alive = true;
	this.revive = 0;	//revival timer

	this.draw = function () {
		push();
		fill(100, 255, 0);
		//rect(this.x, this.y, 20, 20);
		//line 1
		pixel(this.x+this.bw*7, this.y);
		//line 2
		for (let i = 6; i<9; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh);
		}
		//line 3
		for (let i = 6; i<9; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*2);
		}
		//line 4
		for (let i = 1; i<15; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*3);
		}
		//line 5
		for (let i = 0; i<16; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*4);
		}
		//line 6
		for (let i = 0; i<16; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*5);
		}
		//line 7
		for (let i = 0; i<16; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*6);
		}
		//line 8
		for (let i = 0; i<16; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*7);
		}
		//line 9
		for (let i = 0; i<16; i++) {
			pixel(this.x+this.bw*i, this.y+this.bh*8);
		}	//draws the player ship
		pop();
	}

	this.move = function () {	//moves the ship
		if (this.fr < this.thresh) {
			this.fr++;
		}

		if (this.fr == this.thresh) {
			this.fr = 0;
			if (keyIsDown(LEFT_ARROW)) {
				this.x -= this.bw*3;
			}
			if (keyIsDown(RIGHT_ARROW)) {
				this.x += this.bw*3;
			}
			if (this.x < startPointX) {
				this.x = startPointX;
			}
			if (this.x > endPointX-this.bw*16) {
				this.x = endPointX-this.bw*16;
			}
		}
	}

	this.shoot = function () {	//I like this -> pushes a new bullet to the bullets array, from the player's cannon, going up
		bullets.push(new bullet('player', this.x+this.bw*7, this.y));
	}

	this.run = function () { //easier to call
		this.draw();
		this.move();
	}

	this.die = function () {
		this.alive = false;
	}

	this.revival = function () {
		if (!this.alive) {
			console.log(this.revive + " " + lives);
			if (frame == threshold-1 && lives > 0) {
				this.revive+=1;
			}
			if (this.revive > 2) {
				this.alive = true;
				this.revive = 0;
			}
		}
	}
}

function bullet (tag, x, y) {
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = boxHeight;
	this.speed = this.bw*3;

	this.tag = tag; //will do a thing for invaders

	this.fr = 0;
	this.thresh = 1;

	this.draw = function () {	//draws a white bullet
		push();
		fill(255);
		pixel(this.x, this.y);
		pixel(this.x, this.y+this.bh);
		pop();
	}

	this.move = function () {	//shoots the bullet up or down
		if (this.fr < this.thresh) {
			this.fr++;
		}
		if (this.fr == this.thresh && this.tag == 'player') {
			this.fr = 0;
			this.y-=this.speed;
		}
		if (this.fr == this.thresh && this.tag == 'invader') {
			this.fr = 0;
			this.y+=this.speed;
		}
	}

	this.hit = function () {
		for (var i = 0; i < invaderRowArray.length; i++) {
			for (var j = 0; j < invaderRowArray[i].length; j++) {
				if (this.x > invaderRowArray[i][j].x && this.x < invaderRowArray[i][j].x+invaderRowArray[i][j].bw*invaderRowArray[i][j].width
					&& this.y > invaderRowArray[i][j].y && this.y < invaderRowArray[i][j].y + invaderRowArray[i][j].bh*8 &&
					this.tag == "player") {
					bullets.splice(bullets.indexOf(this), 1);
					invaderRowArray[i].splice(j, 1);	//when player bullet hits an invader, will kill the invader, and the bullet
					score += points;
				}
			}
		}
		for (var i = 0; i < shields.length; i++) {
			for (var j = 0; j < shields[i].length; j++) {
				for (var k = 0; k < shields[i][j].length; k++) {
					if (shields[i][j][k] !== undefined && shields[i][j][k].alive) {
						if (this.x > shields[i][j][k].x && this.x < shields[i][j][k].x + shields[i][j][k].width*boxWidth &&
						this.y > shields[i][j][k].y && this.y < shields[i][j][k].y + shields[i][j][k].height*boxHeight) {
							bullets.splice(bullets.indexOf(this), 1);
							shields[i][j][k].alive = !shields[i][j][k].alive;	//kills shields. 3d arrays are confusing ahh
						}
					}
				}
			}
		}
		if (this.tag == 'invader' && this.x < player.x+boxWidth*16 && this.x > player.x && this.y > player.y
			&& this.y < player.y + boxHeight*8 && lives > 0 && player.alive) {
			lives -= 1;
			player.x = mid - boxWidth*8;
			player.die();	//kills the player. lives system
			bullets.splice(bullets.indexOf(this), 1);
		}
		if (this.y<0 || this.y > height) bullets.splice(bullets.indexOf(this), 1); //kills bullet at top/bottom of screen
	}

	this.run = function () {	//easy to call
		this.draw();
		this.move();
		this.hit();
	}
}

function keyPressed () {
	if (gameState == 1) {
		if (keyCode === SHIFT && player.alive) {
			player.shoot(); // just the button to shoot the bullets
		}
	}
	if (gameState == 0) {
		if (keyCode === SHIFT) {
			gameState = 1;
		}
	}
	if (gameState == 2) {
		if (keyCode === SHIFT) {
			gameState = 1;
			reset = true;
			lives = 3;
		}
	}
	if (gameState == 3) {
		if (keyCode === SHIFT) {
			gameState = 1;
			reset = true;
			score = 0;
			lives = 3;
			threshold = 30;
		}
	}
}

function invaderCommand () {
	//Moves all of the invaders - needs some work, but best way of doing it was with global variables
	if (frame < threshold) {
		frame++;
	}
	//calculations here
	if (frame == threshold/2) {

		for (var i = 0; i < invaderRowArray.length; i++) {
			if (invaderRowArray[i][0].x + boxWidth < startPointX + boxWidth*10) {
				hor = boxWidth*5;
				vert = boxHeight*4;
				faster++;
				break;
			}
			if (invaderRowArray[i][lastInvader[i]].x + boxWidth*12 > endPointX - boxWidth*10) {
				hor = -boxWidth*5;
				vert = boxHeight*4;
				faster++;
				break;
			}
			if(invaderRowArray[i][0].x + boxWidth > startPointX + boxWidth*10
				&& invaderRowArray[i][lastInvader[i]].x + boxWidth*12 < endPointX - boxWidth*10) {
				vert = 0;
			}
			if(invaderRowArray[i][lastInvader[i]].x + boxWidth*12 < endPointX - boxWidth*10
				&& invaderRowArray[i][0].x + boxWidth > startPointX + boxWidth*10) {
				vert = 0;
			}
			if (invaderRowArray[i][0].y > height - boxHeight*80) {
				gameState = 3;
			}

		}
		if (faster > 1) {
			if (threshold > 6) threshold = threshold - 2;
			faster = 0;
		}
	}
	//calling move on each invader to move by hor and vert
	if (frame == threshold) {
		frame = 0;
		anim = !anim;
		invaderRowArray.forEach(function(a) {
			a.forEach(function(b) {
				b.move();
				b.shoot();
			});
		});
	}
}

function objectManager () {
	//prevents crashing when a row is emptied
	for (var i = 0; i < invaderRowArray.length; i++) {
		if (invaderRowArray[i].length < 1) {
			invaderRowArray.splice(i, 1);
		}
	}
	//updating the index of the rightmost invader per row
	for (var i = 0; i < invaderRowArray.length; i++) {
		lastInvader[i] = invaderRowArray[i].length - 1;
	}
	//updates the invader's position once every THRESHOLD frames
	invaderCommand();
	//draws and moves the bullets, kills bullets and invaders
	for (let i = 0; i<bullets.length; i++) {
		bullets[i].run();
	}
	//draws the invaders
	for (var i = 0; i < invaderRowArray.length; i++) {
		for (var j = 0; j < invaderRowArray[i].length; j++) {
			invaderRowArray[i][j].run();
		}
	}
	for (var i = 0; i < shields.length; i++) {
		for (var j = 0; j < shields[i].length; j++) {
			for (var k = 0; k < shields[i][j].length; k++) {
				if (shields[i][j][k] !== undefined) {
					shields[i][j][k].draw();
				}
			}
		}
	}
	//draws and moves the player while not dead
	if (player.alive) {
		player.run();
	}
	player.revival();
}

function pointsManager () {		//basic points management
	points = (30 - threshold/2)*15;
	if (frame == threshold-1 && score > 0) score -= 10;
	push();
	fill(255);
	text("Score: " + score, startPointX+boxWidth*50, boxHeight*8);
	pop();
}

function gameStateController () {
	switch (gameState) {
		default:
			startScreen();
			break;

		case 0:
			startScreen();
			break;

		case 1:
			gameScreen();
			break;

		case 2:
			winScreen();
			break;

		case 3:
			gameOverScreen();
			break;
	}
}

function gameScreen () {
	if (reset) {
		setup();
		reset = false;
	}
	//basic setup of screen and background
	background(125);
	push();
	fill(0);
	rect(startPointX, 0, endPointX-startPointX, height);
	pop();

	objectManager();
	//handles the points
	pointsManager();

	livesHUD();

	if (lives < 1) {
		gameState = 3;
	}
	if (invaderRowArray.length < 1) {
		gameState = 2;
	}
}

function startScreen () {
	push();
	background(125);
	var lines = "Press SHIFT to start\nShoot: SHIFT\nMove: LEFT/RIGHT ARROW";
	fill(0);
	rect(startPointX, 0, endPointX-startPointX, height);
	fill(0, 255, 0);
	var sizes = bgwidth/50;
	textAlign(CENTER);
	textSize();
	text(lines, width/2, height/2);
	pop();
}

function winScreen () {
	push();
	background(125);
	var lines = "Score: " + score + "\nPress SHIFT to continue";
	fill(0);
	rect(startPointX, 0, endPointX - startPointX, height);
	fill(0, 255, 0);
	var sizes = bgwidth / 50;
	textAlign(CENTER);
	textSize();
	text(lines, width / 2, height / 2);
	pop();
}

function gameOverScreen () {
	push();
	background(125);
	var lines = "You have lost :(\nScore: "+score+"\nPress SHIFT to replay";
	fill(0);
	rect(startPointX, 0, endPointX-startPointX, height);
	fill(0, 255, 0);
	var sizes = bgwidth/50;
	textAlign(CENTER);
	textSize();
	text(lines, width/2, height/2);
	pop();
}

function livesHUD () {
	for (var i = 0; i < lives; i++) {
		miniPlayer(i);
	}
}

function miniPlayer (i) {
	push();
	fill(100, 255, 0);
	push();
	fill(255);
	textAlign(LEFT);
	text("Lives: ", startPointX+boxWidth, boxHeight*8);
	pop();
	var x = startPointX +boxWidth*15+ boxWidth*5 * i;
	pixel(x + boxWidth, boxHeight * 5);
	for (var j = 0; j<3; j++) {
		pixel(x+boxWidth*j, boxHeight*6);
	}
	for (var j = 0; j<3; j++) {
		pixel(x+boxWidth*j, boxHeight*7);
	}
	pop();
}

//shield will function as an array of a 9x9 grid of squares for simplicity.
function shieldPart (x, y) {
	this.x = x;
	this.y = y;
	this.bw = boxWidth;
	this.bh = this.bw;
	this.width = 10;
	this.height = 5;
	this.alive = true;

	this.draw = function () {
		if (this.alive) {
			push();
			fill(100, 0, 255);
			rect (x, y, this.bw * this.width, this.bh * this.height);
			pop();
		}
	}
}
