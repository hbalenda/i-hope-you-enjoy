window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        //draw canvas    
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");      
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        //draw court
        var drawBoard = function(w,h,border,fill){
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            //fil court
            context.strokeStyle = border;
            context.fillStyle = fill;
            context.fillRect(centerX - w/2,centerY - h/2,w,h);
            //draw outline of court
            context.rect(centerX - w/2,centerY - h/2,w,h);
            context.lineWidth="4";
            context.stroke();  
            //draw midlines
            context.moveTo(centerX, centerY - h/2 - 50);
            context.lineTo(centerX, centerY + h/2 + 50);
            context.stroke(); 
            //draw serving lines
            var drawServeLines = function(x){
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

            //create paddles
            var Paddle = function(x){
                this.render = function() {
                    this.width = 10;
                    this.height = 60;
                    this.xPosition = x;
                    this.yPosition = centerY - this.height/2;
                    context.fillStyle = '#F3F3F5'; context.fillRect(this.xPosition,this.yPosition,this.width,this.height);
                }
            }   

            //create opponents
            var computer = new Paddle(centerX - w/2 + 10);
            var player = new Paddle(centerX + w/2 - 20);
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

            function renderObjects() {
                for (var i = 0; i < arguments.length; i++) {
                    arguments[i].render();
                }
            };
            renderObjects(computer, player, ball);
        }//end drawBoard

        drawBoard(1050,500, "#F3F3F5", "#FFB8BD");
    }

window.onload = function() {
    resizeCanvas(); 
};

