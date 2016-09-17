function drawPlay() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var lawn = document.getElementById("lawn");
    var lawnCtx = lawn.getContext("2d");
    var lawnWidth = 1050;
    var lawnHeight = 500;
    lawn.width = window.innerWidth;
    lawn.height = window.innerHeight;
    var centerX = lawn.width / 2;
    var centerY = lawn.height / 2;
    var playerScore = document.getElementById("playerScore");
    var compScore = document.getElementById("compScore");

    canvas.style.display = "block";
    lawn.style.display = "block";
    playerScore.style.display = "inline-block";
    compScore.style.display = "inline-block";
    //draw canvas    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //draw court
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var drawLawn = function(w,h){
        console.log(centerX + " " + centerY);
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
    drawLawn(lawnWidth, lawnHeight);
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
                var newY = this.yPosition - this.speed;

                if (newY < (centerY - lawnHeight/2)) {
                    newY = centerY - lawnHeight/2;
                }

                this.yPosition = newY;
            } else if(direction == "down"){
                var newY = this.yPosition + this.speed;

                if (newY + this.height > centerY + lawnHeight/2) {
                    newY = centerY + lawnHeight/2 - this.height;
                }

                this.yPosition = newY;
            }
        },
        //make this a function that increments score, gets ball ready to be re-served
        score: 0,
        gamesWon: 0
    };          

    var ComputerPaddle = function(){
        Paddle.call(this);
        this.xPosition = centerX - lawnWidth/2 + 10;
        this.update = function(){
            var roll = Math.floor(Math.random() * 30) + 1;
            if(ball.inPlay){
                if(roll < 25) {
                    if(ball.yPosition < (this.yPosition + this.height/2)){
                        this.move("up");
                    } else if (ball.yPosition > (this.yPosition + this.height)){
                        this.move("down");    
                    }  
                } else if (roll <= 30) {
                    this.speed = 4;
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
    Ball.prototype = {
        inPlay: false,
        render: function() {
            context.lineWidth = 10;
            context.strokeStyle = '#F3F3F5';
            context.beginPath();
            context.arc(this.xPosition, this.yPosition, this.radius, this.startAngle, this.endAngle);
            context.stroke();
        },
        xSpeed: 4,
        ySpeed: 3,
        move: function(){
            if(this.inPlay) {
                //bounce off top and bottom
                if((this.yPosition + 2*this.radius) >= (centerY + lawnHeight/2) || (this.yPosition - 2*this.radius) <= (centerY - lawnHeight/2)) {
                    this.ySpeed = -this.ySpeed;
                } //stop if goes out of bounds
                else if((this.xPosition + 2*this.radius) >= (centerX + lawnWidth/2)){
                    console.log("centerX=" + centerX + " - " + "lawnWidth/2=" + lawnWidth/2);
                    score(computer);   
                    return;
                } else if((this.xPosition - 2*this.radius) <= (centerX - lawnWidth/2)) {
                    score(player);
                    return;
                } //bounce off paddles
                else if((player.xPosition <= (this.xPosition + this.radius)) && (player.yPosition <= this.yPosition && this.yPosition <= (player.yPosition + player.height))){
                    this.xSpeed = -this.xSpeed;
                } else if(((computer.xPosition + computer.width) >= (this.xPosition - this.radius)) && (computer.yPosition <= this.yPosition && this.yPosition <= (computer.yPosition + computer.height))){
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
    var gameIsPlaying = false;

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
        function(callback) { window.setTimeout(callback, 1000/60) ;
        };

    var step = function() {
        context.clearRect(0,0,window.innerWidth,window.innerHeight);
        ball.move();
        computer.update();
        renderObjects(computer, player, ball);

        if (gameIsPlaying) {
            animate(step);
        }
};

    //handle end of round
    function score(guy) {
        gameIsPlaying = false;        
        if(guy.score <= 15){
            guy.score += 15;
        } else if(guy.score == 30) {
            guy.score += 10;
        } else if(guy.score == 40) {
            guy.gamesWon += 1;
            guy.score = 0;
        }
        if(guy.gamesWon == 3){
            guy.score = "winner!";
        }

        ball.inPlay = false;
        updateScore();
        ball.reset();
    }

    //update score box
    var updateScore = function(){
        if(player.score > 0 || player.gamesWon > 0){
        playerScore.innerHTML = player.score;
        } else if (computer.score > 0 || computer.gamesWon > 0){
        compScore.innerHTML = computer.score;
        }
        if (player.gamesWon > 0){
        playerGames.innerHTML = player.gamesWon;
        } else if (computer.gamesWon > 0){
        compGames.innerHTML = computer.gamesWon;
        }
    }

    renderObjects(computer, player, ball);

    window.addEventListener('keydown', function(event){
        var code = event.which || event.keyCode;
        if(code == 32) {
            if(player.gamesWon == 3 || computer.gamesWon == 3){
                location.reload();
            } else {
                gameIsPlaying = !gameIsPlaying;
                ball.inPlay = !ball.inPlay;

                if (gameIsPlaying) {
                    animate(step);
                }
            }
        }
        if(code == 38) {
            player.move("up");
        } else if(code == 40) {
            player.move("down");
        }
    });
};

var resize = function(){
    var msgContainer = document.getElementById("yourScreenIsTooSmall");
    if(window.innerWidth > 1050){
        msgContainer.style.display = "none";
        location.reload();
    } else {
        playerScore.style.display = "none";
        compScore.style.display = "none";
        canvas.style.display="none";
        lawn.style.display="none";
        msgContainer.style.display = "inline-block";
        msgContainer.innerHTML = "window tooooo small";
    }
}
var introMsg = function(){
    var msgContainer = document.getElementById("yourScreenIsTooSmall");
    msgContainer.innerHTML = "space bar";
    msgContainer.style.display = "inline-block";
    drawPlay();
    window.addEventListener('keydown', function(event){
    var code = event.which || event.keyCode;
        if(code == 32) {
            msgContainer.style.display = "none";
        }
    });
}
window.addEventListener("resize", resize);
window.addEventListener("load", introMsg);