var lawnWidth = 1050;
var lawnHeight = 500;

var drawLawn = function(w,h){
    var lawn = document.getElementById("lawn");
    var lawnCtx = lawn.getContext("2d");
    lawn.width = window.innerWidth;
    lawn.height = window.innerHeight;
    var centerX = lawn.width / 2;
    var centerY = lawn.height / 2;
    //fill lawn
    lawnCtx.fillStyle = "#CDE6D5";
    lawnCtx.fillRect(centerX - 700, centerY - 350,1400,700);
    //fil court
    lawnCtx.strokeStyle = "#F3F3F5";
    lawnCtx.fillStyle = "#FFB8BD";
    lawnCtx.fillRect(centerX - w/2,centerY - h/2,w,h);
    //draw outline of court
    lawnCtx.beginPath();
    lawnCtx.rect(centerX - w/2,centerY - h/2,w,h);
    lawnCtx.lineWidth="4";
    lawnCtx.stroke();  
    //draw midlines
    lawnCtx.beginPath();
    lawnCtx.moveTo(centerX, centerY - h/2 - 50);
    lawnCtx.lineTo(centerX, centerY + h/2 + 50);
    lawnCtx.lineWidth="7";
    lawnCtx.stroke(); 

    //draw serving lines
    var drawServeLines = function(x){
        lawnCtx.beginPath();
        lawnCtx.lineWidth = "4";
        lawnCtx.moveTo(x, centerY - (.357 * h));
        lawnCtx.lineTo(x,centerY + (.357 * h));
        lawnCtx.stroke(); 
    };
    drawServeLines(centerX - w/4);
    drawServeLines(centerX + w/4);

    lawnCtx.moveTo(centerX - w/4, centerY);
    lawnCtx.lineTo(centerX + w/4, centerY);
    lawnCtx.stroke(); 

    //draw doubles lines
    var drawDoubles = function(y){
        lawnCtx.moveTo(centerX - w/2, y);
        lawnCtx.lineTo(centerX + w/2, y);
        lawnCtx.stroke();
    };
    drawDoubles(centerY - (.357 * h));
    drawDoubles(centerY + (.357 * h));
        
}

function drawPlay() {
    //draw canvas    
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");      
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //draw court
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;

    //create paddles
    var Paddle = function(){
        this.width = 10;
        this.height = 60;
        this.yPosition = centerY - (this.height / 2);
    }   

    Paddle.prototype = {
        render: function(){
            context.beginPath();
            context.fillStyle = '#F3F3F5';  
            context.fillRect(this.xPosition,this.yPosition,this.width,this.height);
        },
        speed: 25,
        move: function(direction){
            if(direction == "up") {
                if((this.yPosition - this.speed) >= (centerY - lawnHeight/2 - this.height)){
                    this.yPosition -= this.speed;
                }
            } else if(direction == "down"){
                if((this.yPosition + this.speed) <= (centerY + lawnWidth/2)){
                this.yPosition += this.speed;
                }
            }
        },
        //make this a function that increments score, gets ball ready to be re-served
        score: 0

    };          

    var ComputerPaddle = function(){
        Paddle.call(this);
        this.xPosition = centerX - lawnWidth/2 + 10;
        this.update = function(){
            var roll = Math.floor(Math.random() * 9) + 1;
            if(roll !== 2) {
                if(ball.inPlay){
                    if(ball.yPosition < (this.yPosition + this.height/2)){
                        this.move("up");
                    } else if (ball.yPosition > (this.yPosition + this.height)){
                        this.move("down");           
                    }
                }
            }
        };
        this.speed = 5;
    };

    var PlayerPaddle = function(){
        Paddle.call(this);
        this.xPosition = centerX + lawnWidth/2 - 20;
    };

    ComputerPaddle.prototype = Object.create(Paddle.prototype);
    PlayerPaddle.prototype = Object.create(Paddle.prototype);

    //create ball
    var Ball = function(){
        this.xPosition = canvas.width / 2;
        this.yPosition = canvas.height / 2;
        this.radius = 5;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
    };
    // Floor to get rid of decimals
    // random generates between 0 and 0.9999999999
    // multiply random by the upper bound (limit)
    // add the lower bound
    // Math.floor((Math.random() * 2) + 1)
    Ball.prototype = {
        inPlay: false,
        render: function() {
            context.lineWidth = 10;
            context.strokeStyle = '#F3F3F5';
            context.beginPath();
            context.arc(this.xPosition, this.yPosition, this.radius, this.startAngle, this.endAngle);
            context.stroke();
        },
        xSpeed: 5,
        ySpeed: 3,
        move: function(){
            if(this.inPlay == true) {
                //bounce off top and bottom
                if((this.yPosition + 2*this.radius) >= (centerY + lawnHeight/2) || (this.yPosition - 2*this.radius) <= (centerY - lawnHeight/2)) {
                    this.ySpeed = -this.ySpeed;
                } //stop if goes out of bounds
                else if((this.xPosition + 2*this.radius) >= (centerX + lawnWidth/2)){
                    score(computer);   
                } else if((this.xPosition - 2*this.radius) <= (centerX - lawnWidth/2)) {
                    score(player);
                } //bounce off paddles
                else if((player.xPosition == (this.xPosition + 2*this.radius)) && (player.yPosition <= this.yPosition && this.yPosition <= (player.yPosition + player.height))){
                    this.xSpeed = -this.xSpeed;
                } else if(((computer.xPosition + computer.width) == (this.xPosition - 2*this.radius)) && (computer.yPosition <= this.yPosition && this.yPosition <= (computer.yPosition + computer.height))){
                    this.xSpeed = -this.xSpeed;
                }
                this.xPosition += this.xSpeed;
                this.yPosition += this.ySpeed;
            }
        },
        reset: function(){
            this.xPosition = canvas.width / 2;
            this.yPosition = canvas.height / 2;
        }
    }; 

    //create opponents + ball
    var computer = new ComputerPaddle();
    var player = new PlayerPaddle();
    var ball = new Ball();

    var renderObjects = function() {
        for (var i = 0; i < arguments.length; i++){
            arguments[i].render();
        }
    }

    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) 
        };

    var step = function() {
        context.clearRect(0,0,window.innerWidth,window.innerHeight);
        ball.move();
        computer.update();
        renderObjects(computer, player, ball);
        animate(step);
    };

    //handle end of round
    function score(guy) {
        guy.score += 1;
        ball.inPlay = false;
        ball.reset();
    }

    //update score box
    var playerScore = document.getElementById("playerScore");
    var compScore = document.getElementById("compScore");
    var updateScore = function(){
        playerScore.innerHTML = player.score;
        compScore.innerHTML = computer.score;
    }
    
    animate(step);

    window.addEventListener('keydown', function(key){
        if(key.code == "Space") {
            (ball.inPlay) ? ball.inPlay = false : ball.inPlay = true;
            console.log(ball.inPlay);
        }
        if(key.code == "ArrowUp") {
            player.move("up");
        } else if(key.code == "ArrowDown") {
            player.move("down");
        }
    });
};

window.addEventListener('load', drawPlay(), false);
window.addEventListener('load', drawLawn(lawnWidth, lawnHeight), false);