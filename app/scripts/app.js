function resizeCanvas() {
    //draw canvas    
    var canvas = document.getElementById("canvas");
    var canvasContext = canvas.getContext("2d");
    var context = canvas.getContext("2d");      
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //draw court
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var boardWidth = 1050;
    var boardHeight = 500;
    var drawBoard = function(w,h){
        //fill lawn
        context.fillStyle = "#CDE6D5";
        context.fillRect(centerX - 700, centerY - 350,1400,700);
        //fil court
        context.strokeStyle = "#F3F3F5";
        context.fillStyle = "#FFB8BD";
        context.fillRect(centerX - w/2,centerY - h/2,w,h);
        //draw outline of court
        context.beginPath();
        context.rect(centerX - w/2,centerY - h/2,w,h);
        context.lineWidth="4";
        context.stroke();  
        //draw midlines
        context.beginPath();
        context.moveTo(centerX, centerY - h/2 - 50);
        context.lineTo(centerX, centerY + h/2 + 50);
        context.lineWidth="7";
        context.stroke(); 

        //draw serving lines
        var drawServeLines = function(x){
            context.beginPath();
            context.lineWidth = "4";
            context.moveTo(x, centerY - (.357 * h));
            context.lineTo(x,centerY + (.357 * h));
            context.stroke(); 
        };
        drawServeLines(centerX - w/4);
        drawServeLines(centerX + w/4);

        context.moveTo(centerX - w/4, centerY);
        context.lineTo(centerX + w/4, centerY);
        context.stroke(); 

        //draw doubles lines
        var drawDoubles = function(y){
            context.moveTo(centerX - w/2, y);
            context.lineTo(centerX + w/2, y);
            context.stroke();
        };
        drawDoubles(centerY - (.357 * h));
        drawDoubles(centerY + (.357 * h));
        
    }
    
    drawBoard(boardWidth, boardHeight);

    var inPlay = false;
    
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
                if((this.yPosition - this.speed) >= (centerY - boardHeight/2 - this.height)){
                    this.yPosition -= this.speed;
                }
            } else if(direction == "down"){
                if((this.yPosition + this.speed) <= (centerY + boardHeight/2)){
                this.yPosition += this.speed;
                }
            }
        },
        //make this a function that increments score, gets ball ready to be re-served
        score: 0
        
    };          

    var ComputerPaddle = function(){
        Paddle.call(this);
        this.xPosition = centerX - boardWidth/2 + 10;
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
        this.xPosition = centerX + boardWidth/2 - 20;
    };

    ComputerPaddle.prototype = Object.create(Paddle.prototype);
    PlayerPaddle.prototype = Object.create(Paddle.prototype);

    //create opponents
    var computer = new ComputerPaddle();
    var player = new PlayerPaddle();
    
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
                if((this.yPosition + 2*this.radius) >= (centerY + boardHeight/2) || (this.yPosition - 2*this.radius) <= (centerY - boardHeight/2)) {
                    this.ySpeed = -this.ySpeed;
                } //stop if goes out of bounds
                else if((this.xPosition + 2*this.radius) >= (centerX + boardWidth/2)){
                    score(computer);   
                } else if((this.xPosition - 2*this.radius) <= (centerX - boardWidth/2)) {
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
    
    var ball = new Ball(); 

    var renderObjects = function() {
        for (var i = 0; i < arguments.length; i++){
            arguments[i].render();
        }
    };

    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback) { window.setTimeout(callback, 1000/60) 
        };

    var step = function() {
        drawBoard(boardWidth, boardHeight);
        renderObjects(computer, player, ball);
        // if ball is in play
        ball.move();
        animate(step);
        computer.update();
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
            // animate(step)
        }
        if(key.code == "ArrowUp") {
            player.move("up");
        } else if(key.code == "ArrowDown") {
            player.move("down");
        }
    });
}

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('load', resizeCanvas, false);

