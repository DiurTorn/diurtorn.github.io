
var bkgImg;
var hand;
var stick;
var bandage;
var canvas, ctx;
var divStart;
var divAlert;
var divFinish;
var stickX, stickY, bondageX, bondageY;
var crunch, bondageS, error, victory;
stickX = 500;
stickY=1060;
bondageX = 770;
bondageY = 1020;
var handX= -899;
var handsS = 0;
var handsSW = 785;
var stateHand = false;

var mouseDown = false;
var stickDrag = false;
var bondageDrag = false;
var iLastMouseX = 0;
var iLastMouseY = 0;
var imgHand = "img/hands.png";
var t =0;
//object :

function drawScene(){
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.drawImage(bkgImg, 0, 0);
    startGame();

}
function startGame(){
    divStart.style = "display:none";
    ctx.drawImage(hand, handsS, 0, handsSW, 668, handX, 0, 899, 668);
    ctx.drawImage(stick, stickX,stickY);
    ctx.drawImage(bandage, bondageX, bondageY);
}
function move(){
    if(stickY>760)stickY--;
    if(bondageY>720) bondageY--;
}
function move1(){
    if(handX<0)handX++;
}

// initialization
$(function(){

    canvas = document.getElementById('scene');
    ctx = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    bkgImg = new Image();
    hand = new Image();
    stick = new Image();
    bandage = new Image();
    bkgImg.src="img/terrain.png";
    hand.src = imgHand;
    stick.src="img/stick.png";
    bandage.src = "img/bandage.png";
    ctx.drawImage(bkgImg, 0, 0);
    crunch = new Audio('audio/crunch.mp3');
    crunch.volume = 1;
    bondageS = new Audio('audio/bondage.mp3');
    bondageS.volume = 1;
    error = new Audio('audio/error.mp3');
    error.volume = 1;
    victory = new Audio('audio/victory.mp3');
    victory.volume = 1;

    $('#scene').mousedown(function(e) { // binding mousedown event (for dragging)
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        if(e.originalEvent.layerX) { // changes for jquery 1.7
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }

        mouseDown = true;

        if(mouseX > stickX && mouseX < stickX+200 && mouseY > stickY && mouseY < stickY + 200){
            stickDrag = true;
            stickY = mouseY-60;
            stickX = mouseX-60;
        }
        if(mouseX > bondageX && mouseX < bondageX+200 && mouseY > bondageY && mouseY < bondageY + 200){
            bondageDrag = true;
            bondageY = mouseY-60;
            bondageX = mouseX-60;
        }
    });

    $('#scene').mousemove(function(e) { // binding mousemove event
        var mouseX = e.layerX || 0;
        var mouseY = e.layerY || 0;
        if(e.originalEvent.layerX) {
            mouseX = e.originalEvent.layerX;
            mouseY = e.originalEvent.layerY;
        }
        if(stickDrag){
                stickY = mouseY - 60;
                stickX = mouseX - 60;
        }
        if(bondageDrag){
            bondageY = mouseY-60;
            bondageX = mouseX-60;

        }
    });

    $('#scene').mouseup(function(e) { // binding mouseup event
        mouseDown = false;
        bondageDrag = false;
        stickDrag = false;
        if(stickX <534 && stickX> 150 && stickY < 588 && stickY > 400){
            stickX = -300;
            stickY=-470;
            handsS = 893;
            stateHand = true;
            crunch.currentTime = 0;
            crunch.play();
        }else if (stickX == -300 && stickY== -470){
            stickX = -300;
            stickY=-470;
        }else
            {
            stickX = 500;
            stickY=760;
        }

        if(bondageX <534 && bondageX> 150 && bondageY < 588 && bondageY > 300){
            if(stateHand){
                bondageX = -300;
                bondageY=-470;
                handsS = 1786;
                handsSW =795;
                divFinish.style = "display:block";
                victory.currentTime = 0;
                victory.play();
            } else {
                bondageX = 770;
                bondageY = 720;
                divAlert.style = "display:block";
                error.currentTime = 0;
                error.play();
            }
        }else if (bondageX == -300 && bondageY== -470){
            bondageX = -300;
            bondageY=-470;
        }else
        {
            bondageX = 770;
            bondageY = 720;
        }

    });
    divStart = document.getElementById("gameStart");

    divStart.addEventListener("click", function(){
        setInterval(drawScene, 30);
    });
    divAlert = document.getElementById("alert");

    divAlert.addEventListener("click", function(){
        divAlert.style = "display:none";
    });
    divFinish = document.getElementById("finish");

    divFinish.addEventListener("click", function(){
        divFinish.style = "display:none";
    });

    stick.onload = function(){
        setInterval(move, 7);
        setInterval(move1, 0.00001);
    }
});