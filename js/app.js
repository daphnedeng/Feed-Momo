let meats = 0;
let timeleft = 20;
let count = $('.count');
let timer = $('#timer');
let enable = true;

// Enemies our player must avoid
let Enemy = function(x ,y) {
    // x & y: initial position in canvas
    this.x = x;
    this.y = y;
    this.sprite = 'images/rat.png';
    this.speed = Speed(135, 380);
};

//Enemies' moving speed
const Speed = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    if (this.x < 707) {
        this.x += this.speed * dt;
    } else {
        this.x = -100;
    };
    this.checkCollisions();
};

//check if enemy and player collides. https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
Enemy.prototype.checkCollisions = function() {
    if (player.x < this.x + 95 && player.x + 95 > this.x && player.y < this.y + 50 && player.y + 50 > this.y) {
        player.reset();
    };
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Thd player charactor
let Player = function(x, y) {
    this.sprite = 'images/meat.png';
    this.x = x;
    this.y = y;
};

//update the player's position
Player.prototype.update = function() {
    //the player can't move over the canvas
    if (this.x > 606) {
        this.x = 0;
    };
    if (this.x < 0) {
        this.x = 606;
    };
    if (this.y > 390) {
        this.y = 390;
    };
    if (this.y < -20) {
        this.y = -20;
    };
    this.touchMomo();
};

//player needs to touch the dog in order to earn point & win. Once they touch, point++ and player resets its place.
Player.prototype.touchMomo = function() {
    if (this.x < dog.x + 60 && this.x + 60 > dog.x && this.y < dog.y + 30 && this.y + 30 > dog.y) {
        //update the number of meats the dog get
        meats++;
        count.text(meats);        
        player.reset();
        dog.reset();
        if (meats === 10 || timeleft === 0) {
            togglePopup();
            timesUp();
        }
    };
}

//reset player's position
Player.prototype.reset = function() {
    this.x = 300;
    this.y = 310;
}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//your dog, waiting for meat
let Dog = function(x, y) {
    this.sprite = 'images/dog.png';
    this.x = x;
    this.y = y;
};

//update dog's position
Dog.prototype.reset = function() {
    this.x = Math.floor(Math.random()*580);
    this.y = 0;
}

Dog.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [
    new Enemy(-120, 50),
    new Enemy(-155, 130),
    new Enemy(-250, 130),
    new Enemy(-180, 210),
];
const player = new Player(300, 310);
const dog = new Dog(300, 0);

//This handleInput method moves the player's position bese on which arrow key is press.
Player.prototype.handleInput = function(arrowKey) {
    switch (arrowKey) {
        //case value.
        case 'left':
        this.x -= 100;
        break;
        case 'up':
        this.y -= 83;
        break;
        case 'right':
        this.x += 100;
        break;
        case 'down':
        this.y += 85;
        break;
    };
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. Don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});

//timer starts as soon as the game is load! 
const countDown = setInterval(function() {
    timeleft--;
    timer.text(`${timeleft} s`);
    if (timeleft <= 0) {
        clearInterval(countDown);
        togglePopup();
        timesUp();
    }
}, 1000);

//change Momo's image based on #of meat
const changeEmotion = function() {
    if (meats >= 0 && meats < 5) {
        $('#congra-mesg').text('Uh Oh ——');
        $('#emotion img').attr('src', 'images/sad-dog.png')
    } else if (meats >= 5 && meats <= 7) {
        $('#congra-mesg').text('YAWN~~~~');
        $('#emotion img').attr('src', 'images/yawn-dog.png')
    } else {
        $('#congra-mesg').text('AWESOME');
        $('#emotion img').attr('src', 'images/happy-dog.png')
    };
};

//change timer's text
const timesUp = function() {
    if (togglePopup) {
        timer.text('Time\'s Up');
        clearInterval(countDown);
    };
};

//overlay popup http://dev.vast.com/jquery-popup-overlay/
$('#standalone').popup({
	color: 'white',
	opacity: 1,
	transition: '0.3s',
	scrolllock: true
});

/*toggle popup window
this popup contains info about how many meat Momo got, a replay button and a close popup button
*/
function togglePopup() {
    if (enable) {
        changeEmotion();
        $('#standalone').popup('show');
        $('#play-again').on('click', function() {
            reset();
        });
        $('#close-popup').on('click', function() {
            $('#standalone').popup('hide');
            //prevent popup keeps showing up after it shows up once and the user click "nah"
            enable = false;
        });
    }
};

/* reset the game */  
function reset() {
    location.reload();
}