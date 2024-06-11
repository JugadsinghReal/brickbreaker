let scorecounter = 0;
let lifecounter = 3;
let lifestat = document.querySelector(".lifenum");
let scorestat = document.querySelector(".scorenum");
lifestat.innerHTML = lifecounter;
scorestat.innerHTML = scorecounter;

let bricks = 35;
//board
let board;
let boardWidth = 1010;
let boardHeight = 950;
let context;

//players
let playerWidth = 150;
let playerHeight = 30;
let playerVelocityX = 15;

let player = {
  x: boardWidth / 2 - playerWidth / 2,
  y: boardHeight - playerHeight - 20,
  width: playerWidth,
  height: playerHeight,
  velocityX: playerVelocityX,
};

//ball
let ballWidth = 20;
let ballHeight = 20;
let ballVelocityX = 3;
let ballVelocityY = 3;

let ball = {
  x: boardWidth / 2,
  y: boardHeight / 1.4,
  width: ballWidth,
  height: ballHeight,
  velocityX: ballVelocityX,
  velocityY: ballVelocityY,
};

//blocks
let blockArray = [];
let blockWidth = 130;
let blockHeight = 50;
let blockColumns = 7;
let blockRows = 5;
let blockMaxRows = 10;
let blockCount = 0;

//starting block corners top left
let blockX = 15;
let blockY = 205;

let gameOver = false;

window.onload = function () {
  board = document.getElementById("main");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d");

  //draw initial player
  context.fillStyle = "skyblue";
  context.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(update);
  document.addEventListener("keydown", movePlayer);

  //create blocks
  createBlocks();
};

function update() {
  requestAnimationFrame(update);
  //stop drawing
  if (gameOver) {
    return;
  }
  context.clearRect(0, 0, board.width, board.height);

  // player
  context.fillStyle = "lightgreen";
  context.fillRect(player.x, player.y, player.width, player.height);

  // ball
  context.fillStyle = "white";
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  context.fillRect(ball.x, ball.y, ball.width, ball.height);

  //bounce the ball off player paddle
  if (topCollision(ball, player) || bottomCollision(ball, player)) {
    ball.velocityY *= -1;
  } else if (leftCollision(ball, player) || rightCollision(ball, player)) {
    ball.velocityX *= -1;
  }

  if (ball.y <= 0) {
    // if ball touches top of canvas
    ball.velocityY *= -1;
  } else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) {
    // if ball touches left or right of canvas
    ball.velocityX *= -1;
  } else if (ball.y + ball.height >= boardHeight) {
    // if ball touches bottom of canvas
    context.font = "20px sans-serif";
    lifeloss();
  }

  //blocks
  context.fillStyle = "red";
  for (let i = 0; i < blockArray.length; i++) {
    let block = blockArray[i];
    if (!block.break) {
      if (topCollision(ball, block) || bottomCollision(ball, block)) {
        block.break = true; // block is broken
        ball.velocityY *= -1;
        scorecounter += 100;
        blockCount -= 1;
      } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
        block.break = true; // block is broken
        ball.velocityX *= -1;
        scorecounter += 100;
        blockCount -= 1;
      }
      context.fillRect(block.x, block.y, block.width, block.height);
    }
  }

  //next level
  if (blockCount == 0) {
    scorecounter += 100 * blockRows * blockColumns;
    blockRows = Math.min(blockRows + 1, blockMaxRows);
    createBlocks();
  }
}

function outOfBounds(xPosition) {
  return xPosition < 0 || xPosition + playerWidth > boardWidth;
}

function movePlayer(e) {
  if (gameOver) {
    if (e.code == "Space") {
      resetGame();
      console.log("RESET");
    }
    return;
  }
  if (e.code == "ArrowLeft") {
    let nextplayerX = player.x - player.velocityX;
    if (!outOfBounds(nextplayerX)) {
      player.x = nextplayerX;
    }
  } else if (e.code == "ArrowRight") {
    let nextplayerX = player.x + player.velocityX;
    if (!outOfBounds(nextplayerX)) {
      player.x = nextplayerX;
    }
  }
}

function detectCollision(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function topCollision(ball, block) {
  return detectCollision(ball, block) && ball.y + ball.height >= block.y;
}

function bottomCollision(ball, block) {
  return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
  return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
  return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

function createBlocks() {
  blockArray = []; //clear blockArray
  for (let c = 0; c < blockColumns; c++) {
    for (let r = 0; r < blockRows; r++) {
      let block = {
        x: blockX + c * blockWidth + c * 10,
        y: blockY + r * blockHeight + r * 10,
        width: blockWidth,
        height: blockHeight,
        break: false,
      };
      blockArray.push(block);
    }
  }
  blockCount = blockArray.length;
}

function resetGame() {
  gameOver = false;
  player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 20,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
  };
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 1.4,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
  };
  blockArray = [];
  blockRows = 5;
  scorecounter = 0;
  lifecounter = 3;
  createBlocks();
}

function lifeloss() {
  player = {
    x: boardWidth / 2 - playerWidth / 2,
    y: boardHeight - playerHeight - 20,
    width: playerWidth,
    height: playerHeight,
    velocityX: playerVelocityX,
  };
  ball = {
    x: boardWidth / 2,
    y: boardHeight / 1.4,
    width: ballWidth,
    height: ballHeight,
    velocityX: ballVelocityX,
    velocityY: ballVelocityY,
  };
  lifecounter--;
}
function checkgameover() {
  console.log(lifecounter);
  if (lifecounter == 0) {
    gameOver = true;
    context.fillText("Game Over: Press 'Space' to Restart", 350, 700);
  }
}

setInterval(checkgameover, 100);
function repeat() {
  scorestat.innerHTML = scorecounter;
}
setInterval(repeat, 100);

function repeat2() {
  lifestat.innerHTML = lifecounter;
}
setInterval(repeat2, 100);
