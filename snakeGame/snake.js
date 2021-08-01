const c = document.getElementById("snakeCanva");
const ctx = c.getContext("2d");
const contentBorder = document.querySelector("#snakecontainer");
// little bit of color for the snake and board
function rainbow() {
	return Math.floor(Math.random() * 135) + 100;
}
// snakes girth
const width = 20,
	height = 20;
// makes fulscreen board need to mod it by (snakes width and height) so snake doesn't go out of bounds.
c.width = document.body.clientWidth;
c.width = c.width - (c.width % width);
c.height = document.body.clientHeight;
c.height = c.height - (c.height % height);

//keys
let theKey = 0;
document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "ArrowDown":
			theKey = 3;
			break;
		case "ArrowUp":
			theKey = 1;
			break;
		case "ArrowLeft":
			theKey = 4;
			break;
		case "ArrowRight":
			theKey = 2;
			break;
		case "r":
			if (!isGameGoing) {
				restart();
			}
			break;
	}
});
let lastKey = theKey;

let snakeX, snakeY, x, y, score, food;

function generateFood(food1, food2) {
	food1 = Math.floor(Math.random() * ((c.width - width) / width)) * width;
	food2 = Math.floor(Math.random() * ((c.height - height) / height)) * height;
	for (let i = 0; i < snakeX.length; i++) {
		if (snakeX[i] === food1 && snakeY[i] === food2) {
			generateFood(food1, food2);
		}
	}
	return { food1, food2 };
}

let foodX, foodY;

let isGameGoing = true;

function endGame() {
	clearInterval(interv);
}

function restart() {
	isGameGoing = true;
	ctx.clearRect(0, 0, c.width, c.height);
	x = 40;
	y = 40;
	snakeX = [x, x, x];
	snakeY = [y, y, y];
	theKey = 0;
	score = 0;
	food = generateFood(foodX, foodY);
	foodX = food.food1;
	foodY = food.food2;
	let interv = setInterval(function () {
		if (isGameGoing) {
			game();
		} else {
			clearInterval(interv);
		}
	}, 120);
}
function game() {
	// limits movement, so snake doesn't go in it self.
	if (theKey === 1 && lastKey === 3) {
		theKey = 3;
	} else if (theKey === 3 && lastKey === 1) {
		theKey = 1;
	} else if (theKey === 2 && lastKey === 4) {
		theKey = 4;
	} else if (theKey === 4 && lastKey === 2) {
		theKey = 2;
	}

	// clears board;
	ctx.clearRect(0, 0, c.width, c.height);
	// represents score
	if (score > 0) {
		ctx.font = "150px Arial";
		ctx.fillText(score, 10, c.height - 50);
	}
	//tutorial
	if (score < 1) {
		ctx.font = "20px Arial";
		ctx.fillText("Move snake with arrow keys ->", 10, c.height / 2);
	}
	// makes snake move. adding/substracting on x and y axis.
	switch (theKey) {
		case 1:
			y -= height;
			break;
		case 4:
			x -= width;
			break;
		case 3:
			y += height;
			break;
		case 2:
			x += width;
			break;
	}
	lastKey = theKey;

	// validates if snake hasn't driven into itself, + length of 3 so it doesn't break at start
	if (snakeX.length > 3) {
		for (i = 0; i < snakeX.length; i++) {
			if (snakeX[i] === x && snakeY[i] === y) {
				isGameGoing = false;
				break;
			}
		}
	}

	//creates snake
	snakeX.push(x);
	snakeY.push(y);

	for (let i = 0; i < snakeX.length; i++) {
		ctx.fillRect(snakeX[i], snakeY[i], width, height);
	}
	snakeX.shift();
	snakeY.shift();

	ctx.fillRect(foodX, foodY, width, height);

	// when snake eats food, generate new food, add score.
	if (x === foodX && y === foodY) {
		food = generateFood(foodX, foodY);
		foodX = food.food1;
		foodY = food.food2;
		ctx.fillStyle = `rgb(${rainbow()}, ${rainbow()}, ${rainbow()})`;
		snakeX.push(x);
		snakeY.push(y);
		score++;
	}

	// checks out of bounds
	if (x >= c.width || y >= c.height || x < 0 || y < 0) {
		isGameGoing = false;
	}
	//gameover :(
	if (!isGameGoing) {
		ctx.font = "20px Arial";
		ctx.fillText("press << R >> to restart", 10, c.height / 2 + 20);
	}
}

restart();
