//Setting Modal variables
let startOverModal = document.querySelector('#startOver');
let winnerModal = document.querySelector('#winner');
let playAgainButton = document.querySelector('#button');
let modalVisible = false;

// Variables to help render the player and enemies
var offsetX = 101;
var offsetY = 83;


//Enemy Class
class Enemy {
  constructor(x, y) {
    //positioning the enemy bugs
    this.x = x;
    this.y = y - .3;
    this.velocity = .02;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
  }

  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this._move();
    // When the bugs get too the end they start back at the beginning
    // They get a new random position and speed
    if (this.x >= 4) {
      this._randomPosition();
      this._randomVelocity();
    }
  }



  // Draws enemy on the board every frame
  render() {
    ctx.drawImage(Resources.get(this.sprite), (this.x * offsetX), (this.y * offsetY));
  }
  // Sets the bugs x value to the new random speed
  _move() {
    this.x += this.velocity;
  }
  // Bug is given a new random velocity with a range
  _randomVelocity() {
    const hundredthPlaceDigit = Math.ceil(Math.random() * 3);
    this.velocity = Number(`.0${hundredthPlaceDigit}`);
  }
  // Puts the bug back at the begining with a random this.y of 1, 2, or 3
  _randomPosition() {
    this.y = Math.ceil(Math.random() * 3) - .3;
    this.x = 0;
  }
}


// Player Class
class Player {
  constructor() {
    // Setting starting values
    this.x = 2;
    this.y = 4.7;
    this.sprite = 'images/char-boy.png';
    this.hasAlreadyWon = false;
  }
  // Checks position to see if player has won
  update() {
    this._checkForWin();
  }
  // Draws the player in given position
  render() {
    ctx.drawImage(Resources.get(this.sprite), (this.x * offsetX), (this.y * offsetY));
  }
  // Resets player back to original position
  reset() {
    this.x = 2;
    this.y = 4.7;
    this.hasAlreadyWon = false;
  }
  // handles the movement of player & if modal is visible, player cannot move
  handleInput(direction) {
    if (modalVisible) { return; }

    switch (direction) {
      case 'left':
        this._left();
        break;
      case 'right':
        this._right();
        break;
      case 'up':
        this._up();
        break;
      case 'down':
        this._down();
        break;
    }
  }
  // Checks to see if the player reached the water side, if so, they win
  _checkForWin() {
    if (Math.ceil(this.y) === 0) { // winning condition
      if (!this.hasAlreadyWon) { // can only win once
        this.hasAlreadyWon = true;
        this._win();
      }
    }
  }
  // Displays 'Good Job' modal
  // Focuses on button so spacebar and enter can be used to 'play again'
  _win() {
    winnerModal.classList.remove('hidden');
    playAgainButton.focus();
    modalVisible = true;
  }

  // Player cannot move off canvas
  // Moves one block left
  _left() {
    if (this.x === 0) {return;}
    this.x--;
  }
  // Moves one block right
  _right() {
    if (this.x === 4) {return;}
    this.x++;
  }
  // Moves one block up
  _up() {
    if (Math.ceil(this.y) === 0) {return;}
    this.y--;
  }
  // Moves one block down
  _down() {
    if (Math.ceil(this.y) === 5) {return;}
    this.y++;
  }
}

// creates player object
var player = new Player();

// creates Enemy objects and stores them in an array
var enemy1 = new Enemy(1, 3);
var enemy2 = new Enemy(0, 1);
var enemy3 = new Enemy(3, 2);
var allEnemies = [enemy1, enemy2, enemy3];

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// Listens for click on the button to close modal and reset player
playAgainButton.addEventListener('click', function() {
  winnerModal.classList.add('hidden');
  modalVisible = false;
  player.reset();
});

// This is being called in enginejs
// Checks to see if enemy and player are coliding
// If they are, a modal will pop up for a second and reset the player postion
function checkCollisions() {
  allEnemies.forEach(function(enemy) {
    if (checkForYCollsion(enemy, player) && checkForXCollision(enemy, player)) {
      startOverModal.classList.remove('hidden');
      modalVisible = true;
      setTimeout(function () {
        startOverModal.classList.add('hidden');
        modalVisible = false;
      }, 1100);
      player.reset();
    }
  });
}
// Checks for collision along y-axis
function checkForYCollsion(enemy, player) {
  return Math.floor(enemy.y) === Math.floor(player.y);
}
// Checks for collision along x-axis
function checkForXCollision(enemy, player) {
  return enemy.x <= (player.x + 0.7) && enemy.x >= (player.x - 0.5)
}
