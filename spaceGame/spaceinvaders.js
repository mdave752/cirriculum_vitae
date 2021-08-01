const c = document.getElementById("spaceInvadersCanvas");
const ctx = c.getContext("2d");
const btn = document.getElementById("cancel-button");
btnLeft = document.querySelector("#space-left");
btnRight = document.querySelector("#space-right");
btnShoot = document.querySelector("#space-shoot");

document.body.style.backgroundImage = "url('imgs/stars-bg.jpg')";

const img01 = new Image();
img01.src = "imgs/space-monsty.png";
const img02 = new Image();
img02.src = "imgs/space-rocket.png";
ctx.fillStyle = "rgb(255,255,255)";

class Spaceship {
	constructor(x, y, shoot, missileY, lives, score) {
		this.x = x;
		this.y = y;
		this.shoot = shoot;
		this.missileY = missileY;
		this.lives = lives;
		this.score = score;
	}
	shootRocket(monsterPlacement) {
		ctx.fillRect(this.shotPos, this.missileY, 4, 10);
		this.missileY -= 3;
		// check if missle have hit any of the monsters and destroy monster making coordinate null
		for (let i = 0; i < monsterPlacement.length; i++) {
			if (monsterPlacement[i]) {
				if (checkIfHit(this.shotPos, this.missileY, monsterPlacement[i], monsters.movX, monsters.movY, 25)) {
					ctx.clearRect(this.shotPos, this.missileY, 4, 5);
					monsterPlacement[i] = null;
					this.shoot = 0;
					this.missileY = this.y;
					// add score
					this.score += 10;
				}
			}
		}
		// stops shot if it hits top
		if (spaceship.missileY < 5) {
			spaceship.shoot = 0;
			spaceship.missileY = spaceship.y;
		}
	}
}

let spaceship = new Spaceship(250, 550, 0, 550, 3, 0);

class Monsters {
	constructor(width, height, movX, movY, shoot, shotPos, missileY, monsterDirection) {
		this.width = width;
		this.height = height;
		this.movX = movX;
		this.movY = movY;
		this.shoot = shoot;
		this.shotPos = shotPos;
		this.missileY = missileY;
		this.monsterDirection = monsterDirection;
		this.rocketArray = new Array(1);
		this.levelStrength = [2, 1];
	}
	// create an array of monsters
	monsterArray() {
		let array = [];
		for (let i = 46; i <= this.height; i += 30) {
			for (let j = 0; j < this.width; j += 30) {
				array.push([j, i]);
			}
		}
		return array;
	}
	// creates missile
	createMissile(monsterPlacement) {
		let missilePos = Math.floor(Math.random() * monsterPlacement.length);
		if (monsterPlacement[missilePos] !== null) {
			let y = monsterPlacement[missilePos][1] + this.movY;
			let x = monsterPlacement[missilePos][0] + this.movX;
			return [x, y];
		} else {
			this.createMissile(monsterPlacement);
		}
	}

	monsterShot() {
		// goes though array of shots to fire
		for (let i = 0; i < this.rocketArray.length; i++) {
			if (this.rocketArray[i]) {
				this.rocketArray[i][1] += 1;
				ctx.fillRect(this.rocketArray[i][0], this.rocketArray[i][1] + 30, 4, 10);
				// check if rocket hits spaceship
				if (checkIfHit(this.rocketArray[i][0], this.rocketArray[i][1], [spaceship.x, spaceship.y], 0, 0, 50)) {
					spaceshipHit = true;
					this.shoot = 0;
				}

				// if rocket hits end of the map, make element undefined
				if (this.rocketArray[i][1] > 560) {
					this.rocketArray[i] = null;
				}
			}
		}

		// if there are no elemenets generated, generate again.
		if (this.rocketArray.join("") === "") {
			this.shoot = 0;
		}
	}
}

let monsters = new Monsters(300, 140, 20, 0, 0, 140, 20, 2);
// going left or right
let monsterDirection = 0;
// keys
document.addEventListener("keydown", (e) => {
	switch (e.code) {
		case "ArrowRight":
			if (spaceship.x < 300) {
				spaceship.x += 10;
			}
			break;
		case "ArrowLeft":
			if (spaceship.x > 20) {
				spaceship.x -= 10;
			}
			break;
		case "Space":
			if (spaceship.shoot === 0) {
				spaceship.shotPos = spaceship.x;
				spaceship.shoot = 1;
			}
			break;
		case "KeyR":
			if (!gameGoing && !gameWin) {
				restart();
			}
			break;
	}
});
btnRight.addEventListener("mousedown", function () {
	if (spaceship.x < 250) {
		spaceship.x += 10;
	}
});
btnLeft.addEventListener("mousedown", function () {
	if (spaceship.x > 20) {
		spaceship.x -= 10;
	}
});
btnShoot.addEventListener("mousedown", function () {
	if (spaceship.shoot === 0 && gameGoing) {
		spaceship.shotPos = spaceship.x;
		spaceship.shoot = 1;
	}
	if (!gameGoing && !gameWin) {
		restart();
	}
});

ctx.drawImage(img02, spaceship.x, spaceship.y, 55, 55);

function checkIfHit(locationX, locationY, objLocation, moveX, moveY, width) {
	for (let i = 0; i < width; i++) {
		for (let j = 0; j < width; j++) {
			if (locationX === objLocation[0] + i + moveX && locationY === objLocation[1] + j + moveY) {
				return true;
			}
		}
	}
}

//Starts game

let gameGoing, monsterPlacement, count;
let gameWin = false,
	spaceshipHit = false;
function restart() {
	if (!gameWin) {
		monsters.levelStrength[0] = 2;
		monsters.levelStrength[1] = 1;
		monsters.rocketArray = new Array(monsters.levelStrength[1]);
		monsters.shoot = 0;
		spaceship.score = 0;
		spaceship.lives = 3;
	} else {
		gameWin = false;
	}

	btnShoot.innerText = "Shoot";
	gameGoing = true;
	monsterPlacement = monsters.monsterArray();
	monsters.movX = 20;
	monsters.movY = 0;
	ctx.clearRect(0, 500, 500, 600);
	const interv = setInterval(function () {
		if (gameGoing) {
			gameOn();
			ctx.font = "20px Courier New";
			let scoreboard = `Lives: ${spaceship.lives} Score: ${spaceship.score}`;
			ctx.fillText(scoreboard, 20, 50);
		} else {
			clearInterval(interv);
			// creates game harder by changeing speed of monsters flying and maximum amount of rockets they will shoot
			if (gameWin) {
				monsters.levelStrength[1] += 1;
				monsters.levelStrength[0] += 2;
				monsters.rocketArray = new Array(monsters.levelStrength[1]);
				monsters.shoot = 0;
				count = 5;
				const timeout = setInterval(function () {
					ctx.clearRect(0, 0, 500, 600);
					ctx.font = "30px Courier New";
					let countdown = `Game starts in ${count}`;
					ctx.fillText(countdown, 0, 300);
					count--;
					if (count < 1) {
						clearInterval(timeout);
						restart();
					}
				}, 500);
			}
		}
	}, 2);
}

// Le counter
let counter = 0;

function gameOn() {
	ctx.clearRect(0, 0, 500, 600);

	// ends game if no more monsters are on screen
	if (monsterPlacement.join("").length === 0) {
		gameGoing = false;
		gameWin = true;
	}
	// draw spaceship
	ctx.drawImage(img02, spaceship.x, spaceship.y, 50, 50);

	//draw monsters
	for (let i = 0; i < monsterPlacement.length; i++) {
		if (monsterPlacement[i]) {
			// ctx.fillRect(monsterPlacement[i][0] + monsters.movX, monsterPlacement[i][1] + monsters.movY, 25, 25);
			ctx.drawImage(img01, monsterPlacement[i][0] + monsters.movX, monsterPlacement[i][1] + monsters.movY, 25, 25);
		}
	}
	//creates monster movement
	if (counter === 5) {
		if (monsters.movX > 60) {
			monsters.monsterDirection = 1;
		}
		if (monsters.movX < 20) {
			monsters.monsterDirection = 0;
			if (monsters.movY < 250) {
				monsters.movY += 30;
			}
		}
		if (monsters.monsterDirection === 0) {
			monsters.movX += monsters.levelStrength[0];
		} else {
			monsters.movX -= monsters.levelStrength[0];
		}
	}
	//spaceship missile
	if (spaceship.shoot === 1) {
		spaceship.shootRocket(monsterPlacement);
	}

	// Calculate which monster will be shooting
	if (monsters.shoot === 0) {
		for (let i = 0; i < monsters.rocketArray.length; i++) {
			try {
				monsters.rocketArray[i] = monsters.createMissile(monsterPlacement);
			} catch (err) {}
		}
		monsters.shoot = 1;
	}
	// creates monster missiles
	if (monsters.shoot) {
		monsters.monsterShot();
	}
	// check if spaship is hit, takes one life if so.
	if (spaceshipHit) {
		spaceshipHit = false;
		spaceship.lives -= 1;
		if (spaceship.lives < 1) {
			gameGoing = false;
		}
	}

	counter++;
	if (counter > 20) counter = 0;

	// gameover :(
	if (!gameGoing && !gameWin) {
		btnShoot.innerText = "Restart";
		ctx.font = "20px Courier New";
		ctx.fillText("press << R >> or shoot button to restart", 10, 530);
	}
}

restart();
