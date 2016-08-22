function resizeCanvas() {
    //draw canvas    
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");      
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //draw court

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var boardWidth = 1050;
    var boardHeight = 500;
    var drawBoard = function(w,h){
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
        speed: 10,
        move: function(key){
            if(key.keyCode == 38) {
                if((this.yPosition -= this.speed) >= (centerY - boardHeight/2)){
                    this.yPosition -= this.speed;
                }
            } else if(key.keyCode == 40){
                if((this.yPosition += this.speed) <= (centerY + boardHeight/2)){
                this.yPosition += this.speed;
                }
            }
        }
    };          

    // Create a function for computer paddle and player paddle
    // that inherits from paddle
    var ComputerPaddle = function(){
        Paddle.call(this);
        this.xPosition = centerX - boardWidth/2 + 10;
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
        this.render = function() {
            var x = canvas.width / 2;
            var y = canvas.height / 2;
            var radius = 5;
            var startAngle = 0;
            var endAngle = 2 * Math.PI;

            context.beginPath();
            context.arc(x, y, radius, startAngle, endAngle);
            context.lineWidth = 10;
            context.strokeStyle = '#F3F3F5';
            context.stroke();
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
        animate(step);
    };

    animate(step);

    window.addEventListener('keydown', function(key){
        player.move(key);
    });
}

window.addEventListener('resize', resizeCanvas, false);
window.addEventListener('load', resizeCanvas, false);

