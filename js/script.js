var canvas, ctx;
var backgroundImage;
var iBgShiftX = 100;

var dragon, enemy = null;
var balls = [];
var enemies = [];

var dragonW = 75;
var dragonH = 70;
var iSprPos = 0; 
var iSprDir = 0; 
var iEnemyW = 128; 
var iEnemyH = 128; 
var iBallSpeed = 10;
var iEnemySpeed = 2; 

var dragonSound;
var wingsSound;
var explodeSound, explodeSound2;
var laughtSound; 

var bMouseDown = false;
var iLastMouseX = 0;
var iLastMouseY = 0;
var iScore = 0;
// -------------------------------------------------------------

function Dragon(x, y, w, h, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.image = image;
    this.bDrag = false;
}
function Ball(x, y, w, h, speed, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.image = image;
}
function Enemy(x, y, w, h, speed, image) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.speed = speed;
    this.image = image;
}
// -------------------------------------------------------------
function getRand(x, y) {
    return Math.floor(Math.random()*y)+x;
}

function drawScene() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    iBgShiftX += 4;
    if (iBgShiftX >= 1045) {
        iBgShiftX = 0;
    }
    ctx.drawImage(backgroundImage, 0 + iBgShiftX, 0, 1000, 940, 0, 0, 1000, 600);

    iSprPos++;
    if (iSprPos >= 9) {
        iSprPos = 0;
    }

    if (bMouseDown) {
        if (iLastMouseX > dragon.x) {
            dragon.x += 5;
        }
        if (iLastMouseY > dragon.y) {
            dragon.y += 5;
        }
        if (iLastMouseX < dragon.x) {
            dragon.x -= 5;
        }
        if (iLastMouseY < dragon.y) {
            dragon.y -= 5;
        }
    }

    ctx.drawImage(dragon.image, iSprPos*dragon.w, iSprDir*dragon.h, dragon.w, dragon.h, dragon.x - dragon.w/2, dragon.y - dragon.h/2, dragon.w, dragon.h);

    if (balls.length > 0) {
        for (var key in balls) {
            if (balls[key] != undefined) {
                ctx.drawImage(balls[key].image, balls[key].x, balls[key].y);
                balls[key].x += balls[key].speed;

                if (balls[key].x > canvas.width) {
                    delete balls[key];
                }
            }
        }
    }

    if (enemies.length > 0) {
        for (var ekey in enemies) {
            if (enemies[ekey] != undefined) {
                ctx.drawImage(enemies[ekey].image, enemies[ekey].x, enemies[ekey].y);
                enemies[ekey].x += enemies[ekey].speed;

                if (enemies[ekey].x < - iEnemyW) {
                    delete enemies[ekey];

                    laughtSound.currentTime = 0;
                    laughtSound.play();
                }
            }
        }
    }

    if (balls.length > 0) {
        for (var key in balls) {
            if (balls[key] != undefined) {

                if (enemies.length > 0) {
                    for (var ekey in enemies) {
                        if (enemies[ekey] != undefined && balls[key] != undefined) {
                            if (balls[key].x + balls[key].w > enemies[ekey].x && balls[key].y + balls[key].h > enemies[ekey].y && balls[key].y < enemies[ekey].y + enemies[ekey].h) {
                                delete enemies[ekey];
                                delete balls[key];
                                iScore++;

                                explodeSound2.currentTime = 0;
                                explodeSound2.play();
                            }
                        }
                    }
                }
            }
        }
    }

    ctx.font = '16px Verdana';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + iScore * 10, 900, 580);
    ctx.fillText('Press "1" to shoot', 100, 580);

}

// -------------------------------------------------------------

// initialization
$(function(){
    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    backgroundImage = new Image();
    backgroundImage.src = 'images/hell.jpg';
    backgroundImage.onload = function() {
    }
    backgroundImage.onerror = function() {
        console.log('Error loading the background image.');
    }

    dragonSound = new Audio('media/dragon.wav');
    dragonSound.volume = 0.9;

    laughtSound = new Audio('media/laught.wav');
    laughtSound.volume = 0.9;

    explodeSound = new Audio('media/explode1.wav');
    explodeSound.volume = 0.9;
    explodeSound2 = new Audio('media/explosion.wav');
    explodeSound2.volume = 0.9;

    wingsSound = new Audio('media/wings.wav');
    wingsSound.volume = 0.9;
    wingsSound.addEventListener('ended', function() { // loop wings sound
        this.currentTime = 0;
        this.play();
    }, false);
    wingsSound.play();

    var oBallImage = new Image();
    oBallImage.src = 'images/fireball.png';
    oBallImage.onload = function() { }

    var oEnemyImage = new Image();
    oEnemyImage.src = 'images/enemy.png';
    oEnemyImage.onload = function() { }

    var oDragonImage = new Image();
    oDragonImage.src = 'images/dragon.gif';
    oDragonImage.onload = function() {
        dragon = new Dragon(400, 300, dragonW, dragonH, oDragonImage);
    }

    $('#scene').mousedown(function(e) { 
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        if(e.originalEvent.layerX) { 
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }

        bMouseDown = true;

        if (mouseX > dragon.x- dragon.w/2 && mouseX < dragon.x- dragon.w/2 +dragon.w &&
            mouseY > dragon.y- dragon.h/2 && mouseY < dragon.y-dragon.h/2 +dragon.h) {

            dragon.bDrag = true;
            dragon.x = mouseX;
            dragon.y = mouseY;
        }
    });

    $('#scene').mousemove(function(e) {
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        if(e.originalEvent.layerX) {
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }

        iLastMouseX = mouseX;
        iLastMouseY = mouseY;

        if (dragon.bDrag) {
            dragon.x = mouseX;
            dragon.y = mouseY;
        }

        if (mouseX > dragon.x && Math.abs(mouseY-dragon.y) < dragon.w/2) {
            iSprDir = 0;
        } else if (mouseX < dragon.x && Math.abs(mouseY-dragon.y) < dragon.w/2) {
            iSprDir = 4;
        } else if (mouseY > dragon.y && Math.abs(mouseX-dragon.x) < dragon.h/2) {
            iSprDir = 2;
        } else if (mouseY < dragon.y && Math.abs(mouseX-dragon.x) < dragon.h/2) {
            iSprDir = 6;
        } else if (mouseY < dragon.y && mouseX < dragon.x) {
            iSprDir = 5;
        } else if (mouseY < dragon.y && mouseX > dragon.x) {
            iSprDir = 7;
        } else if (mouseY > dragon.y && mouseX < dragon.x) {
            iSprDir = 3;
        } else if (mouseY > dragon.y && mouseX > dragon.x) {
            iSprDir = 1;
        }
    });

    $('#scene').mouseup(function(e) {
        dragon.bDrag = false;
        bMouseDown = false;

        dragonSound.currentTime = 0;
        dragonSound.play();
    });

    $(window).keydown(function(event){ 
        switch (event.keyCode) {
            case 49: 
                balls.push(new Ball(dragon.x, dragon.y, 32, 32, iBallSpeed, oBallImage));

                explodeSound.currentTime = 0;
                explodeSound.play();
                break;
        }
    });

    setInterval(drawScene, 30);


    var enTimer = null;
    function addEnemy() {
        clearInterval(enTimer);

        var randY = getRand(0, canvas.height - iEnemyH);
        enemies.push(new Enemy(canvas.width, randY, iEnemyW, iEnemyH, - iEnemySpeed, oEnemyImage));

        var interval = getRand(5000, 10000);
        enTimer = setInterval(addEnemy, interval);
    }
    addEnemy();
});