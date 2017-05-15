//FUNCTIONS

function drawImage(ctx, img, x, y, width, height){
	ctx.save();
	//origin of canvas at img position
	ctx.translate(x + width/2, y+height/2);
	ctx.drawImage(img, width/2 * (-1), height/2 * (-1), width, height);
	//origin back to normal
	ctx.translate((x + width/2) * (-1), (x + width/2) * (-1));
	ctx.restore();
};

function hslColor(h,s,l)
{
  return 'hsl(' + h + ',' + s + '%,' + l + '%)';
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function drawImageRotDeg(ctx, img, x, y, width, height, deg){
	var rad = deg * Math.PI / 180;
	//origin of canvas at img position
	ctx.save();
	ctx.translate(x + width/2, y+height/2);
	//rotate canvas
	ctx.rotate(rad)
	ctx.drawImage(img, width/2 * (-1), height/2 * (-1), width, height);
	// rotate canvas back
	ctx.rotate(rad * (-1));
	//origin back to normal
	ctx.translate((x + width/2) * (-1), (x + width/2) * (-1))
	ctx.restore();
};

function drawCircle(ctx, x, y, r, color, alpha) {
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.beginPath();
	ctx.arc(x, y, Math.abs(r), 0, Math.PI*2, true);
	ctx.closePath();
	ctx.fill();
	ctx.globalAlpha = 1;

}

function drawRect(ctx, x, y, width, height, color, alpha) {
	ctx.fillStyle = color;
	ctx.globalAlpha = alpha;
	ctx.beginPath();
	ctx.rect(x, y, width, height);
	ctx.closePath();
	ctx.fill();
	ctx.globalAlpha = 1;

}

//
function Edible(inpX,inpY){
	this.posX = inpX;
	this.posY = inpY;
	this.color = getRandomColor();

	this.update = function (newX,newY){
		this.color = getRandomColor();
		this.posX = newX;
		this.posY = newY;
	}

	this.draw = function(c){
		//drawCircle(c, this.posX * 10 + 5, this.posY * 10 + 5, 5, this.color, 1);
		drawImageRotDeg(c, food_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, SCREEN_WIDTH/TILE_WIDTH, SCREEN_HEIGHT/TILE_HEIGHT, habboischenscheiss);
	}
}

function SnakeTile(inpX,inpY,width,height,rot){
	this.state = 0; // 0 = head, 1 = straight, 2 = tail, 3 = right, 4 = left
	this.posX = inpX;
	this.isHead = true;
	this.posY = inpY;
	this.width = width;
	this.height = height;
	this.color = getRandomColor();
	this.next = null;
	this.rot = rot;

	this.update = function(newX,newY,isReallyHead) {

		this.isHead = isReallyHead;

		if(this.isHead){
			var relX = newX - this.posX;
			var relY = newY - this.posY;


			console.log(relX + " " + relY);

			if(relX == 1){
				this.rot = 90;
			} else if (relX == -1) {
				this.rot = 270;
			} else if (relY == 1) {
				this.rot = 180;
			} else if (relY == -1) {
				this.rot = 0;
			}
		}

		if (this.next != null) {
			this.next.update(this.posX,this.posY,false);

				if((this.next.rot - this.rot +360) % 360 > 180){
					if(this.next.next != null){
						this.next.state = 3;
					}
					this.next.rot = this.rot;
				} else if ((this.next.rot - this.rot) % 360 < 180 && this.next.rot != this.rot) {
					if(this.next.next != null){
						this.next.state = 4;
					}
					this.next.rot = this.rot;
				} else {
					if(this.next.next != null){
						this.next.state = 1;
					}
					this.next.rot = this.rot;
				}


		}
		if(!this.isHead){
				console.log("gaggu");
				this.state = 2;
		}

		/*
		this.posX = newX;
		this.posY = newY;
		*/
		if(newX >= TILE_WIDTH){
			this.posX = newX - TILE_WIDTH;
		} else if (newX < 0){
			this.posX = newX + TILE_WIDTH;
		} else {
			this.posX = newX;
		}

		if(newY >= TILE_HEIGHT){
			this.posY = newY - TILE_HEIGHT;
		}	else if (newY < 0){
			this.posY = newY + TILE_HEIGHT;
		} else {
			this.posY = newY;
		}
	}
	this.draw = function(c){
		switch (this.state) {
			case 0:
				drawImageRotDeg(c, head_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, this.width, this.height, this.rot);
				break;
			case 1:
				drawImageRotDeg(c, straight_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, this.width, this.height, this.rot);
				break;
			case 2:
				drawImageRotDeg(c, tail_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, this.width, this.height, this.rot);
				break;
			case 3:
				drawImageRotDeg(c, right_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, this.width, this.height, this.rot-90);
				break;
			case 4:
				drawImageRotDeg(c, left_img, this.posX * SCREEN_WIDTH/TILE_WIDTH, this.posY * SCREEN_HEIGHT/TILE_HEIGHT, this.width, this.height, this.rot-270);
				break;
			default:

		}
		if(this.next != null){
			this.next.draw(c);
		}
	}
}

function Snake(){
	this.velX = 1;
	this.velY = 0;
	this.apple = new Edible(Math.floor(Math.random() * TILE_WIDTH),Math.floor(Math.random() * TILE_HEIGHT));
	this.head = new SnakeTile(TILE_WIDTH/2, TILE_HEIGHT/2, SCREEN_WIDTH/TILE_WIDTH, SCREEN_HEIGHT/TILE_HEIGHT,0);
	this.update = function(){
		if(this.head.posX == this.apple.posX && this.head.posY == this.apple.posY){
			this.apple.update(Math.floor(Math.random() * (TILE_WIDTH)),Math.floor(Math.random() * (TILE_HEIGHT)));
			var start = this.head;
			while(start.next != null){
				start = start.next;
			}
			start.next = new SnakeTile(start.posX,start.posY,SCREEN_WIDTH/TILE_WIDTH,SCREEN_HEIGHT/TILE_HEIGHT,start.rot);
		}
		iter = this.head;
		while(iter.next != null){
			if(this.head.posX + this.velX == iter.next.posX && this.head.posY + this.velY == iter.next.posY){
				gameIsOver = true;
			}
			iter = iter.next;
		}
		this.head.update(this.head.posX + this.velX, this.head.posY + this.velY,true);
	}

	this.draw = function(c){
		this.apple.draw(c);
		this.head.draw(c);
	}

	this.changeVel = function(newVelX,newVelY) {
		this.velX = newVelX;
		this.velY = newVelY;
	}

}

//controller

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 37:
						character.changeVel(-1,0);
            //left
            break;
        case 38:
						character.changeVel(0,-1);
            //up
            break;
        case 39:
						character.changeVel(1,0);
            //right
            break;
        case 40:
						character.changeVel(0,1);
            //down
            break;
        case 32:
        	//space
					character = new Snake();
					gameIsOver = false;
        	break;
    }
};

//INITIALIZE
var SCREEN_HEIGHT = 800;
var SCREEN_WIDTH = 1200;
var TILE_HEIGHT = 8; // not actual height but amount of tiles in y-axis
var TILE_WIDTH = 12;
var backgroundHue = 0;

var fps = 60;
var canvas, c;
var character = new Snake();

var gameOver_img = new Image();
gameOver_img.src = "gameover.png";

var head_img = new Image();
head_img.src = "head.png";

var tail_img = new Image();
tail_img.src = "tail.png";

var right_img = new Image();
right_img.src = "right.png";

var left_img = new Image();
left_img.src = "left.png";

var straight_img = new Image();
straight_img.src = "straight.png";

var food_img = new Image();
food_img.src = "edible.png";

var gameIsOver = false;
var habboischenscheiss = 0;




$(document).ready(function(){
		draw();
});

function draw() {
	canvas = document.getElementById('canvas');
	c = canvas.getContext('2d');
	loop();
}

function loop() {
	setTimeout(function(){
	c.clearRect(0,0,canvas.width, canvas.height)
	backgroundHue+= 0.5;

	$( "body" ).css("background-color",hslColor(backgroundHue,100,80));

	drawRect(c,0,0,canvas.width,canvas.height,hslColor(backgroundHue,100,50),1);

	if(!gameIsOver && habboischenscheiss % 12 == 0){
		character.draw(c);
		character.update();
	}	else if (!gameIsOver) {
		character.draw(c);
	} else {
		drawImageRotDeg(c, gameOver_img, 400,300,400,200,habboischenscheiss)
	}
	habboischenscheiss++;



		loop();
	}, 1000/fps)
}
